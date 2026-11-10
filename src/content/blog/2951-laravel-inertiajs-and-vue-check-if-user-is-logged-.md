---
title: "Laravel, Inertia.js and vue, check if user is logged In"
description: "Laravel, Inertia.js and Vue: Conditionally Displaying User Details Based on Login Status As a senior developer working with the powerful stack of Laravel,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript"]
featured: false
---

As a senior developer working with the powerful stack of Laravel, Inertia.js, and Vue, handling conditional rendering based on user authentication status is a very common requirement. When you are dealing with data flowing between the server (Laravel) and the client (Vue), ensuring that state management is correctly implemented across this boundary is crucial.

You've encountered a common hurdle: setting up shared data via `Inertia::share()` seems correct, but the conditional rendering isn't behaving as expected. This usually points to a subtle mismatch in how you are accessing the shared data on the frontend versus how it was explicitly defined on the backend.

This post will diagnose why your setup might be failing and provide a robust, idiomatic solution for conditionally displaying user details in your navigation bar. We will dive into the mechanics of Inertia data sharing, best practices for authentication checks, and how to correctly implement conditional rendering in your Vue components.

## Understanding Inertia Data Flow and State Sharing

Inertia.js bridges the gap between traditional server-side rendering (Laravel) and modern Single Page Application (SPA) development (Vue). When you use `Inertia::share()`, you are instructing Laravel to serialize specific variables and pass them down to the initial page load context on the frontend. This data is accessible via `$page.props`.

The issue often lies in how you structure the shared data. If you want to check if a user is logged in, you should share a clear boolean flag rather than nesting complex objects that might not exist or be structured exactly as expected during an unauthenticated session.

## Step 1
