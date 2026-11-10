---
title: "Laravel php tinker command to show tables and structures?"
description: "Laravel PHP Tinker: How to Show Tables and Structures? A Developer's Guide When working with Laravel, PHP Tinker becomes an indispensable tool. It allows..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "PHP"]
featured: false
---

When working with Laravel, **PHP Tinker** becomes an indispensable tool. It allows developers to interact directly with the application logic, Eloquent models, and—crucially—the underlying database in a highly interactive manner without needing to write full controller or model code. However, the question often arises: what specific command within Tinker reveals the tables, columns, and overall structure of our database?

The short answer is that there isn't one single, universal `show_tables` command in Artisan Tinker. Instead, you leverage Tinker’s ability to execute raw PHP and Laravel's powerful Eloquent and Query Builder capabilities to achieve this goal. Understanding how to bridge the gap between application code (PHP) and database structure (SQL) is key to mastering Laravel development.

This guide will walk you through the best developer-focused methods for inspecting your database schema directly within the Tinker environment.

## Understanding the Approach: Models vs. Schema

Before diving into the commands, it's important to understand the two primary ways you can inspect a table structure in Laravel:

1.  **Schema Inspection (The Blueprint):** This involves looking at the database migrations. Migrations define *how* the tables were created, which is the formal blueprint of your application’s data structure.
2.  **Runtime Inspection (The Reality):** This involves querying the actual database tables to see the current state, column types, and contents.

## Method 1: Inspecting Table Definitions via Eloquent Models

Since Laravel heavily relies on Eloquent ORM, the easiest way to understand a table's structure is by examining the model it relates to. If you have an Eloquent model representing a database table, Tinker can help you inspect its properties.

Let’s assume we have a `Post` model defined by a migration. We can use Tinker to access that model:

```php
// In your terminal: php artisan tinker

// 1. Access the Model
use App\Models\Post;

$postModel = new Post();

// 2. Inspect Attributes (Properties)
$postModel->getAttributes();
```

While this doesn't show the raw SQL schema, it confirms the structure as defined by your application code. This approach is excellent for verifying that your model correctly maps to the database columns. For deeper structural details, understanding Laravel’s architecture, as detailed on platforms like [laravelcompany.com](https://laravelcompany.com), is essential for robust development practices.

## Method 2: Direct Database Inspection using the Query Builder

For a true view of the physical tables and their columns—the runtime structure—you must interact directly with the database connection within Tinker. This is where the raw power of the Laravel Query Builder shines.

To list all tables in the current database, you can use the `Schema` facade, which is available within Tinker:

```php
// In your terminal: php artisan tinker

use Illuminate\Support\Facades\Schema;

// List all tables in the currently connected database
$tables = Schema::connection('mysql')->listTables();

print_r($tables);
```

This command executes a direct SQL query against the database schema, returning an array of table names. This immediately tells you what tables exist and are accessible to your Laravel application.

To inspect the structure of a *specific* table (e.g., `users`), you can use the `Schema::getColumnListing()` method:

```php
// List all columns for the 'users' table
$columns = Schema::getColumnListing('users');

print_r($columns);
```

This output will give you an array listing every column name present in the `users` table, which is invaluable for debugging data types or verifying migration changes. By mastering these facade calls within Tinker, you gain immediate, on-the-fly access to your database structure without leaving the command line.

## Conclusion

In summary, there is no single "magic" command for showing tables in Laravel Tinker. Instead, effective database inspection involves a layered approach: using Eloquent models for application context and utilizing Laravel's `Schema` facade within Tinker for direct database structure viewing. By combining these methods, you empower yourself to rapidly understand, validate, and interact with your data layer, significantly boosting your development efficiency.
