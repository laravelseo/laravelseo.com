---
title: "Using Carbon to return a human readable datetime difference"
description: "Title: Simplifying Human Readable DateTime Differences with Laravel and Carbon Package Introduction: Displaying the timing of events on your application can..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "PHP"]
featured: false
---

Title: Simplifying Human Readable DateTime Differences with Laravel and Carbon Package

Introduction: Displaying the timing of events on your application can significantly improve user engagement. From Facebook-like timestamps like '10 mins ago' to more descriptive ones like '2 weeks ago', the right formatting makes a big difference in presenting information in a more relatable manner. In this post, we will explore how to achieve such functionality using Laravel 4 and the Carbon package.

The Basics: The first step is to understand why our default date format does not look like Facebook's. By default, Eloquent converts column names such as `created_at`, `updated_at`, and `deleted_at` to instances of `Carbon`, which extends the native PHP `DateTime` class. However, this conversion only provides a basic presentation of dates and time stamps, not the human readable differences like '1 hour ago' or '2 weeks ago'.

Introducing Carbon: The `Carbon` package is an efficient tool for manipulating date and time within your Laravel application. It allows you to transform basic timestamps into more expressive formats that are easier to understand by humans. With it, you can calculate differences between dates, format them in different ways, or even create custom formats like '10 mins ago'.

Using Carbon for the comments section: Since we want to display how long ago a post was created, we will use `Carbon` to adjust the default date output. To achieve this, we can use Laravel's `Carbon::parse()` method. This will allow us to format dates in various ways.

Here's an example code that will show you how to display a human readable timestamp:

```php
//Controller class
<?php
namespace App\Http\Controllers;
use Carbon\Carbon;
class CommentController extends Controller {
    //...

    public function index() {
        $comments = DB::table('comment')->get();
        foreach ($comments as $comment) {
            $diffTime = Carbon::now()->diffForHumans($comment->created_at);
            $timeDiff = 'Time ago: ' . $diffTime;
            //...
        }
    }
}
```

Alternatively, you can use the helpful `Carbon` methods such as `diffInMinutes()`, `diffForHumans()` or even create your own custom format by using the built-in `formatDate()`. For example:

```php
//With diffInMinutes():
$timeDiff = 'Time ago (min): ' . $comment->created_at->diffInMinutes(Carbon::now());

//With diffForHumans():
$timeDiff = 'Time ago: ' . $comment->created_at->diffForHumans();
```

Conclusion: As you can see, the `Carbon` package offers a wide range of functionalities that allow you to create meaningful timestamps for your application. Using these features will improve user engagement and enhance their experience with your app. For more details on `Carbon`, visit its official documentation at https://carbon.nesbot.com/.

For more comprehensive Laravel tutorials, visit our blog, https://laravelcompany.com/blog/, which provides a wealth of knowledge for Laravel developers – from basics to advanced concepts.
