---
title: "Check if String starts with string"
description: "Mastering String Prefixes in PHP: How to Check if a String Starts With Another As developers, we spend a significant amount of time dealing with data..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["PHP", "Errors"]
featured: false
---

As developers, we spend a significant amount of time dealing with data manipulation, especially when handling external data like URLs, file paths, or API responses. A common and crucial operation is checking whether one string begins with another. When building robust APIs, ensuring that URL prefixes are correctly handled prevents broken links, security vulnerabilities, and poor user experience—exactly the kind of bug you are facing!

This post will guide you through the most efficient and idiomatic ways to perform this check in PHP, directly solving the challenge you're encountering with your profile picture URLs.

## The Problem: Prefix Matching in API Development

You are dealing with a scenario where external URLs (like Facebook image links) are being prepended with internal base URLs. If the logic for determining *where* to prepend the URL is flawed, you end up with malformed addresses like `https://base.url/https://facebook.url`, which obviously results in broken images.

Your initial attempt using `substr()` was on the right track, but it became overly complex and error-prone when dealing with variable-length strings. The key to solving this efficiently lies in leveraging PHP's built-in string functions designed specifically for prefix matching.

## Solution 1: The Modern Approach – Using `str_starts_with()` (PHP 8+)

For modern PHP development, the cleanest and most readable solution is to use the dedicated function introduced in PHP 8.0: `str_starts_with()`. This function explicitly checks if a string begins with a specified prefix, making your intent crystal clear.

Here is how you would refactor your logic for checking if a URL starts with a known domain prefix:

```php
<?php

class ProfilePictureService
{
    public function getProfilePicAttribute(string $value): string
    {
        $facebookPrefix = "https://scontent.xx.fbcdn.net";
        $baseDomain = env('VDT_DOMAIN'); // Assume this is set in your .env file

        // Check if the incoming value already starts with the known Facebook prefix
        if (str_starts_with($value, $facebookPrefix)) {
            // If it does, return the original URL as is. No modification needed.
            return $value;
        }

        // Otherwise, construct the new path using your application's base domain
        return 'https://' . $baseDomain . '/uploads/profile_pic/' . $value;
    }
}
```

**Why this works:** This method is direct. It avoids manual length calculations (`strlen()`) and complex comparisons, resulting in code that is less prone to off-by-one errors and easier for other developers (and future you!) to maintain.

## Solution 2: The Compatibility Approach – Using `substr()`

If you are working on a legacy system or need compatibility with older PHP versions (pre-8.0), the classic way to achieve this is by using the `substr()` function, which you were attempting. However, we can simplify and refine your original logic for better clarity:

```php
<?php

class ProfilePictureServiceLegacy
{
    public function getProfilePicAttribute(string $value): string
    {
        $fbUrlPrefix = "https://scontent.xx.fbcdn.net";
        $baseDomain = env('VDT_DOMAIN');

        // Check if the input string starts with the desired prefix length
        if (str_starts_with($value, $fbUrlPrefix)) {
            return $value; // It already has the correct structure
        }

        // If not, append the path segment
        return 'https://' . $baseDomain . '/uploads/profile_pic/' . $value;
    }
}
```

Notice how in both solutions, we focus the comparison *only* on the required prefix. By using a dedicated function like `str_starts_with()`, you are building more resilient code—a core principle when developing applications using frameworks like Laravel, where clean data handling is paramount, much like when structuring your Eloquent models on **laravelcompany.com**.

## Conclusion: Clean Code for Robust APIs

Debugging API issues often boils down to ensuring your input validation and string manipulation logic is flawless. By switching from manual length checks to built-in prefix functions like `str_starts_with()`, you make your code cleaner, more readable, and significantly less error-prone. Always favor modern PHP features when available, as they provide the most expressive tools for solving complex development challenges. Happy coding!
