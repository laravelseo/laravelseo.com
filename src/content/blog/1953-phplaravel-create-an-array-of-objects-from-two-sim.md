---
title: "PHP/Laravel - Create an array of objects from two simple arrays or an associative array that combines that two"
description: "Title: PHP/Laravel Efficiently Transforming Simple Arrays or Associative Arrays into Object Arrays Body: Transforming an array of objects from given inputs..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Title: PHP/Laravel - Efficiently Transforming Simple Arrays or Associative Arrays into Object Arrays

Body:
<p>Transforming an array of objects from given inputs like a PHP associative array, two simple arrays with names and classes, or two separate arrays (one for names and one for classes) can sometimes be challenging. Regardless of the input method, there are several ways to achieve your desired result using PHP and Laravel.</p>

<h2>Using Array Mapping</h2>

In this approach, we will use Laravel's array_map() function to convert each simple array into an associative one. Here is a code example demonstrating how to combine two simple arrays (names and classes) using the array_combine() function:

<pre><code>$data = array_combine($names, $classes);
</code></pre>

Now that we have our combined associative array, we can apply the array_map() function to transform each element into an object by pairing both their name and class values. We will create a closure (an anonymous function) that will return a new object with the specified key-value pairs:

<pre><code>$objects = array_map(function ($item) {
    return (object) [
        'name' => $item,
        'class' => $data[$item]
    ];
}, array_keys($data));
</code></pre>

This will result in an array of objects with each element containing both the name and class values.

<h2>Using Collection Classes</h2>

Laravel offers a built-in Collection class that provides useful methods to transform arrays into object collections or manipulate collections. We can convert our associative array into an instance of Collection class using the collect() function:

<pre><code>$collection = \Illuminate\Support\Collection::make($data);
</code></pre>

Now, we'll map each element to create a new object with the desired fields. We can achieve this by chaining multiple map() methods:

<pre><code>$objects = $collection->map(function ($item) {
    return (object) [
        'name' => $item['someName'] ?? '',
        'class' => $item['someClass'] ?? ''
    ];
})->map(function ($item, $key) use (&$objects) {
    $objects[$key] = $item;
});
</code></pre>

In this example, we used the collection map() method to assign both name and class values. We also used an additional helper function for storing our objects in a new array. The result will be the same as mentioned earlier: an array of objects with each element having its respective name-class pair.

<h2>Conclusion</h2>

There are several ways to transform simple arrays or associative arrays into object arrays using different methods and libraries available in PHP and Laravel. In this blog post, we've explored two common approaches that can help achieve your desired result efficiently. Always remember to choose the best method based on the context and your preference to get the most out of it. Happy coding!
