---
title: "PHP Laravel Convert array value to upper case"
description: "Title: Laravel Collection Magic: Efficiently Modifying Array Values with Upper Case Functions In your Laravel project, you've encountered a situation where..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Laravel Collection Magic: Efficiently Modifying Array Values with Upper Case Functions

<p>In your Laravel project, you've encountered a situation where you need to convert specific values within an array into upper case. In this comprehensive blog post, we will explore different methods and approaches you can follow using Laravel collections or other alternatives to achieve your goal efficiently.</p>

1. Laravel Collection Magic:
   Laravel provides built-in Collection classes that enable easy manipulation of arrays. To perform the transformation on a given array, follow these steps:

   Example array:
   <pre><code>array:1434 [▼
    0 =&gt; array:53 [▼
       "contact" =&gt; "ANA (dependienta)"
       "mail" =&gt; "example@mail.com"
       "phone2" =&gt; ""
       "phone3" =&gt; ""
       "web" =&gt; "0"
       "active" =&gt; true
       "province" =&gt; "Zaragoza"
   ]
   1 =&gt; array:53 [▼
       "contact" =&gt; "JACKELINE * VIVIANA"
       "mail" =&gt; "mail@example.com"
       "phone2" =&gt; ""
       "phone3" =&gt; ""
       "web" =&gt; "0"
       "active" =&gt; true
       "province" =&gt; "Barcelona"
   ]
</code></pre>

Convert all province values to uppercase:
<pre><code>$collection = collect($arrays); // Assuming $arrays is the array containing other data besides provinces
$collection->map(function ($value, $key) {
    $province = $value['province'];
    if (isset($province)) {
        $newProvince = strtoupper($province);
        return collect(['province' => $newProvince])->merge($value)->all();
    } else {
        return $value; // Return original values for keys not related to provinces
    }
})->values()->all();</code></pre>

2. Looping through arrays with foreach:
   You can also iterate through the array in a traditional manner and apply the transformation on each province value individually:
<pre><code>$provinceValues = []; // Create an empty array to store the updated values
foreach ($arrays as $idx => $array) {
    if (isset($array['province'])) {
        $newProvince = strtoupper($array['province']);
        $updatedArray[$idx] = ['province' => $newProvince]; // Update the array with new values
    } else {
        $updatedArray[$idx] = $array; // Keep original arrays for non-province keys
    }
}
</code></pre>

3. Using Laravel Helper Functions:
   If you wish to avoid creating additional collections or iterating, you can use the built-in array helper functions provided by Laravel. In this case, your code may look like:
<pre><code>foreach ($arrays as $idx => $array) {
    if (isset($array['province'])) {
        $newProvince = strtoupper($array['province']);
        if (!empty($newProvince)) {
            $updatedArray[$idx] = array_replace($array, [
                'province' => $newProvince,
            ]);
        } else {
            $updatedArray[$idx] = $array;
        }
    } else {
        $updatedArray[$idx] = $array; // Keep original arrays for non-province keys
    }
}
</code></pre>

4. Other alternatives:
   If you are not using Laravel, alternative methods include using PHP functions like strtoupper() or ucfirst(). You can also use the implode() function to join and uppercase all values in an array. These approaches may depend on your project's structure and dependencies.

In conclusion, there are various ways to achieve transforming specific array values in Laravel projects with different techniques such as Laravel collections, foreach loops, or other built-in functions. Choose the approach that best fits your requirements while ensuring readability, maintainability, and efficiency.
