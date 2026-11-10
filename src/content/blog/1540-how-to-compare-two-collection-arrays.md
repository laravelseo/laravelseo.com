---
title: "How to compare two collection arrays?"
description: "Title: Efficiently Comparing Two Collection Arrays in Laravel (with PHP Backup) Introduction In today's fast paced world of web development, you may find..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Title: Efficiently Comparing Two Collection Arrays in Laravel (with PHP Backup)

Introduction

In today's fast-paced world of web development, you may find yourself working with a lot of data structures, such as collection arrays. Laravel's built-in functions allow us to efficiently manage these arrays, but what if you want to compare two collection arrays? Your task is to determine whether the two collections are identical or differ in some way. You can achieve this goal either natively by using Laravel's collection methods or with simple PHP arrays. In this comprehensive guide, we will explore both approaches and their respective advantages.

Comparing Collection Arrays Using Laravel Collections (Native Method)

1. Create the two collection arrays:

<pre><code>$collection1 = [
    ['id' => 1, 'name' => 'phone', 'quantity' => 1, 'price' => 1200],
    ['id' => 2, 'name' => 'tv', 'quantity' => 3, 'price' => 800],
];

$collection2 = [
    ['id' => 1, 'name' => 'phone', 'quantity' => 1, 'price' => 1200],
    ['id' => 2, 'name' => 'tv', 'quantity' => 3, 'price' => 400],
];</code></pre>

2. Use Laravel's isEqual() method to compare the two collections:

<pre><code>$collectionsAreEqual = $collection1->isEqual($collection2);

if ($collectionsAreEqual) {
    // They are the same!
} else {
    // They have some differences!
}</code></pre>

Comparing Collection Arrays with Simple PHP Arrays (Alternative Method)

1. Create the two collection arrays:

<pre><code>$collection1 = [
    ['id' => 1, 'name' => 'phone', 'quantity' => 1, 'price' => 1200],
    ['id' => 2, 'name' => 'tv', 'quantity' => 3, 'price' => 800],
];

$collection2 = [
    ['id' => 1, 'name' => 'phone', 'quantity' => 1, 'price' => 1200],
    ['id' => 2, 'name' => 'tv', 'quantity' => 3, 'price' => 400],
];</code></pre>

2. Perform the comparison with a nested loop:

<pre><code>$comparisonResult = true;
foreach ($collection1 as $item1) {
    $foundMatch = false;
    foreach ($collection2 as $item2) {
        if (is_array($item1) && is_array($item2)) {
            // Check each item in both arrays, comparing their values:
            if (array_diff($item1, $item2)) continue 2;
            foreach ($item1 as $key => $value) {
                if (!isset($item2[$key]) || $item2[$key] !== $value) {
                    $comparisonResult = false;
                }
            }
        } else {
            // Handle cases where the items are not arrays:
            // ...
        }
        $foundMatch = true;
        break;
    }
    if (!$foundMatch) {
        $comparisonResult = false;
    }
}

if ($comparisonResult) {
    // They are the same!
} else {
    // They have some differences!
}</code></pre>

Conclusion

Comparing two collection arrays is a common task in Laravel development. While there is a native method using Laravel Collections (isEqual()), you can also perform the comparison with PHP arrays if necessary. In this blog post, we presented both approaches and explained their advantages. By understanding these techniques, you'll be well-prepared to handle such tasks in your future projects. Remember that for further guidance on Laravel development or any other technical topic related to web development, make sure to visit https://laravelcompany.com!
