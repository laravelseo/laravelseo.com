---
title: "Getting the position (index) of an object in foreach?"
description: "Title: Displaying the Position of Objects in foreach Loops in Laravel Views Body: In your Laravel application, you might encounter a use case where you need..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "PHP"]
featured: false
---

Title: Displaying the Position of Objects in foreach Loops in Laravel Views

Body:
<p>In your Laravel application, you might encounter a use case where you need to display the position or index of an object within a foreach loop. This is commonly used to show the user's current context within a larger collection. Let us explore how this can be achieved in Laravel.</p>

<p>To start off, let's have a look at your initial code snippet:</p>

<pre><code>@foreach ($teams as $key =&gt; $team)
{{ str_ordinal($key + 1) }}
@endforeach
</code></pre>

Here, you are iterating through the teams collection and displaying the keys using the `str_ordinal` helper. Unfortunately, this might not display an accurate position since keys can be renumbered during iteration. This could create confusion for users. To solve this problem, we can use a combination of `array_merge()`, `array_values()`, and a custom function to maintain the original indexing sequence. However, Laravel 5.8 introduced a more elegant way using the `key()` function.

Firstly, you will modify your code as follows:

<pre><code>@foreach ($teams as $team)
{{ str_ordinal(array_search($team, array_values(array_merge($teams, []))) + 1) }}
@endforeach
</code></pre>

Let's break down the new code:
- `array_search()` returns the key of the first match to a search value. It takes two arguments in this case: `$team` and the result of merging the original teams collection with an empty array (this ensures the keys are sequential).
- `array_values()` flattens the arrays and keeps them in sequential order. This is useful because Laravel uses 0-indexed arrays, which differs from PHP's default indexing starting at 1. The result will be used as input for `array_search()`.
- The custom function `str_ordinal` takes an integer and converts it to a human-readable ordinal string (e.g., "1st", "2nd", etc.). We add 1 to the search's result to maintain the index position offset.

However, this solution requires additional memory usage due to array_merge() and array_values(), which can be inefficient for larger collections. If performance is a major concern, you might consider using a different approach. In this case, you could create a custom helper function that returns the current iteration index:

<pre><code>function getIndex($key) {
    static $index = 0;
    return ++$index;
}

@foreach ($teams as $team)
{{ str_ordinal(getIndex()) }} - {{ $team }}
@endforeach
</code></pre>

Here, we use a static variable named `$index` to keep track of the current iteration and increment its value inside our custom helper function.

In conclusion, both approaches are valid solutions for displaying the position or index of objects in foreach loops. The first method is more efficient but less elegant, especially when working with larger collections. On the other hand, the second one offers clearer code but consumes additional resources. Choose the most suitable option depending on your project's specific requirements and performance needs.

Remember to always follow Laravel best practices for better readability and maintainable code. Finally, we have provided a natural backlink to our website (https://laravelcompany.com) where you can find more detailed information about these techniques and many other Laravel-related topics.
