---
title: "How can I get created_at month name on laravel blade?"
description: "How to Get the Month Name from created at in Laravel Blade As developers working with Laravel, we frequently deal with database timestamps, and extracting..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers working with Laravel, we frequently deal with database timestamps, and extracting human-readable information—like the month name—is a common requirement. When you have a `created_at` field, getting the month name requires leveraging PHP's powerful date manipulation library, **Carbon**. Simply accessing the timestamp won't give you the name; you need to instruct Carbon how to format that timestamp before rendering it in your Blade view.

This guide will walk you through the most effective and idiomatic ways to display the month name from a database timestamp within your Laravel application.

***

## Understanding the Role of Carbon

Laravel is built on top of the excellent Carbon library, which provides an elegant and intuitive way to handle dates and times in PHP. Whenever you interact with Eloquent models (like retrieving a `created_at` field), Laravel automatically casts these into Carbon instances. This is the key to unlocking date manipulation.

The issue often arises when developers try to apply methods designed for the *current* time (`Carbon::now()`) to an existing property (`$value->created_at`). You need to call those methods directly on the specific date object you are working with.

## Method 1: Direct Formatting in the Blade View (Simple Approach)

The most straightforward way to achieve this is by accessing the `created_at` attribute and immediately calling a Carbon method on it within your Blade template. This approach is concise and works perfectly for simple displays.

Assuming you have an Eloquent model named `Post` with a `created_at` timestamp, here is how you would access the month name:

```blade
<div>
    <p>Post Created On: {{ $post->created_at->monthName }}</p>
</div>
```

**Explanation:**

1.  `$post->created_at`: This accesses the Carbon instance stored in your database.
2.  `->monthName`: This is a built-in Carbon accessor that formats the date object to return the full name of the month (e.g., "October").

If you need more control, such as getting the full name or a localized version, Carbon offers several powerful alternatives:

```blade
{{-- Getting the full month name --}}
<p>Month: {{ $post->created_at->month }}</p> 

{{-- Getting the full month name using format() --}}
<p>Full Month Name: {{ $post->created_at->format('F') }}</p> 
```

## Method 2: Formatting in the Controller or Model (Best Practice)

While Method 1 is fast for simple views, relying heavily on complex formatting directly in the Blade file can make your presentation logic messy. A more robust and scalable approach, especially for complex applications, is to perform the date formatting logic within your Eloquent model or the controller before passing the data to the view. This adheres to the principle of separating concerns.

### Option A: Using an Eloquent Accessor (Recommended)

For reusable logic, defining an accessor in your Model is the cleanest solution. This keeps the presentation logic neatly encapsulated within the data structure itself.

In your `Post` model:

```php
// app/Models/Post.php

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Carbon;

class Post extends Model
{
    /**
     * Get the month name for created_at.
     */
    public function getMonthNameAttribute()
    {
        // Ensure created_at exists before attempting to format it
        if ($this->created_at) {
            return $this->created_at->monthName;
        }
        return null;
    }
}
```

Now, in your Blade file, you can simply access the attribute like any other property:

```blade
<div>
    <p>Post Created On: {{ $post->month_name }}</p> 
</div>
```

### Option B: Formatting in the Controller

If the logic is specific to a single view or controller action, formatting it before passing it to the view is also acceptable:

```php
// app/Http/Controllers/PostController.php

use App\Models\Post;
use Carbon\Carbon;

public function show(Post $post)
{
    // Format the date here before passing it to the view
    $formattedDate = $post->created_at->format('F'); 

    return view('posts.show', [
        'post' => $post,
        'display_month' => $formattedDate,
    ]);
}
```

***

## Conclusion

To summarize, while you *can* achieve the goal by calling Carbon methods directly within your Blade file (Method 1), the most professional and maintainable approach is to encapsulate this logic. Using **Eloquent Accessors** (Method 2A) ensures that your date formatting rules are tied directly to your data model, making your application cleaner, more reusable, and easier to manage as your project grows. Always remember that mastering date handling with Carbon is a cornerstone skill for any Laravel developer, helping you build robust applications, much like the principles discussed on the official [Laravel website](https://laravelcompany.com).
