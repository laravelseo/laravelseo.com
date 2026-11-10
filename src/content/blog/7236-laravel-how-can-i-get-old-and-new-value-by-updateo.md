---
title: "Laravel : How can i get old and new value by updateOrCreate"
description: "Laravel Eloquent: Getting Old and New Values with updateOrCreate for Data Comparison As a senior developer, I often encounter situations where we need to..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

As a senior developer, I often encounter situations where we need to perform an atomic "update or create" operation but simultaneously require historical context—specifically, knowing what the data looked like *before* the change. This is crucial for auditing, logging, or calculating deltas, which is exactly what you are trying to achieve with comparing old and new values.

The core issue lies in understanding how Eloquent handles model state versus transactional operations. While Laravel provides powerful tools, directly extracting both the original and the new state from a single `updateOrCreate` call requires a slightly different architectural approach than simply calling methods like `getChange()` or `getOriginal()`, which often only reflect the final state change within the scope of that specific operation.

This post will walk you through the correct, robust pattern to retrieve both the old and new values when managing data in your database using Laravel Eloquent.

---

## The Limitation of `getChange()` and `getOriginal()`

You mentioned trying `getChange()` and `getOriginal()`. While these methods are incredibly useful for tracking changes *from* a saved state, they typically operate on the model instance *after* the update has been committed or during a specific relationship load. If you execute an `updateOrCreate` call without explicitly loading the original data first, Eloquent might not retain the necessary "before" state needed for a direct comparison against the new values in a single step.

For complex comparisons where you need absolute historical context, relying solely on post-save methods can be insufficient if the initial read operation is missing.

## The Robust Solution: Fetch, Compare, and Save

The most reliable method to get both the old and new values for comparison involves an explicit three-step process: **Fetch $\rightarrow$ Modify $\rightarrow$ Save**. This ensures that you have a clean snapshot of the original data before applying any updates.

Let's use your example scenario involving a `user` table where we track `name` and `order`.

### Step-by-Step Implementation

We will fetch the record first, store its state, perform the modification, and then save it.

```php
use App\Models\User;

// Assume $userId is the ID of the user we are targeting
$userId = 1;

// 1. Fetch the existing record (Get Old Value)
$user = User::findOrFail($userId);
$oldOrder = $user->order; // Old value: 10

// Define the new data to be applied
$newName = 'Alex';
$newOrder = 8;

// 2. Perform the Update/Create operation
// We use updateOrCreate here, but we are using the fetched data for comparison context outside of it.
$user->updateOrCreate(
    ['id' => $userId], // Conditions to find or create
    [
        'name' => $newName,
        'order' => $newOrder
    ]
);

// 3. Determine the New Value (which is simply provided in the input)
$newOrderValue = $newOrder;


// 4. Comparison and Logging
echo "Old Order: " . $oldOrder . " | New Order: " . $newOrderValue . "\n";

if ($oldOrder > $newOrderValue) {
    echo "Order decreased by: " . ($oldOrder - $newOrderValue) . "\n";
} else if ($oldOrder < $newOrderValue) {
    echo "Order increased by: " . ($newOrderValue - $oldOrder) . "\n";
} else {
    echo "Order remains the same.\n";
}
```

### Why This Approach Works Best

By explicitly fetching `$user` *before* calling `updateOrCreate`, we isolate the historical data (`$oldOrder = 10`) from the transactional write operation. When you perform the update, Eloquent handles persisting the new state (`order = 8`). You now have both values readily available in your PHP variables for any subsequent business logic or logging, fulfilling your requirement to compare them directly.

When dealing with complex data migrations or ensuring data integrity across multiple operations, understanding these underlying data flows is essential, much like mastering patterns seen in modern frameworks like Laravel. For deeper insights into Eloquent features and best practices, always consult resources from the official team at [laravelcompany.com](https://laravelcompany.com).

## Conclusion

While methods like `getChange()` are fantastic for tracking changes post-save, when you need to compare a specific pre-existing state against a new transactional result, explicitly fetching the original data before executing the update is the most transparent and reliable method. By embracing this Fetch-Modify-Save pattern, you gain complete control over your data flow, allowing you to perform meaningful comparisons, audit history, and build robust business logic on top of your database interactions.
