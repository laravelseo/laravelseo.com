---
title: "Removing html tags in Laravel blade"
description: "Stripping HTML Tags from Database Strings in Laravel: A Developer's Guide Dealing with data persistence, especially when mixing plain text and formatted..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "HTML", "PHP"]
featured: false
---

Dealing with data persistence, especially when mixing plain text and formatted content, is a common hurdle in web development. When you retrieve a string from a database that contains HTML tags, the goal is usually one of two things: either to safely display it (which requires escaping) or to strip the tags entirely to get clean text.

The issue you are facing—where functions like `htmlspecialchars()` only escape characters (`&lt;`, `&gt;`) rather than removing the actual tags (`<p>`)—is fundamental to how HTML and string manipulation work in PHP. This guide will walk you through the proper methods for effectively removing HTML tags from your database strings within a Laravel environment, focusing on security and best practices.

## Why Simple Escaping Isn't Enough

When you use `htmlspecialchars($string, ENT_QUOTES, 'UTF-8')`, you are performing **escaping**. This function converts characters that have special meaning in HTML into their entity equivalents. For example, if your database holds `<p>Test</p>`, escaping it results in `&lt;p&gt;Test&lt;/p&gt;`.

This is crucial for security; it prevents the browser from interpreting the string as actual HTML, mitigating Cross-Site Scripting (XSS) attacks. However, this process *preserves* the content merely by changing the characters. It does not perform the action of **removing** the tags themselves. To achieve true removal, we need a different tool.

## Method 1: Using Regular Expressions for Tag Removal

For simple, known patterns, Regular Expressions (Regex) are a powerful and efficient approach to stripping unwanted characters from a string. This method is fast for basic cleanup tasks.

You can use PHP's `preg_replace` function to find and replace any sequence that matches the pattern of an HTML tag (`<...>`).

Here is how you would strip all HTML tags from your variable:

```php
$dirtyString = "<p>Test 1</p> This is some content.";

// Regex explanation: /<.*?>/ finds anything starting with <, followed by any characters (non-greedily), until the next >
$cleanString = preg_replace('/<[^>]*>/', '', $dirtyString);

echo $cleanString; // Output: Test 1 This is some content.
```

**Explanation:**
The pattern `/<[^>]*>/` targets anything that starts with `<` and ends with `>`, consuming all characters in between. By replacing these matches with an empty string (`''`), we effectively delete the tags.

While this method works well for simple scenarios, be cautious: Regex can become overly complex if you need to handle nested or malformed HTML structures.

## Method 2: The Robust Approach – Using HTML Purifier

For any application handling user-submitted content where the data might contain rich text (like paragraphs, bold tags, etc.), relying solely on regex is risky. Malformed or complex HTML can easily lead to security vulnerabilities if not handled perfectly.

The industry best practice for sanitizing untrusted HTML input in PHP applications, especially within a framework like Laravel, is to use a dedicated library such as **HTML Purifier**.

HTML Purifier parses the HTML string into an abstract syntax tree and allows you to explicitly whitelist or strip out dangerous tags and attributes before rendering. This provides much greater control and security than simple string replacement. When working with data flowing through Laravel, ensuring that your input is safe is paramount, aligning with the security focus promoted by resources like those found at [laravelcompany.com](https://laravelcompany.com).

### Implementation Example (Conceptual)

Instead of trying to strip tags manually from a raw database string, you should sanitize the input immediately upon retrieval or before storage if possible.

```php
// Assuming you are using an HTML Purifier implementation:
require_once 'HTMLPurifier.php'; // Adjust path as necessary

$config = HTMLPurifier_Config::createDefault();
$purifier = new HTMLPurifier($config);

$dirtyString = "<p>Test 1</p>";

// Purify the string to remove all tags safely
$cleanHtml = $purifier->purify($dirtyString);

echo $cleanHtml; // Output: Test 1 (or whatever content remains after filtering)
```

## Conclusion

To summarize, when you encounter HTML tags in a database field within a Laravel application:

1.  **For simple text cleanup:** Use **Regular Expressions** (`preg_replace`) for fast, direct removal of known tag structures.
2.  **For security and rich content handling (Recommended):** Implement a dedicated library like **HTML Purifier**. This approach ensures that you are not just removing characters but actively sanitizing the structure, protecting your application from potential injection vulnerabilities.

Always prioritize input sanitization to maintain a secure and robust application architecture.
