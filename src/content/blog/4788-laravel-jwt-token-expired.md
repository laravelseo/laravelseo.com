---
title: "Laravel : JWT token expired"
description: "Laravel JWT Troubleshooting: Why Your Token Still Shows 'Expired' Despite Null TTL As a senior developer working with token based authentication in Laravel,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a senior developer working with token-based authentication in Laravel, you often run into subtle yet frustrating issues, especially when dealing with JWT expiration. The scenario you are describing—setting `'ttl' => null` and removing the `'exp'` claim from your configuration, yet still seeing an "token expired" message—points not just to a simple configuration error, but often to a misunderstanding of how token revocation and session management interact within the Laravel ecosystem.

This post will dive deep into why this happens with the popular `tymondesigns/jwt-auth` package, explore alternative methods for managing token lifecycles, and provide practical solutions rooted in robust architectural design.

## Understanding JWT TTL vs. Token Revocation

When you set `'ttl' => null`, you are telling the JWT library that the token itself should never expire based on its internal timestamp. However, simply removing the standard `exp` claim from the payload does not magically remove the expiration check enforced by the authentication middleware or the underlying storage mechanism.

The "token expired" message is usually triggered when the system checks two things:
1. **Token Payload Validity:** Is the token structurally sound? (Handled by JWT decoding.)
2. **Session/Blacklist Validity:** Has this specific token been explicitly invalidated or revoked by the server?

If your application relies on a session or user status stored in the database, and that state is tied to a finite time window, the perceived expiration might be related to the *user's session* rather than the JWT itself.

## Deep Dive into Your Configuration and Potential Fixes

Let’s analyze your provided configuration snippet from `config/jwt.php`:

```php
'ttl' => null, // Token never expires internally
// 'exp', remove token expire time (implicitly, by not listing it)
'blacklist_enabled' => env('JWT_BLACKLIST_ENABLED', true),
```

While setting `ttl` to `null` removes the JWT’s built-in expiration mechanism, the persistence of the error suggests that somewhere in your application logic—perhaps in a custom middleware or an external service layer—a check is being performed that relies on time-bound data.

### The Role of Blacklisting

The most powerful tool you have for immediate token invalidation is the blacklist feature provided by the package. If a user logs out, changes their password, or an administrator revokes a token, you must explicitly add that token's ID (`jti` claim) to the blacklist storage (e.g., Redis or a database).

If the "expired" error persists, it strongly suggests that the mechanism checking the token is looking for revocation status *before* it checks the internal TTL.

**Actionable Step:** Ensure that whenever you invalidate a token, you are logging it correctly to the blacklist.

```php
use Tymon\JWTAuth\Facades\JWTAuth;

// Example: Revoking a token immediately upon logout
$tokenId = JWTAuth::fresh()->getClaim('jti'); // Get the unique ID of the token
Redis::set("blacklist:{$tokenId}", true); // Store it in Redis for quick lookup
```

## Architectural Best Practices with Laravel

When dealing with stateful security mechanisms like JWTs in a Laravel application, remember that the framework encourages a layered approach to security. While JWTs are stateless (the token holds all necessary information), your application logic must remain stateful regarding user sessions and permissions. This principle is fundamental to building scalable systems on platforms like **Laravel** (`https://laravelcompany.com`).

Instead of relying solely on the internal `exp` claim, treat the JWT as a key to access ephemeral data stored in your database or cache. If you need time-bound access (e.g., a session that expires after 30 minutes), manage that expiry in your application layer rather than trying to force it into the JWT payload itself.

### A Robust Approach: Hybrid Token Strategy

For maximum control, consider a hybrid approach:

1.  **Short-Lived Access Token:** Keep the access token short-lived (e.g., 5–15 minutes) with a defined `ttl`. This limits the damage if a token is compromised.
2.  **Long-Lived Refresh Token:** Use a separate, long-lived refresh token that is revocable upon logout or security events. When the access token expires, the client uses the refresh token to obtain a new access token.

This strategy gives you both the stateless convenience of JWTs and the necessary state management required for robust session control.

## Conclusion

The persistence of the "token expired" message despite setting `ttl => null` strongly indicates that the issue lies outside the simple time-to-live configuration and is rooted in **token revocation status**. Focus your debugging efforts on verifying how you are interacting with the blacklist functionality. By implementing explicit blacklisting for revoked tokens, and adopting a hybrid token strategy, you will establish a secure, predictable, and highly manageable authentication system within your Laravel application.
