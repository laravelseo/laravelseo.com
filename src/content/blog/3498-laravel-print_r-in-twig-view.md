---
title: "Laravel - print_r in twig view"
description: "Laravel & Twig: How to Display Variable Contents in Your Views I have a simple question I would hope you can answer: how can I print print r or at least..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "PHP", "Errors"]
featured: false
---

I have a simple question I would hope you can answer: how can I print `print_r` or at least see the contents of all defined variables in a Twig file?

As a senior developer working within the Laravel ecosystem, I frequently encounter this exact scenario. When we start separating our application into Model-View-Controller (MVC) architecture, it’s natural to wonder how the data flows and how we can inspect it during rendering. The confusion often stems from mixing the responsibilities of PHP (backend logic) and Twig (frontend presentation).

This post will walk you through the correct, idiomatic way to handle data display in Twig, explain why direct methods like `print_r` don't work as expected, and provide robust alternatives for debugging your data.

## The Separation of Concerns: Why Direct Printing Fails

The primary reason you cannot simply write `{{ $variable }}` or try to use PHP functions like `print_r()` directly within a Twig template is due to the fundamental separation of concerns in the Laravel stack.

Twig is a template engine responsible solely for rendering HTML. It operates on data passed to it from the Controller, not on executing arbitrary PHP code directly. When you pass data from your controller to the view (e.g., `$viewData`), that data is serialized into Twig's context. Twig expects variables to be outputted using its specific syntax (`{{ variable }}`).

Attempting to use raw PHP functions like `print_r()` inside a Twig file will result in errors because Twig does not execute arbitrary PHP code unless explicitly configured to do so (which is strongly discouraged for security and separation). The data you need is already available in the context; you just need to know how to iterate over it.

## Correctly Accessing and Displaying Data in Twig

To successfully display variables, you must use Twig's interpolation syntax: `{{ variable_name }}`.

### 1. Displaying Simple Variables

If you have a simple string or number passed from your controller, accessing it is straightforward:

**Controller Example (PHP):**
```php
// In your controller method
$viewData = [
    'user_name' => 'Alice',
    'age' => 30
];
return view('my-view', $viewData);
```

**Twig View Example:**
```twig
<h2>Welcome, {{ user_name }}!</h2>
<p>Your age is: {{ age }}</p>
```
This works perfectly because `$user_name` and `$age` are accessible in the Twig context.

### 2. Inspecting Complex Data (Arrays)

Your specific need involves viewing array contents. While `print_r()` is a powerful debugging tool in PHP, it belongs in the backend where you can handle errors properly. In Twig, we use control structures to iterate over arrays: loops (`for` or `foreach`) and filters.

If you want to display all items within an array, you must loop through it.

**Controller Example (PHP):**
```php
// In your controller method
$viewData = [
    'items' => ['apple', 'banana', 'cherry'],
    'user_details' => [
        'name' => 'Bob',
        'email' => 'bob@example.com'
    ]
];
return view('my-view', $viewData);
```

**Twig View Example (Displaying Array Contents):**
```twig
<h2>List of Items:</h2>
<ul>
    {% for item in items %}
        <li>{{ item }}</li>
    {% endfor %}
</ul>

<h2>User Details:</h2>
<p>Name: {{ user_details.name }}</p>
<p>Email: {{ user_details.email }}</p>
```
Notice how we use the `{% for ... %}` block to iterate over the `$items` array, which is the standard Twig way to handle collections of data.

## Debugging Best Practices

If you are truly stuck on *what* data was passed to the view—which is a common debugging hurdle—the best practice is to debug in the PHP layer before rendering. If you need to inspect an array structure for deep debugging, use `dd()` (dump and die) within your controller or a dedicated debugger context.

For instance, if you were debugging why `$viewData` was structured incorrectly, you would simply add:

```php
// In the controller
dd($viewData);
```

This immediately stops execution and displays the full structure of the array, allowing you to verify that the data being passed matches your expectations. This approach keeps your template clean, secure, and focused purely on presentation, which aligns perfectly with the principles of building robust applications with Laravel. For more advanced architectural guidance on structuring these components, exploring resources like those found on [Laravel Company](https://laravelcompany.com) is highly recommended.

## Conclusion

In summary, you don't use `print_r` inside Twig to access variables; you let the PHP layer prepare the data and pass it to Twig. Within Twig, you interact with that data using interpolation (`{{ variable }}`) for simple values and control structures (like `{% for %}`) for complex collections. By respecting the MVC pattern, you ensure your application remains maintainable, secure, and easy to debug.
