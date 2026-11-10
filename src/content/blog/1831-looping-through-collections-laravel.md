---
title: "Looping through collections -Laravel"
description: "Title: Efficiently Looping through Collections Laravel Introduction Looping through collections is one of the fundamental tasks in Laravel applications. This..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content"]
featured: false
---

Title: Efficiently Looping through Collections - Laravel

Introduction

Looping through collections is one of the fundamental tasks in Laravel applications. This blog post aims to provide a comprehensive guide on how to loop through various Laravel collection types, including arrays and objects. By the end, you will have a clear understanding of the appropriate methods to use for each looping scenario. In addition, we'll demonstrate best practices and include relevant code examples.

1. Looping Through Arrays: The Foreach Loop

In Laravel applications, it is common to store data in arrays. To iterate through these collections, you can utilize the foreach loop as shown below:

<pre><code>
$companies = [
    ["name" => "Apple", "category" => "Tech"],
    ["name" => "Amazon", "category" => "Retail"],
    ["name" => "Alibaba", "category" => "Technology"]
];

foreach($companies as $company) {
    echo "Company: {$company['name']}, Category: {$company['category']}<br>";
}
</code></pre>

In this example, we loop through the companies array and display both the company name and its category.

2. Looping Through Object Collections: The For Each Loop vs. Collection Methods

Laravel provides built-in collection classes for working with object collections. To loop through these collections, you can use either the foreach loop or Laravel's collection methods such as map, flatMap, and groupBy. Here is an example using both techniques:

<pre><code>
$companies = [
    ["name" => "Apple", "category" => "Tech"],
    ["name" => "Amazon", "category" => "Retail"],
    ["name" => "Alibaba", "category" => "Technology"]
];

// Using foreach loop:
foreach($companies as $company) {
    echo "Company: {$company['name']}, Category: {$company['category']}<br>";
}

// Using collection method:
$results = collect($companies)->map(function ($item, $key) {
    return ["name" => $item['name'], "category" => $item['category']];
})->values();

foreach($results as $company) {
    echo "Company: {$company['name']}, Category: {$company['category']}<br>";
}
</code></pre>

In this code, we first use Laravel's collect() method to transform the array of companies into a collection. Then, we apply map() to convert each company object back into an array with the new format. Lastly, we loop through the modified collection using the traditional foreach loop.

3. Looping Through Collections and Applying Custom Logic: The Map and FlatMap Methods

At times, you might need to perform custom operations on your collection items before displaying them. Laravel's map() method allows you to apply a callback function to each item in the collection. For example:

<pre><code>
$companies = [
    ["name" => "Apple", "category" => "Tech"],
    ["name" => "Amazon", "category" => "Retail"],
    ["name" => "Alibaba", "category" => "Technology"]
];

$results = collect($companies)->map(function ($item, $key) {
    return array_merge($item, ["group" => substr($item['name'], 0, 1)]);
})->values();

foreach($results as $company) {
    echo "Company: {$company['name']}, Category: {$company['category']} (Group: {$company['group']})<br>";
}
</code></pre>

In this code, we use map() to combine each company with an additional key containing its first letter. Then, we loop through the collection and display all the necessary information.

4. Looping Through Grouped Collections: The GroupBy Method

Sometimes, you may require grouping your collections based on a specific key. Laravel provides the groupBy() method for this purpose:

<pre><code>
$companies = [
    ["name" => "Apple", "category" => "Tech"],
    ["name" => "Amazon", "category" => "Retail"],
    ["name" => "Alibaba", "category" => "Technology"]
];

$results = $companies->sortBy('name')->groupBy(function ($item, $key) {
    return substr($item['name'], 0, 1);
});
foreach ($results as $letter => $companies) {
    echo "Group: {$letter}<br>";
    foreach ($companies as $company) {
        echo "Company: {$company['name']}, Category: {$company['category']}<br>";
    }
}
</code></pre>

In this example, we sort the collection by name, then group them based on their first letter. Next, we loop through each group and display all companies within it.

Conclusion

Looping through collections is a fundamental task in Laravel applications. By combining different techniques like foreach loops, map(), flatMap(), and groupBy(), you can efficiently work with your data sets. Keep in mind to use the most appropriate method for your specific requirements. Happy coding!
