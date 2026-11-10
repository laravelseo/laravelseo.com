---
title: "How can I update data with Eloquent without id in Laravel 4"
description: "How Can I Update Data with Eloquent Without an id in Laravel? A Deep Dive into Composite Keys As developers working with relational databases and..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As developers working with relational databases and Object-Relational Mappers (ORMs) like Eloquent, we often encounter scenarios where the database structure deviates from the standard conventions that ORMs are built upon. The issue you’ve encountered—trying to update a record using Eloquent when the primary key is a composite key (`faq_id` and `lang`) instead of a simple auto-incrementing `id`—is a classic hurdle.

This post will walk you through why this error occurs, explore the limitations of standard Eloquent updates in this context, and present practical, developer-focused solutions for updating data efficiently without relying on a traditional single primary key.

## Understanding the Conflict: Eloquent vs. Composite Keys

The core problem lies in how Eloquent (and underlying database drivers) are designed to perform operations. By default, when you call methods like `update()` or rely on model finders, they implicitly assume the existence of an auto-incrementing column named `id` which serves as the unique identifier for that specific row.

Your database constraint is: `primary(array('lang', 'faq_id'))`. This means the combination of `lang` and `faq_id` uniquely identifies a row, but there is no single, simple `id` column that Laravel expects to use in its standard `WHERE` clause for updates.

When you attempt:
```php
$faq_trans = FaqTrans::where('faq_id','=',$faq_id)->where('lang','=',$lang)->first();
$faq_trans->lang  = Input::get('lang');
$faq_trans->body  = Input::get('body');
$faq_trans->title = Input::get('title');
$faq_trans->save(); // This triggers the update query
```
Eloquent attempts to generate an `UPDATE` statement that looks something like: `UPDATE FAQtrans SET body = ?, updated_at = ? WHERE id IS NULL`. The database immediately throws an error because it cannot find a column named `id` in the `WHERE` clause, leading to the `SQLSTATE[42S22]: Column not found: 1054 Unknown column 'id'`.

## Solution 1: The Recommended Path – Adhering to Laravel Best Practices

Before diving into workarounds, it is crucial to address the structural issue. In modern application development, especially when using frameworks like Laravel, adhering to standard conventions simplifies development immensely and improves performance.

The best practice solution is always to modify your database schema to include a standard auto-incrementing primary key (`id`) for every table. This change allows Eloquent to function exactly as intended, making all future data manipulation—including complex relationships and mass updates—straightforward and robust. If you are setting up new projects or refactoring legacy code, this is the recommended path, aligning perfectly with the principles promoted by organizations like [Laravel](https://laravelcompany.com).

## Solution 2: The Workaround – Updating via Raw SQL Queries

If, due to severe legacy constraints or external system requirements, you absolutely cannot modify the table structure to add an `id` column, you must bypass Eloquent's standard update methods and resort to direct interaction with the database using raw SQL queries. This gives you full control over the `WHERE` clause, allowing you to use your existing composite keys.

For updating data based on a composite key, you will construct the `UPDATE` statement explicitly:

```php
// Assuming $faq_id and $lang are available from your input
$new_body = Input::get('body');
$new_title = Input::get('title');
$new_lang = Input::get('lang');
$faq_id = $faq_id; // The specific faq ID
$lang = $lang;     // The specific language

$sql = "UPDATE FAQtrans SET body = ?, title = ?, lang = ? WHERE faq_id = ? AND lang = ?";

// Execute the raw query using the DB facade
DB::update($sql, [$new_body, $new_title, $new_lang, $faq_id, $lang]);
```

**Why this works:**
This approach directly targets the database. By explicitly defining `WHERE faq_id = ? AND lang = ?`, you tell the database exactly which composite record to modify, completely bypassing Eloquent's reliance on a non-existent `id` column for the update condition. This is powerful, but it moves the responsibility of data integrity and query construction from the ORM layer to your application logic.

## Conclusion

While there are workarounds like using raw SQL updates, they should be treated as a last resort. They introduce complexity and reduce the maintainability that an ORM is designed to provide. For long-term stability and adherence to modern development standards—especially when working within the Laravel ecosystem—the definitive solution remains modifying your database schema to include a standard auto-incrementing `id`. This single change unlocks the full power and simplicity of Eloquent for all your data operations, as demonstrated by how robust solutions are built on solid foundational design principles.
