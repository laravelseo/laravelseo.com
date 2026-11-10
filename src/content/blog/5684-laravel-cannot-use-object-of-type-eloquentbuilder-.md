---
title: "Laravel cannot use object of type Eloquent/Builder as array"
description: "Laravel Cannot Use Object of Type Eloquent/Builder as Array: Mastering Eloquent Query Results As developers working with the Laravel ecosystem, we often..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP", "Errors"]
featured: false
---

As developers working with the Laravel ecosystem, we often encounter moments where the power and complexity of Eloquent can trip us up. One of the most common hurdles beginners face is dealing with the difference between an Eloquent **Query Builder** object and a simple PHP **array** or collection of data. The error you are encountering—`Cannot use object of type Illuminate\Database\Eloquent\Builder as array`—is a classic symptom of misinterpreting how database queries are executed in Laravel.

This post will dive deep into why this error occurs, demonstrate the flawed approach, and provide the correct, idiomatic Laravel solution. Understanding this distinction is crucial for writing clean, maintainable, and efficient code when interacting with your database via Eloquent.

## The Root Cause: Builder vs. Data

When you write an Eloquent query, such as `$sites = Site::select('code_site')->orderBy('code_site', 'desc');`, the variable `$sites` is not yet the actual data (the rows from the database). Instead, it is an instance of `Illuminate\Database\Eloquent\Builder`.

The Builder object represents the *instructions* for how to query the database. It holds methods and constraints that define the query structure (like `where()`, `select()`, `orderBy()`), but it does not contain the actual result set data itself.

When your view attempts to loop through `$sites` using a standard PHP loop (`@for ($i = 0; $i < count($sites); $i++)`), PHP expects an array or an object that implements `Countable`. Since the Builder object doesn't expose its results directly in that format, Laravel throws an error because it cannot interpret the query instructions as simple data.

## The Solution: Executing the Query

To fix this, you must explicitly tell the Eloquent Builder to execute the query against the database and fetch the results into a standard PHP structure (an array or a collection) before passing that data to your view.

The simplest and most common methods for achieving this are using the `get()` method or the `toArray()` method.

### Incorrect Approach (The Error)

In your `HomeController`, you were likely returning the Builder object directly:
```php
public function liste_sites() 
{
    $sites = Site::select('code_site')
        ->orderBy('code_site','desc'); // $sites is a Builder object

    return View::make('liste_sites', array( 'sites' => $sites, 'which_actif' => 1));
}
```

### Correct Approach (The Fix)

You need to call an execution method on the Query Builder to retrieve the actual results. The `get()` method is perfect for retrieving a collection of models or plain results into a standard array:

```php
use App\Models\Site; // Ensure you import your model

public function liste_sites() 
{
    // Use get() to execute the query and fetch the results as a Collection/Array
    $sites = Site::select('code_site')
        ->orderBy('code_site', 'desc')
        ->get(); // <-- This executes the query and returns an array of results

    return View::make('liste_sites', array( 'sites' => $sites, 'which_actif' => 1));
}
```

By adding `->get()`, the `$sites` variable now holds a Laravel Collection (which behaves like an array) containing all the site records. This collection can be iterated over perfectly in your Blade file.

## Applying the Fix in the View

With the corrected data structure, your Blade file will work as expected:

```blade
{{-- liste_sites.blade.php --}}

@foreach ($sites as $site)
    <p>{{ $site->code_site }}</p>
@endforeach
```

Notice how we use a cleaner `@foreach` loop, which is the idiomatic way to iterate over Laravel Collections instead of manual index manipulation.

## Best Practices for Data Handling

When dealing with data retrieval in Laravel, always think about what you need:

1.  **For single records:** Use `find()` or `first()`.
2.  **For a single value (e.g., the first result):** Use `first()` and access the attribute directly: `$site = Site::first(); $code = $site->code_site;`
3.  **For multiple records:** Always use `get()` to fetch data into a Collection, which is highly flexible for subsequent operations (like mapping, filtering, or pagination).

Leveraging these methods ensures your code remains readable and resilient. For more advanced insights into how Laravel manages database interactions efficiently, I highly recommend exploring the official documentation at [https://laravelcompany.com](https://laravelcompany.com).

## Conclusion

The error "Cannot use object of type Eloquent/Builder as array" is not a bug in the framework; it is a signal that you are trying to use query instructions where execution results are expected. By understanding the difference between an Eloquent Builder and actual data, and by explicitly calling methods like `get()` or `toArray()`, you master the flow of data from the database into your application layer. Embrace these principles, and you will write more robust and elegant Laravel code.
