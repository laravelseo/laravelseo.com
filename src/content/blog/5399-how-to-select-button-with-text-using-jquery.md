---
title: "How to select button with text using jQuery"
description: "How to Select Buttons with Text Using jQuery: A Deep Dive Is it possible to select buttons using the text property in jQuery? The short answer is yes, but..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "JavaScript", "HTML"]
featured: false
---

Is it possible to select buttons using the text property in jQuery? The short answer is **yes, but not directly through a simple attribute selector like you attempted.** While jQuery excels at selecting elements based on their HTML attributes or CSS classes, selecting elements based purely on the *content* of their text requires a slightly more nuanced approach.

As a senior developer, I often encounter this scenario when dealing with dynamic data—especially in large datasets loaded via AJAX or from a backend framework like Laravel. Relying solely on matching the text within an attribute selector can be brittle and inefficient. Let's explore why your initial attempt falls short and detail the robust methods for achieving text-based selection in jQuery.

## Why Direct Text Selection is Tricky

Your example code snippet demonstrated:
```javascript
$('#table button[text='+elmt+']').css('color','red');
```
This syntax attempts to use the attribute selector `[text=value]`. In standard CSS and jQuery, this selector targets HTML attributes (like `class`, `id`, or custom data attributes), not the actual textual content inside the element. Therefore, this method will generally fail to select elements based on their visible text.

To successfully select an element based on its text content in jQuery, we need to use methods that inspect the element's content directly, typically involving iteration over the DOM or using specialized pseudo-classes.

## Method 1: The Robust Approach – Iterating Over Data

The most reliable and efficient way to handle this task, especially when you are processing a dataset (like your `data` array), is to iterate through that data and use standard jQuery methods on each element individually. This separates the data logic from the DOM manipulation logic, which is a fundamental best practice in modern application development, much like structuring your API responses in Laravel.

Here is how you should approach selecting buttons based on dynamic text:

```javascript
// Assuming 'data' is an array of objects containing table_no and table_aval
$.each(data, function(index, element) {
    if (element.table_aval === 0) {
        var elmtId = element.table_no;

        // Use the ID or a data attribute for precise selection instead of text matching
        $('button[id="' + elmtId + '"]').css('color', 'red');
    }
});
```

Notice how we switched from trying to select by `[text=...]` to selecting by an accessible identifier, such as an `id`. If you absolutely must select based on text content dynamically, iterating and checking the `.text()` property is safer:

```javascript
$.each(data, function(index, element) {
    if (element.table_aval === 0) {
        var elmtId = element.table_no;
        // Find the button by its index within the parent container and check the text
        $('table button').each(function(i) {
            if ($(this).text() === elmtId) {
                $(this).css('color', 'red');
            }
        });
    }
});
```

This iterative method guarantees that you are checking the actual content of the DOM elements against your data, making the code predictable and less prone to errors than complex attribute selectors.

## Method 2: Using `:contains()` for Simple Text Matching

For simpler cases where you just need to find an element containing a specific substring of text within its descendant nodes, jQuery offers the powerful `:contains()` pseudo-class. This is useful if you are searching across a group of elements.

```javascript
// Select all buttons whose text content contains the value stored in elmtId
$('table button:contains("' + elmtId + '")').css('color', 'red');
```
While concise, be aware that `:contains()` can be slower on very large datasets compared to direct attribute lookups or iteration, as it requires traversing the DOM structure for every element.

## Conclusion

To summarize, while you cannot directly select an element using `[text=...]` in jQuery, you absolutely can achieve text-based selection by combining data processing with standard DOM manipulation techniques. For robust applications, favor methods that rely on stable identifiers (like IDs or data attributes) when possible. When dealing with dynamic data from a backend—whether you are using Laravel for your API endpoints or any other framework—always prioritize clear data handling before attempting complex DOM queries. Stick to iterative checks or precise attribute matching for the most performant and maintainable results.
