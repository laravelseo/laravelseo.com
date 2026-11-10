---
title: "Orderby Desc in Eloquent, Laravel"
description: "Mastering Nested Ordering in Eloquent: Sorting by Related Model Timestamps As senior developers working with Laravel and Eloquent, we frequently encounter..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Errors"]
featured: false
---

As senior developers working with Laravel and Eloquent, we frequently encounter scenarios where we need to order the main results based on timestamps from deeply nested relationships. The specific challenge you are facing—ordering a query based on a column in a related table (like `messages.created_at`)—is very common when dealing with complex relational data.

Simply applying `orderBy()` to the main model often sorts by the primary model’s columns, not the related ones. Mastering this requires understanding how Eloquent handles eager loading and query scope management.

This guide will walk you through the most effective ways to achieve descending order based on timestamps in a related table, using your provided context as a starting point.

## The Challenge: Ordering Nested Data

You have three tables joined together (e.g., `chats`, `messages`, `users`), and you want the primary results ordered by the creation time of the messages (`messages.created_at`) in descending order.

Your initial attempt uses `Chat::latest('created_at')`, which correctly orders by the `chats` table, giving you the wrong result set for your requirement. To sort by a related model’s timestamp, we must instruct Eloquent to apply the ordering logic to that specific relationship during the eager loading process.

## Solution 1: Ordering via Relationship Constraints (The Best Practice)

The most idiomatic and efficient way to handle this in Eloquent is to use the `with()` method combined with constraints or closures that define the required sorting on the related models. While you cannot directly order the parent query by a child's attribute without specific joins, you can ensure the loaded relationship adheres to the desired order.

For deeply nested ordering, we often rely on scope definitions or ensuring the primary sort happens on the most relevant relationship first. Since you want the *chats* ordered based on their messages, we need to apply the sort logic inside the eager loading constraints.

Here is how you can adjust your controller logic:

```php
// Assuming Chat model has a 'messages' relationship defined
use App\Models\Chat;
use Illuminate\Support\Facades\Auth;

$chats = Chat::with([
    'messages' => function ($query) {
        // Order the messages themselves by creation time descending
        $query->orderBy('created_at', 'desc');
    },
    'users' => function ($query) {
        // Apply filtering to users (as you already had)
        $query->where('id', '!=', Auth::id());
    }
])
->whereHas('users', function ($query) {
    $query->where('id', '=', Auth::id());
})
->get();
```

### Explanation of the Approach

1.  **`with([...])`**: This tells Eloquent to eager load the related `messages` and `users`.
2.  **Closure for Ordering**: By passing a closure to the relationship definition (`'messages' => function ($query) { ... }`), we gain access to the query builder instance for that specific relationship.
3.  **`$query->orderBy('created_at', 'desc')`**: Inside this closure, we apply the desired sorting directly to the `messages` query being loaded. This ensures that when Eloquent fetches the data, the related messages are already sorted correctly before they are attached to the main `Chat` models.

This pattern keeps your database interaction clean and leverages Eloquent's relationship magic, which is a core strength of Laravel development, as highlighted by the philosophy behind frameworks like [Laravel Company](https://laravelcompany.com).

## Solution 2: Ordering via Raw Joins (For Complex Scenarios)

If the above method proves too complex for your specific join structure, or if you need to perform highly complex sorting across multiple tables that Eloquent relationships don't naturally support in a single call, you can fall back on raw SQL joins. This gives you explicit control over the final ordering:

```php
$chats = Chat::join('messages', 'chats.id', '=', 'messages.chat_id')
             ->join('users', 'messages.user_id', '=', 'users.id')
             ->where('users.id', Auth::id())
             ->where('messages.user_id', '!=', Auth::id()) // Example filtering logic
             ->orderBy('messages.created_at', 'desc')
             ->select('chats.*', 'messages.*', 'users.*') // Select only necessary columns
             ->get();
```

While this method is powerful, it requires you to manage the hydration of the resulting data manually, which can be more verbose than using Eloquent relationships. Use this when dealing with highly intricate reporting needs outside of standard CRUD operations.

## Conclusion

For ordering results based on related model timestamps in Eloquent, **Solution 1 (Ordering via Relationship Constraints)** is strongly recommended. It maintains the elegance and readability of your code while ensuring that the eager loading process correctly sorts the underlying data. Always strive to use Eloquent's built-in features when possible; they are designed to make complex database interactions manageable and maintainable. By understanding how `with()` interacts with query scopes, you unlock powerful ways to manage relational sorting in Laravel.
