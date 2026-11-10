---
title: "How do I sort a Laravel Collection by multiple properties with both asc and desc?"
description: "Title: Sorting Laravel Collections by Multiple Properties with Ascending and Descending Order Introduction: Working with Laravel collections involves..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content"]
featured: false
---

Title: Sorting Laravel Collections by Multiple Properties with Ascending and Descending Order

Introduction: Working with Laravel collections involves manipulating and organizing data in various ways. This includes sorting them based on multiple properties, both ascending (asc) and descending (desc). In this blog post, we will discuss a comprehensive method to sort Illuminate\Support\Collection objects by multiple properties while considering both ascending and descending order.

Body:

Step 1: Create the Collection
Firstly, create your Laravel collection with the desired data. For demonstration purposes, let's assume it contains user records:
<pre><code>$collection = User::all();</code></pre>

Step 2: Define the Sorting Instructions
Define an array containing all the sorting instructions in a structured manner. In this case, we have two columns to sort by - 'first_name' and 'date_of_birth'. Also, both ascending ('asc') and descending ('desc') order are required:
<pre><code>$sorting_instructions = [
    ['column' => 'first_name', 'order' => 'asc'],
    ['column' => 'date_of_birth', 'order' => 'desc'],
];</code></pre>

Step 3: Apply Closure-Based Sorting
Now that we have the collection and sorting instructions, let's iterate through the users and apply the ordering logic using a closure. This allows us to compare user records based on multiple criteria:
<pre><code>$collection->sort(function($a,$b) use ($sorting_instructions){
    // Compute all comparisons required for each instruction
    $compare1 = strcmp($a['first_name'], $b['first_name']);
    if ($compare1 === 0) {
        $compare2 = strcmp($a['date_of_birth'], $b['date_of_birth']);
        if ($compare2 == 0) {
            // If both first name and date of birth are equal, proceed to the next iteration
            return 0;
        } else if ($compare2 < 0) {
            // A is before B in descending order for 'date_of_birth'
            return -1;
        } else {
            // A is after B in descending order for 'date_of_birth'
            return 1;
        }
    } else if ($compare1 < 0) {
        // A is before B in ascending order for 'first_name'
        return -1;
    } else {
        // A is after B in ascending order for 'first_name'
        return 1;
    }
});</code></pre>

Step 4: Apply the Sorting Instructions
Now that we have a sorted collection, let's print it out to see the results. Please note that you may need to adapt this code based on your specific Laravel version and needs:
<pre><code>dd($collection);</code></pre>

Conclusion:
By following these steps, we can easily sort a Laravel collection by multiple properties with both ascending and descending order. It's always essential to ensure the data is sorted according to your specific requirements for efficient management and analysis. Keep exploring the Laravel documentation and community resources to stay updated on new techniques and best practices.
