---
title: "Call to undefined method Illuminate\\Auth\\TokenGuard::attempt()"
description: "Resolving the Error: Call to undefined method Illuminate\\Auth\\TokenGuard::attempt() As a senior developer working with Laravel, encountering errors related..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a senior developer working with Laravel, encountering errors related to authentication methods often points to subtle mismatches in configuration or an outdated understanding of how specific guards are implemented. The error you are facing—`Call to undefined method Illuminate\Auth\TokenGuard::attempt()`—is a classic symptom that arises when the authentication system attempts to call an `attempt()` method on a guard instance that is configured to use a token-based driver, but the context expects a session-based operation, or vice versa.

This post will dive deep into why this error occurs, how Laravel handles different authentication drivers (Session vs. Token), and provide actionable solutions based on your provided configuration.

## Understanding Laravel Authentication Guards

In Laravel, authentication is managed through **Guards**. A guard defines a specific mechanism for authenticating users—whether it uses session data, API tokens, or other methods. The core issue here lies in the conflict between the method you are calling (`attempt()`) and the underlying driver implemented by your guard.

The `attempt()` method is typically associated with session-based authentication guards (like the default `web` guard using the `session` driver). However, if a guard is set up to use a token mechanism (like the `token` driver), it inherits methods from specific implementations, such as `TokenGuard`. If you call a standard session method on a Token Guard instance, Laravel throws an error because that specific method doesn't exist on the token implementation.

## Analyzing Your Configuration Conflict

Let’s look at your provided configuration snippet:

```php
// ... in auth.php
'guards' => [
    'web' => [
        'driver' => 'session', // Session driver used for web login
        'provider' => 'users',
    ],
    'api' => [
        'driver' => 'token', // Token driver used for API login
        'provider' => 'users',
    ],
    'admin' => [
        'driver' => 'session', // Session driver intended for admin login
        'provider' => 'admins',
    ],
    // ... other guards
],
// ...
```

You are attempting to use `Auth::guard('admin')->attempt(...)`. Since your `'admin'` guard is explicitly set to use the `'session'` driver
