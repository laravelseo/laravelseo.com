---
title: "Sort collecttion by date DESC using Laravel and Collection"
description: "Mastering Multi Criteria Sorting in Laravel Collections: The Ultimate Guide As developers working with data manipulation, one of the most frequent challenges..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As developers working with data manipulation, one of the most frequent challenges we encounter is sorting data based on multiple criteria. When you need to prioritize sorting by one field (like a total) and use another field (like a date) as a tie-breaker, simple chaining methods often fall short. Today, we are diving deep into how to correctly implement complex, multi-level descending sorts within Laravel Collections.

The specific problem many of us face is: **How do I sort a collection first by the 'total' value in descending order, and if two items have the same total, then sort those ties by 'created\_at' in descending order?**

Let’s break down why the initial attempts failed and reveal the definitive, robust solution.

## The Pitfalls of Simple Chaining

Many developers try to solve this using sequential calls to `sortByDesc()` or a custom `sort()` function. While this seems intuitive, it fails when the criteria are interdependent.

Consider the method you attempted:
```php
$collection->sortByDesc('created_at')->sortByDesc('total');
// Or the complex sort logic involving strtotime()
```
These methods apply sorting sequentially. Sorting by date first and *then* by total applies the secondary sort to the already ordered primary set, which doesn't achieve the desired hierarchical result (Total priority > Date priority). The issue is that these methods are designed for single-dimension sorting, not complex, multi-dimensional comparisons simultaneously.

## The Correct Approach: A Single Custom Comparator

For true multi-criteria sorting where one field must strictly dominate the others, the most reliable technique is to use a single `sortBy()` method with a closure (callback function) that handles the entire comparison logic in one go. This allows you to define exactly how two items ($a$ and $b$) should be ordered relative to each other based on all required fields.

Since we need both 'total' and 'created\_at' to be sorted in **descending** order, our custom function must reflect this priority.

Here is the canonical way to achieve nested descending sorting:

```php
$collection->sortBy(function ($item) {
    // Primary sort: total (Descending)
    // Secondary sort: created_at (Descending)
    return [
        $item->total, // Comparison value 1
        $item->created_at // Comparison value 2
    ];
});
```

Wait, that returns an array, which isn't ideal for a direct comparison. A better approach within the closure is to use standard subtraction for numerical sorting and leverage the negative sign for descending order.

### Implementing Nested Descending Sort Correctly

To ensure 'total' is the primary sort key (descending) and 'created\_at' is the secondary tie-breaker (also descending), we structure the comparison like this:

```php
$collection->sortBy(function ($a, $b) {
    // 1. Compare 'total'. Since we want DESC, we reverse the subtraction result.
    if ($a->total != $b->total) {
        return $b->total <=> $a->total; // $b - $a for descending order
    }

    // 2. If totals are equal, compare 'created_at'. Since we want DESC, we reverse the subtraction result.
    return $b->created_at <=> $a->created_at;
});
```

**Explanation of the Logic:**

1.  The comparison operator (`<=>` or the spaceship operator in PHP 7+) is used to return -1, 0, or 1.
2.  If `$b->total` is greater than `$a->total`, it returns `1`, effectively placing item $b$ before item $a$ (descending order).
3.  If the totals are equal, the code falls through to compare `$b->created_at` and `$a->created_at`, ensuring that the more recent (larger) date comes first among the ties.

## Complete Example

Let's see this in action with concrete data:

```php
$data = [
    ['id' => 1, 'total' => 100, 'created_at' => '2023-01-15'],
    ['id' => 2, 'total' => 50, 'created_at' => '2023-02-20'],
    ['id' => 3, 'total' => 100, 'created_at' => '2023-01-01'], // Same total as ID 1, older date
    ['id' => 4, 'total' => 50, 'created_at' => '2023-03-10'], // Same total as ID 2, newer date
];

$collection = collect($data);

$collection->sortBy(function ($a, $b) {
    // Primary sort: Total DESCENDING (b <=> a)
    if ($a['total'] != $b['total']) {
        return $b['total'] <=> $a['total'];
    }

    // Secondary sort: Created At DESCENDING (b <=> a)
    return $b['created_at'] <=> $a['created_at'];
});

// Output will be ordered by Total (100, 100, 50, 50), and then by Date descending for ties.
// Expected Order: ID 1 (Total 100, Jan), ID 3 (Total 100, Jan), ID 4 (Total 50, Mar), ID 2 (Total 50, Feb)
```

## Conclusion

When dealing with complex sorting requirements in Laravel Collections, avoid relying solely on sequential chaining of single-property sorting methods. Instead, embrace the power of a single custom comparator function passed to `sortBy()`. This approach gives you explicit control over the entire sorting hierarchy, ensuring that your data is ordered exactly as required—prioritizing 'total' first, and then using 'date' as a precise tie-breaker.

For more advanced data manipulation patterns within the Laravel ecosystem, exploring how Eloquent relationships and query scopes interact with Collection methods can further enhance your development skills. Stay tuned for more deep dives into mastering Laravel!
