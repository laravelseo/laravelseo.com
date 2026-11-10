---
title: "Laravel fetch data from two tables without join with pagination"
description: "Laravel: Fetching Data from Disjoint Tables Without Joins and Implementing Pagination As senior developers working with relational databases, one of the most..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP", "Errors"]
featured: false
---

As senior developers working with relational databases, one of the most common challenges we face is retrieving related data when there are no explicit foreign key relationships connecting the tables. If you try to force a `JOIN` where none exists, you violate data integrity principles and often end up with incorrect or extremely complex queries.

This post addresses a specific scenario: how to fetch records from two independent tables, `properties` and `properties_x`, based on a shared string condition (`LIKE 'test'`), and apply standard Laravel pagination across the combined result set, all without establishing a formal database join.

## The Challenge Setup

We have two separate tables:

1.  **`properties`**: Contains property details (e.g., `id`, `name`, `address`).
2.  **`properties_x`**: Contains cross-reference details (e.g., `id`, `name`, `address_x`).

The goal is to retrieve rows where either the `properties.address` or `properties_x.address_x` matches a pattern like `'test'`, and present this combined list with Laravel's pagination.

| properties | id | name | address |
| :--- | :--- | :--- | :--- |
| properties\_x | id | name | address\_x |

Since there is no foreign key linking these tables, we cannot use a standard `JOIN`. We must rely on separate queries and intelligent merging.

## Solution Strategy: Combining Queries

When tables are independent, the most performant way to handle this in a modern application framework like Laravel is often to leverage the database's set operations or execute parallel queries and merge the results in PHP memory. For complex filtering across two disparate sets, using `UNION` in SQL is conceptually cleaner than trying to stitch together non-joined tables manually.

### Method 1: Using SQL `UNION` for Combined Results

The most elegant way to combine result sets from different tables based on a common structure, without relying on relational links, is by using the `UNION` operator. This allows us to stack the results of two separate `SELECT` statements into one unified result set.

This approach ensures that whatever data you select from each table conforms to the final required schema before combining them.

```sql
SELECT name, address FROM properties WHERE address LIKE '%test%'
UNION
SELECT name, address_x FROM properties_x WHERE address_x LIKE '%test%';
```

**Why this works:**
1.  The first `SELECT` fetches matching records from the `properties` table.
2.  The second `SELECT` fetches matching records from the `properties_x` table.
3.  `UNION` combines these two result sets, automatically removing duplicate rows (if needed) and presenting a single, unified list.

While this doesn't inherently offer pagination *within* the SQL query itself, we can apply Laravel's pagination logic to this combined result set by executing the query within a Laravel repository or controller method.

### Method 2: The Laravel Eloquent Approach (Filtering and Merging)

If you prefer to keep the filtering logic entirely within your application layer—perhaps for more complex conditional logic that SQL struggles with—you can execute two separate, paginated queries and merge them using Eloquent collections.

This requires careful handling of pagination numbers to ensure the final result set is correctly ordered and paginated across both sources. This is often seen when dealing with highly denormalized data structures, similar to advanced querying patterns discussed in official Laravel documentation regarding database interaction.

```php
use App\Models\Property;
use App\Models\PropertyX;

// 1. Fetch paginated results from properties
$properties = Property::where('address', 'LIKE', '%test%')
                         ->orderBy('name')
                         ->paginate(10); // Page 1 result

// 2. Fetch paginated results from properties_x
$propertiesX = PropertyX::where('address_x', 'LIKE', '%test%')
                           ->orderBy('name')
                           ->paginate(10); // Page 1 result

// 3. Merge the results in PHP
$combinedResults = $properties->items();
$propertiesXItems = $propertiesX->items();

// Combine and paginate manually (or using a custom Paginator implementation)
$finalData = array_merge($combinedResults, $propertiesXItems);

// Note: For true, seamless pagination across two independent sets, 
// you would typically calculate the total items from both sets 
// and handle the offset logic explicitly.
```

## Conclusion

For fetching data across tables that lack foreign key relationships, **Method 1 (using SQL `UNION`) is generally the most performant and database-native solution.** It offloads the heavy lifting of set combination to the database engine, resulting in a single, optimized query.

However, **Method 2 (Eloquent merging)** provides maximum flexibility if your filtering logic becomes too complex for pure SQL. When dealing with large datasets and ensuring correct pagination across disparate sources, always evaluate whether a single, well-structured SQL query (`UNION`) can achieve the goal more efficiently than multiple separate queries followed by application-side merging. Remember to leverage Laravel's powerful Eloquent tools, as demonstrated by best practices found on the official [Laravel Company website](https://laravelcompany.com) for robust database interaction.
