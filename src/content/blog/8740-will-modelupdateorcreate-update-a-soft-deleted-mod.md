---
title: "Will Model::updateOrCreate() update a soft-deleted model if the criteria matches?"
description: "The Soft Delete Conundrum: Will updateOrCreate Touch Soft Deleted Models? As developers working with modern relational databases and frameworks like..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers working with modern relational databases and frameworks like Laravel, understanding how Eloquent interacts with database states—especially soft deletes—is crucial. When using methods like `updateOrCreate()`, we need to know exactly what happens when the target record has been logically deleted but not physically removed.

Let’s dive into a specific scenario involving soft-deleted models and see if our standard update logic holds up.

## The Scenario Setup

Imagine we have a model, perhaps `Post`, that utilizes Laravel's built-in soft deletion feature. We are attempting to use the powerful `updateOrCreate()` method to modify a record that is currently marked as deleted.

Here is the setup:

```php
// EXISTING soft-deleted Model's properties
$model = [
    'id'         => 50,
    'app_id'     => 132435,
    'name'       => 'Joe Original',
    'deleted_at' => '2015-01-01 00:00:00' // This record is soft-deleted
];

// Some new properties we want to apply
$properties = [
    'app_id'     => 132435,
    'name'       => 'Joe Updated',
];

// Attempting the update/create operation
Model::updateOrCreate(
    ['app_id' => $properties['app_id']], // Criteria based on app_id
    $properties                               // Data to update/create
);
```

The core question is: **Is `Joe Original` now `Joe Updated`?** Or is there a separate, new record created alongside the soft-deleted one?

## The Developer's Answer: How Eloquent Handles Soft Deletes

In short, when working with standard Eloquent models configured with the `SoftDeletes` trait, **`updateOrCreate()` will generally NOT update an existing soft-deleted record if the criteria for matching that record relies on the default query behavior.**

Here is a deeper explanation of why this happens and what you need to consider.

### Understanding Soft Deletes and Query Scopes

When you use Eloquent models with `SoftDeletes`, Laravel automatically applies global scopes. By default, any query executed against the model (using `find()`, `where()`, or implicitly within methods like `updateOrCreate`) will only return records where the `deleted_at` timestamp is `NULL`. This effectively hides soft-deleted records from standard queries.

When you execute:
```php
Model::updateOrCreate(
    ['app_id' => 132435],
    ['name' => 'Joe Updated']
);
```
Eloquent attempts to find a record matching `app_id = 132435` first. Because of the global scope, if the database query implicitly excludes soft-deleted records (which is the default behavior), Eloquent will not find the record with `id=50`, and thus it will perform an **INSERT** operation instead of an **UPDATE**.

If the criteria *did* match a soft-deleted record, depending on your specific setup and database configuration, the update might still occur, but this behavior is often unreliable when dealing with records that should be considered logically absent from active operations.

### Best Practice: Explicitly Including Soft-Deleted Records

To gain explicit control over whether you interact with deleted records, you must explicitly modify your queries using the `withTrashed()` scope. This allows you to tell Eloquent to look at all records, regardless of their soft-deleted status.

If your goal is specifically to update a record that *might* be deleted, you should include `withTrashed()` in your query:

```php
// Include models that are soft-deleted when searching for the ID
Model::withTrashed()->updateOrCreate( 
    ['id' => $model['id']], // Search by the specific ID
    $properties
);
```

By using `withTrashed()`, you force Eloquent to consider records where `deleted_at` is populated. This ensures that if a soft-deleted record exists with the matching criteria, `updateOrCreate()` will successfully execute the update on that existing (though deleted) row, effectively restoring its data while keeping the soft-delete timestamp intact for auditing purposes.

## Conclusion

The behavior of `updateOrCreate()` concerning soft-deleted models is entirely dependent on how you scope your query. By default, Eloquent protects you from accidentally modifying or creating records outside the active set by enforcing the `SoftDeletes` constraint. For operations that need to interact with deleted data—such as restoring a record via an update operation—always use scopes like `withTrashed()` to explicitly manage the visibility of soft-deleted entries. This approach ensures your data integrity remains sound, which is a core principle in robust application development, mirroring the attention to detail found throughout the Laravel ecosystem, including documentation on [laravelcompany.com](https://laravelcompany.com).
