---
title: "laravel hook into Eloquent pre and post save for every model"
description: "Laravel Hook into Eloquent Pre and Post Save for Every Model: The Observer Pattern As you dive deeper into Laravel and Eloquent, you quickly realize that..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As you dive deeper into Laravel and Eloquent, you quickly realize that while the ORM provides incredible power for data manipulation, managing complex business logic around those saves often requires external hooks. You are looking to implement code that fires automatically before and after any model is persisted—a classic requirement for auditing, updating related data, or triggering notifications.

The approach you suggested, overriding the `save()` method directly within the Eloquent model, is a valid way to handle logic specific to that single model. However, when you need this behavior applied across *every* model in your application, manually implementing it in dozens of classes becomes cumbersome and violates the principle of separation of concerns.

The most elegant, scalable, and recommended solution in the Laravel ecosystem for achieving global Eloquent lifecycle hooks is by utilizing **Model Observers**. This pattern allows you to decouple your business logic from the model itself, making your code cleaner, more maintainable, and highly reusable.

## Understanding Model Observers

Model Observers are a dedicated feature in Laravel designed precisely for this scenario: listening to events that occur on a Eloquent model (like creating, updating, saving, or deleting) and executing custom logic based on those events. They follow the Observer design pattern, which is perfect for managing side effects tied to data changes.

Instead of cluttering your models with save logic, you create an Observer class that listens for specific Eloquent events. When an event fires (e.g., a model is saved), the Observer's methods are automatically executed.

### Setting up the Observer

To use an Observer, you first generate it using the Artisan command:

```bash
php artisan make:observer PostObserver --model=Post
```

This command creates a class that extends `Illuminate\Auth\Observer` (or similar base classes depending on context) and registers it with your Model.

### Implementing Pre-Save Logic (Creating/Updating)

To hook into the save process *before* the database transaction commits, you listen for the `creating` or `updating` events.

Let's imagine we want to automatically set a `created_at` timestamp (though Eloquent handles this by default, custom logic is often needed) and ensure a specific field is populated before saving.

In our `PostObserver`, we define the necessary methods:

```php
// app/Observers/PostObserver.php

namespace App\Observers;

use App\Models\Post;

class PostObserver
{
    /**
     * Handle the creating event (before a new record is saved).
     */
    public function creating(Post $post)
    {
        // Pre-save logic: Set default values or perform initial checks.
        $post->status = 'draft'; 
        // Any other setup before saving to the database happens here.
    }

    /**
     * Handle the updating event (before an existing record is updated).
     */
    public function updating(Post $post)
    {
        // Pre-save logic: Audit changes or enforce rules.
        if ($post->is_published && !$post->published_at) {
            // Logic to handle publishing status before the update runs.
            $post->published_at = now();
        }
    }

    /**
     * Handle the saved event (after a model has been successfully persisted).
     */
    public function saved(Post $post)
    {
        // Post-save logic: Trigger actions after the save is complete.
        // For example, sending an email notification or logging the change to an audit table.
        \Log::info("Post ID {$post->id} was successfully saved at " . now());
    }

    /**
     * Handle the deleted event (before a model is removed from the database).
     */
    public function deleting(Post $post)
    {
        // Logic to handle soft deletes or cleanup.
        // Example: Delete associated files when a post is deleted.
    }

    /**
     * Handle the restored event (after a soft-deleted model is restored).
     */
    public function restored(Post $post)
    {
        // Logic for restoring data integrity.
    }
}
```

### Registering the Observer

The final, crucial step is telling Laravel which model should use this observer. This is done within the `boot()` method of your application's Service Provider (usually `AppServiceProvider`):

```php
// app/Providers/AppServiceProvider.php

use App\Models\Post;
use App\Observers\PostObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register the observer for the Post model
        Post::observe(PostObserver::class); 
        
        // You can register observers for other models here as well:
        // User::observe(UserObserver::class);
    }
}
```

## Conclusion

By adopting the Model Observer pattern, you achieve a robust, scalable solution for global Eloquent hooks. This approach ensures that your model classes remain focused purely on data structure and relationships, while all the complex operational logic—the "before save" and "after save" code—is cleanly centralized in dedicated Observer classes. This is a fundamental best practice when building large-scale applications with Laravel; it keeps your codebase clean and makes maintenance significantly easier. Remember, leveraging these built-in Laravel features, like Eloquent and its associated tools found on the [Laravel Company website](https://laravelcompany.com), is key to writing professional, maintainable code.
