---
title: "How to get all rows (soft deleted too) from a table in Laravel?"
description: "Title: Retrieving All Rows (Including Soft Deleted) from Tables in Laravel A Comprehensive Guide Introduction: As a popular PHP framework, Laravel provides..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Keywords", "Performance"]
featured: false
---

Title: Retrieving All Rows (Including Soft Deleted) from Tables in Laravel - A Comprehensive Guide

Introduction: As a popular PHP framework, Laravel provides excellent tools for managing database interactions with its Eloquent ORM. However, you may sometimes need to access all records, including soft-deleted ones. This blog post aims to discuss how you can achieve this goal efficiently and effectively using Eloquent.

1. Introduction to Soft Deleting in Laravel:
Laravel ships with an elegant feature called "soft deletes" that allows you to hide records instead of completely removing them from the database. When a model is soft-deleted, it remains present in the database but has its 'deleted_at' attribute set to the current timestamp. This method facilitates recovery and auditing tasks for later use while ensuring proper data management and accessibility.

2. Getting All Rows with Eloquent:
To retrieve all rows from a table, you can call the <code>Model::all()</code> method, which returns an array of all models belonging to that table. However, this method does not include soft-deleted records by default.

3. Incorporating Soft Deleted Records:
To get all soft-deleted and active models for a particular table, you can use the <code>withTrashed()</code> method. This method will ensure that both trashed records and their non-deleted counterparts are included in the query results. Here's an example of how to perform this action:

<pre><code class="language-php">$models = App\Model::withTrashed()->get(); // Retrieve all models, including soft deleted ones
</code></pre>

4. Using Raw SQL Queries for More Control:
In some cases, you may need more control over the query or performance considerations. Laravel allows you to use raw queries directly through its QueryBuilder API. You can use <code>\Illuminate\Support\Facades\DB</code> to execute a raw query, which will retrieve all records from a table, including soft-deleted ones:

<pre><code class="language-php">$models = DB::table('models')->get(); // Retrieve all models, including soft deleted ones using a raw query
</code></pre>

5. Comparing Eloquent and Raw Query Performance:
While Eloquent offers convenience with its model classes, raw queries directly interact with the database and may provide better performance in some situations. However, this will depend on your specific project requirements and the complexity of the query you need to execute. It is advised to benchmark each approach for optimal results and choose accordingly.

Conclusion: In conclusion, retrieving all rows (including soft-deleted ones) from a table can be easily achieved using Laravel's Eloquent ORM with methods such as <code>withTrashed()</code>. Alternatively, you may opt for raw queries if performance is of primary concern. By incorporating these techniques into your project, you ensure comprehensive data access and efficient project management with Laravel.
