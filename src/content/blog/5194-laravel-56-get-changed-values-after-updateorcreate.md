---
title: "Laravel 5.6 - get changed values after updateOrCreate"
description: "Laravel 5.6: Mastering Changes After updateOrCreate As a senior developer, I frequently encounter situations where we use powerful Eloquent methods like..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As a senior developer, I frequently encounter situations where we use powerful Eloquent methods like `updateOrCreate` to handle data synchronization, but we need granular feedback on *what* actually changed during that operation. The scenario you described—attempting to retrieve the changes array after using `$model->updateOrCreate()` and finding it empty or null—is a common point of confusion when working with mass update operations in Laravel.

This post will dive into why this happens and provide robust, developer-approved methods to accurately track the modified values, moving beyond simple assumptions about Eloquent’s built-in change tracking.

## The Mystery of `$changes` in `updateOrCreate`

When you execute:

```php
$q = Userssub::updateOrCreate(
    ['userid' => $uid],
    ['model' => $model]
);
// ... then attempting to access $q->changes or $q->changes->toArray()
```

You are expecting Eloquent to provide a direct array detailing which fields were modified (e.g., `['model' => 'new_value']`). However, in many scenarios, especially when dealing with combined create and update operations via methods like `updateOrCreate`, the standard `$changes` property on the resulting model instance often returns `null` or an empty collection.

This happens because `updateOrCreate` is designed to be a single, atomic operation that prioritizes persistence over detailed history tracking in its immediate return value. It focuses on achieving the desired state rather than reporting the delta of the transaction itself. Trying to access `$changes` directly is often missing the necessary context for this specific method call.

## The Developer's Solution: Reconstructing the Change Log

Since relying on a single property might be unreliable, the most robust approach in a production environment—especially when dealing with complex updates—is to capture the state *before* and *after* the operation. This technique ensures you have definitive proof of what was modified, which is crucial for auditing and debugging.

Here is a practical way to retrieve the actual changes:

### Step 1: Fetch the Original Record (If it Existed)

Before calling `updateOrCreate`, if you are updating an existing record, fetch its current state.

```php
$userId = $uid;
$modelName = $model;

// 1. Fetch the original record before the operation
$user = Userssub::find($userId);

if ($user) {
    // Store the original data for comparison
    $originalData = $user->toArray();
} else {
    // Handle case where no record existed (it was a creation)
    $originalData = [];
}
```

### Step 2: Execute `updateOrCreate`

Now, perform the operation.

```php
$q = Userssub::updateOrCreate(
    ['userid' => $userId],
    ['model' => $modelName]
);
```

### Step 3: Compare and Determine Changes

After the operation, you compare the `$originalData` with the newly retrieved model data. The difference between these two states is your list of changes.

```php
$newData = $q->toArray();

$changes = [];
foreach ($originalData as $key => $value) {
    if ($value !== $newData[$key]) {
        $changes[$key] = [
            'old' => $value,
            'new' => $newData[$key]
        ];
    }
}

// $changes now holds the exact values that were modified.
```

This pattern gives you complete control over what data is logged and ensures that your application logic accurately reflects the database changes. This level of meticulous data handling aligns perfectly with the principles of clean architecture often discussed in modern Laravel development, reinforcing the idea that robust data management is paramount when building applications on a framework like **https://laravelcompany.com**.

## Conclusion

While Eloquent provides powerful tools for data manipulation, understanding the limitations and capabilities of methods like `updateOrCreate` is key to effective development. When simple accessor properties fail to provide the necessary granular detail—as often happens with mass operations—we must resort to state management. By implementing a "fetch-before-and-after" strategy, you gain total control over tracking changes, making your application more reliable and transparent.
