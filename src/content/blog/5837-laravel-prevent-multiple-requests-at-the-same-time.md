---
title: "Laravel - Prevent multiple requests at the same time creating duplicate records"
description: "Laravel: Preventing Duplicate Records in Concurrent Operations Using Database Locking As developers working with high throughput APIs, one of the most..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Performance"]
featured: false
---

As developers working with high-throughput APIs, one of the most insidious problems we face is the race condition. When multiple requests hit the same endpoint simultaneously—especially operations that involve reading data and then writing changes—we often end up with data integrity issues, such as duplicate records or incorrect state transitions.

This post dives into a specific scenario within a Laravel application where concurrent API calls lead to duplicate refund creations. We will explore why simple caching fails and demonstrate the robust solution using pessimistic database locking to ensure atomicity in critical operations.

## The Race Condition: Why Simple Checks Fail

The scenario you described perfectly illustrates a classic race condition. When multiple requests execute the following logic concurrently:

1.  **Read:** Check if the order is cancelled (`$transaction->is_cancelled`).
2.  **Modify/Write:** Update the status to cancelled and save (`$transaction->is_cancelled = true; $transaction->save();`).
3.  **Action:** Create the refund record (`Transaction::createCancelRefund($transaction)`).

If two separate API calls read the state (Step 1) before either has committed its write, both proceed independently to execute Step 2 and Step 3. This results in duplicate entries in your `transactions` table, even if you wrap the creation steps in a standard database transaction.

Your attempt with caching was a good first step for performance, but since the check-and-update cycle is too fast for the cache to reliably block all concurrent requests, it proved insufficient for guaranteeing data integrity.

## The Solution: Pessimistic Locking with `lockForUpdate()`

To solve this concurrency issue at the database level, we need to instruct the database to lock the specific record being examined until the current transaction is complete. In Laravel and Eloquent, this is achieved using the `lockForUpdate()` method on a query. This implements pessimistic locking, ensuring that only one process can modify the row at any given time.

By applying this lock immediately after retrieving the record, we guarantee that subsequent requests attempting to read or update that specific transaction will be forced to wait until the first request has finished its entire operation and committed its changes.

### Implementing Locking in Your Refund Logic

We need to apply the lock when fetching the `Transaction` record that we intend to modify:

```php
public function cancelOrder($orderId) {
    // Start a database transaction for overall safety, though locking handles most of the concurrency issue.
    DB::transaction(function () use ($orderId) {
        // 1. Acquire the lock immediately when fetching the record.
        $transaction = Transaction::where('order_id', $orderId)
            ->where('user_id', auth()->user()->id)
            ->where('type', 'Order Charge')
            ->lockForUpdate() // <-- This is the crucial step for pessimistic locking
            ->firstOrFail();

        if ($transaction->is_cancelled) {
            return response()->json(['message' => 'Order already cancelled'], 403);
        }

        // ... (Rest of your external API call logic remains here) ...
        try {
            $result = (new OrderCanceller)->cancel($orderId);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 403);
        }

        // 2. Update the status and save within the locked context.
        $transaction->is_cancelled = true;
        $transaction->save();

        // 3. Create the refund record (this write is now protected).
        Transaction::createCancelRefund($transaction);

        return response()->json(['message' => 'Refund is made to your account']);
    });
}
```

### Why This Works Better

When multiple requests hit this endpoint simultaneously, only one request will successfully acquire the row lock via `lockForUpdate()`. The other concurrent requests will pause execution at that line, waiting for the first transaction to commit and release the lock. By the time the waiting requests proceed, they will read the updated state (e.g., `$transaction->is_cancelled` will be true), correctly preventing duplicate refund creations.

This approach leverages the inherent transactional guarantees of your database, which is a core principle in building reliable applications with Laravel. For more complex scenarios involving multiple related tables, understanding how Eloquent handles these locks and transactions is essential, as detailed in the official [Laravel documentation](https://laravelcompany.com).

## Conclusion: Prioritizing Data Integrity

When dealing with financial operations or any state-changing logic exposed via an API, you must move beyond application-level checks (like simple caching) and rely on database-level guarantees for data integrity. Pessimistic locking using `lockForUpdate()` is the most effective way to prevent race conditions caused by concurrent requests trying to modify the same resource. Always treat your database as the single source of truth, and ensure that critical operations are atomic and isolated.
