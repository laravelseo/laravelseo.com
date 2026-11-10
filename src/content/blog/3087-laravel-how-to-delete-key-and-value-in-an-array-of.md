---
title: "Laravel, how to delete key and value in an array of a specific position?"
description: "Laravel: How to Delete Key and Value in an Array of a Specific Position Without a foreach Loop As developers, we often deal with data manipulation. When..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Performance", "PHP"]
featured: false
---

As developers, we often deal with data manipulation. When working with arrays—whether they are simple PHP structures or Eloquent collections within a Laravel application—the need to selectively remove elements based on their position is common. The challenge, as you pointed out, is finding an efficient way to achieve this deletion without resorting to iterative methods like `foreach`, especially when performance and functional purity are priorities.

This post will dive into the most efficient, non-iterative ways to delete an element from a specific index in an array, focusing on practical PHP techniques that can be seamlessly integrated into your Laravel projects.

## Understanding Array Deletion in PHP

In standard PHP arrays, deletion is typically handled using the `unset()` function. However, `unset()` only removes the element; it leaves a gap (a hole) in the array structure. If you need to maintain a contiguous array where the indices are shifted, simply calling `unset()` is insufficient. You need a method that reconstructs the array without the unwanted element.

The key to avoiding `foreach` lies in using direct index manipulation and array slicing techniques.

## Method 1: The Direct Indexing Approach (For Specific Deletion)

If you know the exact position you wish to remove, accessing that index directly is the fastest way to remove the element itself. This method doesn't re-index the array, but it removes the data instantly.

```php
$data = ['a', 'b', 'c', 'd', 'e'];
$position_to_delete = 2; // We want to delete 'c'

// Use unset() on the specific index
unset($data[$position_to_delete]);

print_r($data);
/* Output:
Array
(
    [0] => a
    [1] => b
    [3] => d
    [4] => e
)
*/
```

**Developer Insight:** While this satisfies the "no `foreach`" constraint, it leaves empty slots (notice index 2 is missing). If your downstream logic requires a perfectly indexed array, you must proceed to re-indexing.

## Method 2: The Slicing Approach (For Positional Deletion and Re-indexing)

To truly delete an item *and* shift the subsequent items, we employ array slicing—creating new arrays from the desired segments of the original array and concatenating them. This is a highly efficient, non-iterative approach for positional deletion.

We split the original array into two parts: everything before the target index, and everything after the target index, and then join them.

```php
function deleteByPosition(array $array, int $position): array
{
    // Ensure the position is valid
    if (!isset($array[$position])) {
        return $array; // Return original if position is out of bounds
    }

    // Slice the array before the position and after the position
    $part1 = array_slice($array, 0, $position);
    $part2 = array_slice($array, $position + 1);

    // Combine the two parts to form the new, contiguous array
    return array_merge($part1, $part2);
}

$items = ['apple', 'banana', 'cherry', 'date', 'elderberry'];
$index_to_remove = 2; // Remove 'cherry'

$new_items = deleteByPosition($items, $index_to_remove);

print_r($new_items);
/* Output:
Array
(
    [0] => apple
    [1] => banana
    [2] => date
    [3] => elderberry
)
*/
```

This slicing method is significantly faster than iterating and deleting elements, as it relies on highly optimized internal C implementations within PHP for array operations. When dealing with complex data structures in a Laravel context, understanding these low-level array functions is crucial for writing performant code, whether you are manipulating Eloquent collections or raw arrays.

## Conclusion: Choosing the Right Tool

For deleting an item based on a specific position without using `foreach`, **array slicing (`array_slice
