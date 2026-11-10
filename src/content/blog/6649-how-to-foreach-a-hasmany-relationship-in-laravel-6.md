---
title: "How to foreach a hasMany relationship in Laravel 6"
description: "How to foreach a hasMany Relationship in Laravel 6: Fixing the Common Eloquent Pitfall As senior developers working with Eloquent relationships in..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As senior developers working with Eloquent relationships in Laravel, we often encounter situations where fetching nested data—specifically iterating over a `hasMany` relationship—seems straightforward but throws cryptic errors. This is a very common hurdle when dealing with relational data structures.

In this post, we will dissect the issue you encountered with looping through a `hasMany` relationship between `Layanan` and `Objek` models in Laravel 6. We will diagnose why your original approach failed and demonstrate the most efficient, idiomatic way to handle nested relationships using Eloquent's eager loading.

## Understanding the Setup and The Error

You have correctly set up a classic one-to-many relationship:
*   **Layanan Model:** Has many `Objek` (`hasMany`).
*   **Objek Model:** Belongs to one `Layanan` (`belongsTo`).

The error you received, *"Invalid argument supplied for foreach()"* or issues where `'layanan' is non-object`, usually indicates that when you try to access the relationship inside your loop (e.g., `$item->layanan`), Eloquent hasn't loaded that relationship data yet, or the structure being returned by the query isn't what PHP expects in that context.

The core problem here is often related to **N+1 query problems** and inefficient data access when dealing with nested relationships. Simply fetching the parent objects (`$objek = \App\Objek::all();`) does not automatically fetch all the related `Layanan` data efficiently for every object, leading to potential errors or massive overhead if you try to iterate over an unpopulated relationship structure.

## The Solution: Eager Loading with `with()`

The most robust and performant way to access nested data in Laravel is by using **Eager Loading**. This technique tells Eloquent to load the related models in a separate, optimized query, preventing the dreaded N+1 problem (where you execute one query for the main objects, and then $N$ additional queries inside the loop to fetch the relationships).

To fix your issue, instead of fetching only the `Objek` models, you must instruct Eloquent to also load the related `Layanan` data along with them.

### Step 1: Modifying the Controller Query

We need to modify how we retrieve the data in the controller to eagerly load the `layanan` relationship onto every `objek` record.

```php
// In ObjekController.php

public function object()
{
    // Use with('layanan') to eager load the related Layanan data efficiently
    $objek = \App\Objek::with('layanan')->all();

    return view('pages.alat.object.object')->with('data', $objek);
}
```

By adding `->with('layanan')`, Eloquent executes two optimized queries: one to fetch all the objects, and a second query to fetch all necessary related layanans, which is far more efficient than looping and querying inside your view. This approach aligns perfectly with best practices for data retrieval in Laravel, as promoted by resources like [laravelcompany.com](https://laravelcompany.com).

### Step 2: Correcting the View Iteration (Blade)

Once the data is correctly loaded via eager loading, iterating through the collection becomes safe and reliable. You can now safely access the nested relationship within your Blade view.

```blade
{{-- In your view file --}}
@foreach ($data as $item)
    {{-- The relationship is now guaranteed to be loaded and accessible --}}
    @foreach ($item->layanan as $layanan)
        <tr>
            <td>{{ $item->objeks_id }}</td>
            <td>{{ $layanan->layanan_id }},</td>
            <td>{{ $item->tipe_objeks }}</td>
            <td>{{ $item->created_at->format('d/m/Y') }}</td>
            <td>{{ $item->updated_at->format('d/m/Y') }}</td>
        </tr>
    @endforeach
@endforeach
```

Notice that by using `$item->layanan`, we are now accessing a properly populated Eloquent model instance, which resolves the "non-object" error you were facing.

## Conclusion

Handling nested relationships in Laravel requires understanding how Eloquent manages data retrieval. The error experienced was not a flaw in your relationship definition but rather an oversight in loading the related data. By mastering **Eager Loading** using the `with()` method, developers can write cleaner, faster, and more resilient code, ensuring that complex relational data is retrieved efficiently. Always prioritize eager loading when dealing with `hasMany` and `belongsTo` relationships to maintain optimal performance across your Laravel applications.
