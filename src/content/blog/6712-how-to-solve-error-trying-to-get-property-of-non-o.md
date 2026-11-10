---
title: "How to solve Error \"Trying to get property of non-object\" on Laravel"
description: "How to Solve the \"Trying to get property of non object\" Error in Laravel As a senior developer working with the Laravel ecosystem, you’ve encountered..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP", "Errors"]
featured: false
---

As a senior developer working with the Laravel ecosystem, you’ve encountered countless debugging sessions where the application throws the frustrating error: `Trying to get property of non-object`. This error is a classic symptom in PHP development, indicating that you are attempting to access a property (using the object operator `->`) on a variable that currently holds `null` instead of an actual object.

When dealing with Eloquent models and database queries in Laravel, this usually points to an issue with how data is being fetched or loaded, rather than a simple syntax mistake. Today, we will dive deep into why this happens in a Laravel context and provide robust solutions, focusing on best practices like Eager Loading.

---

## Understanding the Root Cause: Why Does This Happen?

The error occurs precisely at the line where you attempt to access nested properties, such as `$employee->Profile->date_of_leaving`. If any part of this chain—for instance, `$employee` itself, or the related `$employee->Profile` object—is `null`, PHP throws this fatal error because it cannot find a property on nothing.

In the context of Laravel Eloquent, this typically happens for one of these reasons:

1.  **Missing Relationship Data:** You have loaded a collection of models (e.g., `$employees`), but the related model (e.g., `Profile`) was not loaded or does not exist in the database record for that specific employee.
2.  **Failed Query:** The initial query that fetched the `$employees` might have returned no results, or the mechanism used to retrieve a single item failed before the data could be populated.
3.  **Lazy Loading Issues:** If you are accessing relationships without explicitly loading them, Eloquent defaults to lazy loading. If the underlying relationship doesn't exist, accessing it results in `null`.

Let’s look at your specific code snippet:

```php
$status = ($employee->Profile->date_of_leaving == null) ? '<span class="label label-success">active</span>' : '<span class="label label-danger">in-active</span>';
```

If `$employee` is `null`, or if `$employee->Profile` returns `null`, the code crashes immediately.

---

## Solution 1: Defensive Coding (Immediate Fixes)

The quickest way to prevent the application from crashing is to implement defensive coding by checking for null values before attempting property access. This ensures your code remains resilient even when dealing with incomplete data.

We can use the null-coalescing operator (`??`) or explicit `if` checks:

**Improved Code Example (Defensive Approach):**

```php
foreach ($employees as $employee) {
    // Check if $employee exists before proceeding
    if (!$employee) {
        continue; // Skip this iteration if the employee object is null
    }

    // Safely access nested properties using null-coalescing
    $dateOfLeaving = $employee->Profile->date_of_leaving ?? null;

    $status = ($dateOfLeaving == null) ? '<span class="label label-success">active</span>' : '<span class="label label-danger">in-active</span>';

    // ... rest of your logic
}
```

This approach ensures that if `$employee` or `$employee->Profile` is missing, the script gracefully handles it instead of throwing an error.

---

## Solution 2: The Laravel Best Practice – Eager Loading

While defensive coding fixes the immediate crash, the most efficient way to handle related data in Laravel is through **Eager Loading**. This practice ensures that when you fetch your main models, you also load their related relationships in a single, optimized database query. This solves the underlying problem by guaranteeing that the data objects exist *before* you start iterating.

Instead of loading employees one by one and then potentially hitting the database for each profile (an N+1 problem), you should instruct Eloquent to load the necessary relations upfront.

**Example of Eager Loading:**

If your `Employee` model has a relationship defined with `Profile`, you modify your query like this:

```php
// Fetch employees and eager load the 'Profile' relationship in one go
$employees = Employee::with('Profile')->get();

foreach ($employees as $employee) {
    // Because we used ->with('Profile'), $employee->Profile is guaranteed to be an object (or null if no profile exists)
    $dateOfLeaving = $employee->Profile->date_of_leaving ?? null; 
    
    // ... rest of your logic remains clean and safe
}
```

By using `with('Profile')`, you delegate the responsibility of loading related data to Eloquent, making your code cleaner, faster, and fully aligned with how Laravel is designed to manage database relationships. This principle of efficient data retrieval is central to building scalable applications on Laravel, as demonstrated by principles found in frameworks like [Laravel Company](https://laravelcompany.com).

## Conclusion

The "Trying to get property of non-object" error is a signal that your application logic is encountering unexpected data states. While defensive coding provides an immediate patch for stability, adopting Eager Loading is the superior, long-term solution. By ensuring all necessary Eloquent relationships are loaded efficiently, you prevent these errors from occurring and build more robust, performant Laravel applications. Always prioritize loading related data upfront to keep your code clean and efficient.
