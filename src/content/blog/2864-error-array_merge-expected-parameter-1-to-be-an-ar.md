---
title: "\"error\": \"array_merge(): Expected parameter 1 to be an array, null given\""
description: "This is a very common point of confusion when starting with Laravel's powerful features like Observers, Events, and Broadcasting. The issue you are facing..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "PHP", "Errors"]
featured: false
---

This is a very common point of confusion when starting with Laravel's powerful features like Observers, Events, and Broadcasting. The issue you are facing isn't necessarily a bug in your code syntax itself, but rather a misunderstanding of **how events should be triggered and how broadcasting mechanisms integrate with them.**

Based on the context you provided—using an Observer to trigger a broadcast—we can diagnose the problem and establish the correct Laravel pattern.

Here is a thorough developer explanation addressing your setup, best practices, and why commenting out `broadcast(new OrderStatus($order));` changes the behavior.

***

## Understanding Observers, Events, and Broadcasting in Laravel

When working with complex application logic in Laravel, separating concerns into Models, Observers, and Events is a fundamental best practice. Your setup involves three key components: an Eloquent Model (`Order`), an Observer (`OrderStatusObserver`), and an Event (`OrderStatus`). The interaction between these pieces determines how data flows through your application.

## The Role of the Observer

An **Observer** is designed to react to specific events that happen on a Model. In your case, the `OrderStatusObserver` correctly hooks into the `created` event of the `Order` model.

```php
// app/Observers/OrderStatusObserver.php
public function created(Order $order)
{
   broadcast(new OrderStatus($order)); // <--- The point of confusion
}
```

The Observer's job is to detect the change and signal that something important has happened.

## Why `broadcast()` Might Be Failing

The behavior you described—where commenting out the line makes it "work fine"—strongly suggests that the issue
