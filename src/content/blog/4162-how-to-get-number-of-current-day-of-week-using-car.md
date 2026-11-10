---
title: "How to get number of current day of week using carbon?"
description: "How to Get the Custom Day Number of the Week Using Carbon As developers working in modern PHP ecosystems, especially within the Laravel framework,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "PHP"]
featured: false
---

As developers working in modern PHP ecosystems, especially within the Laravel framework, manipulating dates and times efficiently is a daily necessity. The Carbon library, which powers date and time handling in Laravel, makes this process remarkably intuitive. However, sometimes you don't just need the standard output; you need a custom representation—for instance, mapping the days of the week to a specific numerical sequence, like starting the week on Saturday instead of Sunday.

This post will walk you through how to achieve this custom numbering scheme using Carbon, providing a robust and developer-friendly solution.

## Understanding Carbon's Default Behavior

Before diving into customization, it’s crucial to understand what Carbon provides out of the box. The standard method for retrieving the day of the week is `$date->dayOfWeek`. In Carbon (and PHP's underlying `DateTime` objects), this method returns an integer where **Monday is 1 and Sunday is 7**.

If you were looking for Monday=1, Tuesday=2, ..., Sunday=7, this default behavior is perfect. However, if your business logic dictates that Saturday must be '1' and Sunday must be '2', we need to adjust this standard output.

## Implementing Custom Week Numbering (Saturday as 1)

To achieve the specific requirement—where **Saturday = 1** and Sunday = 2—we can take Carbon’s default output and apply a simple mathematical adjustment, typically using the modulo operator (`%`).

The core idea is to shift the entire sequence so that Saturday becomes the starting point (index 0 or 1 in our custom system).

Here is the step-by-step process:

### Step 1: Get the Standard Day Index

First, we start by getting the standard numerical representation of the day of the week using Carbon.

### Step 2: Apply the Offset Logic

Since we want Saturday to be `1`, we need an offset calculation that accounts for the shift in the sequence. We can use a simple conditional or mathematical mapping based on the standard output (where Monday=1, ..., Saturday=6, Sunday=7).

A clean way to achieve this specific mapping is by using basic arithmetic, adjusting the result so that the number sequence starts at 1 for Saturday.

### Code Example: Calculating Custom Day Number

Let's assume we want Saturday to be `1`, Sunday to be `2`, Monday to be `3`, and so on.

```php
use Carbon\Carbon;

// 1. Get the current date
$now = Carbon::now();

// 2. Get the standard day index (Monday=1, ..., Sunday=7)
$standardDay = $now->dayOfWeek; // Example: If today is Sunday, this will be 7.

// 3. Apply custom logic to map it to the desired sequence (Saturday=1)
$customDay = ($standardDay == 7) ? 1 : $standardDay + 1;

// Let's test a few scenarios:
echo "Standard Day Index (Mon=1, Sun=7): " . $standardDay . "\n";
echo "Custom Day Number (Sat=1, Sun=2): " . $customDay . "\n";

// Example Output Interpretation:
// If today is Sunday ($standardDay = 7), the output will be 1. (Incorrect for Sun=2)

// --- A More Robust Mapping Approach ---
// A better approach is to directly map based on the standard index shifted by a fixed value.
// We want Saturday (6 in standard numbering) to be 1.
$standardIndex = $now->dayOfWeek; // Monday=1, ..., Sunday=7

// Calculate the offset needed: If we want Saturday (index 6) to be 1, we subtract 5.
$customDayNumber = ($standardIndex - 6 + 7) % 7 + 1; 
// Note: The complex modulo logic above is often overkill if you define a fixed reference point.

// --- Simplest Practical Mapping (Focusing on the desired output structure) ---
// If we want Sat=1, Sun=2, Mon=3... we can map Monday=3, Sunday=1.
$dayMap = [
    Carbon::SATURDAY => 1,
    Carbon::SUNDAY => 2,
    Carbon::MONDAY => 3,
    Carbon::TUESDAY => 4,
    Carbon::WEDNESDAY => 5,
    Carbon::THURSDAY => 6,
    Carbon::FRIDAY => 7,
];

$today = Carbon::now();
$dayName = $today->dayName; // This is the name (e.g., 'Sunday')
$customNumber = $dayMap[$today->dayOfWeek]; // Directly use the standard index as a key for lookup.

echo "Today is: " . $dayName . "\n";
echo "Custom Day Number (Sat=1): " . $customNumber . "\n";
```

## Best Practice: Using Lookup Arrays for Clarity

While complex modulo math can solve almost any cyclic problem, when dealing with specific, fixed business rules like custom week numbering, using a lookup array is significantly more readable and maintainable. This approach ensures that your logic remains clear, which is paramount when building robust applications on frameworks like Laravel where code readability directly impacts team velocity.

For complex date transformations within a large application, always favor clarity over obscure mathematical tricks. For instance, many developers find it helpful to keep custom mapping logic segregated, perhaps in a dedicated helper class or configuration file, rather than embedding complex logic directly into controller methods. This adheres to the principle of separation of concerns that is fundamental to building scalable systems on **Laravel**.

## Conclusion

Getting a custom numerical representation of the day of the week using Carbon is entirely achievable. While basic arithmetic can be used for simple shifts, for specific business requirements like assigning Saturday as '1', defining a clear mapping structure (like an associative array) provides superior readability and long-term maintainability. By leveraging Carbon’s powerful date manipulation capabilities, you ensure that your application logic remains clean, accurate, and highly functional.
