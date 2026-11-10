---
title: "How To Get Search Query From Multiple Columns in Database"
description: "Mastering Multi Column Search Queries in Laravel Eloquent As developers working with relational databases, one of the most common requirements is the ability..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Keywords", "PHP"]
featured: false
---

As developers working with relational databases, one of the most common requirements is the ability to perform flexible searches across multiple related fields simultaneously. In your scenario, you are currently limiting your search functionality to just the `judul` column, which causes issues when a user inputs a keyword that should match entries in `writters` or `publisher`. This is a classic scaling problem where simple single-condition queries fall short of complex business logic.

This post will guide you through the most effective and performant ways to retrieve data from multiple columns using Laravel Eloquent, moving beyond simple single-field searches to build truly comprehensive search functionality.

## The Limitation of Single-Column Searching

Your current approach uses a single `where` clause:

```php
$query = Book::where('judul', 'LIKE', '%' . $keyword . '%');
```

This query strictly limits the search scope to the `judul` column. To achieve your goal—searching across `judul`, `writters`, and `publisher`—you need a way to tell the database that *any* of these fields can contain the keyword.

## Solution 1: Using `where` and `orWhere` for Text Matching

The most straightforward way to implement this in Eloquent is by chaining multiple conditions using logical operators like `orWhere()`. This translates directly into an SQL query using `OR`, allowing you to search across different columns while maintaining the necessary text searching functionality (`LIKE`).

Here is how you can modify your controller method to achieve a multi-column search:

```php
public function search(Request $request)
{
    $keyword = $request->input('keyword');

    if (empty($keyword)) {
        // Handle case where no keyword is provided
        return view('dashboards.index', ['book_list' => collect(), 'keyword' => '', 'pagination' => null, 'total_book' => 0]);
    }

    $query = Book::where(function ($query) use ($keyword) {
        // Search in the title column
        $query->where('judul', 'LIKE', '%' . $keyword . '%')
              // OR search in the writers column
              ->orWhere('writters', 'LIKE', '%' . $keyword . '%')
              // OR search in the publisher column
              ->orWhere('publisher', 'LIKE', '%' . $keyword . '%');
    });

    $book_list = $query->paginate(5);
    $pagination = $book_list->appends($request->except('page'));
    $total_book = $book_list->total();

    return view('dashboards.index', compact('book_list', 'keyword', 'pagination', 'total_book'));
}
```

### Code Breakdown and Best Practices

**Why this approach works:**

1.  **Clarity:** Using a closure with `where(function ($query) { ... })` groups all your related conditions together, making the query logically structured and much easier to read than chaining multiple top-level `orWhere` calls.
2.  **Flexibility:** This structure ensures that if the user inputs "John," the database will return books where "John" appears in `judul`, *or* `writters`, *or* `publisher`.
3.  **Performance Consideration (Crucial!):** While this is functionally correct, searching across many columns using `LIKE %keyword%` can become slow on very large datasets because it often prevents the database from efficiently using standard indexes.

## Solution 2: Performance Optimization with Full-Text Search (FTS)

For applications that rely heavily on complex, multi-field text searching, a more robust and scalable solution is to leverage dedicated Full-Text Search capabilities provided by your specific database (e.g., MySQL's `MATCH AGAINST` or PostgreSQL's built-in full-text search features).

Instead of relying purely on string matching (`LIKE`), you can create a dedicated search index on relevant columns. This shifts the heavy lifting from runtime query construction to optimized indexing, which is far more efficient for large tables. If you are building complex data interactions within Laravel, understanding how Eloquent interacts with these advanced database features is key—look into the official resources provided by [laravelcompany.com](https://laravelcompany.com) for deep dives into optimizing your ORM usage.

## Conclusion

To effectively search across multiple columns in a database using Laravel, the best practice is to combine multiple `where` conditions using nested closures and logical operators like `orWhere()`. For simple applications, this method works perfectly. However, as your application grows, always plan for performance. When dealing with extensive text searching across many fields, migrating to Full-Text Search indexes will provide a significantly faster and more scalable solution, ensuring your application remains snappy even under heavy load.
