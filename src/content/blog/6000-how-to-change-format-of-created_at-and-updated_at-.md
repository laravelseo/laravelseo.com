---
title: "How to change format of created_at and updated_at in laravel Model?"
description: "How to Change the Format of created at and updated at in Laravel Models As developers working with Laravel, handling timestamps correctly is crucial. The..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers working with Laravel, handling timestamps correctly is crucial. The `created_at` and `updated_at` fields are fundamental for tracking record history, but often, when we retrieve them for an API response or display, we need a specific, streamlined format—like removing the seconds—for cleaner presentation.

You are running into a common point of confusion: while Laravel's Eloquent casting is powerful, applying complex string formatting directly via `$casts` isn't always the most straightforward approach for custom output needs.

This guide will explore why your initial attempt didn't work and provide the most robust, developer-friendly solutions for formatting these timestamps exactly how you need them.

---

## Understanding the Limitation of `$casts`

You attempted to use the `$casts` property to format the dates:

```php
protected $casts = [
    'created_at'  => 'datetime:Y-m-d H:i', // This did not work as expected
    'updated_at'  => 'datetime:Y-m-d H:i'
];
```

The reason this didn't produce the desired output is that `$casts` primarily controls how Eloquent converts the raw database value (a `DATETIME` string) into a native PHP type when accessing the model. While it handles basic date/time parsing, it doesn't automatically override the standard methods Eloquent uses to format these attributes when they are serialized into JSON or returned directly from the Model instance without explicit intervention.

To achieve precise formatting control over output, we need to intervene in the data retrieval process itself.

## Solution 1: Custom Accessors (The Eloquent Way)

The most "Laravel" and object-oriented way to customize how an attribute is retrieved and displayed is by using **Accessors** within your Model. Accessors allow you to define custom methods that are automatically called when you try to access a property on the model.

By implementing an accessor, you gain full control over the exact string format returned to the caller, regardless of the underlying database storage format.

Here is how you would implement this in your Model:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    /**
     * Get the creation date formatted as YYYY-MM-DD HH:MM.
     */
    public function getFormattedCreatedAtAttribute()
    {
        // Use the Carbon instance for safe formatting
        return $this->created_at->format('Y-m-d H:i');
    }

    /**
     * Get the updated date formatted as YYYY-MM-DD HH:MM.
     */
    public function getFormattedUpdatedAtAttribute()
    {
        return $this->updated_at->format('Y-m-d H:i');
    }
}
```

**Usage:** Now, instead of accessing `$post->created_at`, you access the custom method:

```php
$post = Post::find(1);

// Output will be '2022-02-22 04:07' (without seconds)
echo $post->formatted_created_at;
```

This approach keeps your Model clean and separates the database logic from the presentation logic, which is a core principle in building scalable applications, much like the principles discussed on [laravelcompany.com](https://laravelcompany.com).

## Solution 2: Formatting at the Controller Level (The API Way)

If you are primarily serving an API response, it is often cleaner to handle the formatting right before sending the data to the client, rather than embedding presentation logic deep within the Model. This keeps your Eloquent Models focused solely on data persistence and retrieval.

In your Controller method, you can use the `format()` method provided by Carbon (which Laravel uses internally) directly:

```php
use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function show(Request $request, Post $post)
    {
        // Retrieve the model
        $post = Post::findOrFail($post->id);

        // Format the timestamps directly for the response
        $formattedData = [
            'id' => $post->id,
            'title' => $post->title,
            'created_at' => $post->created_at->format('Y-m-d H:i'),
            'updated_at' => $post->updated_at->format('Y-m-d H:i'),
        ];

        return response()->json($formattedData);
    }
}
```

## Conclusion

For formatting timestamps in Laravel, the choice depends on where the logic belongs. If you need this format consistently across many parts of your application (e.g., in Blade views or general object access), **Custom Accessors** are the superior, object-oriented solution. If you are strictly building an API and want to keep your Models agnostic of presentation concerns, **formatting within the Controller** is the most pragmatic approach.

By mastering these techniques, you ensure your data remains accurate in the database while presenting exactly the clean, standardized format your users expect. For deeper dives into Eloquent relationships and model design, always refer back to the resources provided by [laravelcompany.com](https://laravelcompany.com).
