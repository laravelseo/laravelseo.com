---
title: "Laravel Query Builder, selectRaw or select and raw"
description: "Title: Understanding Laravel's Query Builder Options selectRaw vs. Select & raw Body: When working with databases in PHP applications, developers often need..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Keywords", "PHP"]
featured: false
---

Title: Understanding Laravel's Query Builder Options - selectRaw vs. Select & raw

Body:

When working with databases in PHP applications, developers often need to retrieve data from the database using SQL queries. Laravel provides several effective ways of doing this through its Query Builder. One common debate among developers is whether to use `selectRaw()` or `select()` with `DB::raw()`. This blog post will help you understand the differences between these two approaches and when to use each effectively.

Firstly, let's take a look at Laravel's Query Builder:

```php
DB::table('some_table')
->selectRaw('COUNT(*) AS result')
->get();
```

In this example, you are using the Query Builder to fetch data from the `some_table`. You use the `selectRaw()` method to define a custom SQL statement that will be executed to get your desired result. It returns an instance of Eloquent's collection object containing all the fetched rows as objects or arrays, depending on whether you have defined your model with attributes in the Eloquent way.

Now let's explore using `select()` with `DB::raw()`:

```php
DB::select(DB::raw(" 
SELECT COUNT(*) AS result
FROM some_table"));
```

This approach uses a custom SQL statement to perform the query and returns an array of all the rows fetched. The only difference is that you are using `DB::raw()` to define your SQL statement outside your Query Builder with the `select()` method. While both approaches achieve similar goals, they serve distinct purposes.

Here's when to use each approach:

1. Use `selectRaw()` in the Query Builder when you need to perform complex queries or require accessing columns from multiple tables in a single query and want to keep the code within the Query Builder. This method is particularly useful if you are familiar with SQL syntax and like working directly with SQL statements.

2. Choose `select()` with `DB::raw()` when dealing with simple queries, such as those involving only one table, where a more concise code can be achieved using Eloquent or another ORM. This method is recommended for beginners or situations where the actual query doesn't require complex syntax and can be easily defined in plain SQL.

In summary, Laravel Query Builder offers multiple ways to fetch data from the database, each with its advantages depending on your project requirements. When choosing between `selectRaw()` within the Query Builder and `select()` with `DB::raw()`, consider the complexity of your query, your familiarity with SQL syntax, and whether you prefer working directly in the Query Builder or using a more concise Eloquent approach. As always, testing and experimenting with different methods is essential to finding the best approach for your specific project needs.
