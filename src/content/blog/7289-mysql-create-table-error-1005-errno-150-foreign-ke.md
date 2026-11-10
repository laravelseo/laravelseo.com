---
title: "MySQL create table: error 1005 errno: 150 “Foreign key constraint is incorrectly formed”"
description: "Decoding MySQL Error 1005: Why Your Foreign Key Constraint Fails in Laravel Migrations As developers building robust applications with Laravel, we spend a..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "HTML", "Errors"]
featured: false
---

As developers building robust applications with Laravel, we spend a significant amount of time wrestling with database schema migrations. While Eloquent makes interacting with data feel intuitive, the underlying relational integrity enforced by the database—specifically foreign key constraints—is where many projects hit unexpected walls. One of the most frustrating errors you can encounter is: `SQLSTATE[HY000]: General error: 1005 Can't create table ... (errno: 150 "Foreign key constraint is incorrectly formed")`.

This post will dive deep into what this cryptic MySQL error means, why it happens specifically during Laravel schema creation, and how to debug and fix these common relational database pitfalls.

---

## Understanding the Foreign Key Error (Error 150)

The error code `errno: 150` in MySQL signals that the foreign key constraint you are attempting to create is invalid. This does not mean the syntax of your SQL command was wrong; rather, it means the *relationship* you defined between two tables cannot be established according to MySQL's strict rules at the moment of creation.

In essence, a foreign key relationship requires absolute consistency. For a foreign key on Table A to successfully reference Table B, several conditions must be met perfectly:

1.  **Data Type Match:** The data type of the referencing column (the foreign key) *must* exactly match the data type of the referenced column (the primary key).
2.  **Referential Integrity:** All values currently present in the referencing column must already exist in the referenced table's primary key column.
3.  **Indexing:** The referenced column in the parent table *must* be indexed (usually as a Primary Key).

When you see error 150, it almost always points to a failure in conditions 1 or 3.

## Common Causes for 'Foreign Key Constraint is Incorrectly Formed'

When working with Laravel migrations to define relationships between tables—like linking `employees` to `city`—the issue usually stems from one of these specific problems:

### 1. Data Type Mismatch (The Prime Suspect)

This is the most frequent cause. If you try to link an `integer` column in one table to a `string` column in another, MySQL will reject the constraint immediately.

**Example Scenario:** Attempting to link an `unsigned integer` foreign key to a non-integer type.

### 2. Missing or Incorrect Indexing

For a relationship to be efficient and valid, the column you are referencing (the primary key in the parent table) must be properly indexed. If the referenced column does not have an index, MySQL cannot guarantee quick lookups, leading it to reject the constraint creation. In Laravel migrations, this often means forgetting to define the `id()` as an auto-incrementing primary key correctly.

### 3. Mismatched Constraints (Especially Auto-Increment)

When defining foreign keys in a migration, ensure that the referencing column's data type and size perfectly align with the referenced table's primary key definition. For instance, if you define `city_id` as an `integer`, the referenced `id` column *must* also be an `integer`.

## Debugging Your Laravel Schema Example

Let’s look at the schema you provided for context:

```php
// Employee Table Snippet
$table->integer('city_id')->unsigned();
$table->foreign('city_id')->references('id')->on('city');
```

Based on this structure, if you are receiving error 150, here is the critical checklist to review:

1.  **Check Parent Table:** Verify that the `city` table has an `id` column defined as a primary key and that it is an integer type (e.g., `$table->increments('id');`).
2.  **Check Child Table Type:** Ensure that `employees.city_id` is also an `integer` or `bigint` and that you correctly applied the `unsigned()` modifier if necessary to match the parent.
3.  **Check Indexing:** Confirm that the referenced column (`city.id`) is indeed indexed (which it will be if you use `$table->increments('id')`).

In Laravel, defining these relationships explicitly in migrations ensures that when your application tries to build models and Eloquent relationships, the database structure perfectly supports those connections. As a reminder on effective schema design for complex applications, understanding these fundamentals is crucial, aligning with best practices promoted by resources like [laravelcompany.com](https://laravelcompany.com).

## Best Practices for Robust Schema Migration

To prevent error 150 from ever appearing in your workflow, adopt these practices:

*   **Use Auto-Incrementing Primary Keys:** Always use `$table->id()` or `$table->increments('id')` as the primary key for every table you intend to reference. This ensures MySQL handles the indexing correctly by default.
*   **Explicit Data Types:** Be meticulous about declaring `integer`, `bigInteger`, `unsigned()`, and `unsignedBigInteger`. Consistency is paramount when defining foreign keys.
*   **Test in Isolation:** If a complex migration fails, try creating the tables *without* the foreign key constraints first. Verify that the basic table structures are sound before introducing relational integrity rules.

By following these steps, you move beyond simply throwing an error and start architecting database schemas that are both fast and perfectly consistent, setting a solid foundation for any application built on Laravel.
