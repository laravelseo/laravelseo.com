---
title: "Laravel still expects to find deleted_at column after I remove softDelete"
description: "Laravel Still Expects to Find deleted at After Removing SoftDeletes: A Deep Dive into Schema Refactoring As senior developers working with Laravel, we..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "Performance", "HTML"]
featured: false
---

As senior developers working with Laravel, we frequently engage in database schema refactoring. One of the most common patterns is implementing soft deletes using the `SoftDeletes` trait. However, when you decide to remove that column entirely—perhaps for performance reasons or a complete architectural shift—you often run into unexpected runtime errors.

This post addresses a specific and frustrating scenario: removing the `deleted_at` column via a migration still causes queries to throw an error like `Column not found: 1054 Unknown column 'items.deleted_at' in 'where clause'`, even when the application code doesn't explicitly reference that column. Where does this phantom dependency come from, and how do we resolve it?

---

## The Anatomy of the Problem: Schema vs. Application State

The core issue here lies in the disconnect between the physical state of your database (the schema) and the cached expectations held by the application layer (Eloquent).

When you use Laravel’s `SoftDeletes` trait, Eloquent hooks into the model to automatically apply global scopes. These scopes implicitly rely on the existence of the `deleted_at` column for filtering records. When you execute a migration to drop this column, you successfully modify the database structure. However, if other parts of your application—or internal Laravel mechanisms—still hold references or cached expectations based on the *previous* schema state, they fail when interacting with the new reality.

The error message you are seeing indicates that some mechanism is attempting to construct a `WHERE` clause involving `deleted_at`, but the column simply does not exist in the underlying table structure anymore. This suggests the issue isn't just a simple missing reference, but potentially an internal state or cache within the ORM layer that hasn't been properly synchronized with the migration.

## Investigating Caching and Internal References

Since you assert that your application code doesn't explicitly use `deleted_at`, we must look toward where this expectation might be stored:

### 1. Eloquent’s Internal Cache
Eloquent heavily caches model relationships, scopes, and query builders. When a SoftDeletes-enabled model is deleted, the framework sets up internal logic that relies on that column. If you remove the column without fully flushing these internal references, subsequent queries will fail.

### 2. Query Builder Artifacts
If you are using raw query builder methods or complex scopes defined outside of standard Eloquent relations, those artifacts might be referencing the old structure if they were generated before the schema change was finalized.

### How to Clear Stale State

The most practical solution is often forcing Laravel and Eloquent to re-evaluate the model’s state against the current database schema. While there isn't a single "clear cache" function for this specific issue, ensuring that all related models are refreshed and that you are using the latest schema definition is crucial.

A simple step is to ensure you have run all necessary migrations (`php artisan migrate`) and then consider clearing any relevant application caches if you suspect framework-level caching:

```bash
php artisan cache:clear
php artisan config:clear
```

If the issue persists, it strongly suggests that the code path causing the error exists within a custom scope or an older version of the model definition that hasn't been fully updated to reflect the schema change. Always ensure your models are properly synchronized with the latest structure defined in the migrations, as demonstrated by best practices outlined on platforms like [laravelcompany.com](https://laravelcompany.com).

## Best Practices for Schema Refactoring

When refactoring database structures, especially removing features like soft deletes, adopt these safety measures:

1.  **Test Thoroughly:** Before deploying any destructive migration, test all existing application functionality against a local staging environment.
2.  **Phased Migration:** If possible, consider a phased approach rather than an immediate drop. For example, first archive the data (if needed) or use a temporary column to manage the transition.
3.  **Review All Code Paths:** Use static analysis tools or thorough code review to ensure no obscure service, job, or custom query is relying on deprecated columns.

In conclusion, while Laravel provides robust tools for database interaction, schema changes require careful attention to the application layer integration. The "Column not found" error after removing `softDelete` points to a synchronization failure between the physical database and the framework's internal state. By understanding this separation—schema vs. application cache—and applying rigorous testing, you can navigate complex refactoring tasks successfully.
