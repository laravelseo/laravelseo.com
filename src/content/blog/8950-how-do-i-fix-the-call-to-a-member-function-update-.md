---
title: "How do I fix the \"Call to a member function update() on null\" error?"
description: "How Do I Fix the \"Call to a member function update() on null\" Error in Laravel? As a senior developer working with Laravel, you will inevitably encounter..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a senior developer working with Laravel, you will inevitably encounter errors that seem cryptic at first glance. One of the most common and frustrating errors developers face is the dreaded "Call to a member function update() on null." This error signals a fundamental mismatch between what your code expects and what the database actually provides.

This post will dive deep into why this error occurs in Laravel applications, dissect the specific problem presented in your scenario, and provide the robust, idiomatic solution using Eloquent principles.

## Understanding the Error: The Null Object Trap

The error message "Call to a member function update() on null" is not an error within the `update()` method itself, but rather an error thrown by PHP because you attempted to call a method (`update()`) on a variable that holds the value `null`.

In your specific case, the culprit lies in this line from your controller:

```php
$obj = \App\Page::find($URI);
$obj->update(request()->all()); // Error occurs here if $obj is null
```

When you use the Eloquent method `find($URI)`, if no record exists in the `pages` table matching that `$URI`, the `find()` method returns `null`. Consequently, when the code immediately tries to execute `$obj->update(...)`, PHP throws the fatal error because you cannot call a method on nothing.

The core issue is not with your input validation (which checks if the data *exists*), but with the object retrieval itself (checking if the related record *was found*).

## The Solution: Defensive Coding with Existence Checks

To fix this, we must implement defensive coding practices. Before attempting to modify a model instance, we must first ensure that the model instance actually exists. This prevents runtime crashes and makes your application much more resilient.

The correct approach is to check the result of the `find()` operation before proceeding with the update logic.

Here is how you should refactor your `update` method in your controller:

```php
public function update($URI)
{
    // 1. Validate the incoming request data first (Good practice!)
    $data = request()->validate([
        'title' => 'required',
        'URI' => 'required|min:5|max:10',
        'pageContent' => 'required'
    ]);

    // 2. Attempt to find the model instance
    $page = \App\Page::find($URI);

    // 3. *** The crucial step: Check if the model was found ***
    if (!$page) {
        // If the page doesn't exist, return an appropriate error response.
        // This prevents calling update() on null.
        return redirect()->back()->withErrors(['pageContent' => 'Page not found.']);
    }

    // 4. If the model exists, proceed with the update operation
    $page->update(request()->all());

    // 5. Redirect upon success
    return redirect('/p');
}
```

### Why This Works: Eloquent and Robustness

By adding the `if (!$page)` check, you are implementing defensive programming. You are explicitly handling the scenario where a requested resource (in this case, the Page record identified by `$URI`) cannot be found in the database.

This pattern is fundamental to building reliable applications with Laravel. When working with Eloquent models—which is what powers most of the data interaction in Laravel—always assume that database queries might fail or return null. Always check for existence before attempting mutation operations like `update()`, `save()`, or other method calls. For deeper insights into how Laravel structures these interactions, studying official documentation, such as resources available at [laravelcompany.com](https://laravelcompany.com), is highly recommended.

## Final Thoughts on Data Flow

Your form structure and request handling look fine for collecting data. The issue was purely in the logic flow *after* retrieving the model object. By ensuring that `$page` is an actual model instance before calling `$page->update()`, you ensure that your application handles non-existent records gracefully, preventing fatal errors and providing meaningful feedback to the user via redirection and error messages.

Always remember: **Validate input, find the record, check for existence, then perform the action.** This simple sequence is the backbone of robust backend development in Laravel.
