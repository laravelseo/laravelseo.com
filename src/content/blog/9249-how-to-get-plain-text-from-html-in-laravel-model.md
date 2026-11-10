---
title: "How to get plain text from html in laravel model?"
description: "How to Get Plain Text from HTML in a Laravel Model: A Developer's Guide As developers working with rich text editors like TinyMCE, we frequently encounter a..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "HTML", "PHP"]
featured: false
---

As developers working with rich text editors like TinyMCE, we frequently encounter a common data challenge: storing formatted HTML within a database field, but needing to perform logical operations (like counting words or searching) on the raw textual content. The issue you are facing—getting empty results when trying to extract words from the `description` field—stems from trying to use complex regular expressions to parse nested HTML structure directly, which is brittle and often fails when dealing with varied formatting.

This post will walk you through the most robust and efficient ways to convert rich HTML content into clean, plain text within your Laravel Eloquent model, ensuring your data processing is accurate and scalable.

## The Challenge: HTML vs. Plain Text

When a user inputs text via a WYSIWYG editor, the resulting database entry is typically a string containing HTML tags (like `<strong>`, `<p>`, `<br>`).

Your current attempt to use a custom function with `preg_match` is hitting a wall because parsing complex nested HTML structures with simple regex is notoriously difficult. The HTML structure itself interferes with simple word boundary matching, leading to incorrect counts or empty results.

The goal is not just to count words; the primary goal must be to first *sanitize* the input by removing all the markup before any other processing occurs.

## Solution 1: The Standard and Safest Approach – `strip_tags()`

The most straightforward and reliable method in PHP to remove all HTML and XML tags from a string is using the built-in function `strip_tags()`. This function iterates through the string and removes any tag specified (or all tags if no argument is provided), leaving only the pure textual content.

We can integrate this directly into our Eloquent model to ensure that whenever we retrieve the description, it is already in a clean state.

Here is how you would implement this within your Model:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    /**
     * Get the plain text description by stripping all HTML tags.
     *
     * @return string
     */
    public function getPlainTextDescription(): string
    {
        if (empty($this->description)) {
            return '';
        }
        // Use strip_tags() to remove all HTML and PHP tags, leaving only the text.
        $plainText = strip_tags($this->description);

        // Optional: Clean up excessive whitespace introduced by removing tags (e.g., multiple newlines)
        $plainText = trim(preg_replace('/\s+/', ' ', $plainText));

        return $plainText;
    }

    // You can also use an accessor for easy access:
    public function getShortDescriptionAttribute()
    {
        // We now operate on the already cleaned text
        return $this->getPlainTextDescription();
    }
}
```

### Why this works better:

Using `strip_tags()` delegates the complex task of parsing HTML structure to PHP's optimized engine. It reliably removes all tags, leaving you with a pure string of text that is ready for word counting or searching, eliminating the complexity and fragility of custom regex patterns. This approach aligns perfectly with Laravel’s philosophy of keeping business logic clean and relying on robust framework features.

## Solution 2: Refactoring Word Counting Logic

Now that we have clean plain text, we can simplify your word counting function significantly. Instead of trying to extract words from messy HTML, we apply the logic directly to the clean string.

If you still need a function to get the first N words, you can update it to work on the sanitized output:

```php
/**
 * Extracts the first $count words from a plain text string.
 *
 * @param string $text The plain text content.
 * @param int $count The number of words to retrieve.
 * @return string
 */
function getWordsFromText(string $text, int $count = 30): string
{
    // 1. Ensure the input is a single string and remove any remaining messy whitespace.
    $cleanText = trim(preg_replace('/\s+/', ' ', $text));

    // 2. Use a simpler regex to find sequences of word characters separated by spaces.
    // This finds sequences that look like words, ignoring the complex HTML structure entirely.
    if (empty($cleanText)) {
        return '';
    }

    // Find all words in the text
    $words = preg_split('/\s+/', $cleanText, -1, PREG_SPLIT_NO_EMPTY);

    // Return the first $count words, joined back together with a space.
    return implode(' ', array_slice($words, 0, $count));
}
```

By separating the concerns—stripping HTML in the model and performing text manipulation in a dedicated function—you create a highly maintainable codebase. This separation is key to building robust applications on top of Laravel.

## Conclusion

The best practice for handling rich text data in Laravel is always to sanitize the input as early as possible. By leveraging native PHP functions like `strip_tags()` within your Eloquent model, you transform messy HTML into clean plain text efficiently. This simplifies subsequent operations, such as word counting or searching, making your application logic cleaner, more reliable, and easier to maintain. Embrace these built-in tools to build powerful applications with Laravel.
