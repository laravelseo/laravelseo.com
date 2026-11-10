---
title: "eloquent attempt to read property on int"
description: "Eloquent's Tricky Dance: Why You Get \"Attempt to read property on int\" When Reading Related Data in Laravel As a developer diving into the world of Laravel,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a developer diving into the world of Laravel, mastering Eloquent relationships is key to unlocking the power of your application. Connecting related data—like linking a student to their academic cohort (`angkatan`)—is a fundamental task. However, sometimes the way Laravel handles object hydration and nested data access can lead to confusing errors like "Attempt to read property on int."

This post addresses a very common stumbling block: understanding how Eloquent relationships are loaded, what they return, and how to correctly navigate deeply nested data in your Blade views. We will walk through your specific scenario to diagnose this issue and establish best practices for handling relational data in Laravel 10.

***

## Understanding the Root of the Error

You have correctly set up a `belongsTo` relationship between your `Siswa` model and the `Angkatan` model. Your setup:

```php
// In Siswa Model
public function angkatan()
{
    return $this->belongsTo(Angkatan::class, 'angkatan', 'id');
}
```

And your controller correctly uses eager loading:

```php
$siswa = Siswa::with('angkatan')->first();
```

When you use `$siswa->angkatan`, Eloquent *should* return an `Angkatan` model instance. The fact that you are seeing an error like **"Attempt to read property 'tahun' on int"** strongly suggests that at the point of access, PHP is interpreting `$siswa->angkatan` not as a Model object, but as a raw integer (or some other scalar value).

### Why the Discrepancy Between `dump()` and the View?

The key to understanding this lies in the difference between debugging output (`dump()`) and template rendering (Blade/View access):

1.  **`dump()`:** When you use `dump($siswa->angkatan)`, you are inspecting the direct result returned by the Model relationship resolver. In some contexts or older versions, dumping a relationship might reveal the underlying data structure more directly, showing you the raw attributes of the related model object correctly.
2.  **View Access (`{{ $siswa->angkatan->tahun }}`):** When rendering a Blade view, if Eloquent encounters an issue during hydration, it can sometimes throw exceptions or result in unexpected type casting errors when trying to access nested properties, especially if the relationship itself failed to load a fully hydrated model object due to missing foreign keys or migration issues.

The error indicates that `$siswa->angkatan` resolved to an integer (likely the `id` of the angkatan), and you are attempting to read the property `tahun` *on* that integer, which is impossible—hence the error.

***

## The Solution: Ensuring Data Integrity and Correct Access

The solution involves ensuring two things: data integrity (migrations) and safe access within the view layer.

### 1. Verify Database Setup (The Foundation)

Before diving into Eloquent intricacies, you must ensure your database structure is sound. If you are working with relational data in Laravel, always start with migrations. These files define your schema and ensure that foreign keys are correctly set up between tables.

Make sure your `siswa` table has a column for the foreign key (e.g., `angkatan_id`) that properly references the primary key of your `angkatan` table. If you haven't run migrations, Eloquent cannot establish this link correctly, leading to corrupted object loading later on. Remember, proper database structure is foundational in any robust framework like Laravel ([https://laravelcompany.com](https://laravelcompany.com)).

### 2. Safe Access in the View

If your relationship setup is correct, the view access needs to be defensively coded. Always check if the relationship exists and is not null before attempting to read its properties.

Instead of directly accessing nested properties, use conditional checks:

```blade
@if ($siswa->angkatan)
    {{-- Now it's safe to access properties --}}
    <p>Angkatan Name: {{ $siswa->angkatan->nama }}</p>
    <p>Tahun Angkatan: {{ $siswa->angkatan->tahun }}</p>
@else
    <p>Angkatan data not found for this student.</p>
@endif
```

This pattern prevents the "Attempt to read property on int" error by ensuring you only try to access properties if the relationship object actually exists.

***

## Conclusion

The issue you encountered is a classic example of how Eloquent works: it relies entirely on the integrity of your database structure and the correctness of your model relationships. The error wasn't in the *logic* of the `belongsTo` call, but in the *state* of the data being returned to the view layer.

By focusing on proper migration setup first, and implementing defensive checks when accessing nested Eloquent models, you ensure that your Laravel applications remain stable, predictable, and easy to debug. Keep practicing these principles; they are the building blocks for becoming a senior developer!
