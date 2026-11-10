---
title: "Laravel 5.5 - Check if string contains exact words"
description: "Title: Efficient String Comparison in Laravel 5.5 Checking for Exact Matches in a Blacklist Array Body: In this comprehensive blog post, we will discuss how..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Performance", "PHP"]
featured: false
---

Title: Efficient String Comparison in Laravel 5.5 - Checking for Exact Matches in a Blacklist Array
Body:

In this comprehensive blog post, we will discuss how to implement a more accurate method of checking strings against blacklist words using Laravel 5.5. The initial code snippet provided shows the use of `str_contains`, which searches a string for instances of any word found in an array. However, it sometimes provides false positives due to partial matches or close resemblances. To address this issue efficiently and correctly, we will explore different approaches, considering both syntax and performance.

First, let's look at the initial code snippet:
```php
$string = 'Cassandra is a clean word so it should pass the check';
$blacklistArray = ['ass','ball sack'];

$contains = str_contains($string, $blacklistArray); // true, contains bad word
```
The `str_contains()` function returns true if any of the words in the array is found within the string. This may lead to false positives since it does not check for exact matches. A potential solution would be to replace `str_contains()` with a custom function that checks for exact word matches:
```php
function containsExactWords($string, $blacklistArray) {
    foreach ($blacklistArray as $word) {
        if (stripos($string, $word) !== false) {
            return true;
        }
    }
    return false;
}
```
Using the custom function, we can refine our code to check for exact matches in blacklist words:
```php
$string = 'Cassandra is a clean word so it should pass the check';
$blacklistArray = ['ass','ball sack'];

$containsExactWords = containsExactWords($string, $blacklistArray); // false, no exact match found
```
In this version, `stripos()` is used to find the position of a word within the string. If any word from the blacklist array matches exactly, the function returns true. Since we are looking for exact matches, we can be more confident in the accuracy of our results.

However, this approach may not be efficient when working with large arrays or long strings, as it involves linear search through each element in the array. In such cases, a better solution would be to use Laravel's built-in `Str::containsWords()` function:
```php
$string = 'Cassandra is a clean word so it should pass the check';
$blacklistArray = ['ass','ball sack'];

$containsExactWords2 = Str::containsWords($string, $blacklistArray); // false, no exact match found
```
This function performs an efficient and accurate search for words in a string. It can be optimized by using regular expressions when searching through multiple arrays simultaneously or by combining them in a single array.

In summary:
- To check for exact matches of blacklist words in Laravel 5.5, use the `containsExactWords()` function (or a custom version) and the built-in `Str::containsWords()`.
- The custom function can be more suitable when searching through large arrays or long strings, while `Str::containsWords()` provides better performance for smaller datasets.
- Ensure your code is well-structured, including proper variable naming and easy-to-read syntax for future maintenance and collaboration purposes.
- Always choose the most efficient and accurate solution based on your specific requirements.

By following these best practices, you will achieve an effective and reliable method of checking strings against blacklist arrays in Laravel 5.5 applications.
