---
title: "Laravel- How to Remove a key from collection?"
description: "Laravel: How to Remove a Key from a Collection? Mastering Data Manipulation in PHP As developers working with Laravel, we constantly deal with manipulating..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers working with Laravel, we constantly deal with manipulating data—filtering lists, transforming objects, and restructuring collections. Understanding how to efficiently modify data structures is fundamental to building robust applications. Today, we're diving into a very practical scenario: how to filter a collection based on a condition and simultaneously remove specific keys from the resulting items.

This guide will walk you through the process using standard PHP array functions, which form the backbone of data handling in any Laravel project, whether you are dealing with raw data or Eloquent results.

## The Scenario: Filtering and Restructuring Data

Let's start with the data you provided. We have a collection of items, and we want to perform two operations:
1. Filter the collection to only include items where `is_lottery` is `false`.
2. From those filtered items, remove the `price` key.

**Initial Data:**
```php
$data = [
    [
        "id" => "3",
        "title" => "Boruto's Photo",
        "is_lottery" => 1,
        "price" => 10
    ],
    [
        "id" => "4",
        "title" => "Misuki's Photo",
        "is_lottery" => 0,
        "price" => 20
    ]
];
```

**Desired Output:**
We want the item where `is_lottery` is `0`, and we want the `price` key removed from it.
```php
[
    [
        "id" => "4",
        "title" => "Misuki's Photo",
        "is_lottery" => 0
    ]
]
```

## The Solution: Combining `array_filter` and `array_map`

To achieve this transformation, we need a two-step approach: first filter the collection, and then map over the results to remove the unwanted key. This technique is powerful and highly idiomatic in PHP development, which underpins how Laravel handles data processing.

### Step 1: Filtering the Collection with `array_filter`

We use `array_filter()` to select only the records where the condition (`is_lottery == false`) is met.

```php
$filteredData = array_filter($data, function ($item) {
    // Keep items where is_lottery is explicitly 0 (false in a boolean context)
    return $item['is_lottery'] === 0;
});
```

At this stage, `$filteredData` would look like:
```php
[
    [
        "id" => "4",
        "title" => "Misuki's Photo",
        "is_lottery" => 0,
        "price" => 20 // Still present
    ]
]
```

### Step 2: Removing the Key with `array_map`

Now that we have the correct subset of data, we use `array_map()` to iterate over this new collection and transform each entry by removing the unwanted key (`price`). We can achieve this using an anonymous function that reconstructs the array without the specified key.

```php
$finalResult = array_map(function ($item) {
    // Create a new array containing all keys except 'price'
    unset($item['price']);
    return $item;
}, $filteredData);
```

### Complete Implementation Example

Putting both steps together results in clean, efficient code:

```php
$data = [
    ["id" => "3", "title" => "Boruto's Photo", "is_lottery" => 1, "price" => 10],
    ["id" => "4", "title" => "Misuki's Photo", "is_lottery" => 0, "price" => 20]
];

//
