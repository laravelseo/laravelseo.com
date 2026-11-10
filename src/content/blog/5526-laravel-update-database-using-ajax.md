---
title: "Laravel : Update Database using Ajax"
description: "Laravel: Seamlessly Updating Database Records with AJAX in a Shopping Cart Building interactive features like shopping carts requires smooth communication..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "PHP", "Errors"]
featured: false
---

Building interactive features like shopping carts requires smooth communication between the frontend and backend. When you attempt to update data via AJAX, it’s easy to run into subtle errors related to object retrieval or data validation. As a senior developer, I’ve seen this exact scenario frequently: updating quantities in real-time causes issues when handling Eloquent models on the server side.

This post will dissect the problem you are facing with your shopping cart update mechanism and provide a robust, production-ready solution using Laravel best practices. We will address why you are seeing errors like `Trying to get property of non-object` and how to ensure your AJAX calls result in successful database updates.

## Understanding the AJAX Flow and Potential Pitfalls

Your setup—using hidden inputs for IDs and an AJAX call to a specific route—is fundamentally correct for initiating a request. The problem usually lies not in the frontend JavaScript, but in how the backend handles the received data and interacts with the Eloquent models.

When you execute this line in your controller:

```php
$cart = Cart::find($cat_id);
```

If no record exists with that `$cat_id`, `find()` returns `null`. When your code immediately tries to access a property on that null object (e.g., `$cart->no_of_items = ...`), PHP throws the fatal error: `Trying to get property of non-object`. This is the root cause of your issue, as demonstrated by your console errors.

## The Solution: Defensive Coding in Your Controller

The key to solving this lies in implementing **defensive coding**. Before attempting to modify a model retrieved from the database, you must always verify that the model actually exists. This ensures your application remains stable even when invalid or missing data is sent via an API call.

Here is how we can refactor your `cartUpdate` method in the `ProductController`:

```php
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;

public function cartUpdate(Request $request, $cat_id, $qty)
{
    // 1. Validate Input (Optional but highly recommended for security)
    if (!is_numeric($qty) || $qty < 1) {
        return response()->json(['error' => 'Invalid quantity provided.'], 400);
    }

    // 2. Find the Cart Record Safely
    $cart = Cart::find($cat_id);

    // CRITICAL CHECK: If the cart doesn't exist, stop execution and return an error.
    if (!$cart) {
        return response()->json(['error' => 'Cart not found.'], 404);
    }

    // 3. Find the related Product safely (assuming a relationship exists)
    $product = Product::find($cart->product_id);

    if (!$product) {
         return response()->json(['error' => 'Related product not found.'], 404);
    }

    // 4. Perform the Update
    $cart->no_of_items = (int)$qty; // Cast to ensure it's an integer
    
    // Recalculate price based on the current product price
    $cart->price = $product->price * $cart->no_of_items;
    
    $cart->save();

    return response()->json(['message' => 'Cart updated successfully', 'new_total' => $cart->price]);
}
```

### Best Practice Summary

1.  **Use Eloquent Find/Where:** Always use methods like `find()` or `where()` when querying data, and immediately check the result before attempting to access properties on it.
2.  **Return Appropriate Status Codes:** Instead of letting an exception crash your page, return JSON responses with appropriate HTTP status codes (e.g., 404 for not found, 400 for bad input). This is fundamental to building robust APIs, a core concept in modern Laravel development.
3.  **Data Integrity:** Always ensure the data you are using for calculations (`$product->price`) is also verified before proceeding with the update.

## Conclusion

Updating database records via AJAX in a Laravel application is an excellent way to create a dynamic user experience. While the frontend handles the visual interaction, the backend must be meticulously secured and robust. By adopting defensive programming—specifically checking for `null` values immediately after database lookups—you transform potentially crashing code into reliable, scalable logic. Keep focusing on Eloquent relationships and input validation; these are the cornerstones of building powerful applications with Laravel. For more detailed insights into structuring your projects, check out the resources available at [https://laravelcompany.com](https://laravelcompany.com).
