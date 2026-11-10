---
title: "Laravel: how to \"disable\" a global scope in order to include \"inactive\" objects into query?"
description: "Laravel: How to \"Disable\" a Global Scope to Include Inactive Objects in Queries As developers working with Eloquent, global scopes offer an incredibly..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP"]
featured: false
---

As developers working with Eloquent, global scopes offer an incredibly powerful way to enforce default constraints across your entire application. They keep your models clean and ensure data integrity by automatically applying `WHERE` clauses on every query. However, this power can sometimes become restrictive when you need to perform specific administrative tasks—like retrieving "inactive" or soft-deleted records—that intentionally bypass these default rules.

This post dives into a common challenge: how to temporarily disable a global scope so you can include objects that the scope is designed to exclude. We will dissect your custom implementation and provide a robust, idiomatic solution using Laravel's Query Builder features.

## The Challenge with Global Scopes

You are encountering an issue where your `ActiveUsersScope` successfully filters out inactive users by default. When you attempt to create a method like `withInactive()` to bypass this filter (similar to how `SoftDeletingTrait::withTrashed()` works), the results are still filtered, meaning the scope is not effectively disabled for that specific query.

The core difficulty lies in correctly manipulating the underlying Eloquent Query Builder when dealing with inherited global constraints. Simply trying to remove a scope via its `remove` method often requires deep introspection of how Laravel stores the applied constraints, which can become brittle.

## Deconstructing the Trait Implementation

Let's look at the structure you provided:

```php
// Inside ActiveUsersTrait
public static function withInactive()
{
    return (new static)->newQueryWithoutScope(new ActiveUsersScope);
}

// Inside ActiveUsersScope::remove()
public function remove(Builder $builder)
{
    // ... complex logic to iterate and unset where clauses
}
```

The attempt to modify the constraints
