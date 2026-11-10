---
title: "Change date format laravel 5"
description: "Mastering Date Formatting in Laravel: A Deep Dive with Carbon (Laravel 5.1) As a senior developer, I frequently encounter situations where manipulating dates..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "PHP", "Errors"]
featured: false
---

As a senior developer, I frequently encounter situations where manipulating dates retrieved from the database proves tedious. You fetch raw date strings, but you need them displayed in a user-friendly format—whether it's `DD/MM/YYYY`, `Month Day, Year`, or something custom. In the world of Laravel, the indispensable tool for this kind of complex date and time manipulation is **Carbon**.

This post will guide you through solving your specific problem: properly changing the date format for your posts in a Blade view using Carbon, tailored for a Laravel 5.1 environment. We will cover the best practices for handling data flow from the Controller to the View.

## The Challenge: Formatting Dates in Your View

You are currently looping through your `$posts` and trying to display the `tanggal` field:

```html
<td class="mailbox-name"><?php echo $post->tanggal; ?></td>
```

If the date coming from the database is in a format that isn't immediately presentable (e.g., a raw MySQL datetime string), displaying it directly often leads to inconsistent or incorrect formatting across your application. The solution lies in ensuring the data is correctly formatted *before* it ever reaches the Blade template.

## Introducing Carbon: The Power of Date Manipulation

Carbon is an extension of PHP's built-in `DateTime` class. It provides a much more intuitive, fluent, and expressive way to work with dates and times. Instead of dealing with complex string parsing, Carbon allows you to easily parse, manipulate, compare, and format dates. This makes development significantly cleaner and less error-prone.

When working within the Laravel ecosystem, especially when dealing with Eloquent models or raw database results, Carbon becomes your best friend for presentation logic. As we explore more advanced concepts in building robust applications, understanding these foundational tools is crucial, aligning with the principles promoted by platforms like [Laravel Company](https://laravelcompany.com).

## Implementation Strategy: Formatting in the Controller

The most robust and maintainable approach is to perform all necessary formatting logic within your Controller or Model layer, rather than cluttering your Blade file with complex PHP functions. This adheres to the separation of concerns principle.

Since you are using Laravel 5.1 and fetching data via the Query Builder, we will focus on applying the Carbon methods immediately after retrieving the data.

### Step-by-Step Code Example

Let's assume your `tanggal` column in the database holds a valid date string (e.g., '2023-10-26'). We will format it to a more readable format, like Day Month Year.

**1. Update Your Controller (`getIndex` method):**

Instead of passing the raw data, we will convert the dates into Carbon objects and then apply the desired format using the `format()` method.

```php
use Illuminate\Support\Facades\DB;
use Carbon\Carbon; // Make sure to import Carbon

public function getIndex()
{
    $posts = DB::table("lembur_karyawan")
        ->orderBy('id', 'desc')
        ->paginate(6);

    // Process the results to format the dates
    $posts->each(function ($post) {
        // Assuming $post->tanggal is the raw date string from the DB
        if (isset($post->tanggal)) {
            // Convert the string into a Carbon object, then format it as desired
            $post->formatted_date = Carbon::parse($post->tanggal)->format('d M Y');
        }
    });

    return view('user',['posts' => $posts]);
}
```

**Note on Eloquent:** If you were using Eloquent Models, this formatting logic would typically live in a Mutator or an accessor method within your Model class. This keeps the presentation logic entirely decoupled from the controller and view.

## Displaying the Formatted Date in the View (Blade)

Now that the data is pre-formatted and clean, displaying it in your Blade file becomes trivial. You simply echo the new formatted string:

```html
@foreach ($posts as $post)
    <tr>
        <td><?php echo $post->id; ?></td>
        <td><?php echo $post->nama; ?></td>
        {{-- Use the pre-formatted date directly --}}
        <td class="mailbox-name"><?php echo $post->formatted_date; ?></td> 
        <td><?php echo $post->deskripsi; ?></td>
        {{-- ... other columns ... --}}
    </tr>
@endforeach
```

## Conclusion

By leveraging Carbon, you transform a simple data display issue into a powerful demonstration of clean, object-oriented programming. In your Laravel application, treating dates as Carbon objects—parsing them from the database and formatting them for presentation before rendering—is a standard best practice. This approach ensures consistency, readability, and maintainability, setting you up for building more sophisticated features down the line. Embrace tools like Carbon to elevate your development experience!
