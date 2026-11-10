---
title: "Laravel change pagination data"
description: "Title: Laravel Pagination Data Manipulation for Custom Object Arrays Body: Laravel provides an efficient pagination system for displaying data in an..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

Title: Laravel Pagination Data Manipulation for Custom Object Arrays
Body:

Laravel provides an efficient pagination system for displaying data in an organized manner. However, there might be instances where one needs to customize the output of the data array for each object. Let's analyze a possible solution and understand how it can be achieved without compromising the Laravel pagination functionality.

In your current code, you are using `$items = $this->items()` which returns all user items with pivot table, but you are not satisfied with the way the pivot data is shown in the JSON. You want to modify this array and organize each item with its related pivot data before displaying them.

Firstly, let's take a look at your current code:
<pre><code>$items = $this-&gt;items()
        -&gt;where('position', '=', null)
        -&gt;paginate(15);</code></pre>

The first step would be to create a custom collection by merging the items and their related pivots as you desire. For this, you may use Laravel's `collect()` method:
<pre><code>$items = collect($this-&gt;items())
        -&gt;mergeWith($this-&gt;pivotTableItems())
        -&gt;flatMap(function ($item, $key) {
            return [
                array_merge($item->toArray(), ['pivot' => $this-&gt;pivotDataForItem($item->id)]),
            ];
        });</code></pre>
This code will merge the original items and their related pivots into one collection. The `pivotTableItems()` method here is a custom method you have to write based on your database relationships. It should return an array of the relevant pivot data (pivot columns) for each item in the current $items collection. We are using `flatMap()` to flatten the nested collections.

After this, you can paginate the modified collection:
<pre><code>$items = $items-&gt;paginate(15);</code></pre>
Now your data is organized as per your requirements and displayed with the newly structured output. However, note that if your pivot table has more than one pivot row per item (for instance, a many-to-many relationship), you will need to iterate through all the rows for each item in your custom function.

You can utilize `array_map()` or `collect()` within the custom function to make this process simpler and more efficient:
<pre><code>$items = $this-&gt;items()
        -&gt;where('position', '=', null)
        -&gt;paginate(15);

$pivotTableItems = collect($this-&gt;pivotTableItems())
        -&gt;groupBy('item_id')
        -&gt;mapWithKeys(function ($items, $key) {
            return [$key => $items->first()];
        });

$combinedItems = collect($this-&gt;items())
        -&gt;mergeWithCollection($pivotTableItems)
        -&gt;flatMap(function ($item, $key) {
            return [
                array_merge($item->toArray(), ['pivot' => $this-&gt;pivotDataForItem($item->id)]),
            ];
        });
</code></pre>
This code will first create a collection of pivots grouped by item ID and then merge it with the original items collection. Finally, the `flatMap()` function will ensure your output is organized as per your desired structure. After this modification, you can use the custom collection for pagination:
<pre><code>$combinedItems = $combinedItems-&gt;paginate(15);</code></pre>

This approach ensures that your Laravel pagination data manipulation remains efficient and organized while meeting your desired output. Remember to include proper error handling and validation to avoid any unforeseen issues. To learn more about Laravel's collection methods, visit https://laravelcompany.com/resources/collections-101/.
