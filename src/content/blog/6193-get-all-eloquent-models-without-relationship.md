---
title: "Get all eloquent models without relationship"
description: "Getting All Eloquent Models Without Relationships: Mastering Relational Queries As a senior developer working with Laravel and Eloquent, we often grapple..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "HTML"]
featured: false
---

As a senior developer working with Laravel and Eloquent, we often grapple with the limits of Object-Relational Mapping (ORM). While Eloquent excels at defining *one-to-many* or *many-to-many* relationships, querying for the inverse—finding models that have *no* defined relationships—often requires stepping outside the standard convenience methods.

You've hit upon a common challenge: wanting to perform set operations (like finding unmatched records) without resorting to raw SQL query builder calls, which defeats the purpose of using Eloquent. The core issue is that Eloquent focuses on traversing defined relationships, not analyzing the schema for orphaned records directly.

This post will explore why this operation is tricky in an ORM context and provide a robust, efficient method to fetch all models that do not participate in any defined relationship, leveraging powerful database features while keeping the result clean within your Laravel application.

---

## The Eloquent Limitation: Why `has()` Doesn't Offer an Inverse

When you use methods like `$model->has('relationship')`, Eloquent is performing a check based on the existence of pivot tables or foreign key constraints defined in your models. It’s designed to answer, "Does this specific object connect to *this* other object?"

The inverse operation—"Find all objects that connect to *nothing*"—is a set-based query problem rather than a simple relationship traversal problem. There is no built-in Eloquent method like `doesNotHaveRelationship()`. Trying to force this through nested `where` clauses across potentially dozens of relationships quickly becomes unmanageable and extremely inefficient, especially for large datasets.

## The Solution: Leveraging SQL Set Operations for Orphan Records

The most efficient way to solve this is to shift the focus from checking Eloquent relationships to analyzing the underlying database structure. As you correctly identified with your `RIGHT JOIN` example, this is fundamentally a relational integrity problem that SQL handles natively and extremely fast.

To find models without any active relationships, we need to identify the set of all models and subtract the set of models that *do* have at least one relationship defined in the pivot tables or foreign keys.

### Step-by-Step Implementation using Query Builder

Instead of relying on complex Eloquent traversal, we can use a combination of database joins and subqueries to isolate these "orphan" records directly. For this example, let's assume we are working with a `custom_design_requests` table that might be related to `quotes`.

We want all `custom_design_requests` that have no matching entry in the `quotes` table (or vice versa).

```php
use Illuminate\Support\Facades\DB;
use App\Models\CustomDesignRequest; // Assume this is your base model

$orphans = CustomDesignRequest::whereNotIn('id', function ($query) {
    // Subquery finds all IDs that *do* have a relationship (i.e., exist in the pivot table)
    $query->select('custom_design_request_id')
          ->from('quotes'); // Join against the related table
})->get();

// $orphans now contains only the CustomDesignRequest models that are not linked to any quote.
```

### Explanation and Best Practices

1.  **The Outer Query:** We start with the primary model (`CustomDesignRequest::`).
2.  **The `whereNotIn` Clause:** This is the key. We use `whereNotIn` to filter the main set of records.
3.  **The Subquery (The Exclusion Set):** Inside the closure, we execute a subquery that selects all IDs from the related table (`quotes`). By using this subquery inside `whereNotIn`, we effectively tell the database: "Give me all records from `custom_design_requests` whose ID is *not* present in the list of IDs found in the `quotes` table."

This approach leverages the database engine's optimization capabilities. It avoids loading potentially massive sets into PHP memory just to check relationship status, making it significantly faster and more scalable than iterating through Eloquent relationships in application code. This principle of efficient relational querying is central to high-performance Laravel applications, much like understanding how data integrity works within systems like [Laravel](https://laravelcompany.com).

## Conclusion

While Eloquent provides a beautiful abstraction for defining relationships, complex set operations—like finding orphaned records—are best handled by leaning into the power of the underlying database. By mastering techniques like `whereNotIn` combined with subqueries, you can achieve highly optimized results without sacrificing the elegant structure of your application code. This approach ensures that whether you are fetching related data or identifying missing links, your queries remain fast, clean, and scalable.
