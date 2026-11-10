---
title: "Laravel href with POST"
description: "Mastering HTTP Methods in Laravel: Why href Fails for State Changes (and How to Use POST Correctly) As senior developers working within the Laravel..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "HTML"]
featured: false
---

As senior developers working within the Laravel ecosystem, we often deal with routing and form submissions. A common point of confusion arises when trying to use standard HTML elements like `<a>` tags to trigger state-changing actions (like deleting or updating records), which inherently require the `POST` method.

The issue you are encountering—where a link directs to a route expecting a `POST` method but Laravel resolves it as a `GET`, resulting in a `MethodNotAllowedHttpException`—stems from a fundamental misunderstanding of how HTTP methods map to HTML tags and routing definitions.

This post will break down why your current approach fails, explain the correct way to handle form submissions in Laravel, and provide robust, modern solutions for performing actions on your application.

***

## The Core Conflict: `GET` vs. `POST`

The root of the problem lies in the nature of the HTML anchor tag (`<a>`). By design, an `<a>` tag is used exclusively for navigation; it tells the browser to request a new resource from the server via a `GET` request.

When you write:
```html
<a href="/products/delete?id=10">Delete Item</a>
```
The browser sends an HTTP `GET` request to that URL. Even if you try to configure your route as `Route::post()`, the browser will naturally send a `GET` request unless explicitly told otherwise via form submission rules or JavaScript.

In RESTful API design, we adhere to specific conventions:
*   **`GET`**: Retrieve data (read operation).
*   **`POST`**: Submit new data to be processed (create operation).
*   **`PUT`/`PATCH`**: Update existing data (update operation).
*   **`DELETE`**: Remove data (delete operation).

Since deleting a record is an action that *changes* the state of the server, it should use `DELETE`. However, if you are using older conventions or need to submit complex data payloads, the standard mechanism for this is the HTML `<form>` element.

## The Correct Approach: Using HTML Forms for Data Submission

To successfully trigger a `POST` request in Laravel and send data to your controller, you must use an HTML `<form>` tag. This explicitly signals to the browser that the intent is to submit data, not just navigate.

Here is how you correctly structure the link to perform a deletion using a POST request:

**1. Update Your Blade View:** Instead of relying solely on `href`, wrap your action in a form.

```blade
@foreach($products as $product)
    <td>
        {{-- Use a form to handle the POST request --}}
        <form method="POST" action="{{ route('delete', $product->id) }}">
            {{-- CSRF Token is essential for security in Laravel --}}
            @csrf
