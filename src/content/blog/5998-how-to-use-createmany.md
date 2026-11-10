---
title: "How to use createMany"
description: "Mastering Batch Insertion in Laravel: A Deep Dive into createMany() Welcome to the world of Eloquent! As you start working with databases in Laravel,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Performance", "PHP"]
featured: false
---

Welcome to the world of Eloquent! As you start working with databases in Laravel, optimizing how you handle large sets of data is crucial for performance. One method that stands out for its efficiency is `createMany()`. It allows you to insert multiple model records with a single database query, which saves significant time and resources compared to running individual `save()` operations in a loop.

If you are new to Laravel, it’s completely understandable why the syntax of methods like `createMany()` might seem confusing initially. Let's break down exactly what `createMany()` does, how it works under the hood, and how to correctly structure your data to use it effectively.

## Understanding the Power of `createMany()`

The primary goal of `createMany()` is to perform a bulk insertion into the database using Eloquent models. Instead of executing an INSERT query for every item in your loop—which involves multiple round trips to the database—`createMany()` bundles all your data and executes a single, highly optimized query. This massively improves performance, especially when dealing with hundreds or thousands of records.

When you call `$model::createMany($attributes)`, Eloquent takes the provided array of attributes and inserts each set into the table in one go. This is a powerful feature that leverages the underlying efficiency of SQL operations tailored for bulk data insertion. Understanding this concept is key to writing scalable Laravel applications, much like understanding the core principles discussed on the [Laravel Company website](https://laravelcompany.com).

## Analyzing Your Example and Correcting the Usage

Your attempt to use `createMany()` is on the right track, but the way you are constructing your `$values` array needs a slight adjustment to align with how Eloquent expects data for batch creation.

Here is an analysis of your original approach:

```php
// Original logic snippet provided by the user
for($i = 0; $i < count($request->products); $i++)
{
    $values[] = [
        'order_number' => $request->order_number, // Problem: Using single request values repeatedly
        'client' => $request->client,             // Problem: Using single request values repeatedly
        'products' => $request->products[$i],
        'amount' => $request->amount[$i],
        'description' => $request->description,
    ];
}
Order::createMany($values);
```

The issue here is that inside your loop, you are repeatedly referencing `$request->order_number`, `$request->client`, and `$request->description`. This means every record in your `$values` array will share the *same* order number and client details, which is usually not what you want when creating multiple distinct orders.

### The Correct Approach: Mapping Data Directly

For `createMany()` to work correctly, the `$values` array must contain an array of attributes for *each* record you intend to create. You should map the request data directly into the structure required by your model.

Assuming you are creating multiple related records (e.g., multiple Order items), the correct way is to build an array where each element is a complete set of data for one model instance:

```php
public function store(Request $request)
{
    $request->validate([
        'order_number' => 'required',
        'client' => 'required',
        'products' => 'required,array', // Ensure products is an array
        'amount' => 'required',
        'description' => 'required',
    ]);

    $dataToCreate = [];

    // Iterate through the product data to create multiple order line items
    foreach ($request->products as $index => $productData) {
        $dataToCreate[] = [
            'order_number' => $request->order_number, // Use the specific order number for this item
            'client' => $request->client,               // Use the specific client for this item
            'product_name' => $productData['name'] ?? 'Unknown Product', // Example of mapping nested data
            'amount' => $request->amount[$index],
            'description' => $request->description,
        ];
    }

    // Execute the batch insertion
    Order::createMany($dataToCreate); 

    return redirect('/')->with('msg', 'Order Saved successfully!');
}
```

Notice how we iterate over the `$request->products` array and build a separate entry (`$dataToCreate[]`) for each product line item. This ensures that when `createMany()` runs, it receives an array where every element is ready to be inserted as a new record.

## Conclusion

`createMany()` is an essential tool for optimizing database operations in Laravel. By shifting from iterative saving to batch creation, you significantly reduce latency and improve the overall performance of your application. Remember to structure your input data carefully—ensure that the array passed to `createMany()` contains exactly the attributes needed for each new model instance. Keep focusing on efficient data handling, and you will build robust, high-performing applications, just as we strive for in modern Laravel development.
