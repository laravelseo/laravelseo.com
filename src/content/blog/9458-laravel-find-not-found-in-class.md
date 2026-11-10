---
title: "laravel ::find not found in class"
description: "Mastering Eloquent: Solving \"Not Found\" Errors When Searching in Laravel As a senior developer working with the Laravel ecosystem, you frequently run into..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

As a senior developer working with the Laravel ecosystem, you frequently run into scenarios where you need to retrieve data from the database based on certain criteria. One of the most common stumbling blocks is handling cases where the requested data simply does not exist. The error you encountered—`Trying to get property of non-object`—is a classic symptom of trying to access properties on a variable that holds `null`, which often happens when Eloquent cannot find a matching record in the database.

This post will dissect the issue you faced, explain why it happened, and demonstrate the correct, idiomatic Laravel solutions for finding models efficiently and safely.

## Understanding the Error: Why `$article` Becomes `null`

Your error, "Trying to get property of non-object (View: ...)", tells us exactly what is wrong: the variable `$article` in your view is not an `Article` model instance; it is `null`. This occurred because when you executed `$article = Article::find($title);`, the Eloquent query found no record matching the provided `$title`, so the method returned `null`. When the Blade view attempted to execute `{{$article->title}}`, PHP threw a fatal error because you cannot access properties on `null`.

Furthermore, the message about `Method "findOrFail" not found` suggests a slight confusion between standard Eloquent methods. The correct approach involves understanding how Eloquent handles missing records and ensuring your query is correctly structured for searching by columns.

## Solution 1: Safely Using `find()` (The Explicit Check)

If you explicitly use the `find()` method, you are responsible for checking if the result exists before proceeding. This is the safest approach when you don't want an immediate HTTP exception.

To correctly search by a column like `title`, you must use the `where()` clause instead of passing the value directly to `find()`.

### Controller Implementation (Safe Approach)

```php
public function showArticle($title)
{
    // Use where() to query based on a column value.
    $article = Article::where('title', $title)->first();

    // Check if the article was found before attempting to load the view.
    if (!$article) {
        // Handle the case where the article does not exist (e.g., redirect or throw a 404)
        abort(404, 'Article not found.');
    }

    return view('article.show', compact('article'));
}
```

**Why this works:** By explicitly checking `$article` with an `if` statement, you prevent the error in the view layer. If the article is missing, you can handle the response gracefully, perhaps by aborting with a 404 status code, which is standard RESTful practice.

## Solution 2: The Eloquent Best Practice: Using `findOrFail()`

For scenarios where the existence of the record is *mandatory* for the operation to succeed (which is common in detail views), Laravel provides the elegant solution: `findOrFail()`.

`findOrFail()` attempts to find a record using the specified constraints. If no record is found, it automatically throws a `ModelNotFoundException`, which Laravel’s exception handler catches and automatically converts into an HTTP 404 response. This eliminates the need for manual `if/else` checks in your controller method, leading to cleaner, more concise code.

### Controller Implementation (Recommended Approach)

```php
use App\Models\Article; // Make sure you import your model

public function showArticle($title)
{
    // Eloquent finds the record by title. If not found, it automatically throws a 404 error.
    $article = Article::where('title', $title)->firstOrFail();
    
    // If we reach this point, the article object is guaranteed to exist.
    return view('article.show', compact('article'));
}
```

**Model Structure Note:** Remember that for `findOrFail()` to work correctly and efficiently, your Eloquent model (`Article` in this case) must be properly defined, often by inheriting from `Illuminate\Database\Eloquent\Model`, as you have done. This adherence to Eloquent conventions is crucial when building robust applications with Laravel.

## Conclusion: Choosing the Right Tool for the Job

The difference between these solutions lies in error handling philosophy:

1.  **`find()` or `where()->first()` + Manual Check:** Use this when you want fine-grained control over *how* and *if* a record is found, allowing you to return custom responses (like a specific error message) without interrupting the flow with an exception.
2.  **`findOrFail()`:** Use this for standard resource retrieval where the existence of the requested item is a prerequisite for the page loading. It keeps your controller clean and leverages Laravel's built-in exception handling to manage HTTP status codes automatically.

By adopting `findOrFail()` for mandatory lookups, you write more concise, maintainable code, adhering to the principles of clean architecture that Laravel promotes. Always strive to use Eloquent’s powerful methods to handle database interactions gracefully!
