---
title: "foreach() argument must be of type array|object, null given"
description: "Debugging the Dreaded Error: Solving foreach() argument must be of type array|object, null given in Laravel As a senior developer working with the Laravel..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "PHP", "Errors"]
featured: false
---

As a senior developer working with the Laravel ecosystem, you will inevitably run into frustrating runtime errors. One of the most common and maddening errors developers face is the infamous: `foreach() argument must be of type array|object, null given`. This error usually signals that somewhere in your application logic, you are attempting to loop over a variable that unexpectedly holds the value `null` instead of an array or object.

This post dives deep into the specific scenario you described—fetching related data based on a category ID—and provides a robust, defensive strategy to eliminate this bug, ensuring your Laravel application remains stable and predictable.

## Understanding the Root Cause in Your Scenario

The error occurs because PHP cannot iterate over `null`. In your case, `$produks` is expected to be an array of products, but if the data retrieval fails (e.g., a category ID doesn't exist), the variable ends up being `null`. When the Blade view attempts to execute `@foreach ($produks as $produk)`, PHP throws this fatal error because it cannot iterate over nothing.

Let’s analyze the logic provided:

**Controller Snippet Analysis:**

```php
// ... inside index() method
$categoryId = request('category_id');
$categoryName = null;

if($categoryId){
    $category = Category::find($categoryId); // If this returns null, the next line fails.
    $categoryName = ucfirst($category->name); 
    $produks = $category->products; // CRITICAL: If $category is null, accessing ->products causes a fatal error before reaching the view.
} else {
    $produks = Produk::take(10)->get();
}

return view('produk.index', compact('keranjangItems', 'produks', 'categoryName'));
```

The vulnerability lies in the assumption that `Category::find($categoryId)` will always return a valid `Category` model instance. If `$categoryId` is provided but points to a record that does not exist, `$category` will be `null`, causing a fatal error when you try to access `$category->products`.

## The Solution: Defensive Programming and Null Safety

The fix is not just about catching the error; it's about implementing **defensive programming**. We must ensure that every variable used in a loop is guaranteed to be an array, even if it’s empty. This practice aligns perfectly with modern Laravel development principles, where handling potential null values is paramount for robust applications (as emphasized by best practices found on platforms like [laravelcompany.com](https://laravelcompany.com)).

There are three primary ways to resolve this issue cleanly:

### 1. Using the Nullsafe Operator (PHP 8.0+)

If you are using PHP 8.0 or newer, the nullsafe operator (`?->`) can make accessing nested properties safer, though it primarily helps prevent errors on the object itself, not necessarily on the array result.

### 2. Conditional Assignment with `if` Checks (The Classic Approach)

This is the most explicit and safest way to handle conditional data fetching in your controller logic. You must check if the model was successfully found *before* attempting to access its relationships.

**Improved Controller Logic:**

```php
public function index()
{
    $categoryId = request('category_id');
    $produks = []; // Initialize $produks as an empty array by default

    if ($categoryId) {
        $category = Category::find($categoryId);

        // Only proceed if the category was actually found
        if ($category) {
            $categoryName = ucfirst($category->name);
            // Safely assign products, defaulting to an empty array if 'products' relationship is null
            $produks = $category->products ?? []; 
        } else {
            // Handle the case where the category ID was invalid (optional: log error)
            $categoryName = 'Unknown Category';
            $produks = []; // Ensure $produks is an empty array if the category doesn't exist
        }
    } else {
        // Fallback logic remains sound
        $produks = Produk::take(10)->get();
    }

    return view('produk.index', compact('keranjangItems', 'produks', 'categoryName'));
}
```

### 3. Blade Null Coalescing for Display

While fixing the controller logic is paramount, you can also safeguard the view layer by using the null coalescing operator (`??`) directly in your Blade file. This ensures that if `$produks` is `null`, it defaults to an empty array (`[]`), which safely allows the `@foreach` loop to execute zero times without throwing an error.

**Improved Blade Snippet:**

```html
@extends('layouts.front')

@section('content')

    {{-- Use ?? [] to ensure $produks is always iterable --}}
    <div class="container">
        <h2>Produk {{ $categoryName ?? 'No Category Selected' }}</h2>

        <div class="custom-row-2">
            {{-- If $produks is null, use an empty array instead \
               to prevent the foreach error --}}
            @foreach (array_filter($produks ?? []) as $produk)
                @include('produk._single_product')
            @endforeach
        </div>
    </div>

@endsection
```

## Conclusion

The `foreach() argument must be of type array|object, null given` error is a classic symptom of insufficient input validation in backend logic. By adopting defensive programming—checking for the existence of Eloquent models before attempting to access their relationships and by utilizing PHP's null-coalescing features in your Blade views—you transform brittle code into resilient, production-ready applications. Always assume data might be missing; handle those edge cases explicitly to ensure stability, whether you are working with complex Eloquent relationships or simple database queries on [laravelcompany.com](https://laravelcompany.com).
