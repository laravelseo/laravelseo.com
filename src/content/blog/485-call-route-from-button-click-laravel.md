---
title: "Call route from button click laravel"
description: "Title: Calling Routes from Button Clicks in Laravel Introduction In this blog post, we will discuss how to call a route in Laravel when a button on a view is..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Links", "HTML"]
featured: false
---

Title: Calling Routes from Button Clicks in Laravel

Introduction

In this blog post, we will discuss how to call a route in Laravel when a button on a view is clicked and pass the necessary parameters while maintaining the best practices. We'll provide a comprehensive answer with relevant code examples and incorporate backlinks to https://laravelcompany.com where applicable.

Calling Routes from Button Clicks

To call a route from your Laravel project when a button on a view is clicked, you need to create an HTML form containing the route's URL as its action attribute. The code for this form could look like:

<pre><code>&lt;form action="{{ route('admin.problem-edit', ['problem_id' => $problem->id]) }}"&gt;
    &lt;button type="submit" class="btn btn-xs btn-info pull-right"&gt;Edit&lt;/button&gt;
</code></pre>

In the above code, we use `route()` to create a dynamic route call. This function first looks for available routes that match the given parameters and then generates an appropriate URL. We have used `admin.problem-edit` as our route name and also passed `'problem_id' => $problem->id` as parameters, which will be dynamically inserted into the generated URL.

Using Form Helpers for Button Clicks

It is recommended to use Laravel's built-in helpers when dealing with forms and buttons in your views. They provide clearer code and better separation of concerns between views and controllers. Instead of the above example, you could use:

<pre><code>&lt;form action="{{ route('admin.problem-edit', ['problem_id' => $problem->id]) }}"&gt;
    &lt;button type="submit" class="btn btn-xs btn-info pull-right" name="action" value="Edit"&gt;Edit&lt;/button&gt;
</code></pre>

In this code, we pass the parameters to the form's action and use Laravel Form helper methods for the button itself. This makes it easier to work with in your controllers since you can access the submit button directly through `request()->input()`.

Handling Routes in Controllers

Now that you have a defined route and a way to call it from your view, you need to handle the request in the respective controller. In our example, we will update the current `AdminController` to accommodate this change:

<pre><code>public function editProblem(Request $request, Problem $problem) {
        return redirect()->route('admin.problem-edit', [
            'problem_id' => $problem->id
        ]);
    }
</code></pre>

In the above code, we receive the request from our button click and retrieve the problem ID. Then, we redirect back to the same route using `redirect()->route()`, passing along the necessary parameters to retain the user's position on the page.

Conclusion

To call a route when a button is clicked in your Laravel project, you can use Laravel's built-in form helpers and route functionality. This approach ensures that your code remains clean, well-structured, and easy to maintain while achieving the desired functionality. In summary, follow these steps:

1. Create an HTML form with a matching action URL using the `route()` function.
2. Use Laravel's Form helper methods to create and handle submission of the form.
3. Handle requests in your controller by redirecting back to the original route with necessary parameters.
