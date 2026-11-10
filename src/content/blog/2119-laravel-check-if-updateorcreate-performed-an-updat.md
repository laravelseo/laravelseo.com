---
title: "Laravel check if updateOrCreate performed an update"
description: "Laravel: How to Check if updateOrCreate Performed an Update As developers working with Eloquent in Laravel, we frequently deal with scenarios where we need..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers working with Eloquent in Laravel, we frequently deal with scenarios where we need to perform conditional actions based on whether a database operation resulted in a creation or an update. The method `updateOrCreate()` is incredibly convenient—it handles the "find or create" logic in a single call—but this convenience sometimes hides the necessary feedback required for subsequent business logic.

Let's examine the scenario you presented: running `updateOrCreate` inside a loop and needing to execute different code paths based on whether an update actually occurred.

```php
for($i=0; $i < $number_of_tourists; $i++) {
    $tourist = Tourist::updateOrCreate([
        'doc_number' => $request['doc_number'][$i]
    ], $tourist_to_update);
}
```

The core challenge is determining if the operation resulted in an update (the record existed and was modified) or a creation (a new record was inserted). Simply checking the returned `$tourist` object isn't sufficient, as it will always return the resulting model instance. We need to inspect the database activity itself.

## The Developer Solution: Checking Existence Before Operation

The most reliable and often clearest way to handle this is to manage the check explicitly rather than relying solely on inferring state from the complex nature of `updateOrCreate`. For critical operations, clarity beats cleverness.

Before executing the loop, or inside it, you should determine if the record exists *before* attempting the update/create. This allows you to branch your logic precisely.

Here is a robust pattern:

```php
foreach ($request['doc_number'] as $docNumber) {
    $data = [
        'doc_number' => $docNumber,
        // other necessary data...
    ];

    // 1. Check if the record exists first (The existence check)
    $tourist = Tourist::where('doc_number', $docNumber)->first();

    if ($tourist) {
        // 2. If it exists, perform the update
        $tourist->update($tourist_to_update); // Or use fill() / save() if you need full model manipulation
    } else {
        // 3. If it does not exist, create a new one
        Tourist::create($data); // Or use the Model static create method
    }
}
```

### Why This Approach Works Best

This explicit check is superior for several reasons:

1.  **Clarity:** The intent of the code is immediately obvious to any developer reading it. We are explicitly checking existence before deciding on the action.
2.  **Control:** You have granular control over what happens in each branch, allowing you to execute specific business logic for updates versus creations.
3.  **Performance (in some cases):** While running two queries (`where` then `update`/`create`) might seem slower than a single `updateOrCreate`, in complex conditional loops, the overhead of checking existence prevents unnecessary writes or complex branching based on potentially ambiguous return values from Eloquent methods. This pattern keeps database interactions straightforward and predictable, which aligns with best practices for efficient data handling, much like when structuring relationships in Laravel.

## Alternative: Relying on Query Builder Feedback (Advanced)

For scenarios where you absolutely must stick close to the `updateOrCreate` structure, you can leverage the underlying query builder methods to see how many rows were affected immediately after the call. However, this requires slightly more complex setup as Eloquent doesn't always expose this directly in a simple return value for these methods.

A peek into efficient database interaction often involves looking at the result of the update operation itself, particularly when dealing with bulk operations. For general Eloquent tasks, ensuring you understand the underlying SQL executed is key to mastering performance optimization, which is a core concern whenever managing data persistence within Laravel applications. Mastering these nuances will help you build highly performant systems on top of the robust foundation provided by the [Laravel framework](https://laravelcompany.com).

In summary, while `updateOrCreate` saves keystrokes, for operations that require specific conditional execution based on *what* happened (update vs. create), explicitly checking the record's existence first provides the most readable, maintainable, and contextually accurate solution.
