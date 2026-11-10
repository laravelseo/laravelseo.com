---
title: "How to dynamically set table name in Eloquent Model"
description: "How to Dynamically Set Table Names in Eloquent Models: A Deep Dive Welcome to the world of Laravel and Eloquent! It’s a fantastic framework for interacting..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Welcome to the world of Laravel and Eloquent! It’s a fantastic framework for interacting with your database, but as you’ve discovered, sometimes the real-world requirements push you beyond the standard conventions. When you have multiple related tables that share structural similarities, trying to manage them all through a single Eloquent Model can lead to complexity.

You are asking a very common and excellent question: **Is there a way to set the table name dynamically within an Eloquent Model?**

As a senior developer, I can tell you that while Eloquent is designed for convention over configuration, it is highly flexible enough to handle dynamic operations. The key is understanding *where* the table mapping occurs and how to intervene when you need dynamic behavior. This post will walk you through the best practices for achieving dynamic table access in your Laravel applications.

---

## The Challenge of Static Mapping in Eloquent

By default, an Eloquent Model (like your `ProductLog`) is statically mapped to a single database table defined in its `$table` property or implicitly by its class name (e.g., `product_logs`). When you try to force a model instance to query a different table dynamically during runtime, you are essentially asking the ORM to break its established conventions.

The goal here is not just to change how data is retrieved, but to ensure that subsequent Eloquent methods (`where`, `find`, etc.) still function correctly against the newly specified table.

## Solution 1: Dynamic Table Setting via Model Attributes

The most direct way to achieve dynamic table switching is by modifying the model instance's properties *before* performing database operations. Since you are working with custom logic, we can leverage standard PHP object manipulation within your model or a separate service layer.

Let’s refine your proposed approach by making the table name an accessible property and ensuring your query methods respect it.

### Implementing Dynamic Table Switching

Instead of trying to inject the table name into the constructor (which modifies the fundamental structure), we can use a method that sets the internal state for subsequent queries, or dynamically manipulate the query builder itself.

Here is how you can adapt your concept using a custom method:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class ProductLog extends Model
{
    public $timestamps = false;

    /**
     * Dynamically sets the table name for this specific query context.
     *
     * @param string $tableName The name of the table to query.
     * @return $this
     */
    public function setTable(string $tableName): self
    {
        // Store the table name as an attribute, which we can use later.
        $this->setAttribute('table_name', $tableName);
        return $this;
    }

    /**
     * Scope to dynamically change the base table for queries.
     * This method overrides how Eloquent resolves table names.
     */
    public function scopeQuery(Builder $query)
    {
        $tableName = $this->getAttribute('table_name') ?? $this->getTable();
        return $query->from($
