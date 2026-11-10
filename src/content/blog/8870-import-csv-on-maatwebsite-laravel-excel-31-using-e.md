---
title: "Import CSV on Maatwebsite / Laravel Excel 3.1 using Excel::import"
description: "Migrating CSV Imports in Maatwebsite/Laravel Excel: Fixing the Syntax After v3.1 Upgrade Upgrading popular packages like Maatwebsite/Laravel Excel often..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Upgrading popular packages like Maatwebsite/Laravel-Excel often introduces breaking changes, especially when moving between major versions. For developers relying on specific utility methods, this can lead to frustrating errors like "Call to undefined method."

Recently, I encountered a similar issue after upgrading from version 2.1 to 3.1 of the package. The core difference lies in how data is loaded and structured. This post will walk you through the change, explain why the error occurred, and provide the correct, modern syntax for importing CSV files using `Excel::import()`.

## Understanding the API Shift: `load` vs. `import`

The transition from version 2.x to 3.x involved a significant refactoring of the package's underlying methods. In version 2.1, developers commonly used the `load()` method, which was part of an older builder pattern for reading files.

Here is how the syntax changed:

**Version 2.1 Syntax (Deprecated):**
```php
$data = Excel::load($path, function($reader) {
    // Reader logic here
})->get()->toArray();
```

When you upgraded to version 3.1, the old `Excel::load()` method was removed or replaced, resulting in the error you saw: `Call to undefined method Maatwebsite\Excel\Excel::load()`. This indicates that the package developers moved towards a more direct and focused approach for file importation.

**Version 3.1 Syntax (Correct):**
The recommended way to import data directly is by using the dedicated static method `Excel::import()`. This method handles the entire reading process, making the code cleaner and aligning with modern Laravel practices.

```php
$data = Excel::import($path, function($reader) {
    // Reader logic here
})->toArray();
```

While it might seem like a simple syntax change, understanding this shift is crucial for maintaining compatibility and leveraging the latest features of any package you use in your Laravel application. This focus on clean, robust APIs mirrors the philosophy behind building scalable applications, much like handling relationships when working with Eloquent models on **https://laravelcompany.com**.

## Fixing Your Import Logic

The error occurred because you were attempting to call a method (`load`) that no longer exists in the upgraded package version. The solution is to replace the deprecated call with the new standard: `Excel::import()`.

Let's refactor your original controller logic using the correct v3.1 syntax. We will focus on making the file handling and data extraction robust.

### Refactored Code Example

Here is how your import logic should be structured in your controller, ensuring you correctly handle headers and data mapping:

```php
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Http\Request;

// ... inside your controller method

$path = $request->file('csv_file')->getRealPath();

if ($request->has('header')) {
    // Use Excel::import() for v3.1 compatibility
    $data = Excel::import($path, function ($reader) {
        // The reader object provides the data stream
        return $reader->toArray(); 
    });
} else {
    // Fallback logic if no header is provided (e.g., simple CSV parsing)
    $data = array_map('str_getcsv', file($path));
}

if (count($data) > 0) {
    if ($request->has('header')) {
        // Assuming the first row is the header
        $csv_header_fields = array_keys($data[0]); // Cleaner way to get keys from an associative array
    }
    
    // Slice data as needed
    $csv_data = array_slice($data, 0, 8);

    $csv_data_file = CsvData::create([
        'csv_filename' => $request->file('csv_file')->getClientOriginalName(),
        'csv_header' => $request->has('header'),
        'csv_data' => json_encode($data) // Storing the whole array for flexibility
    ]);
} else {
    return redirect()->back()->withErrors('CSV file is empty.');
}

return view('import.import_field', compact( 'csv_header_fields', 'csv_data', 'csv_data_file'));
```

## Conclusion

The migration from `Excel::load()` to `Excel::import()` in Maatwebsite/Laravel-Excel highlights the importance of staying updated with package documentation when performing major version upgrades. By replacing the deprecated method with the current standard, you ensure your application remains stable and utilizes the most efficient methods available. Always check the official documentation for the latest API structure, as this practice is fundamental when developing robust solutions on **https://laravelcompany.com**. Happy coding!
