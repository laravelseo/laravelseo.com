---
title: "Trying to get property 'id' of non-object (View: C:\\xampp\\htdocs\\project\\resources\\views\\keuangan\\hasil.blade.php)"
description: "Mastering Eloquent: Solving the \"Trying to get property 'id' of non object\" Error in Laravel As a beginner diving into the world of Laravel, you are..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a beginner diving into the world of Laravel, you are encountering one of the most common stumbling blocks: handling data retrieval and updates. The error message, `Trying to get property 'id' of non-object`, is highly specific, but it signals a fundamental issue in how your application is interacting with the database—specifically, you are attempting to access a property (like `id`) on a variable that does not hold an object, meaning it is likely `null`.

This post will walk you through exactly why this error occurs in your scenario and provide robust, best-practice solutions using Laravel's Eloquent ORM.

## The Root Cause: Why Does This Error Happen?

The error occurs in your Blade view when you try to access `$keuangan->id` (or `$keuangan['id']`). This means that the variable `$keuangan`, which you passed from your Controller, is `null` instead of an Eloquent Model instance.

In your controller's `edit` method:

```php
public function edit($id)
{
    $keuangan = Keuangan::find($id); // If no record with $id exists, $keuangan will be null.
    return view('/keuangan/edit', compact('keuangan'));
}
```

If the `$id` passed to the route does not correspond to any existing record in your `keuangan` table, `Keuangan::find($id)` returns `null`. When Laravel tries to execute the view and access properties on this `null` value, it throws the fatal error: "Trying to get property 'id' of non-object."

The solution is not just fixing the view; we must fix the data retrieval logic in the Controller to ensure a valid object is always passed to the view.

## Solution 1: Safe Data Retrieval with `findOrFail()`

The most idiomatic Laravel way to handle this situation is to use Eloquent's `findOrFail()` method instead of `find()`.

`findOrFail($id)` attempts to find the record and, if it doesn't exist, it automatically throws a `ModelNotFoundException`, which Laravel handles gracefully by redirecting the user to a 404 page. This prevents your application from crashing with a raw PHP error.

**Refactored Controller Code:**

```php
use App\Models\Keuangan; // Make sure you import your Model
use Illuminate\Http\Request;

class KeuanganController extends Controller
{
    // ... other methods

    public function edit($id)
    {
        // Use findOrFail to ensure the record exists, or throw an exception if it doesn't.
        $keuangan = Keuangan::findOrFail($id); 
        
        // If we reach here, $keuangan is guaranteed to be a valid Model object.
        return view('/keuangan/edit', compact('keuangan'));
    }

    // ... other methods
}
```

By implementing `findOrFail()`, you ensure that the `$keuangan` variable passed to your view is always an actual Eloquent model, eliminating the possibility of it being `null`. This practice aligns perfectly with the principles of clean code and robust application design promoted by platforms like [laravelcompany.com](https://laravelcompany.com).

## Solution 2: Handling Updates Correctly (The Next Step)

Since your ultimate goal is to *update* data, let's briefly look at how you would perform that action safely. When editing a record, the process involves two main steps: retrieving the data and then saving the changes.

If you were updating the data from the form submission, you would use the `update()` method:

```php
public function update(Request $request, $id)
{
    // 1. Find the record (using findOrFail for safety)
    $keuangan = Keuangan::findOrFail($id);

    // 2. Update the attributes
    $keuangan->update([
        'bahan_baku' => $request->input('bahan_baku'),
        'biaya_tambahan' => $request->input('biaya_tambahan'),
        // ... update other fields
    ]);

    return redirect()->route('keuangan.hasil')->with('success', 'Data berhasil diperbarui!');
}
```

This approach is much cleaner and more secure than manually querying the database multiple times, as it leverages Eloquent's built-in methods for data manipulation.

## Conclusion

The error `Trying to get property 'id' of non-object` is a classic symptom of accessing null data. As a developer, your job is to anticipate these failures and build defensive code. By switching from simple `find()` to the more robust `findOrFail()`, you ensure that your application flow remains predictable and prevents runtime errors. Always prioritize checking for null values when dealing with Eloquent models, especially when handling routes and form submissions. Keep practicing these principles, and you will write much more reliable Laravel applications.
