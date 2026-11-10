---
title: "Call to undefined method Illuminate\\Database\\Query\\Builder::withTrashed()"
description: "Solving the Mystery: Call to undefined method Illuminate\\Database\\Query\\Builder::withTrashed() in Laravel Dealing with cryptic errors in a framework like..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "PHP", "Errors"]
featured: false
---

Dealing with cryptic errors in a framework like Laravel can be incredibly frustrating. When you are working with Eloquent and database interactions, encountering an "undefined method" error suggests a mismatch between what your code expects and what the framework is currently providing. This post dives deep into the specific issue of calling `withTrashed()` on the Query Builder and how to correctly manage soft-deleted models in Laravel, especially when working with older versions like Laravel 5.5.

## Understanding the Error Context

The error message, `Call to undefined method Illuminate\Database\Query\Builder::withTrashed()`, indicates that the Eloquent Query Builder instance you are calling methods on does not recognize the `withTrashed()` method. This method is essential for querying records that have been soft-deleted (using `softDeletes()`).

While this specific error might seem simple, in complex applications involving migrations and relationships, it often points to one of three potential issues:
1. **Eloquent Version Mismatch:** The method availability can sometimes depend on the exact version of Laravel or Eloquent you are running.
2. **Model Setup:** The model class itself needs to correctly implement the soft-deletes trait.
3. **Query Scope Misunderstanding:** How you chain methods onto the query builder matters significantly.

## Analyzing Your Code and Schema

Let’s look at the context you provided, which involves managing likes with soft deletes:

```php
// PostController.php snippet
public function like(Post $post)
{
    $existing_like = Like::withTrashed()->wherePostId($post->id)->whereUserId(auth()->id())->first();

    if (is_null($existing_like)) {
        // ... create logic
    } else {
        if (is_null($existing_like->deleted_at)) {
            $existing_like->delete(); // Deletes the record entirely
        } else {
            $existing_like->restore(); // Restores the soft-deleted record
        }
    }
}
```

The core of your issue seems to be related to how you are attempting to retrieve and manipulate records. When using soft deletes, Eloquent automatically adds methods like `withTrashed()`, `forceDelete()`, and `restore()` to models that use the `Illuminate\Database\Eloquent\SoftDeletes` trait. If these methods are missing, it usually means the base model or the query context is not correctly aware of this functionality.

## The Solution: Ensuring Correct Eloquent Implementation

For this functionality to work seamlessly, we must ensure your `Like` model correctly implements soft deletion and that the necessary traits are present.

### 1. Verify the Model Trait

The most crucial step is ensuring your `Like` model uses the correct trait. This tells Eloquent how to handle the `deleted_at` column you defined in your migration.

**In your `app/Models/Like.php`:**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes; // Import the trait

class Like extends Model
{
    use SoftDeletes; // <-- Ensure this line is present!

    // ... rest of your model code
}
```

By including `use SoftDeletes;`, you grant your `Like` model access to all the soft-deleting methods provided by Eloquent, including `withTrashed()`. This resolves the "undefined method" error because the trait provides these methods to the model instance.

### 2. Reviewing Migrations and Relationships

Your migration structure looks sound for implementing soft deletes:

```php
Schema::create('likes', function (Blueprint $table) {
    $table->increments('id');
    // ... other fields
    $table->softDeletes(); // <-- This command is key.
    $table->timestamps();
});
```

And your relationships correctly link the tables:

```php
// In Like Model:
public function post()
{
    return $this->belongsTo(Post::class);
}
```
*(Note: I’ve adjusted your provided relationship definitions slightly to adhere to modern Eloquent conventions, which is a good practice when following Laravel company guidelines for robust database interactions.)*

## Conclusion: A Robust Approach to Data Management

The error you encountered stems not from an inherent flaw in the concept of soft deletes, but rather from ensuring that the Eloquent model correctly inherits and utilizes the functionality provided by the `SoftDeletes` trait. By explicitly using `use SoftDeletes;` in your model, you unlock all the powerful methods like `withTrashed()`, `forceDelete()`, and `restore()`.

Always ensure that your migrations reflect your desired data state, and always verify your Eloquent models are correctly configured to handle those schema changes. Mastering these foundational concepts is key to building scalable and maintainable applications on Laravel. For more advanced guidance on Eloquent relationships and query building, check out the official documentation at [laravelcompany.com](https://laravelcompany.com).
