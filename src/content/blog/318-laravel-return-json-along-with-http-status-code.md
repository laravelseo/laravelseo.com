---
title: "Laravel - Return json along with http status code"
description: "Title: Effortlessly Customizing JSON Response with HTTP Status Codes in Laravel In today's modern web development world, we often need to tailor our API..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Content"]
featured: false
---

Title: Effortlessly Customizing JSON Response with HTTP Status Codes in Laravel

<p>In today's modern web development world, we often need to tailor our API responses according to various scenarios. For instance, you may want to provide an HTTP status code other than the default 200 (OK) along with your JSON response. In this comprehensive blog post, we will guide you through how to modify the status code in Laravel and even add custom messages alongside your JSON response.</p>

<h2>Utilizing Laravel's Response Object</h2>

To return a JSON response, Laravel provides an elegant way using its Response object. A simple yet effective example is:

<pre><code>return Response::json([
    'hello' => $value
]);
</code></pre>

This code snippet will generate a JSON response with the key-value pair "hello" and its value set to $value. Additionally, by default, it will return an HTTP status code of 200 (OK). Let us now discuss how you can customize this behavior.

<h2>Setting Custom Status Codes</h2>

Apart from the default response, there are times when you might want to modify both the JSON content and the HTTP status code to convey specific information. To achieve this, Laravel allows you to set a custom status code within your Response object. Here's how that looks:

<pre><code>return Response::json([
    'hello' => $value
], 201) // Set the status code to 201
</code></pre>

In this example, the JSON response will remain identical with the only difference being the provided HTTP status code of 201 (Created). This is a perfect solution for cases like successful resource creation or when you want to present specific data.

<h2>Adding Custom Messages</h2>

In some scenarios, you might also need to include custom messages alongside your JSON response and HTTP status code. Laravel allows you to do this via the withHeader() method of the Response object. Here's an example:

<pre><code>return Response::json([
    'hello' => $value
], 201) // Set the status code to 201
->withHeader('X-Custom-Message', 'Your file was successfully uploaded') // Add a custom message header
</code></pre>

This will generate a JSON response with an HTTP status code of 201 (Created), and additionally, it will send the provided custom message as part of the HTTP headers. Now you can easily customize your API responses to fit specific use cases by combining these methods to control both content and status codes.

<h2>Conclusion</h2>

Laravel's Response object provides developers with a plethora of options for generating JSON responses tailored to meet the requirements of various situations. You can easily customize your HTTP status codes, modify JSON content, and even include custom messages alongside your data. By following these guidelines and best practices, you will create more efficient and effective APIs that efficiently convey information and fulfill their intended purpose.

To learn more about building powerful Laravel applications, visit https://laravelcompany.com/blog/.
