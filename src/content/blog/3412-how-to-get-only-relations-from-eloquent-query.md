---
title: "How to get only relations from eloquent query"
description: "How to Get Only Relations from Eloquent Queries: Mastering Selective Data Retrieval As senior developers working with Laravel and Eloquent, optimizing data..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "Performance", "PHP"]
featured: false
---

As senior developers working with Laravel and Eloquent, optimizing data retrieval is just as important as writing functional code. When you eager load relationships using `with()`, you get a rich set of related models. However, sometimes, you only need a specific piece of data from that relationship, and loading the entire parent model structure can be inefficient or overly complex.

The scenario you presented—where you have loaded a collection of `PopularProduct` models, each containing a nested `product` relation—is very common. The key is learning how to navigate this nested structure efficiently without fetching unnecessary data.

This post will dive into the best practices for selectively retrieving only the relationships you need from your Eloquent queries, ensuring both correctness and performance.

## Understanding Eager Loading and Relations

When you execute `$popularProducts = PopularProduct::with('product')->get();`, Eloquent performs two main operations:
1. It fetches all `PopularProduct` records.
2. It executes a separate query (or queries) to fetch the related `Product` models and associates them with their respective parents.

The resulting collection contains fully hydrated parent models, including an array of relations (e.g., `relations: ["product" => Product Model]`). If your goal is *only* the data from the related table, you need methods that bypass loading the full parent model structure or restrict the columns retrieved.

## Method 1: Direct Access to Nested Relations (The Simple Approach)

The most straightforward way to access the relation you've loaded is by accessing the relationship property directly on the model instance. This is essential if you have already eager-loaded the data correctly.

In your case, since you want only the `product` data, you iterate through the collection and access that specific attribute:

```php
$popularProducts = PopularProduct::with('product')->get();

foreach ($popularProducts as $popularProduct) {
    // Accessing the related Product model directly
    $productDetails = $popularProduct->product; 
    
    if ($productDetails) {
        echo "Popular Product ID: " . $popularProduct->id . "\n";
        echo "Related Product Name: " . $productDetails->name . "\n";
    }
}
```

While this doesn't *reduce* the initial query load, it is the correct way to extract the specific relation data once it has been loaded by Eloquent. For more complex scenarios where you need to build a flattened result set, we must look at optimization techniques.

## Method 2: Selecting Specific Columns for Optimization (The Performance Approach)

If your primary goal is performance—avoiding loading unnecessary columns from the parent tables or related tables—you should leverage Eloquent's `select()` method combined with nested relations. This technique allows you to specify exactly which columns you want to retrieve from both the main model and its relationships. This aligns perfectly with best practices advocated by the Laravel team, ensuring your database queries are lean and fast, as demonstrated by the principles outlined on [laravelcompany.com](https://laravelcompany.com).

To achieve this, we use nested selection syntax:

```php
$popularProducts = PopularProduct::with('product')
    ->select([
        'id', 
        'name', // Select columns from the parent table
        'product_id' // Ensure we select the foreign key if needed for joining
    ])
    ->with(['product' => function ($query) {
        // Only select the necessary fields from the related 'products' table
        $query->select('id', 'name', 'sku'); 
    }])
    ->get();

// Now, when iterating, you only pull the data explicitly selected above.
foreach ($popularProducts as $popularProduct) {
    echo "ID: " . $popularProduct->id . ", Name: " . $popularProduct->name . "\n";
    
    // Accessing the relation still works perfectly
    if ($popularProduct->product) {
        echo "Related Product SKU: " . $popularProduct->product->sku . "\n";
    }
}
```

### Why This Approach is Superior

By using nested closures within `with()`, you instruct Eloquent to modify the underlying SQL query. Instead of loading all columns from `PopularProduct` and then subsequently loading all columns from `Product`, we are telling the database: "For every `PopularProduct`, only retrieve these specific fields from the related `Product` table." This drastically reduces memory usage, network traffic, and improves overall query performance, especially when dealing with large datasets.

## Conclusion

To get only relations from an Eloquent query efficiently, understand that there are two main approaches: direct property access for simple retrieval, and advanced nested selection for performance optimization. For senior development, always favor the latter when dealing with large-scale applications. By mastering these techniques, you ensure your Laravel applications are not only functional but also highly performant and scalable.
