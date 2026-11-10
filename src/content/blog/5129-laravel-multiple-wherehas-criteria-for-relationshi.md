---
title: "Laravel multiple whereHas criteria for relationship"
description: "Mastering Multi Criteria Filtering in Laravel Eloquent with whereHas As developers working with relational databases through an ORM like Eloquent, one of..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Google"]
featured: false
---

As developers working with relational databases through an ORM like Eloquent, one of the most common tasks is filtering parent models based on complex conditions existing within their related child models. When you need to ensure that a parent record is associated with *multiple distinct* criteria across its relationships—an "AND" condition across multiple `whereHas` clauses—it can quickly become confusing.

This post dives into a specific challenge involving nested relationships and demonstrates the proper, clean way to achieve complex filtering using Eloquent’s powerful `whereHas` method.

## The Scenario: Finding Contacts with Specific Visit History

Let's look at the data structure you provided:

**Contacts Table:**
| id | name |
|----|------|
| 1  | Joe  |
| 2  | Sally |

**Visits Table:**
| id | contact_id | pathname | referrer |
|----|------------|----------|-----------|
| 1  | 1          | about    | google    |
| 2  | 1          | pricing  | null      |
| 3  | 1          | signup   | null      |
| 4  | 2          | about    | null      |
| 5  | 2          | signup   | null      |

**The Goal:** Retrieve all contacts that have *both* visited the 'signup' page AND were referred by 'google'. This is a strict **AND** condition.

## Why Simple Chaining Fails

You attempted to use chaining like this:

```php
Contact::whereHas('visits', function($query) {
    $query->where('pathname', '=', 'signup');
})
->orWhereHas('visits', function($query) {
    $query->where('referrer', '=', 'google');
})->get();
```

As you correctly observed, this structure uses `orWhereHas`. This tells Eloquent: "Find contacts that have *either* a visit to 'signup' **OR** a visit referred by 'google'." This retrieves contacts like Sally (who visited signup but wasn't referred by google), which is not what we need.

To enforce an **AND** relationship—where the contact must satisfy Condition A *and* Condition B simultaneously within its related records—we need to nest the conditions inside a single query scope.

## The Correct Approach: Nested `whereHas` for AND Logic

The solution lies in ensuring that both required criteria are evaluated against the same parent relationship using nested closures. By applying multiple `whereHas` calls *within* the same outer closure, we instruct Eloquent to look for related records that satisfy all specified conditions simultaneously.

To find contacts who have visited 'signup' **AND** were referred by 'google', we structure the query as follows:

```php
$contacts = Contact::whereHas('visits', function ($query) {
    // Condition 1: The contact must have at least one visit where pathname is 'signup'
    $query->where('pathname', '=', 'signup');
})->whereHas('visits', function ($query) {
    // Condition 2: AND the contact must also have at least one visit where referrer is 'google'
    $query->where('referrer', '=', 'google');
})->get();
```

### Explanation of the Technique

1.  **Outer `whereHas`:** We start by scoping the query onto the `visits` relationship.
2.  **First Closure (`pathname = 'signup'`):** The first closure filters the `visits` table to ensure that the contact has at least one associated visit record where `pathname` equals `'signup'`.
3.  **Second `whereHas`:** Crucially, we chain a second `whereHas` call. Since both clauses operate on the same parent relationship (`contacts`), Eloquent implicitly combines these requirements with an **AND**. It forces the query to find contacts that satisfy *both* criteria within their related visits.

This method is idiomatic for building complex relational filters in Laravel, making your code highly readable and maintainable. For deeper dives into advanced querying techniques, understanding how Eloquent translates these methods into optimized SQL joins is key—a concept central to modern database interaction, much like the principles behind efficient data retrieval on platforms like [Laravel Company](https://laravelcompany.com).

## Conclusion

When dealing with multi-faceted requirements involving relationships, resist the urge to chain simple `whereHas` calls with `orWhereHas`. Instead, embrace nested logical grouping using multiple closures within a single `whereHas` scope. This pattern correctly enforces the necessary **AND** logic required for complex data retrieval. By mastering this technique, you can move beyond simple filtering and build sophisticated querying capabilities in your Laravel applications.
