---
title: "How to cascade soft deletes in Laravel?"
description: "How to Cascade Soft Deletes in Laravel: Managing Relationships with Eloquent As developers working with relational data in Laravel, we often encounter..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML"]
featured: false
---

As developers working with relational data in Laravel, we often encounter scenarios where managing related records—especially when soft deletes are involved—requires careful architectural planning. A common requirement is: if a parent record (like a `Post`) is deleted (soft-deleted), all its associated child records (like `Comments`) must also be deleted (soft-deleted) to maintain data integrity and consistency.

The desire for a simple, declarative solution, such as adding `$cascadeSoftDeletes = ['comments'];` directly to the `Post` model, is completely understandable. However, Eloquent, by design, focuses on managing the state of individual models rather than automatically enforcing complex cascading deletion rules across relationships defined in the database schema.

This post will dive into why direct cascading doesn't exist natively and provide the most robust, idiomatic Laravel solutions for achieving true soft-delete cascading behavior.

---

## The Limitation of Native Soft Deletes

When you use the `SoftDeletes` trait in a Laravel model, it primarily manages the deletion state within that specific model’s scope (i.e., querying only non-deleted records). It does not inherently manage the lifecycle of related models across different tables. If we were to rely solely on Eloquent's relationship definitions, deleting the parent would simply leave orphaned soft-deleted children, which is often undesirable for data cleanup.

Therefore, achieving cascading soft deletes requires us to introduce custom logic that hooks into the deletion process. We must manually instruct the system to find and update all related records upon a parent's deletion.

## Solution 1: Implementing Cascading via Model Events (The Eloquent Way)

The most controlled and recommended way to handle this in Laravel is by utilizing model events, specifically the `deleting` or `deleted` events on the parent model. This allows us to intercept the deletion process and manually trigger the soft deletion on related models.

Let’s assume we have a `Post` model and a `Comment` model, linked by a standard foreign key relationship.

### Step 1: Define the Relationship

Ensure your models have the necessary relationships defined.

```php
// app/Models/Post.php
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    use SoftDeletes;

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
```

### Step 2: Implement the Cascade Logic

We will listen for the `deleting` event on the `Post` and iterate through all related comments, triggering their soft deletion.

```php
// app/Models/Post.php (Adding the logic)
use Illuminate\Support\Facades\DB;

class Post extends Model
{
    use SoftDeletes;

    protected static function booted()
    {
        static::deleting(function (Post $post) {
            // Cascade soft delete on related comments
            $post->comments()->each(function ($comment) {
                $comment->delete(); // This triggers the soft delete if SoftDeletes is used
            });
        });
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
```

### Explanation of the Code

By using the `deleting` event, we execute custom code *just before* the parent record is permanently deleted (or soft-deleted). We access the `$post->comments()` relationship and loop through every related comment. Inside the loop, calling `$comment->delete()` triggers the Eloquent soft delete mechanism on that specific comment record. This ensures that when a post is removed, all its associated comments are also marked as deleted, maintaining data integrity across your application's data structure.

This approach provides granular control over the deletion process, which aligns perfectly with the principles of building scalable applications, much like the structured design principles emphasized by **Laravel Company**.

## Conclusion

While the idea of a single property to handle cascading soft deletes is appealing for simplicity, complex relational operations in an ORM like Eloquent require custom handling. By leveraging model events and relationship methods, we can build robust, explicit logic that ensures data consistency. This method moves beyond simple database constraints and allows your application layer to manage intricate business rules gracefully. For any advanced data manipulation, always favor clear, intentional code over attempting to force a solution where the framework doesn't natively provide it.
