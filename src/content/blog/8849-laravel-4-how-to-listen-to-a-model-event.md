---
title: "Laravel 4 how to listen to a model event?"
description: "Laravel 4: How to Listen to a Model Event and React to Updates As developers, one of the most powerful features of an MVC framework like Laravel is its..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "PHP"]
featured: false
---

As developers, one of the most powerful features of an MVC framework like Laravel is its ability to decouple components through events. By listening to model events, we can execute custom logic whenever data changes, keeping our controllers clean and our business logic centralized within the model layer. This guide will walk you through how to implement an event listener for a model's `updating` event to notify you of changes, specifically demonstrating how to pass data like a post title to the listener.

## Understanding Model Events in Laravel

Laravel's Eloquent ORM provides a rich set of events that fire during the lifecycle of a model (creation, updating, saving, deleting). These events allow external classes—known as Observers—to hook into these crucial moments without directly modifying the model itself. This pattern is fundamental to building maintainable and scalable applications.

When you perform an action like `$post->save()`, several events are triggered. For instance, the `updating` event fires just before the record is saved to the database, making it the perfect time to inspect the changes.

## Implementing the Event Listener with an Observer

The recommended way to handle model events in Laravel is by creating an **Observer**. An Observer is a class that implements methods corresponding to specific Eloquent events. When an event occurs on a model, Laravel automatically notifies all registered observers.

### Step 1: Create the Observer Class

First, we create a new observer class. This class will contain the logic for what happens when the `updating` event fires. Let's assume we have a `Post` model.

```php
// app/Observers/PostObserver.php

namespace App\Observers;

use App\Models\Post;

class PostObserver
{
    /**
     * Handle the updating event.
     * This method is called right before the model is updated in the database.
     *
     * @param  \App\Models\Post  $post
     * @return void
     */
    public function updating(Post $post)
    {
        // Access the attributes that are about to be updated
        $title = $post->title;

        // In a real application, you would trigger an alert, send an email, or perform validation here.
        $this->notifyUpdate($title);
    }

    /**
     * A simple method to simulate notification logic.
     * @param string $title
     */
    protected function notifyUpdate($title)
    {
        // Example: In a real scenario, this might dispatch an event or interact with a service.
        \Log::info("Post title is being updated: " . $title);

        // For demonstration purposes, we simulate an alert notification.
        echo "ALERT: The post title has been updated to: " . $title . "\n";
    }
}
```

### Step 2: Register the Observer

For Laravel to recognize and use this observer, you must register it on your model. This is typically done within the model's boot method or via a service provider.

```php
// app/Models/Post.php

namespace App\Models;

use App\Observers\PostObserver;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    /**
     * Get the model observers.
     */
    public function observers()
    {
        return [
            PostObserver::class,
        ];
    }
}
```

By registering the observer this way, whenever any instance of the `Post` model goes through an update operation, our custom logic in the `updating` method will automatically execute. This separation of concerns is exactly what promotes clean code and adherence to good architecture principles, much like the principles advocated by the Laravel team regarding application structure.

## Conclusion

Listening to model events via Observers provides a robust, decoupled mechanism for reacting to data changes within your Laravel application. By utilizing methods like `updating`, you gain precise control over the flow of execution. Remember that while modern Laravel offers streamlined ways to handle events (like using dedicated event listeners directly on the model), the Observer pattern remains a powerful and highly flexible tool for managing complex side effects associated with Eloquent operations. Mastering these patterns is key to building sophisticated features on top of the framework, ensuring your application remains responsive and easy to maintain.
