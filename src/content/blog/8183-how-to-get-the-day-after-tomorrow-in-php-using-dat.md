---
title: "How to get the day after tomorrow in PHP using DateTime?"
description: "Mastering Date Arithmetic in PHP: Getting the Day After Tomorrow with DateTime As a senior developer, I often find myself dealing with date and time..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP", "Errors"]
featured: false
---

As a senior developer, I often find myself dealing with date and time manipulation when building dynamic queries or scheduling tasks. Working with `DateTime` objects is fundamental in PHP, but understanding how to correctly increment dates—especially across boundaries like "tomorrow" and "the day after tomorrow"—is crucial for writing robust code.

The scenario you presented is a very common hurdle: trying to use string concatenation within the `DateTime` constructor (e.g., `'tomorrow + one'`) instead of leveraging the proper object-oriented methods provided by PHP. Let’s dive into how to correctly calculate future dates and apply this knowledge directly to your Eloquent query example.

## The Problem with String Manipulation in DateTime

Your initial attempt:

```php
$rides = Ride::where('date', '>=', new \DateTime('today'))
  ->where('date', '<=', new \DateTime('tomorrow + one')) // This fails
  ->get();
```

The reason this approach doesn't work is that the `\DateTime` constructor expects a valid date string (like `'2023-10-27'`), not an arbitrary mathematical expression. Trying to inject arithmetic directly into the string causes PHP to interpret it as a literal string, resulting in an invalid `DateTime` object or an error when used in the query context.

In professional development, especially when dealing with frameworks like Laravel where Eloquent relies on accurate date comparisons, precision is paramount. We must use the built-in methods provided by the `DateTime` class for all date manipulation.

## The Correct Approach: Using `modify()` and `addDays()`

The correct way to move forward or backward in time using `DateTime` is by calling its dedicated methods. For adding days, the `addDays()` method is the cleanest and most readable solution.

To find "the day after tomorrow," we need to calculate a date that is two days from the current moment. We can achieve this by starting with today and adding two days.

Here is the corrected logic:

```php
// 1. Start with the current date
$today = new \DateTime('today');

// 2. Calculate tomorrow (add 1 day)
$tomorrow = clone $today; // Use clone to avoid modifying the original if needed elsewhere, though not strictly necessary here
$tomorrow->modify('+1 day');

// 3. Calculate the day after tomorrow (add 2 days from today, or 1 day from tomorrow)
$dayAfterTomorrow = clone $today;
$dayAfterTomorrow->modify('+2 days');

// Alternatively, calculating it sequentially is often clearer:
$tomorrow = new \DateTime('tomorrow'); // If you are using a system that supports 'tomorrow' literally (like some specific PHP environments), or by setting the date explicitly.
                                     // The most robust way is still relative to 'today'.

$dayAfterTomorrow = clone $tomorrow;
$dayAfterTomorrow->modify('+1 day');
```

### Implementing the Solution in Your Query

For your specific goal—finding records between tomorrow and the day after tomorrow—we can calculate both boundaries relative to `new \DateTime('today')`:

```php
// Calculate the start date (Tomorrow)
$startDate = new \DateTime('today');
$startDate->modify('+1 day'); // This is Tomorrow

// Calculate the end date (Day After Tomorrow)
$endDate = new \DateTime('today');
$endDate->modify('+2 days'); // This is the Day After Tomorrow

// Apply the dates to your Eloquent query
$rides = Ride::where('date', '>=', $startDate)
             ->where('date', '<=', $endDate)
             ->get();
```

This approach ensures that both boundary dates are correctly formatted `DateTime` objects, which PDO and Laravel can handle seamlessly for database comparisons. This focus on accurate object manipulation is a core principle of building reliable applications, much like the principles guiding development at [laravelcompany.com](https://laravelcompany.com).

## Conclusion

Mastering date arithmetic in PHP requires moving away from treating `DateTime` objects as simple strings and embracing their powerful methods like `modify()` and `addDays()`. By explicitly calculating future dates step-by-step, you ensure your database queries are accurate, predictable, and reliable. Always favor object methods over string manipulation when dealing with temporal data to keep your code clean and maintainable.
