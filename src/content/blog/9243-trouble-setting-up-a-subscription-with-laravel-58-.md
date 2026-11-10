---
title: "Trouble setting up a subscription with Laravel 5.8 / Cashier / Stripe"
description: "Troubleshooting Stripe Subscriptions in Laravel 5.8 with Cashier: Solving the InvalidRequest Error Integrating payment gateways like Stripe into a backend..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Integrating payment gateways like Stripe into a backend framework like Laravel involves navigating complex state management, token handling, and asynchronous requests. When setting up subscriptions, these integrations are particularly sensitive. I’ve seen countless developers run into frustrating errors when trying to bridge the gap between frontend card data and backend transaction logic.

Recently, a developer encountered a very specific issue while attempting to implement subscription creation using Laravel 5.8, the Cashier package, and Stripe:

> **Stripe Error InvalidRequest No such payment_method:**

This error is cryptic and rarely points directly to an issue in your Laravel code itself. Instead, it usually signals a mismatch or a problem in how the token or Payment Intent data is being communicated to the Stripe API. As a senior developer, my goal is to help you diagnose where this disconnect is happening.

## Understanding the Root Cause: Tokens vs. Payment Intents

The core of this problem often lies in the transition between client-side tokenization and server-side subscription creation. The error `No such payment_method` strongly suggests that when your Laravel application calls Stripe to create a subscription, it is referencing a payment method ID or token that Stripe cannot find or validate within its current context.

In modern Stripe integrations, we primarily deal with two concepts: **Tokens** and **Payment Intents**. Understanding the difference is crucial for solving this issue in a Laravel Cashier environment.

### The Token Flow Issue

The provided code snippet relies on collecting a token from the frontend using `stripe.createToken(card)` and then submitting that token (`$request->stripeToken`) to your controller to create the subscription:

```php
// In SubscriptionController@create
$request->user()->newSubscription('main', $plan->stripe_plan)->create($request->stripeToken);
```

If you are using older methods or specific versions of Cashier that rely on legacy token handling, inconsistencies can arise. The error suggests that the `$request->stripeToken` being passed to the `create()` method is either expired, invalid, or associated with a payment method that no longer exists in Stripe’s system when the server attempts the transaction.

## Debugging Steps and Solutions

Here is a structured approach to debugging this specific error:

### 1. Verify API Key Scope and Test Mode

First and foremost, ensure your environment setup is correct. The user mentioned setting Stripe to test mode, which is good practice. However, double-check that the API keys configured in your `.env` file are correctly scoped for the operations you are performing (e.g., if you are using specific test card numbers).

### 2. Review Token Lifecycle

The most common fix involves scrutinizing the token lifecycle:

*   **Token Expiration:** Ensure the payment method used to generate the token is still active and valid when the server attempts to create the subscription.
*   **Stripe Library Version:** Since you are working with Laravel 5.8, ensure that your Stripe PHP library version is compatible with your Cashier version. Inconsistent library versions can lead to unexpected failures in API calls.

### 3. Migrate to Payment Intents (The Modern Approach)

For subscription management, migrating from raw token usage to **Payment Intents** is highly recommended, especially when dealing with modern frameworks and evolving payment standards. Laravel Cashier and newer Stripe integrations heavily favor the Payment Intent flow because it provides a better state-based approach for handling payment authorization.

Instead of relying solely on a simple token submission, you should use the client-side flow to create a `PaymentIntent` on the server (or via a dedicated Stripe endpoint) and then use that intent ID to finalize the subscription creation with Cashier. This makes the transaction state more robust.

## Best Practice Implementation for Laravel & Stripe

When implementing subscriptions in Laravel, focus on ensuring data consistency across the request cycle. A robust implementation often involves:

1.  **Client-Side:** Use Stripe Elements and `stripe.createToken` to gather payment method details securely.
2.  **Server-Side (Controller):** Instead of passing a simple token directly if possible, ensure you are using the data to create or confirm a Payment Intent *before* invoking Cashier's subscription creation method.

For maintaining reliable and secure payments in Laravel applications, always refer to the official documentation and principles discussed by the **Laravel Company**. Adopting modern patterns ensures your application remains stable as payment standards evolve.

## Conclusion

The `Stripe Error InvalidRequest No such payment_method` error is almost always a communication failure between your server and Stripe regarding the validity of the payment instrument provided. By systematically checking API keys, token validity, and considering the migration towards Payment Intents, you can resolve this issue. Focus on verifying that every
