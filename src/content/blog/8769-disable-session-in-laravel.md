---
title: "Disable session in Laravel"
description: "How to Truly Disable Sessions in Laravel for Stateless APIs Developing stateless RESTful API applications is a common requirement, especially when building..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Developing stateless RESTful API applications is a common requirement, especially when building microservices or public-facing services where state should not be persisted on the server side. When you remove session handling, it’s easy to assume the problem is solved, but as we'll see, disabling sessions completely requires a deeper dive into how Laravel initializes its request lifecycle.

If you are encountering the `RuntimeException: Session store not set on request.` error after removing the middleware and environment variables, it means that while you have removed the *entry point* for session management (the middleware), some part of the framework or your application code is still attempting to access or instantiate a session service during the bootstrapping phase.

As a senior developer, let's dissect why this happens and how to achieve a truly stateless setup in Laravel.

## The Anatomy of the Session Error

The error message indicates that somewhere in the request pipeline, a component expects a session store implementation (like file, database, or Redis) to be available, but it isn't. This usually stems from the default behavior of Laravel’s service container attempting to resolve session-related services, even if the middleware is absent.

Your steps—removing `StartSession::class` from `$middleware` in `app/Http/Kernel.php` and removing `SESSION_DRIVE` from your `.env` file—are the correct first steps for disabling sessions *for web requests*. However, they often don't fully eradicate legacy or implicit dependencies within the framework structure.

## The Comprehensive Solution: Eliminating Session Dependencies

To completely turn off sessions and ensure a clean, stateless API environment, you need to address three areas: the Kernel, the Environment, and any potential Service Provider registrations.

### 1. Verify Kernel Configuration (The Baseline)

Ensure your `app/Http/Kernel.php` file is clean regarding session middleware. For an API only setup, ensure that no session-related middleware is listed in the `$middleware` or `$middlewareGroups` arrays. If you are using a custom kernel, review it to confirm no other route or group is implicitly relying on session context.

### 2. Eliminate Environment Variables (The Context)

Removing `SESSION_DRIVE` from your `.env` file correctly stops Laravel from attempting to load a specific driver for session storage. This prevents the application from trying to initialize infrastructure for sessions that don't exist.

```dotenv
# .env file example
SESSION_DRIVE=null  # Or simply remove this line entirely if using default settings
```

### 3. The Deeper Dive: Removing Session Service Providers (The Fix)

If the error persists, it strongly suggests that a Service Provider is still registering session functionality into the container. For truly stateless applications, you must examine your service providers to see if any are explicitly binding session dependencies.

In modern Laravel development, especially when moving towards heavy API usage, we should minimize framework baggage. If you find any custom or third-party service providers that interact with session state (even indirectly), consider removing them or refactoring them. This aligns with the principle of keeping your application lean and focused, a core concept in building scalable applications as championed by resources like [laravelcompany.com](https://laravelcompany.com).

**Example Check:** Review files within the `app/Providers` directory. Look for any providers that extend `Illuminate\Foundation\Support\Providers\RouteServiceProvider` or involve session management classes. If you find one, temporarily commenting it out can confirm if it is the source of the runtime error.

## Best Practice: Embracing Stateless Design

For stateless APIs, the best practice is not just to *disable* sessions but to *design* your endpoints without them. This means relying entirely on tokens (like JWTs) passed in the request headers for authentication and context, rather than server-side session storage. This approach results in faster, more scalable applications because the application layer is decoupled from state management.

By focusing on stateless design, you eliminate the need to manage session stores entirely, resulting in a leaner codebase that adheres to high performance standards, which is exactly what modern Laravel development aims for.

## Conclusion

The `RuntimeException: Session store not set on request` error is a symptom of residual framework expectations when session functionality is disabled. Simply removing middleware and environment variables is often insufficient. The true solution lies in scrutinizing the service container and ensuring no component implicitly relies on session services during request bootstrapping. For stateless APIs, embrace token-based authentication and maintain a lean architecture to build robust, scalable services.
