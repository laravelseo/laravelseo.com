---
title: "Laravel: nested \"with()\" function"
description: "Mastering Nested Eager Loading in Laravel: Taming the Multi Level with() Function As senior developers working with Eloquent, we frequently deal with..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP", "Errors"]
featured: false
---

As senior developers working with Eloquent, we frequently deal with complex data structures involving multiple levels of relationships. Retrieving deeply nested data—such as finding courses, their associated competencies, and finally, the standards linked to those competencies—is a common requirement. Often, setting up these nested relationships using the `with()` method can feel tricky, leading to unexpected array structures.

This post dives into a common scenario: retrieving data across three interconnected tables (`courses`, `competencies`, and `competency_standards`) and successfully nesting them as desired using Laravel’s eager loading capabilities.

## The Challenge: Retrieving Deeply Nested Data

You are trying to fetch course data, which includes its competencies, and within those competencies, you want to pull the associated competency standards. Your initial attempt was close, but it failed to fully map the deepest level of the relationship into the desired nested array structure.

The relationships are defined as:
1. `courses` has many `competencies`.
2. `competencies` has many `competency_standards`.

The goal is to get a result where each course contains an array of competencies, and each competency contains an array of its standards.

## The Solution: Correctly Nesting Eager Loads

The key to solving this lies in correctly chaining the nested `with()` calls. Eloquent’s eager loading mechanism is designed precisely for this kind of hierarchical data retrieval. When you nest queries within a closure passed to `with()`, you instruct Eloquent to load the related models recursively.

Here is the correct approach to achieve the desired nested structure:

```php
$coursesAndComps = Course::with(
    'competencies' => function ($query) {
        // Inside the competency query, eager load its related standards
        $query->with('competency_standards');
    }
)->get()->toArray();
```

### Code Breakdown and Explanation

Let’s break down why this structure works perfectly:

1.  **`Course::with(...)`**: We start by telling Eloquent we want to eager load the `competencies` relationship for every course record.
2.  **`'competencies' => function ($query) { ... }`**: This is where the magic happens. Instead of passing a simple relationship name, we pass a closure (a callback function). This tells Eloquent: "When loading the `competencies` for each course, execute this inner query."
3.  **`$query->with('competency_standards')`**: Inside that nested query, we apply another eager load. We tell Eloquent: "For every competency found in this step, also eagerly load its related `competency_standards`."

This recursive structure ensures that when the final results are flattened, the data is correctly grouped under the parent models, resulting in the desired nesting: `Course -> Competencies -> Competency_Standards`. This powerful capability showcases how robust Laravel’s Eloquent model-relationship system is (see more about Eloquent relationships on [laravelcompany.com](https://laravelcompany.com)).

## The Resulting Structure

When you execute this query, the resulting array will look exactly as intended:

```php
[0] => [
    'id' => 1,
    'name' => 'the first course',
    'competencies' => [
        [
            'id' => 9,
            'course_id' => 1,
            'name' => 'first course comp 1',
            'competency_standards' => [ // <-- The nested data is now present!
                [
                    'id' => 22,
                    'competency_id' => 9,
                    'name' => 'standard foo'
                ],
                [
                    'id' => 23,
                    'competency_id' => 9,
                    'name' => 'standard bar'
                ]
            ]
        ],
        // ... other competencies
    ]
]
```

## Conclusion: Eager Loading is Your Friend

The confusion often arises from trying to force a flat structure when the database relationships are inherently hierarchical. The solution isn't about avoiding nesting; it’s about correctly utilizing the recursive nature of Eloquent eager loading. By understanding how to pass nested closures within `with()`, you can efficiently retrieve complex, multi-level data structures in a clean and performant manner. Always remember that mastering these relationship techniques is fundamental to writing efficient Laravel applications.
