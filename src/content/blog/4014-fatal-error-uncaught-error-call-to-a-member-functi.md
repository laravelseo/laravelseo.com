---
title: "Fatal error: Uncaught Error: Call to a member function format() on null"
description: "Solving Fatal Errors: Avoiding Call to a member function format() on null in PHP Date Handling As senior developers, we often deal with data that isn't..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["PHP", "Errors"]
featured: false
---

As senior developers, we often deal with data that isn't perfectly clean. When working with APIs, databases, or external services, missing fields, null values, or unexpected data types are common hurdles. One of the most frustrating errors developers encounter is the `Fatal error: Uncaught Error: Call to a member function format() on null`.

This error doesn't tell you *what* went wrong in your application logic; it simply tells you that you attempted to call a method (in this case, `format()`) on a variable that currently holds the value `null`, which is not an object. Understanding how to prevent this "null dereference" is fundamental to writing robust and stable PHP code.

This post will dive deep into why this error occurs in date manipulation scenarios and provide a concrete, best-practice solution.

---

## Understanding the Error: Null Dereference in Action

The error `Call to a member function format() on null` occurs when your code expects a variable to be an object (specifically one with a `format()` method, like a `DateTime` object), but instead, that variable is `null`.

Let's look at the problematic line from your example:

```php
'date' => $startDate->format('d/m/Y') ?? '',
```

In this code, PHP first evaluates `$startDate`. If the preceding logic fails to create a valid `DateTime` object (because `$data->started_at` was missing), `$startDate` is assigned `null`. When the interpreter then tries to execute `$startDate->format('d/m/Y')`, it crashes because you cannot call a method on `null`.

The core issue here is that you are assuming `$startDate` will always be an object, when in reality, it might be `null`.

## The Solution: Defensive Coding with Null Checks

The solution lies in implementing **defensive programming**. Before attempting to use any object methods, you must explicitly check if the variable actually holds an object. We achieve this using simple conditional statements or the null-coalescing operator (`??`).

### Applying the Fix to Your Code

Your goal is to ensure that if `$startDate` is `null`, we don't try to format it; instead, we use a default empty string.

Here is how you can refactor your logic to safely handle missing dates:

```php
// 1. Safely attempt to create the DateTime object
$startDate = null;
if ($data->started_at) {
    try {
        $startDate = \DateTime::createFromFormat('Y-m-d H:i:s', $data->started_at);
    } catch (\Exception $e) {
        // Handle cases where the date format is invalid but data exists
        $startDate = null; 
    }
}

// 2. Safely determine the formatted output using null checks
$formattedDate = $startDate ? $startDate->format('d/m/Y') : '';
$formattedTime = $startDate ? $startDate->format('H:i:s') : '';


return (object) [
    'planId' => $data->plan_id ?? '',
    'comment' => $data->comment ?? '',
    'facilitator' => $data->facilitator ?? '',
    'date' => $formattedDate, // Use the safely calculated variable
    'time' => $formattedTime,
] : (object) [];
```

### A More Concise Approach using Ternary Operators

While the explicit `if` block above is very clear, you can often condense this logic back into a structure similar to your original attempt, but correctly nested:

```php
$startDate = null;

// Only proceed if the date string exists and we can parse it
if ($data->started_at) {
    $dateObject = \DateTime::createFromFormat('Y-m-d H:i:s', $data->started_at);
    // Check if the object creation was successful (not null)
    if ($dateObject) {
        $startDate = $dateObject;
    }
}

return (object) [
    'planId' => $data->plan_id ?? '',
    'comment' => $data->comment ?? '',
    'facilitator' => $data->facilitator ?? '',
    // Use the ternary operator to safely call format() only if $startDate is set
    'date' => $startDate ? $startDate->format('d/m/Y') : '',
    'time' => $startDate ? $startDate->format('H:i:s') : '',
] : (object) [];
```

## Best Practices for Data Handling in Laravel

When working within a framework like Laravel, this defensive approach is even more critical. If you are retrieving data from a database using Eloquent models, ensure that your model relationships handle nulls gracefully, or use methods provided by Eloquent to manage casting and defaults before processing the data in your controller or service layer. For instance, relying on Eloquent's automatic casting helps ensure that dates retrieved from the database are already in a usable `Carbon` format, simplifying this kind of operation significantly. Always prioritize checking for nulls immediately after data retrieval.

## Conclusion

The error `Call to a member function format() on null` is a classic symptom of assuming data integrity when dealing with external inputs. By adopting defensive coding practices—specifically by explicitly checking if an object exists before attempting to call its methods—you transform brittle code into robust, production-ready logic. Always assume the worst about your input data, validate it rigorously, and handle the `null` case gracefully.
