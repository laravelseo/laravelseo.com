---
title: "Maatwebsite Excel 3.1 : how do I skip duplicate data when imported?"
description: "Maatwebsite Excel 3.1: How to Skip Duplicate Data When Importing? Importing large datasets from spreadsheets into a relational database is a common task in..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Errors"]
featured: false
---

Importing large datasets from spreadsheets into a relational database is a common task in web development. When using powerful packages like Maatwebsite/Excel with Laravel, developers often encounter a frustrating roadblock: `integrity constraint violation` errors when trying to insert data that already exists in the database.

As a senior developer, I’ve seen this exact scenario repeatedly. The issue isn't usually with the Excel reading process itself, but rather how your application handles conflicts during the final database write operation. This guide will walk you through the technical reasons behind these errors and provide robust, scalable solutions using Laravel and Maatwebsite/Excel 3.1.

## Understanding the Duplicate Data Error

When you execute `Excel::import()`, the package iterates row by row, calling your `model()` method for each entry. If your model's primary key (like `nim` in your example) already exists when Eloquent attempts to save the new record, the database throws an integrity error because it violates the unique constraint defined on that primary key.

Your provided error:
```
integrity constraint violation: 1062 Duplicate entry '188281' for key 'PRIMARY'
```
This confirms that the issue is a fundamental database rule being enforced, not just an application logic failure. To solve this gracefully, we must implement business logic *before* the final save attempt.

## The Solution: Implementing De-Duplication in the Import Class

The most effective place to handle data de-duplication during bulk imports is within your custom Import class's `model()` method. Instead of blindly creating a new record, we need to check if the record already exists and decide whether to update it or skip it entirely.

For this solution, let’s assume that the `nim` column in your `Mahasiswa` table is the unique identifier (Primary Key). We will use Eloquent's powerful methods to manage these conflicts.

### Step 1: Modifying the Import Logic

We will change the logic inside the `model(array $row)` method to utilize `firstOrCreate()`. This method attempts to find a record matching specific criteria; if found, it returns that record; if not found, it creates a new one. While this is excellent for ensuring existence, for true *skipping* of duplicates, we need an explicit check.

A more controlled approach involves checking the database directly before attempting insertion.

### Step 2: Implementing Explicit Duplicate Checking

To skip duplicates cleanly, you must query the database within your loop. This ensures that only new records are added, and existing ones are ignored, preventing the integrity constraint violation.

Here is how you can modify your `MahasiswaImport` class to implement this logic:

```php
namespace App\Imports;

use App\Mahasiswa;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\Importable;
use Illuminate\Support\Facades\DB; // Import DB facade

class MahasiswaImport implements ToModel, WithHeadingRow, WithChunkReading, Importable
{
    public function model(array $row)
    {
        // 1. Check if the record already exists based on a unique field (e.g., 'nim')
        $mahasiswa = Mahasiswa::where('nim', $row['nim'])->first();

        if ($mahasiswa) {
            // If the data exists, you can choose to update it or skip it.
            // For skipping duplicates: return null or throw a specific exception if necessary.
            // For updating (Upsert):
            $mahasiswa->update([
                'nama_mahasiswa' => $row['nama_mahasiswa'],
                'email' => $row['email'],
                // ... update other fields
            ]);
            return $mahasiswa;
        }

        // 2. If no record is found, create the new one.
        return new Mahasiswa([
            'nim' => $row['nim'],
            'slug' => \Illuminate\Support\Str::slug($row['nim']), // Use Illuminate helper functions
            'nama_mahasiswa' => $row['nama_mahasiswa'],
            'email' => $row['email'],
            'kode_kelas' => $row['kode_kelas'],
            'alamat' => $row['alamat'],
            'kode_jurusan' => $row['kode_jurusan'],
            'kode_tahun_akademik' => $row['kode_tahun_akademik'],
            'no_hp' => $row['no_hp'],
            'tempat_lahir' => $row['tempat_lahir'],
            'password' => bcrypt($row['password']), // Always hash passwords!
        ]);
    }

    public function chunkSize(): int
    {
        return 1000; // Good practice for large files
    }
}
```

### Best Practice: Database-Level Uniqueness

While the application logic above solves the import issue, the most robust solution is to ensure your database structure enforces uniqueness from the start. Always define a unique index on any field that should never be duplicated, such as `nim`. This prevents accidental manual insertions and provides a layer of defense regardless of how the data gets into your system.

```php
// In your Mahasiswa model migration file:
Schema::table('mahasiswa', function (Blueprint $table) {
    $table->string('nim')->unique(); // This enforces uniqueness at the DB level
});
```

## Conclusion

Dealing with duplicate data during bulk imports requires a layered approach. Relying solely on the Excel importer is insufficient; you must implement application-level checks within your import class to manage conflicts gracefully. By querying the database inside your `model()` method and using Eloquent's update or creation methods, you transform a potential error into manageable business logic. Remember that adhering to Laravel principles, such as using proper database constraints and queueing jobs (as recommended by teams at [laravelcompany.com](https://laravelcompany.com/)) ensures your data pipeline remains clean, reliable, and scalable.
