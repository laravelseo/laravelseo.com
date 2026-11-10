---
title: "Questions related to soft delete in laravel"
description: "Demystifying Soft Deletes in Laravel: Answering Your Top Questions Soft deletes are a powerful feature in Laravel and Eloquent, offering a graceful way to..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords"]
featured: false
---

Soft deletes are a powerful feature in Laravel and Eloquent, offering a graceful way to handle record removal without permanently destroying data. As you've started exploring this concept, it’s natural to have questions about how it functions in practice. Understanding the mechanics behind soft deletion is key to building robust, maintainable applications.

Let's dive into your specific questions based on the core principle: setting a `deleted_at` timestamp instead of physically removing rows from the database.

---

## Q1: Does Data Disappear from the View if it's Soft Deleted?

**Short Answer:** No, the data does not disappear immediately when soft-deleted. It remains in the database, but by default, Eloquent will hide it from standard queries.

When you use the `SoftDeletes` trait, Laravel automatically modifies how models interact with the database. When you perform a standard query (e.g., `User::all()`), Eloquent automatically scopes the results to only include records where the `deleted_at` column is `NULL`. Therefore, if you are not explicitly querying for soft-deleted items, they simply won't appear in your Blade views.

However, this behavior requires developers to be mindful of how data is retrieved. If you need to retrieve soft-deleted items for administrative purposes (like viewing a trash bin), you must bypass the default scope using methods like `withTrashed()` or `onlyTrashed()`. This ensures that the actual data persists safely in your database, which adheres to good data management principles often discussed in modern Laravel development practices found on resources like [laravelcompany.com](https://laravelcompany.com).

## Q2: Explaining `static::deleting`

The `static::deleting` method is a Model Observer hook that executes just before the model is soft-deleted (i.e., before the `delete()` method is called on an Eloquent model). This is extremely useful for implementing custom logic that needs to run during the deletion process, such as logging actions or triggering notifications.

When you implement this method within your model, any code inside it runs synchronously on the server when the soft delete operation is initiated.

**Example Implementation:**

```php
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class Post extends Model
{
    use \Illuminate\Database\Eloquent\SoftDeletes;

    /**
     * The model now runs custom logic before soft deletion.
     */
    public function deleting(SoftDeletes $this)
    {
        // Log the action right before the record is marked as deleted
        Log::info("Post ID {$this->id} is being soft-deleted.");

        // You could also trigger external service calls here:
        // Mail::to(User::find($this->user_id))->send('post_deleted');
    }
}
```

This pattern allows you to hook into the lifecycle of the model. It shifts the responsibility of performing side effects from controllers (where they might be missed) directly into the model itself, making your code cleaner and more encapsulated.

## Q3: How Do You Delete Data Using Soft Deletes?

Soft deletes fundamentally change how deletion is executed. You no longer use the standard `Model::destroy()` method for soft deletion; instead, you call the standard Eloquent delete method, which automatically applies the soft delete logic if the trait is present.

The key distinction lies in *how* you query the data:

1.  **Soft Deleting (The Standard Way):**
    ```php
    $post = Post::find(1);
    $post->delete(); // This sets deleted_at = NOW() in the database
    ```

2.  **Retrieving Active Data (Default Behavior):**
    When you query normally, only active records are returned:
    ```php
    $activePosts = Post::all(); // Only returns posts where deleted_at IS NULL
    ```

3.  **Retrieving Deleted Data:**
    To find records that have been soft-deleted, you must explicitly use the scope methods provided by `SoftDeletes`:
    ```php
    $trashedPosts = Post::onlyTrashed()->get(); // Retrieves only posts where deleted_at IS NOT NULL
    $allPosts = Post::withTrashed()->get();      // Retrieves all records, active and trashed
    ```

This approach forces you to handle the state of the data explicitly. Instead of relying on a simple "delete" command that removes everything, soft deletes give you granular control over record visibility, which is invaluable for auditing and recovery features within your application structure.

## Conclusion

Soft deletes are not just a database trick; they are a crucial architectural pattern for maintaining data history and implementing user-friendly workflows. By understanding the `deleted_at` timestamp, leveraging model events like `deleting()`, and mastering Eloquent’s scoping methods (`withTrashed()`, `onlyTrashed()`), you can build sophisticated systems that offer data recovery capabilities while keeping your database clean and compliant with modern Laravel standards. For deeper dives into Eloquent features and best practices, always refer to resources like [laravelcompany.com](https://laravelcompany.com).
