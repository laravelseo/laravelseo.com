---
title: "Auto increment numbers in laravel"
description: "Mastering Auto Incrementing Order Numbers in Laravel: A Developer's Guide As developers building applications with Laravel, one of the most common and..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "PHP"]
featured: false
---

As developers building applications with Laravel, one of the most common and crucial tasks is managing unique identifiers, such as order numbers, user IDs, or product SKUs. The challenge you are facing—creating sequential, zero-padded numbers like `001`, `002`, `003` dynamically—is a classic database management problem masquerading as a string manipulation task.

Simply concatenating strings like `'TXT' . date('Ymd') . '001'` is fragile. It bypasses the inherent integrity of your data and offers no protection against race conditions, especially in a multi-user environment. As senior developers, we must always rely on the database for sequence management.

This guide will walk you through the correct, robust way to handle auto-incrementing IDs in Laravel, ensuring data integrity and scalability.

## Why Simple String Concatenation Fails

Your initial approach:
```php
$order->order_no = 'TXT'.date('Ymd').'001';
// Result: TXT20190213001 (Static)
```
This method fails because the number (`001`) is hardcoded. If two requests hit your server simultaneously, both might try to assign the same static sequence, leading to duplicate order numbers and data corruption. Database operations must be atomic—meaning they either complete fully or not at all.

## The Robust Solution: Leveraging Database Auto-Increment

The foundation of reliable auto-incrementing numbers lies entirely within your database schema, not in your application logic. Laravel’s Eloquent ORM is designed to interact seamlessly with these database features.

### Step 1: Define the Primary Key Correctly

Ensure that the column you intend to be sequential (the order number) is set up as an auto-incrementing integer in your migration file. This is the most fundamental step.

In your migration file, this looks like:
```php
Schema::create('orders', function (Blueprint $table) {
    $table->id(); // This automatically creates an auto-incrementing BIGINT primary key
    $table->string('order_no')->unique(); // We will use a separate field for the formatted string
    // ... other columns
});
```

### Step 2: Using Eloquent’s `increment` Method

Instead of manually calculating the next number in your controller logic, let the database handle it using Eloquent's powerful methods. This is far safer and more efficient, especially when dealing with complex relationships or large datasets, a concept central to how robust data handling is managed within frameworks like Laravel.

When you create a new record, you simply save the model:
```php
use App\Models\Order;

// Create a new order
$order = new Order();
$order->user_id = 123; // Example foreign key
$order->save();

// To get the newly generated ID (which is always safe):
$newOrderId = $order->id;
```

### Step 3: Formatting the Number for Display (The Laravel Way)

If you still require a custom, zero-padded string format (like `ORD-001`), you should generate this formatted string *after* retrieving the reliable database ID. This separates the concerns: the database manages the sequence; the application layer manages the presentation.

You can use PHP's built-in formatting functions to achieve the desired padding:

```php
$order = Order::create([
    'user_id' => 123,
    // The ID is safely managed by the DB
]);

// Format the order number for display in your application layer
$formattedOrderNo = sprintf('ORD-%04d', $order->id);

// Result: ORD-0001 (if using %04d) or ORD-001 (if using padding logic)
```

To make this process even cleaner and more reusable, consider adding an **Accessor** or **Mutator** to your Eloquent model. This keeps the formatting logic encapsulated within the model itself, adhering to good object-oriented principles that strengthen application architecture. For deeper dives into advanced Eloquent features, exploring resources from [laravelcompany.com](https://laravelcompany.com) is highly recommended.

## Conclusion

The key takeaway is this: **Never rely on application code alone for sequence generation.** Always delegate the responsibility of unique, sequential numbering to your database. By using `id()` and the Eloquent `save()` method, you ensure atomicity, concurrency safety, and data integrity. Use your application layer—Laravel—to handle the presentation formatting, which is where string manipulation belongs. This separation of concerns makes your code cleaner, more reliable, and significantly easier to maintain as your application scales.
