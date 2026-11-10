---
title: "Laravel Eloquent how to get the second or third record?"
description: "Laravel Eloquent: How to Get the Second or Third Record from a Relationship As developers working with relational data in Laravel, one of the most common..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Performance", "PHP"]
featured: false
---

As developers working with relational data in Laravel, one of the most common tasks is navigating relationships. When you have a one-to-many relationship, like an `Order` having many `Product`s, retrieving specific elements—such as the second or third product—requires a slightly more nuanced approach than simply using `first()` or direct ID lookups.

This post will walk you through the best and most practical ways to retrieve specific records from a related collection in Eloquent, ensuring you understand both the efficient database practices and the idiomatic Laravel syntax.

## The Challenge with Basic Retrieval

You are working with an `Order` model that has a `hasMany` relationship with the `Product` model. You want the second or third product associated with that order.

As you noted, methods like `$order->products->first()` correctly retrieve the first item. However, trying to use `$order->products->find(2)` assumes you know the exact primary key ID of the product you want, which defeats the purpose of querying based on positional index within the relationship itself.

The core challenge is that Eloquent relationships primarily deal with sets of data (collections), and retrieving a record by its *position* within that set requires processing the collection after the data has been fetched from the database.

## Solution 1: Load All and Use Array Indexing (The Practical Approach)

For smaller result sets, the simplest and often most readable way to access the Nth element is to load the entire relationship into a collection and then use standard PHP array indexing. This is perfectly acceptable when performance on massive datasets isn't the absolute bottleneck.

Here is how you can retrieve the second product:

```php
use App\Models\Order;

// 1. Fetch the order and eager load the products
$order = Order::with('products')->find(1);

if ($order && $order->products->count() >= 2) {
    // The first element is at index 0, the second is at index 1.
    $secondProduct = $order->products->toArray()[1];
    $thirdProduct = $order->products->toArray()[2];

    echo "The second product name is: " . $secondProduct->name;
} else {
    echo "Not enough products found for this order.";
}
```

**Why this works:** This method leverages Eloquent's ability to load the relationship data into a collection. By casting it to an array (`toArray()`), you gain access to standard PHP indexing, allowing you to pick the element at index `1` (the second item) or `2` (the third item).

## Solution 2: Using `limit()` and `offset()` for Database Efficiency

While the method above is simple, it forces Laravel to fetch *all* related products from the database before PHP slices them. For large orders, this can be inefficient. A more performant approach involves using SQL features directly through Eloquent's query builder methods: `limit()` and `offset()`. This tells the database exactly how many records to return, minimizing data transfer.

To get the third product (assuming products are ordered by creation date or some other defined order):

```php
use App\Models\Order;

$orderId = 1;
$offset = 1; // Start after the first record (0-indexed)
$limit = 1;  // Only retrieve one record at a time for precision

// Retrieve the second product (offset 1, limit 1)
$secondProduct = Order::with('products')
    ->where('id', $orderId)
    ->with('products') // Ensure relationship is loaded for subsequent retrieval if needed
    ->limit($offset + 1)
    ->offset($offset)
    ->first();

// You would need a loop or chaining to get the third record,
