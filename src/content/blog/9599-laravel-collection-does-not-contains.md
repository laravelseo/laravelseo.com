---
title: "Laravel collection does not contains"
description: "Mastering Collection Logic: How to Check for Absence in Laravel Blade Templates As senior developers working with Laravel, we frequently deal with..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As senior developers working with Laravel, we frequently deal with collections of data, and understanding how to query and manipulate these collections efficiently is crucial. One common point of confusion arises when trying to determine if a specific value *does not exist* within a set of records, especially when rendering logic directly in Blade templates.

The issue you are encountering stems from misunderstanding how Laravel Collections methods like `contains()` operate, particularly when dealing with nested data or complex filtering across an entire collection versus checking a single item. Let's dive into why your initial attempts failed and explore the correct, idiomatic Laravel solutions.

## The Misconception: `contains()` vs. Collection Filtering

You correctly identified that you need to check for the *absence* of a condition. However, methods like `contains()` are designed to check if an exact value exists within the collection's values or keys. When dealing with complex objects within a collection (like your `$orders`), checking a single property across all records requires a different approach—filtering the collection first and then checking the result.

Your attempts:
```php
@if(!$orders->contains('order_status', 'Complete')) // Fails for this use case
@if($orders->contains('order_status', 'Complete') === false) // Also fails conceptually
```
These methods are not designed to perform a row-by-row conditional check across an entire set of objects. To achieve your goal—displaying one block if *no* orders are 'Complete' and another if *some* orders are 'Complete'—we need to leverage the power of collection filtering.

## The Correct Approach: Using `some()` or `where()`

The most robust and readable way to check for the existence of at least one item matching a criterion in a Laravel Collection is by using the `some()` method or the scope-based `where()` method, which are fundamental tools when working with Eloquent relationships and collections (as discussed on the **[Laravel Company documentation](https://laravelcompany.com)**).

### Scenario 1: Checking if *Any* Item Matches a Condition (`some()`)

If you want to know if there is at least one order that has the status 'Complete', you use `some()`:

```php
@if($orders->some(function ($order) {
    return $order->order_status === 'Complete';
}))
    {{-- This block runs if AT LEAST ONE order is 'Complete' --}}
    <h4 class="completed">Completed Orders</h4>
    {{-- ... display completed orders table ... --}}
@else
    {{-- This block runs if NO order has the status 'Complete' (i.e., it does not contain 'Complete') --}}
    <h4 class="in-progress">Orders in Progress</h4>
    {{-- ... display in-progress orders table ... --}}
@endif
```

### Scenario 2: Checking for Absence (`isEmpty()` on a Filtered Result)

To achieve your goal of checking if the collection *does not contain* any 'Complete' orders, you can filter the collection first and then check if the resulting filtered collection is empty. This is often cleaner when dealing with complex conditional display logic in Blade.

Here is how you implement the "does not contain" logic:

```php
@php
    // 1. Check if any order has the status 'Complete'
    $hasCompletedOrders = $orders->where('order_status', 'Complete')->isNotEmpty();
@endphp

@if($hasCompletedOrders)
    {{-- Logic for Completed Orders --}}
    <h4 class="completed">Completed Orders</h4>
    <table class="table table-hover">
        <thead>
            <tr>
                <th>Order #</th>
                <th>Cost</th>
                <th>Completed On</th>
                <th>View Files</th>
            </tr>
        </thead>
        <tbody>
            {{-- Display only completed orders --}}
            @foreach($orders as $order)
                @if($order->order_status == 'Complete')
                    <tr>
                        <td>{{ $order->id }}</td>
                        <td>£ {{ $order->customer_value }}</td>
                        <td>{{ $order->updated_at }}</td>
                        <td><a href="/view-order/{{ $order->id }}">View Files</a></td>
                    </tr>
                @endif
            @endforeach
        </tbody>
    </table>
@else
    {{-- Logic for Orders in Progress (The "does not contain" case) --}}
    <h4 class="in-progress">Orders in Progress</h4>
    <table class="table table-hover">
        <thead>
            <tr>
                <th>Order #</th>
                <th>Placed on</th>
                <th>Due by</th>
                <th>Cost</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            {{-- Display all orders that are NOT 'Complete' --}}
            @foreach($orders as $order)
                @if($order->order_status !== 'Complete')
                    <tr>
                        <td>{{ $order->id }}</td>
                        <td>{{ $order->created_at }}</td>
                        <td>{{ $order->due }}</td>
                        <td>£ {{ $order->customer_value }}</td>
                        <td>{{ $order->order_status }}</td>
                    </tr>
                @endif
            @endforeach
        </tbody>
    </table>
@endif
```

## Conclusion: Prioritizing Readability in Blade

When building conditional logic within a Laravel Blade template, move away from trying to force complex collection checks into single `contains()` calls. Instead, embrace the power of Eloquent and Collection methods like `where()`, `some()`, and `isEmpty()`. This approach keeps your presentation layer clean, delegates the data querying responsibility to the model/collection layer, and results in code that is significantly more readable and maintainable. For advanced collection
