---
title: "how to convert array of objects to key value pairs in php"
description: "How to Convert Array of Objects/Arrays to Key Value Pairs in PHP: Fixing Common Errors As a senior developer, I frequently encounter situations where we need..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Technical SEO", "PHP", "Errors"]
featured: false
---

As a senior developer, I frequently encounter situations where we need to transform structured data—like an array of objects or associative arrays—into a simpler key-value map for easier access and processing. This is a fundamental task in application development, whether you are building a backend API, processing data from a database, or handling configuration settings.

The error you encountered stems from a very common conceptual misunderstanding in PHP: confusing an array structure with an object structure during iteration. Let's break down your specific scenario, diagnose the error, and show you the most efficient ways to achieve this conversion.

## Diagnosing the Error: Object vs. Array Access

You are attempting to iterate over an array where each element is itself an associative array (or what you intended to be an object). Your controller code looked like this:

```php
// SettingController.php
foreach ($currency_list as $currency) {
    $result[$currency->code] = $currency->name; // <-- Error occurs here!
}
```

The error `Trying to get property 'code' of non-object` happens because `$currency` inside the loop is an **array**, not an object. In PHP, you access elements within an array using square brackets (`[]`), whereas accessing properties on an object uses the arrow operator (`->`).

When `$currency` is an array like `['code' => 'AED', 'name' => 'United Arab Emirates Dirham']`, trying to use `$currency->code` fails because arrays do not possess properties accessed via the arrow operator.

## Solution 1: The Direct Fix (Correcting the Iteration)

The simplest fix is to treat `$currency` as an array and access its elements using array syntax (`[]`). This resolves the `E_NOTICE` error immediately.

Here is the corrected version of your controller logic:

```php
public function index()
{
    $setting = new Setting();
    $currency_list = $setting->currency_info();

    $result = [];
    foreach ($currency_list as $currency) {
        // Correct way: Access array elements using [] notation
        $result[$currency['code']] = $currency['name'];
    }

    return $result;
}
```

This code now executes successfully, producing the desired key-value map. However, while this works perfectly, it is often verbose and less efficient for complex transformations.

## Solution 2: Modern PHP Techniques for Data Transformation

As a senior developer, I always advocate for using more functional and modern PHP methods when dealing with array manipulation. Instead of manually looping, we can leverage built-in functions to achieve the same result in a single, highly readable line. This approach aligns well with the principles of clean code favored by frameworks like Laravel, where data transformations are common.

### Method A: Using `array_column()` (For simple mapping)

If you want to map one array onto another based on specific keys, `array_column()` is extremely useful. While it doesn't directly produce a key-value pair structure, it helps in extracting the necessary data cleanly.

### Method B: Using `array_reduce()` or `collect()` (For robust transformation)

For converting an entire list of records into a single associative array, methods like `array_reduce` or using Laravel’s powerful Collection facade (`collect()`) are superior. They allow you to define exactly how the new structure should be built, making the code more declarative and less prone to manual indexing errors.

Here is how you could achieve the transformation using the modern **Laravel Collections** approach:

```php
use Illuminate\Support\Collection;

public function index()
{
    $setting = new Setting();
    $currency_list = $setting->currency_info();

    // 1. Convert the array to a Laravel Collection
    $result = collect($currency_list)->keyBy('code')->mapWithKeys(function ($item) {
        return [$item['code'] => $item['name']];
    })->toArray();

    return $result;
}
```

This approach is far more scalable. By using `keyBy('code')`, we instantly group all entries by the currency code, and then we map those results to create the final key-value structure. This pattern demonstrates how leveraging framework tools can abstract away tedious looping logic, which is a core concept in building robust applications on platforms like Laravel.

## Conclusion

The fundamental takeaway is that data types matter deeply in PHP. Always inspect what you are iterating over—is it an object (`->`) or an array (`[]`)? When dealing with arrays of records, avoid manual loops for simple transformations if possible. Instead, embrace functional methods like those found in the Laravel Collections to write code that is not only correct but also highly readable and maintainable. For more advanced data handling patterns, exploring resources on robust data management, perhaps found through documentation on sites like https://laravelcompany.com, will further enhance your skills.
