---
title: "Laravel 5.0 blade template and count() conditions"
description: "Title: Mastering Laravel Template Count Conditions: A Comprehensive Guide for Newbies Body: This blog post will discuss how to count specific tasks in a..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Content", "Performance"]
featured: false
---

Title: Mastering Laravel Template Count Conditions: A Comprehensive Guide for Newbies

Body:
<p>This blog post will discuss how to count specific tasks in a Laravel 5.0 application using the Blade template engine effectively. We'll show you how to handle situations where the data is filtered before rendering, and provide some best practices for clean code and performance optimization.</p>

<p><strong>First Things First: Understanding Collections and Filtering</strong></p>

Before we dive into counting tasks, let's examine collections. Laravel uses collections to manipulate arrays of data in a more efficient way than traditional PHP methods. We can use the 'map', 'each', 'filter', or other collection functions to perform various operations on our data sets. In this case, we want to group and count completed tasks and in-progress tasks from all tasks.

<p><strong>Approach 1: Count Completed Tasks with a Custom Collection</strong></p>

To begin, let's create a custom collection that allows us to filter the tasks by their status. We can add this function to our Application class:

<pre><code>public static function countTasksByStatus($tasks) {
    $completed = new Collection();
    $inprogress = new Collection();
    foreach ($tasks as $task) {
        if (Task::$task->completed == 100) {
            // completed tasks - we can use the filter() method directly on the collection to return only those with a status of 100% (completed).
            $completed = $completed->merge($tasks-&gt;where('completed', 100));
        } else {
            // in progress tasks - we can use the same technique but filter for not completed.
            $inprogress = $inprogress->merge($tasks-&gt;whereNotIn('completed', [0, 100]));
        }
    }
    return $completed-&gt;count() . ' (Completed) / ' . $inprogress-&gt;count() . ' (In Progress);
}
</code></pre>

And in your controller, pass the custom collection function as a parameter to the view:

<pre><code>public function index() {
    $tasks = Task::All();
    return view('pages.projects', compact('tasks'), ['completed' => static::countTasksByStatus($tasks)]);
}  
</code></pre>

In your Blade template, call the custom collection function using Blade syntax:

<pre><code>{{ countTasksByStatus(tasks) }}
</code></pre>

This approach ensures that we are counting completed and in-progress tasks accurately based on their status.

<p><strong>Approach 2: Count Tasks with Ternary Operator</strong></p>

If you want to make the count shorter, you can use the ternary operator instead of the custom function:

<pre><code>{{ (count($tasks-&gt;where('completed', 100))) . ' (Completed) / (' . (count($tasks-&gt;whereNotIn('completed', [0, 100]))) . ') (In Progress); }}
</code></pre>

This code block will create a comma-separated string showing the counts for completed and in-progress tasks.

<p><strong>Conclusion and Best Practices</strong></p>

Using these techniques, you can easily count and display the desired information from your data set in Laravel applications. However, ensure that you follow best practices, such as:

1. Ensure that your Eloquent models are named appropriately, with singular class names (Task) and plural table names (tasks).
2. Use appropriate collection methods to manipulate and filter your tasks effectively.
3. Create custom helper functions for common computations like counting tasks based on status.
4. Avoid using direct database calls in the view when possible; instead, utilize Eloquent models or QueryBuilder methods.
5. Maintain clean code structure, following Laravel's conventions and best practices.

By following these guidelines, you will be able to efficiently and effectively count tasks based on their status in your Laravel application.
