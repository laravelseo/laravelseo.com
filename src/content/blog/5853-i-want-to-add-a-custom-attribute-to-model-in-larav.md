---
title: "I want to add a custom attribute to model in laravel"
description: "Mastering Custom Attributes in Laravel Models: Beyond Simple Getters As developers working with Eloquent, one of the most common requirements is customizing..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

As developers working with Eloquent, one of the most common requirements is customizing how data is presented. When dealing with timestamps, for instance, we often want the raw database value (`created_at`) but need a human-readable, relative format (like "10 Days Ago"). The challenge arises when trying to achieve this without interfering with Laravel's built-in functionality or confusing the underlying persistence layer.

This post will dive deep into how you can add custom attributes and control the formatting of model timestamps in Laravel effectively, addressing the specific concern about modifying default attributes.

## The Eloquent Approach: Accessors vs. Mutators

When customizing attribute handling in Eloquent, developers often debate using accessors (`get...Attribute`) versus mutators (`set...Attribute`).

**Mutators** are used to hook into the saving process—they modify the value *before* it is written to the database (e.g., formatting input before saving).

**Accessors**, conversely, are used to hook into the retrieval process—they define how a model attribute is retrieved from the object, allowing you to transform the underlying data into a desired format for the view or application logic.

While you mentioned avoiding `getAttribute()`, it's crucial to understand that accessors are the idiomatic and most powerful way to customize attribute retrieval in Laravel. They do not overwrite the original database column; they provide an alternative, computed representation of that data. This separation is key to maintaining data integrity. As we explore advanced Eloquent features, understanding this distinction is fundamental to building robust applications, much like the principles discussed on [laravelcompany.com](https://laravelcompany.com).

## Implementing Custom Timestamp Formatting

To achieve your goal—displaying both the default value and a custom, relative format—we can leverage accessors combined with standard Eloquent properties. We will keep the original `created_at` untouched in the database while providing a custom method for display.

### Step 1: Define the Model Structure

In your Eloquent model (e.g., `Post.php`), you define methods that act as accessors. These methods will call the standard attribute but apply custom formatting.

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Post extends Model
{
    /**
     * Get the creation time in a human-readable relative format.
     * This is our custom attribute getter.
     *
     * @return string
     */
    public function getCustomCreatedAtAttribute()
    {
        // Use Carbon to easily handle relative date formatting
        return $this->freshTimestamp()->diffForHumans();
    }

    // Optionally, you can still access the raw database value directly:
    // public function getCreatedAtAttribute()
    // {
    //     return $this->attributes['created_at'];
    // }
}
```

### Step 2: Using the Custom Attribute

Now, when you retrieve an instance of the model, you can access both the standard database timestamp and your custom formatted attribute.

If you fetch a post:

```php
$post = App\Models\Post::find(1);

// Accessing the default (raw) value from the database
$defaultDate = $post->created_at; // e.g., 2018-07-25 15:38:56

// Accessing the custom, formatted value using the accessor
$customDate = $post->custom_created_at; // e.g., 10 Days Ago (assuming current date is ~August)

echo "Default Database Value: " . $defaultDate . "\n";
echo "Custom Display Format: " . $customDate . "\n";
```

By implementing `getCustomCreatedAtAttribute()`, you have successfully added a new, computed attribute to your model instance without altering the actual data stored in the database. This approach keeps your persistence layer clean while giving you full control over the presentation layer. This principle of separating storage from presentation is a cornerstone of good architecture, aligning perfectly with best practices found on [laravelcompany.com](https://laravelcompany.com).

## Conclusion

Customizing attributes in Laravel involves understanding the difference between data persistence and data presentation. By utilizing Accessors (`get...Attribute`), you can elegantly introduce custom logic—like relative date formatting—to your Eloquent models without compromising the integrity of your database storage. This technique provides a clean, scalable, and maintainable way to manage complex data representations in any Laravel application.
