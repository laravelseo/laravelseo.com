---
title: "Laravel Eloquent how to get all products according to category id"
description: "Laravel Eloquent: How to Get All Products According to Category ID Welcome to the world of database relationships! It is extremely common, especially when..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP"]
featured: false
---

Welcome to the world of database relationships! It is extremely common, especially when starting out with Laravel and Eloquent, to grapple with how to seamlessly connect related data. The problem you are facing—retrieving all products belonging to a specific category—is one of the most fundamental operations in any application. Don't worry; this is a classic scenario, and once you understand the power of Eloquent relationships, it becomes trivial.

As senior developers, we rely on Eloquent to abstract away complex SQL queries into elegant PHP methods. Let's break down exactly how you can achieve this efficiently using your existing model structure.

## Understanding Your Setup

Before diving into the solution, let’s quickly review the foundation you have established:

1.  **`products` Table:** Contains `cat_id`, which is a foreign key linking to the `categories` table.
2.  **`categories` Table:** Stores category details (`id`, `cat_name`, etc.).
3.  **Eloquent Relationships:** You have correctly defined the relationship:
    *   In the `Product` model: `public function category() { return $this->belongsTo('App\Category','category_id'); }`
    *   In the `Category` model: `public function products() { return $this->hasMany('App\Product'); }`

These relationships are the key to unlocking relational data querying.

## Method 1: Querying Directly via Foreign Key (The Straightforward Approach)

If you only need a simple list of products based on a known ID, you can use the standard Eloquent `where()` clause directly on the `Product` model. This method is highly efficient when dealing with direct foreign key lookups.

Suppose you know the ID of the category you are interested in (let's say `category_id = 5`).

```php
use App\Models\Product;

class UserProductsController extends Controller
{
    public function getProductsByCategory(int $categoryId)
    {
        // Find all products where the category_id matches the provided ID
        $products = Product::where('cat_id', $categoryId)->get();

        if ($products->isEmpty()) {
            return response()->json(['message' => 'No products found for this category.'], 404);
        }

        return response()->json($products);
    }
}
```

This approach is fast and perfectly valid. It directly translates to an SQL query like `SELECT * FROM products WHERE cat_id = 5;`. This is great when you are querying based on a known primary key relationship.

## Method 2: Leveraging Eloquent Relationships (The Relational Approach)

While Method 1 works, the true power of Eloquent lies in using the defined relationships to fetch data in a more object-oriented and flexible manner. If you start from a `Category` model, you can easily pull all its related products through the defined `hasMany` relationship.

To achieve this, you would first find the category, and then access its related products:

```php
use App\Models\Category;

class UserProductsController extends Controller
{
    public function getProductsByCategoryId(int $categoryId)
    {
        // 1. Find the specific category
        $category = Category::findOrFail($categoryId);

        // 2. Use the 'products' relationship to fetch all related products
        $products = $category->products;

        return response()->json($products);
    }
}
```

This second method is often preferred because it keeps your query logic tightly coupled with your data structure. It makes your code more readable and maintainable, which is a core principle in building robust applications on Laravel. For more advanced relationship management and database interactions, exploring the comprehensive documentation available at [laravelcompany.com](https://laravelcompany.com) will provide you with extensive knowledge.

## Conclusion: Choosing the Right Tool

Both methods successfully solve your problem, but they serve slightly different contexts. Use **Method 1** when you are querying directly via a foreign key in a high-performance scenario or when you need to query across multiple tables without loading the parent object first. Use **Method 2** when you are already operating within the context of an Eloquent model and want to leverage the defined relationships for cleaner, more object-oriented data retrieval.

For your initial project, understanding the concept of `belongsTo` and `hasMany` is crucial. Master these relationships, and you will find that building complex features in Laravel becomes remarkably intuitive. Keep up the great work!
