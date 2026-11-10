---
title: "Why soft deleted entities appear in query results?"
description: "Title: Understanding Soft Deleted Entities and Their Appearance in Query Results The \"soft delete\" concept is an important feature in modern software..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Understanding Soft Deleted Entities and Their Appearance in Query Results

The "soft delete" concept is an important feature in modern software development, especially for web applications that require data management. It allows developers to temporarily remove records from their database without physically deleting them. Rather, it marks the record as deleted by adding a 'deleted_at' timestamp. When needed again, you can restore or permanently delete the records.

However, there is a common issue whereby soft-deleted entities still show up in query results even after being marked as deleted. In this blog post, we will explain why this occurs and provide practical solutions to avoid it.

Why Soft Deleted Entities Appear in Query Results?
The reason for this behavior lies in the way Laravel's Eloquent ORM handles soft-deleted records by default. When executing a query without explicitly adding constraints, all records are considered eligible to be returned. This includes both active and soft-deleted entities. For many use cases, this is helpful since it allows you to see the entire history of your data, including what has been deleted or archived in the past.

Practical Solutions for Preventing Soft Deleted Entities from Appearing
To prevent soft-deleted records from appearing in query results, follow these steps:
1. Add constraints to your Eloquent model to only return specific conditions. This can be achieved by using the 'where' method or the 'scope' function. Here is a simple example of using 'where':
   ```php
   // Get all active posts
   Post::all()->where('deleted_at', null);
   // Get all posts marked as deleted within the last week
   Post::all()->whereBetween('deleted_at', [now()->subWeek(), now()]);
   ```
2. Use Eloquent's 'withTrashed()' and 'withoutTrashed()' methods to explicitly control whether or not soft-deleted records should be included in the results. Here is an example of using these functions:
   ```php
   // Get all posts, including soft-deleted ones
   Post::all()->withTrashed();
   // Get only active (non-soft-deleted) posts
   Post::all()->withoutTrashed();
   ```
3. Use query scopes to define the desired behavior of your Eloquent model. This is a more advanced method but provides greater flexibility and code reusability. Here's an example of defining a scope:
   ```php
   // Defining a 'showActivePosts' scope
   class Post extends Model {
       ...

       public function scopeShowActivePosts($query) {
           $query->withoutGlobalScopes()->where('deleted_at', null);
       }

       // Call the new scope to get all active posts
       Post::showActivePosts()->get();
   ```
4. Customize your Eloquent query builder to filter soft-deleted entities. Although this requires an in-depth understanding of Laravel's query builder, it allows you to create a customized query by applying filters and constraints:
   ```php
   Post::query()->get(function($builder) {
       $builder->withoutGlobalScopes();
       if (request('active')) {
           $builder->whereNull('deleted_at');
       }
   });
   ```

Conclusion
In conclusion, soft-deleted entities appearing in query results is a common issue that can be addressed through several methods. The best practice depends on your specific use case and the requirements of your application. By understanding Laravel's Eloquent ORM and using appropriate constraints or scopes, you can effectively manage soft-deleted records and ensure only desired entities are returned in queries.
