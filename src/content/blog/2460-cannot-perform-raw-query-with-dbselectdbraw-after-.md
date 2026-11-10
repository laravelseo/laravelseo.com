---
title: "cannot perform raw query with DB::select(DB::raw()) after updating to laravel 10"
description: "Fixing the Raw Query Headache in Laravel 10: Why DB::raw() Fails Dynamically As developers, we often dive into raw SQL when dealing with complex database..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP", "Errors"]
featured: false
---

As developers, we often dive into raw SQL when dealing with complex database interactions, especially when needing dynamic queries that aren't easily handled by Eloquent or the standard Query Builder. However, migrating to newer framework versions like Laravel 10 sometimes exposes subtle incompatibilities in how the underlying PDO layer handles dynamically constructed strings passed through methods like `DB::raw()`.

If you’ve encountered the error: `PDO::prepare(): Argument #1 ($query) must be of type string, Illuminate\Database|Query\ Expression given`, you are running into a common pitfall related to mixing dynamic PHP string concatenation with Laravel's expectation for query construction.

This post will diagnose why your raw query attempt fails and provide robust, secure alternatives that align with modern Laravel best practices.

## The Root Cause: String Construction vs. Query Expectation

The error you are seeing stems from a type mismatch within the PDO layer. When you use `DB::raw($statement)`, Laravel expects `$statement` to be a pure SQL string. However, when you build your dynamic query using PHP string concatenation (`.=`) based on iterating over table names, the resulting structure—especially when mixing placeholders or expressions—can sometimes confuse the framework's internal type checking before passing it to the PDO driver for preparation.

The core issue is that dynamically building complex SQL strings via simple concatenation is inherently risky (SQL Injection vulnerability) and often brittle when dealing with how Laravel parses these strings internally, especially when structures like `SELECT COUNT(*) FROM table` are being built piece by piece.

## Why Dynamic String Building Fails in Modern Laravel

Your attempt to build a string like this:

```php
$statement = 'SELECT';
foreach ($tables = collect(availableTables()) as $name => $table_name) {
    // ... complex concatenation logic ...
}
$query  = DB::select(DB::raw($statement)); // Fails here
```

While logically sound for string building, it fails in this context because the structure you are creating is too fluid for simple `DB::raw()` ingestion when dealing with dynamic table names. The framework prefers methods that allow explicit mapping of tables rather than relying on concatenating raw strings.

Furthermore, manually constructing SQL queries by concatenating table names directly into the string opens the door to severe **SQL Injection** vulnerabilities if any part of `$table_name` were user-supplied. This is why modern frameworks strongly push for abstraction layers over direct string manipulation.

## The Solution: Using Eloquent and Query Builder for Dynamic Queries

Instead of trying to force a massive, concatenated raw statement, the preferred Laravel way to handle dynamic queries across multiple tables is to leverage the power of the Query Builder or Eloquent relationships. If you need to perform a count operation dynamically, it’s better to iterate over your table list and execute individual, safe queries.

Here is how you can safely achieve your goal using recommended Laravel patterns:

### Safe Approach: Iterating with the Query Builder

If you need counts from multiple tables, iterate through them and execute explicit `count` queries. This keeps each operation isolated, secure, and easy to debug.

```php
use Illuminate\Support\Facades\DB;

$results = [];
$tables = collect(availableTables());

foreach ($tables as $table_name) {
    // Use the Query Builder for safety and clarity
    $count = DB::table($table_name)->count();
    
    // Store the result in a structured way
    $results[$table_name] = $count;
}

// $results now contains safe, separate counts: ['users' => 100, 'posts' => 50]
dd($results);
```

### Advanced Alternative: Using `DB::raw` with Explicit
