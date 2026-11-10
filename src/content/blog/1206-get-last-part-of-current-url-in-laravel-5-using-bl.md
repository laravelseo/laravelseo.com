---
title: "Get last part of current URL in Laravel 5 using Blade"
description: "Title: Effortlessly Retrieving the Last Path Segment of Current URL in Laravel 5 Using Blade Body: In modern web development, it is quite essential to work..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Content"]
featured: false
---

Title: Effortlessly Retrieving the Last Path Segment of Current URL in Laravel 5 Using Blade

Body: <p>In modern web development, it is quite essential to work with URLs and their constituents. Many times, you may need to access data based on specific parts of the URL. For instance, if your application has a news website structure where each new article will have its own unique path - www.news.com/foo/bar, how can you get the last part (bar) using Laravel 5 Blade? This blog post will teach you how to accomplish this task in a structured way.</p>

<h4>Understanding URLs and Path Segments</h4>

A URL consists of various parts that include protocol, domain name, and path. In your example, the path structure has multiple levels: www.news.com/foo/bar. To get the last part (bar), you need to understand how Laravel handles URLs. Laravel's routing system uses segments. A segment is a logical piece of a URL that can be extracted and understood as a separate entity. There are two primary methods for accessing path segments: using "Request" or "URL" classes, and leveraging the built-in Laravel helper functions.

<h4>Implementation Using Request Class</h4>

Firstly, you may utilize the Request class to get the last part of the current URL without the trailing "/". To do this, you can access the "path" attribute, which holds all segments in an array. Then, you can retrieve the last element from that array using Array helper functions like "last()", "end()", or even indexing directly with square brackets. Here's a code snippet:

<pre><code>use Illuminate\Http\Request;
//...
$request = Request::createFromGlobals();
$pathSegments = $request->path();
$lastSegment = $pathSegments[count($pathSegments) - 1]; // get the last element using count() and indexing
</code></pre>

This approach works well, but it consumes more memory as you are creating a new Request object.

<h4>Implementation Using URL Class</h4>

Another way is to create an instance of the URL class directly from the input string and access its method "path()" to get all segments. You can use "lastSegment()", "end()", or indexing, similar to the previous approach:

<pre><code>use Illuminate\Support\Facades\URL;
//...
$url = URL::create(Request::path());
$pathSegments = $url->path();
$lastSegment = $pathSegments[count($pathSegments) - 1]; // get the last element using count() and indexing
</code></pre>

This implementation is more efficient as you don't create a new object, but it might have some compatibility issues with older PHP versions.

<h4>Implementation Using Laravel Helper Functions</h4>

Lastly, you can take advantage of the built-in helper functions provided by Laravel to get your desired output. The "request()->path()" and "url()->current()" functions return the complete path based on the current request. Then, you can use the methods like "parse()", "lastSegment()", or "end()" to retrieve your specific result:

<pre><code>use Illuminate\Support\Facades\URL;
//...
$pathSegments = Request::path()->parse();
$lastSegment = $pathSegments[count($pathSegments) - 1]; // get the last element using count() and indexing
</code></pre>

<h4>Conclusion</h4>

To wrap up, you now have three different ways to fetch the last part of a URL in Laravel 5 using Blade. The best method depends on your use case, project structure, and preferences. Remember that Laravel constantly evolves; these solutions might change over time, so stay updated with its latest features and updates. Happy coding!
