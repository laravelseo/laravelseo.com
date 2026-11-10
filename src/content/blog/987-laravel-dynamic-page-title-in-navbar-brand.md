---
title: "Laravel dynamic page title in navbar-brand"
description: "Title: Dynamically Display Page Titles in Laravel Navbar Brand Using Blade Views Introduction In Laravel, having a dynamic page title displayed on your..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "HTML", "PHP"]
featured: false
---

Title: Dynamically Display Page Titles in Laravel Navbar-Brand Using Blade Views

Introduction

In Laravel, having a dynamic page title displayed on your navbar-brand is essential to provide a smooth user experience. This ensures that each page's content is represented accurately while keeping the navigation consistent across all pages of your application. In this article, we will discuss how to dynamically display the page titles in the navbar-brand using Laravel 5.2 and its powerful Blade templates.

Dynamic Page Title in Navbar-Brand

First, let's take a look at our current setup:

<pre><code> &lt;div class="navbar-header"&gt;
    &lt;!-- Collapsed Hamburger --&gt;
    &lt;button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#spark-navbar-collapse"&gt;
        &lt;span class="sr-only"&gt;Toggle Navigation&lt;/span&gt;
        &lt;span class="icon-bar"&gt;&lt;/span&gt;
        &lt;span class="icon-bar"&gt;&lt;/span&gt;
        &lt;span class="icon-bar"&gt;&lt;/span&gt;
    &lt;/button&gt;
    &lt;!-- Branding Image --&gt;
    &lt;a class="navbar-brand" href="/"&gt;
        *Dynamic page title*
    &lt;/a&gt;
&lt;/div&gt;
// ...
@yield('content')
</code></pre>

To dynamically display the page titles in our navbar-brand, we want to pass the current page's name from each specific template extending layouts.app.blade.php. We can achieve this by adding an extra blade directive:

<p>In your templates/layouts folder, create a shared Blade file named 'base.blade.php'. This file will hold the basic HTML structure and common elements that are shared across all pages. Then, add the following to the navbar-brand:</p>

<pre><code>@yield('pageTitle')</code></pre>

This line looks for a specific yield ('pageTitle') from each template extending layouts.app.blade.php, and displays its value within the navbar-brand. Now you can use this directive in your templates to easily display page titles.

Example Usage

Here is an example for your reference:

1. Create a shared Blade file ('base.blade.php') in templates/layouts folder with the following code:

   <pre><code>&lt;div class="navbar-header"&gt;
        &lt;!-- Collapsed Hamburger --&gt;
        &lt;button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#spark-navbar-collapse"&gt;
            &lt;span class="sr-only"&gt;Toggle Navigation&lt;/span&gt;
            &lt;span class="icon-bar"&gt;&lt;/span&gt;
            &lt;span class="icon-bar"&gt;&lt;/span&gt;
            &lt;span class="icon-bar"&gt;&lt;/span&gt;
        &lt;/button&gt;
        &lt;!-- Branding Image --&gt;
        &lt;a class="navbar-brand" href="/home"&gt;@yield('pageTitle')&lt;/a&gt; // Dynamically display page title here.
    &lt;/div&gt;
// ...
@yield('content')</code></pre>

2. In your templates/views folder, create a new template named 'index.blade.php' with the following code:

   <pre><code>@extends('layouts.base') // Extend the shared base layout.
@section('pageTitle', 'Home Page Title') // Set the page title for this specific page.
@yield('content')</code></pre>

3. In your browser, navigate to http://your-domain/index and you will see the 'Home Page Title' displayed in the navbar-brand. This will vary depending on the page being visited.

Conclusion

Now you can easily display dynamic page titles in your Laravel application's navbar-brand using Blade views. By following these simple steps, you can achieve consistency and a smooth user experience across all pages of your website while maintaining the flexibility to change each page's title as needed.
