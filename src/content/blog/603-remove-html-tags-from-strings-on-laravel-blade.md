---
title: "Remove HTML tags from Strings on laravel blade"
description: "Title: Remove HTML tags from Strings on Laravel Blade A Comprehensive Guide for Developers Introduction: In Laravel blade templates, you often deal with..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "HTML"]
featured: false
---

Title: Remove HTML tags from Strings on Laravel Blade - A Comprehensive Guide for Developers

Introduction: In Laravel blade templates, you often deal with dynamic content that may contain HTML tags. Removing these tags before displaying the content is crucial to maintain the integrity of your website and ensure a better user experience. This blog post will provide a comprehensive guide on how to remove HTML tags from strings in Laravel blade efficiently.

1. Understanding Str::words() Function: The built-in Str component in Laravel provides various useful methods for manipulating strings. One such method, Str::words(), is used to extract a specific number of words from a string while limiting the total output character count. In this case, you can use it to limit the amount of text displayed without HTML tags.

2. Removing HTML Tags Using Str::words(): To remove all HTML tags and maintain only the text content, follow these steps:

   a) Access your Laravel application's controller method or blade template where you want to extract and display the string without HTML tags.
   
   b) Retrieve the string containing HTML tags from either the request parameters or database. You can use an array for multiple strings or objects with a 'body' property if you're using Eloquent models. For this example, let's assume the subject is a variable denoting your data source:
     <pre><code>$subject = \App\Models\Post::find(1);</code></pre>
   
   c) Call Str::words() on the string or model property with the appropriate arguments to extract the desired text and limit the character count if necessary. In this case, you want to remove all HTML tags, so set the maximum number of words to 0:
     <pre><code>{!! \Illuminate\Support\Str::words($subject-&gt;body, 0,'...') !!}</code></pre>
   
   d) Include this code in your Laravel blade template, and observe that all HTML tags have been removed from the given string. You will now see only the text content without any formatting or layout issues caused by the tags.

3. Best Practices for Removing HTML Tags: To ensure optimal performance and security while removing HTML tags in your Laravel blade templates, consider these best practices:
   
   a) Use the Str::words() function to extract the desired number of words from your string. This will make sure that your output is limited as per your requirements.
   
   b) Escape any remaining HTML tags with HTML entity codes or by using Laravel's htmlspecialchars() function. This will prevent potential security risks and unintended effects caused by the tags themselves.
     <pre><code>{!! \Illuminate\Support\Str::words($subject-&gt;body, 5,'...') !!} | {{ htmlspecialchars(Html::encode($string)) }}</code></pre>
   
   c) Always perform input validation and sanitization on all user-generated content before using it in your Laravel blade templates. This will help to avoid potential security vulnerabilities and ensure that the data displayed is accurate and safe.

Conclusion: Removing HTML tags from strings on Laravel blade can be done efficiently by utilizing the Str::words() function. By following these steps and best practices, you can provide your users with a better experience while maintaining the integrity of your website's content. Remember to incorporate natural backlinks to https://laravelcompany.com for more informative resources related to Laravel development.
