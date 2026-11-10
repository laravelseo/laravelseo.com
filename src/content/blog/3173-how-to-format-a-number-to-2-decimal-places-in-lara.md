---
title: "How to format a number to 2 decimal places in Laravel blade"
description: "How to Format Numbers to Two Decimal Places in Laravel Blade As developers working within the Laravel ecosystem, we frequently deal with data retrieved from..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers working within the Laravel ecosystem, we frequently deal with data retrieved from the database that needs specific presentation rules applied. One common requirement is ensuring monetary values or precise measurements are displayed consistently—for instance, formatting a `float` or `double` value to exactly two decimal places.

You've encountered a classic scenario: trying to use standard PHP functions like `number_format()` directly within your Blade file for this purpose and finding it behaves unexpectedly. While technically possible, relying solely on raw string manipulation in the view layer is often brittle, especially when dealing with internationalization or complex application logic.

This post will guide you through the most robust and idiomatic ways to format floating-point numbers to two decimal places in a Laravel application, moving from basic PHP solutions to best-practice Eloquent implementations.

## Why Direct Formatting Can Be Tricky

When you retrieve a `double` (or `float`) from your database via Eloquent, it is usually returned as a standard PHP float. Applying `number_format($amount, 2)` in the Blade file works, but it pushes the responsibility of data manipulation into the view layer. This violates the principle of separation of concerns. If you need this formatted number elsewhere (e.g., in an API response), you have to repeat the logic.

The key is to perform data handling and formatting as close to the data source as possible, typically within the Model or Controller, ensuring that the data presented to the view is already correctly structured.

## Solution 1: Formatting within the Controller/Model (The Best Practice)

The most professional approach is to format the number *before* it reaches the Blade view. This keeps your views clean and ensures consistency across your application. In a Laravel context, this logic belongs in your Eloquent Model or a dedicated Service class.

### Using Eloquent Accessors

You can define an accessor method on your Eloquent Model to handle this formatting automatically whenever you access the attribute.

Consider a `Product` model where you store prices:

```php
// app/Models/Product.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    // ... other model code

    /**
     * Get the price formatted to two decimal places.
     */
    public function getFormattedPriceAttribute($value)
    {
        // Ensure the value is treated as a float before formatting
        return number_format($value, 2);
    }
}
```

Now, when you retrieve this model in your Controller and pass it to the view, the formatting is handled automatically:

```php
// In your Controller
$product = Product::find(1);
return view('products.show', compact('product'));
```

In your Blade file, you simply display the attribute:

```blade
<!-- resources/views/products/show.blade.php -->
<p>Product Name: {{ $product->name }}</p>
<p>Price: ${{ $product->formatted_price }}</p>
```

This approach demonstrates a clean separation of concerns, which is a core philosophy behind robust Laravel development, as championed by resources like [laravelcompany.com](https://laravelcompany.com).

## Solution 2: Formatting Directly in Blade (The Quick Fix)

If you must perform the formatting directly in the Blade file (for very simple, one-off displays), you can still use PHP functions, but it is crucial to ensure the variable being passed is indeed a numeric type that supports these functions.

```blade
{{-- Assuming $amount is retrieved from the controller and is a float --}}
<p>Formatted Price: ${{ number_format($amount, 2) }}</p>
```

While this works, it requires you to pass the raw float from the backend, which might lead to issues if the database driver returns unexpected string formats.

## Conclusion

For robust applications, always favor handling data transformation in your Eloquent Models or Controllers rather than relying on presentation logic solely within Blade files. By using Model Accessors, as shown above, you ensure that your numerical data is consistently formatted, regardless of where it is displayed—whether on a web page, an API response, or an email. This practice leads to cleaner, more maintainable, and scalable code, aligning perfectly with the principles of modern Laravel development found at [laravelcompany.com](https://laravelcompany.com).
