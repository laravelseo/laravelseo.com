---
title: "laravel session shopping cart - how to increase the quantity if the product already exists"
description: "Mastering the Shopping Cart: How to Increment Quantities in a Laravel Session Building an e commerce application with Laravel is a fantastic journey. As you..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Building an e-commerce application with Laravel is a fantastic journey. As you dive into session management, one of the most common hurdles developers face is correctly managing the shopping cart state—specifically, ensuring that when a user adds an item they already possess, the quantity updates instead of creating duplicate entries.

This post will walk you through the problem you are facing with your Laravel session cart and provide a robust, developer-friendly solution using best practices. We’ll look at why your current implementation leads to duplicated items and refactor your controller logic to handle quantities efficiently.

## The Shopping Cart Dilemma: Duplication vs. Aggregation

You've correctly identified the issue: when adding an item repeatedly, your current approach simply appends a new array entry to the session cart. This results in multiple rows for the same product ID, which complicates checkout and inventory management.

Let's look at your example structure:

```php
// Current result (Problematic):
array:3 [▼
  0 => array:5 [ "id" => 7, "nama_product" => "adssdsadxx", "qty" => 1 ]
  1 => array:5 [ "id" => 7, "nama_product" => "adssdsadxx", "qty" => 1 ] // Duplicate entry!
  2 => array:5 [ "id" => 7, "nama_product" => "adssdsadxx", "qty" => 1 ] // Duplicate entry!
]
```

The goal is to transform this into an aggregated structure where the product ID maps directly to its total quantity. We need to shift from treating the cart as a simple list of line items to treating it as a collection of unique products with associated quantities.

## The Solution: Checking and Updating Existing Items

To solve this, we must modify the `addToCart` method to perform an existence check before adding a new item. If the product ID is already present in the session cart array, we update its quantity; otherwise, we add it fresh.

This approach ensures that your session data remains clean, aggregated, and easy to process when the user eventually checks out. This pattern of checking for existing IDs before inserting or updating data is fundamental in any application development, including what you learn when building scalable systems with **Laravel** [https://laravelcompany.com](https://laravelcompany.com).

### Refactoring the `addToCart` Logic

Instead of simply appending to the session array, we will iterate through the existing cart items to see if the product already exists and update its quantity accordingly.

Here is how you can refactor your logic within your controller method:

```php
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\DB; // Assuming you are using Eloquent/DB facade

public function addToCart(Request $request, $productId)
{
    // 1. Fetch product details (Using Eloquent is highly recommended over raw DB queries in Laravel)
    $product = DB::table('products')->where('id', $productId)->first();

    if (!$product) {
        return redirect()->back()->with('error', 'Product not found.');
    }

    // 2. Retrieve the current cart session data
    $cart = Session::get('cart', []);

    // 3. Check if the product already exists in the cart
    if (isset($cart[$productId])) {
        // If it exists, increment the quantity
        $cart[$productId]['qty'] += $request->input('quantity', 1); // Use input for desired quantity
    } else {
        // If it does not exist, add the new item to the cart
        $cart[$productId] = [
            "id" => $product->id,
            "nama_product" => $product->nama_product,
            "harga" => $product->harga,
            "pict" => $product->pict,
            "qty" => $request->input('quantity', 1), // Start quantity at the requested amount
        ];
    }

    // 4. Save the updated cart back to the session
    Session::put('cart', $cart);

    Session::flash('success', 'Barang berhasil ditambahkan ke keranjang!');
    return redirect()->back();
}
```

### Handling Quantity Updates (The `updateCart` Improvement)

Your original `updateCart` method also needs refinement. A cleaner way to handle quantity modification is usually through a dedicated route that receives the product ID and the new quantity, rather than trying to process complex array inputs within the session update itself.

When you fetch the cart data now, it will look much cleaner:

```php
public function updateCart(Request $request, $productId)
{
    $cart = Session::get('cart');

    if (!isset($cart[$productId])) {
        return redirect()->back()->with('error', 'Product not found in cart.');
    }

    // Ensure the requested quantity is a valid number
    $newQuantity = (int) $request->input('quantity');

    if ($newQuantity <= 0) {
        // If quantity is zero or less, remove the item entirely
        unset($cart[$productId]);
    } else {
        // Otherwise, update the quantity
        $cart[$productId]['qty'] = $newQuantity;
    }

    Session::put('cart', $cart);
    return redirect()->back();
}
```

## Conclusion: Scalability Matters

By implementing this check-and-update logic, you transform your shopping cart from a simple list into an efficient data structure. This practice is crucial for building scalable applications. While session management is fine for small projects, as your e-commerce site grows, consider using Eloquent models and potentially storing the cart items in a dedicated database table linked to the user ID. This provides better persistence, easier auditing, and superior performance compared to relying solely on session data alone. Keep leveraging the power of **Laravel** to build robust features!
