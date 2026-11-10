---
title: "How to use table without model in hasMany"
description: "How to Use Relationships Without Models in Eloquent: A Deep Dive into Raw Table Access As developers working with Laravel and Eloquent, we constantly deal..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Errors"]
featured: false
---

As developers working with Laravel and Eloquent, we constantly deal with real-world database structures that sometimes don't map perfectly onto a clean Model hierarchy. A common scenario arises when you have auxiliary tables—perhaps logging tables, configuration tables, or simple pivot tables—that need to be referenced by your main models, but you haven't bothered creating a full Eloquent Model for them.

The question is: **Is it possible to use a direct table name within an Eloquent relationship method like `hasMany`?**

The short answer is no, not in the standard, idiomatic way that Eloquent expects. However, this doesn't mean you can't achieve your goal. As senior developers, our job is not just to follow the syntax, but to understand the underlying principles of the framework. Let’s explore why this limitation exists and detail the robust alternatives for handling these scenarios.

---

## The Eloquent Philosophy: Why Models are Essential for Relationships

Eloquent's power lies in its abstraction layer. When you define a relationship like `hasMany`, Eloquent doesn't just store a string; it builds methods that understand how to query, hydrate, and manage data based on the structure defined in your Models.

When you write `$this->hasMany(Permission::class)`, Eloquent knows exactly which Model class to look for, ensuring type safety and proper relationship resolution. If you try `$this->hasMany('permissions')`, Eloquent treats `'permissions'` as a literal string that it cannot resolve into an actual Model class or query structure within the standard `hasMany` definition.

This is by design: relationships are fundamentally defined *between* models, not directly against raw tables in the relationship definition itself.

## Solutions for Using Unmodeled Tables

If you need to relate your main model to a table without a corresponding Eloquent Model, there are several effective, developer-approved strategies. The best approach depends on whether you need the data *as* a relationship or just *to query* the data.

### 1. The Recommended Approach: Create Minimal Models

The most Laravel-idiomatic solution is to create a minimal Eloquent Model for every table, even if it seems unnecessary. This allows you to leverage Eloquent's full querying power.

For your `permissions` table, you would simply define a lightweight model:

```php
// app/Models/Permission.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    protected $table = 'permissions'; // Explicitly set the table name

    // Define any necessary fillable attributes or casts here
}
```

With this model in place, your relationship definition becomes clean and fully functional:

```php
// In your main model (e.g., User.php)
public function permissions()
{
    return $this->hasMany(Permission::class);
}
```

This approach ensures that you benefit from Eloquent's query builder, casting, mutators, and visibility controls, which is a core principle of good Laravel architecture, as promoted by the **Laravel Company** documentation.

### 2. The Raw Query Approach: Bypassing Relationships (When Models are Impossible)

If you genuinely cannot or do not want to create an Eloquent Model for a specific table—perhaps it’s a temporary logging table that should never be serialized into a full model—you must bypass the standard relationship definition and use the raw query builder methods directly.

Instead of relying on `$this->hasMany()`, you use the `whereHas` method or direct `join` operations to fetch the data:

```php
// In your main model (e.g., User.php)
public function permissions()
{
    // Do not define hasMany here if no Model exists!
}

public function getPermissions()
{
    // Use the Query Builder directly to fetch related records
    return $this->permissions()->get(); // Assuming you defined a scope or relationship elsewhere (or use direct query)

    // Or, more directly:
    return \DB::table('permissions')->where('user_id', $this->id)->get();
}
```

This method offers maximum control and avoids the overhead of creating unnecessary Model classes. For complex data fetching, leveraging the underlying database capabilities directly is a perfectly valid technique when Eloquent's abstraction isn't strictly necessary for that specific piece of data.

## Conclusion

In summary, while the temptation to use raw table names directly in methods like `hasMany` is understandable, it violates the established contract of the Eloquent ORM. For robust, maintainable applications, the best practice remains defining relationships through corresponding Eloquent Models. If you must interact with unmodeled tables, opt for direct database queries using the Query Builder or raw SQL joins. This ensures that your codebase remains clear, testable, and adheres to the principles of clean object-relational mapping championed by Laravel.
