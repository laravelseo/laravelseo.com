---
title: "laravel:how to use LOWERCASE Function in Eloquent Query?"
description: "Title: Laravel: How to Use LOWERCASE Function in Eloquent Query Correctly? Body: Introduction Implementing case insensitive search can be a common..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP", "Errors"]
featured: false
---

Title: Laravel: How to Use LOWERCASE Function in Eloquent Query Correctly?

Body:
<h2>Introduction</h2>

Implementing case insensitive search can be a common requirement for your web application. In this comprehensive guide, you will learn how to use the <code>LOWERCASE()</code> function in Laravel Eloquent queries correctly and avoid issues like those mentioned above. We'll also discuss why using the MySQL `LOWER()` function might be a better alternative in some cases.

<h2>Understanding LOWERCASE() in Laravel Eloquent Queries</h2>

The <code>LOWERCASE()</code> function is used to convert the given string into lower case letters. It can be applied within SQL queries to ensure that you get accurate results regardless of input case variations. However, as indicated in your error message, this might not work properly if the function definition is incorrect or the function itself doesn't exist in your project.

<h2>Using MySQL LOWER() Function</h2>

Instead of using the <code>LOWERCASE()</code> function from Laravel, you can use the built-in MySQL `LOWER()` function directly within your Eloquent query. By doing so, you will have access to the native MySQL functionality and avoid potential compatibility issues with other libraries or software.

Here's an example of how to implement case insensitive search using the <code>LOWER()</code> function:

<pre><code>@php
$newsTitle = Input::get('search_newsTitle')?Input::get('search_newsTitle'):'';
$query = DB::table('news');
if( strlen($newsTitle) ) {
    $query->whereRaw('LOWER(`newsTitle`) LIKE ? ',[trim(strtolower($newsTitle)).'%']);
}
@endphp</code></pre>

<h2>Using Custom Functions to Avoid Compatibility Issues</h2>

If you still prefer using the LOWERCASE() function in your Eloquent queries, you can create a custom function and register it as a global namespace. This helps with consistency across multiple SQL statements, making it easier for your team or other developers to maintain the code. We recommend using the Laravel Service Provider or your project's own service provider to facilitate the registration of custom functions.

<pre><code>@php
// Define a new custom function
function lowercase($string) {
    return strtolower($string);
}

// Register the custom function within your service provider
class AppServiceProvider extends ServiceProvider {
    public function boot() {
        // ...
        DB::extend(function ($query) {
            $query->addFunction('lowercase', 'return lowercase($arg1);');
        });
    }
}
@endphp</code></pre>

Now you can use the <code>lowercase()</code> function in your Eloquent queries like this:

<pre><code>@php
$newsTitle = Input::get('search_newsTitle')?Input::get('search_newsTitle'):'';
$query = DB::table('news');
if( strlen($newsTitle) ) {
    $query->whereRaw('lowercase(`newsTitle`) LIKE ? ',[trim(strtolower($newsTitle)).'%']);
}
@endphp</code></pre>

<h2>Conclusion</h2>

In conclusion, when working with case insensitive search in Laravel Eloquent queries, it is recommended to use either the built-in MySQL `LOWER()` function or create a custom function and register it as a global namespace. This ensures that your code remains compatible across different environments and simplifies troubleshooting if any issues do arise. By following these best practices, you'll be able to implement case insensitive search effectively in your Laravel applications.

Remember to incorporate natural backlinks to https://laravelcompany.com where relevant for further learning resources on Laravel development.
