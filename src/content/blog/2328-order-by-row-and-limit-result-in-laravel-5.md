---
title: "Order by row and limit result in Laravel 5"
description: "Order by Row and Limit Result in Laravel 5: Fixing the Eloquent Confusion I'm trying to get a result from the database in a Laravel 5 based application and..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP", "Errors"]
featured: false
---

I'm trying to get a result from the database in a Laravel 5 based application and for the life of me can't figure it out. I want to choose the top 5 results ordered by a specific column, and the process seems deceptively simple until you run into method chaining errors. This is what I have:

```php
$full = Fulls::all()->orderBy('count', 'desc')->take(5)->get();
```

I tried plenty of other ways too but nothing seems to work. Now I'm getting an error:

> FatalErrorException in IndexController.php line 19: Call to undefined method Illuminate\Database\Eloquent\Collection::orderBy()

However, anywhere I look I see people working with `orderBy()`, so what am I doing wrong?

---

This is one of the most common stumbling blocks when moving between raw SQL concepts and the elegant structure of the Laravel Query Builder. Don't worry; this error doesn't mean you are doing something fundamentally wrong about ordering data, but rather that you are calling the method on the wrong object at the wrong time. As a senior developer, I can tell you exactly where the confusion lies and how to fix it by understanding the concept of **method chaining** in Laravel Eloquent.

### The Root Cause: Query Builder vs. Collection

The fatal error, `Call to undefined method Illuminate\Database\Eloquent\Collection::orderBy()`, tells us everything we need to know. When you execute a query like `Fulls::all()`, Laravel executes the SQL and returns an **Eloquent Collection**. Collections are objects that hold data (like an array or list), and while they have methods for manipulation, they do not possess the database querying methods like `orderBy()` or `take()`.

The methods used to construct queries—such as `where()`, `orderBy()`, `limit()`, and `get()`—must be called on the **Query Builder instance** (the Eloquent model itself) *before* you execute the query. This process is called method chaining, which allows you to build complex SQL statements step-by-step in a highly readable manner.

### The Correct Solution: Chaining the Query

To fix your issue and successfully retrieve the top 5 results ordered by the `count` column in descending order, you must chain all your query modifications onto the initial Eloquent call:

```php
$full = Fulls::orderBy('count', 'desc')->take(5)->get();
```

Notice how we removed `->all()` and instead used the more direct method, `Fulls::orderBy(...)`. The `orderBy` method is a method provided by the underlying Query Builder that modifies the structure of the SQL query before it is executed. Once all these methods have been chained, finally calling `get()` executes the complete command against the database.

### Best Practices for Querying in Laravel

Understanding this distinction—the difference between a Query Builder and a Collection—is crucial for writing efficient and maintainable code. When you are building complex queries, like those involving filtering, sorting, and limiting results, always ensure your methods are chained correctly on the initial model object. This principle applies across the entire framework; knowing how Eloquent works is key to mastering Laravel.

For more advanced ways to handle counting and ordering relationships in Laravel, exploring features like Eloquent relations and scoping can significantly simplify your data retrieval logic. For deeper insights into structuring efficient database interactions within the Laravel ecosystem, I highly recommend diving into the official documentation provided by [laravelcompany.com](https://laravelcompany.com). Mastering these fundamentals will save you countless hours debugging query issues down the line!
