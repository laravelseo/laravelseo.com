---
title: "How to get unique slug to same post-title for other time too?"
description: "How to Get a Unique Slug for Duplicate Post Titles: A Developer's Guide As developers working with content management systems or blogging platforms, ensuring..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Technical SEO", "Content", "PHP", "Errors"]
featured: false
---

As developers working with content management systems or blogging platforms, ensuring data integrity is paramount. One of the most common stumbling blocks is generating unique identifiers, such as URL slugs, especially when dealing with duplicate titles. You’ve rightly encountered a situation where your original method works perfectly for new posts but fails when you try to create a post with an already existing title, because your database enforces uniqueness on the `slug` column.

This post will walk you through why this happens and provide robust, practical solutions to guarantee that every piece of content has a truly unique URL slug.

## The Problem: Database Constraints vs. Title Duplication

The code snippet you provided demonstrates a standard way to generate a slug:

```php
$post->title = $request->title;
$post->body = $request->body;
$post->slug  = str_slug($post->title,'%'); // Generates the slug based on the title
```

This method works flawlessly when generating a *new* entry. However, if you attempt to save this record to a database where the `slug` column has a unique index (a constraint), the operation fails when the generated slug already exists. The system correctly throws an error because it cannot violate the established data integrity rules.

The core issue is that relying solely on the title for slug generation is insufficient when titles are not guaranteed to be unique, which is common in dynamic content creation flows.

## Solution 1: Iterative Slug Generation (The Practical Fix)

The most straightforward developer-friendly approach is to implement a loop that checks for existing slugs and appends a differentiator if a collision is detected. This ensures that the new slug is guaranteed to be unique while still reflecting the original title.

Here is how you can modify your logic in a controller or service layer:

```php
function generateUniqueSlug(string $title, array $existingSlugs): string
{
    $baseSlug = str_slug($title, '-'); // Use a more standard slug function if available
    $counter = 1;
    $newSlug = $baseSlug;

    // Check against existing slugs in the database or cache
    while (in_array($newSlug, $existingSlugs)) {
        $newSlug = $baseSlug . '-' . $counter;
        $counter++;
    }

    return $newSlug;
}

// Example Usage:
$existingSlugs = ['my-first-post', 'another-article'];
$title = 'My First Post';

$uniqueSlug = generateUniqueSlug($title, $existingSlugs); // Result might be 'my-first-post-2'
```

### Explanation of the Approach

This method works by iteratively testing potential slugs. If `$baseSlug` is taken, we append a counter (`-2`, `-3`, etc.). This approach guarantees uniqueness without requiring complex database locking for every single operation, making it highly practical when dealing with content creation workflows. This kind of careful data handling is critical in modern frameworks like **Laravel**, where Eloquent models rely heavily on maintaining transactional integrity and adhering to defined constraints.

## Solution 2: Database-Driven Slug Generation (The Robust Approach)

A more robust solution involves delegating the uniqueness check entirely to the database, which is often cleaner and faster, especially for large datasets. Instead of generating the slug in application code first, you can let the database handle the constraint violation and catch the error gracefully.

In a Laravel context, when using Eloquent, you would typically rely on model events or custom mutators to manage this logic. You can implement a custom accessor or a `beforeCreate` hook on your model to automatically attempt slug generation and resolve conflicts before saving. This ensures that the application layer trusts the database constraint as the ultimate source of truth regarding uniqueness.

For instance, when dealing with complex relationships and ensuring data consistency across multiple tables, understanding how frameworks manage these constraints is key. As we see in robust architecture discussions on **Laravel**, setting up proper Eloquent relationships and utilizing migration constraints effectively saves significant development time down the line.

## Conclusion

Don't let duplicate titles derail your content pipeline. While simple string manipulation is a good starting point, true data integrity requires a multi-layered approach. By combining iterative generation logic (Solution 1) for immediate fixes and leveraging database constraints within your framework (Solution 2), you can reliably generate unique slugs every time. Always prioritize checking existing data before committing new records to ensure your application remains scalable and error-free.
