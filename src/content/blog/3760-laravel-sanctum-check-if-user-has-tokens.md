---
title: "Laravel Sanctum check if user has tokens"
description: "Laravel Sanctum Token Management: A Deep Dive into Login Flow Security When building secure applications with Laravel and Sanctum, managing user sessions and..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

When building secure applications with Laravel and Sanctum, managing user sessions and access tokens is paramount. One common requirement during a login process is ensuring that if a user attempts to log in with new credentials, any previously issued tokens are invalidated before issuing a fresh one. This practice significantly enhances security by preventing token reuse or accidental exposure of old session data.

However, handling this logic within the request lifecycle can often lead to tricky errors, as demonstrated by the issue you encountered: `Call to a member function currentAccessToken() on null`. This error usually signals that the authenticated user object (`$request->user()`) is either null or doesn't have the expected relationship loaded in that specific context.

This post will dissect why your initial attempt failed and present the most robust, performant, and idiomatic ways to check for and manage Sanctum tokens during a login sequence.

## Understanding the Pitfall: Why `currentAccessToken()` Fails

The error arises because methods like `currentAccessToken()` rely on the authenticated user being properly hydrated within the request scope. If your login route is executed outside of the standard Sanctum middleware chain, or if `$request->user()` hasn't been successfully populated by the time you call the method, it returns null, leading to the fatal error when trying to access a function on that null object.

Your initial approach attempted to use the token context directly:
```php
if($request->user()->currentAccessToken()){ // Fails if $request->user() is null
    $request->user()->currentAccessToken()->delete();
}
```
While elegant, relying solely on the authenticated user object for mass deletion can be brittle during custom flow implementations.

## The Robust Solution: Direct Database Management for Token Cleanup

For operations that involve cleaning up related records across a model (like deleting all tokens associated with a specific `User` ID), performing a direct database query is often more reliable and performant than navigating Eloquent relationships in complex request flows. This method bypasses potential loading issues related to the authentication context.

The solution you found—using raw SQL queries on the `personal_access_tokens` table—is perfectly valid and highly effective for this specific task:

```php
// 1. Validate credentials and retrieve the user (as you did)
// ...

if (count(DB::table('personal_access_tokens')->where('tokenable_id', $user->id)->get()) > 0) {
    // 2. Delete all existing tokens for this user
    DB::table('personal_access_tokens')->where('tokenable_id', $user->id)->delete();
}

// 3. Create the new token
$token = $user->createToken('ribluma_access_token')->plainTextToken;
```

### Why This Approach Works Best

1.  **Reliability:** It directly addresses the data layer, ensuring that regardless of the request context, you are correctly querying and deleting records from the `personal_access_tokens` table based on the user's ID.
2.  **Performance:** For mass deletion, direct SQL operations are often faster than loading Eloquent models and executing cascading deletes or relationship methods across a potentially large dataset.
3.  **Separation of Concerns:** It cleanly separates the authentication logic (finding credentials) from the token management logic (cleaning up tokens).

When dealing with complex authorization and session management in Laravel, understanding how to interact efficiently with the underlying database is key. For advanced topics on building secure APIs and managing relationships effectively within Laravel, exploring official documentation like [laravelcompany.com](https://laravelcompany.com) is highly recommended.

## Best Practices for Token Handling

While direct querying works well for mass cleanup during a forced re-login, remember the best practice for standard operations:

*   **Use Sanctum Middleware:** Ensure that all routes requiring token verification are protected by the `auth:sanctum` middleware to ensure `$request->user()` is reliably populated.
*   **Scope Management:** If you need to retrieve a user's tokens, always use Eloquent relationships (e.g., `$user->tokens`) rather than raw queries for standard data retrieval.

In summary, when performing token revocation during a login, prioritize database integrity and reliability. Use direct Eloquent methods where possible for fetching related data, but utilize optimized query builders like `DB::table()` when executing mass deletion operations on pivot tables to guarantee success. By combining secure authentication practices with solid database interaction, you build more resilient applications.
