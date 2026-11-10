---
title: "Laravel Php 8.1 how to convert enum cases to array for select input"
description: "Laravel Php 8.1: How to Convert Enum Cases to Array for Select Input Working with modern PHP features, especially enums, brings significant improvements in..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "PHP", "Errors"]
featured: false
---

Working with modern PHP features, especially enums, brings significant improvements in type safety and code readability. When building dynamic forms—whether using standard HTML or powerful frameworks like FilamentPHP—we often need to transform these structured data types into formats that the UI components can easily consume. One common scenario is converting an enumeration of terms or statuses into a list of options for a `<select>` input.

This post dives into a specific challenge: how to efficiently convert PHP enum cases into the key-value array structure required by form builders, like FilamentPHP’s `Select` component, avoiding common type errors.

## The Challenge with PHP Enums and Form Options

Let's start with an example of a simple enum defining different time periods:

```php
namespace App\Enums;

enum Term : string
{
    case ONE_MONTH = '1 month';
    case THREE_MONTHS = '3 months';
    case SIX_MONTHS = '6 months';
    case TWELVE_MONTHS = '12 months';
}
```

When we attempt to extract the values using `Term::cases()` and map them, we get an array of just the string values:

```php
dd(array_map(
   fn (Term $term) => $term->value,
   Term::cases()
));
// Output: [0 => '1 month', 1 => '3 months', 2 => '6 months', 3 => '12 months']
```

The goal is to use this data to populate a select input. The documentation for components like Filament often dictates that the `options()` method expects an associative array where the *key* is the value sent to the database (or the internal ID) and the *value* is the human-readable label displayed to the user.

When you try to pass the simple array of values directly, you encounter errors because the form field expects a structure like this:

```php
// What Filament expects for options:
[
    '1 month' => '1 Month', // Key is the value, Value is the label
    '3 months' => '3 Months',
    // ... and so on
]
```

Attempting to pass the raw values leads to type errors because the function expects strings for the labels, not just the enum string values. This mismatch highlights a common hurdle when bridging strong typing systems (like PHP enums) with dynamic UI rendering in Laravel applications.

## The Solution: Explicit Mapping for Form Builders

The solution lies in explicitly
