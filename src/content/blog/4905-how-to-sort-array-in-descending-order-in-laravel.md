---
title: "How to sort array in descending order in laravel"
description: "Mastering Array Sorting in PHP: How to Sort Arrays in Descending Order As developers, working with arrays is a fundamental skill. Whether you are dealing..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers, working with arrays is a fundamental skill. Whether you are dealing with raw PHP arrays or Laravel Eloquent Collections, knowing how to sort data accurately and efficiently is crucial. Many developers run into confusion when trying to achieve descending order, often misusing basic sorting functions.

If you are looking to sort an array based on a specific value (like a 'count') in descending order, relying solely on the standard `array_sort()` function might lead to unexpected results. This post will dive deep into the correct methods for achieving descending order in PHP and show you how this concept translates into effective data manipulation within the Laravel ecosystem.

## Understanding PHP Sorting Functions

The confusion often stems from the subtle differences between various PHP sorting functions. When dealing with simple, numerically indexed arrays, there are specific functions designed explicitly for ascending and descending order.

### `sort()` vs. `rsort()`

*   **`sort()`:** This function sorts an array in **ascending** order (A to Z, or smallest to largest).
*   **`rsort()`:** This function sorts the array in **descending** order (Z to A, or largest to smallest).

If your goal is specifically to get the elements with the *greater count* first, you need `rsort()`. If you use `array_sort()` on an array of numbers, it will always sort from smallest to largest. To achieve descending order immediately, simply swap the function call:

```php
<?php
$counts = [10, 5, 20, 8];

// Ascending order (default)
sort($counts);
print_r($counts); // Output: Array ( [0] => 5 [1] => 8 [2] => 10 [3] => 20 )

// Descending order using rsort()
rsort($counts);
print_r($counts); // Output: Array ( [0] => 20 [1] => 10 [2] => 8 [3] => 5 )
```

As you can see, `rsort()` correctly places the largest element first, fulfilling your requirement to get the element with the greatest count at the top.

## Sorting Complex Data: Using Custom Keys

While `rsort()` is perfect for simple arrays of values, real-world data often involves associative arrays or collections where you need to sort based on a specific property (like a 'count' column) rather than the array index. For this scenario, leveraging Laravel’s powerful collection methods is often the cleanest approach.

If you are working with an Eloquent collection—which you will frequently encounter when interacting with databases in Laravel—you use the `sortBy()` or `orderBy()` methods for robust sorting logic. This method allows you to specify exactly which attribute determines the sort order and the direction.

### Example with Laravel Collections

Imagine you have a collection of items, and you want to retrieve them sorted by their 'count' in descending order:

```php
use Illuminate\Support\Collection;

// Sample data representing an Eloquent Collection
$data = collect([
    ['name' => 'Item A', 'count' => 15],
    ['name' => 'Item B', 'count' => 30],
    ['name' => 'Item C', 'count' => 10],
]);

// Sort the collection by the 'count' attribute in descending order
$sortedData = $data->sortByDesc('count');

// Display the result
foreach ($sortedData as $item) {
    echo "Name: {$item['name']}, Count: {$item['count']}\n";
}
```

This approach is far more readable and scalable than manipulating raw PHP arrays when you are working within a framework like Laravel. This principle of using methods like `orderBy()` over native array functions is central to writing clean, maintainable code in Laravel, making your applications much easier to manage and debug, which aligns with the best practices promoted by the [Laravel Company](https://laravelcompany.com).

## Conclusion

To summarize, if you are sorting a standard PHP array of numbers in descending order, use `rsort()`. However, when working within a Laravel environment—especially with database results or Eloquent collections—it is highly recommended to utilize the framework's collection methods like `sortByDesc('key')` or `orderBy('key', 'desc')`. These methods provide a more structured and powerful way to manage complex sorting requirements, ensuring your code remains both functional and professional.
