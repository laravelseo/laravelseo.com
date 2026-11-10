---
title: "How to invalidate all tokens for an user in laravel passport?"
description: "How to Invalidate All Tokens for a User in Laravel Passport As developers working with token based authentication systems like Laravel Passport, managing the..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

As developers working with token-based authentication systems like Laravel Passport, managing the lifecycle of access and refresh tokens is crucial for security. When a user logs out or deactivates their account, simply revoking a single token (as you correctly noted) is sufficient for that session. However, the challenge arises when an account is deactivated: we need a mechanism to globally invalidate *every* active token associated with that user across all devices.

This guide will walk you through the correct and efficient way to achieve mass token invalidation in a Laravel Passport environment, moving beyond single-token revocation to ensure complete security upon account deactivation.

## Understanding the Challenge: Specific vs. Global Revocation

When a user logs out, revoking the active access token (often done by targeting the specific `oauth_access_tokens` record) is standard practice. This ensures that device-specific sessions are immediately terminated.

The requirement here is different: account deactivation necessitates wiping all lingering authentication credentials. If a user deletes their account, any existing tokens should be rendered invalid immediately, preventing potential misuse if those tokens were somehow cached or re-used. The key lies in querying the database for all associated tokens and revoking them in bulk.

## The Solution: Mass Revocation via Eloquent

To invalidate all tokens for a user, we need to query the relevant Passport token tables (typically `personal_access_tokens` and/or `oauth_access_tokens`) based on the user ID and perform a mass revocation operation. This approach is more secure and idempotent than relying on client-side invalidation alone.

### Implementation Steps

We will assume you are working within a service class or controller where the account deactivation logic resides. The process involves fetching all tokens linked to the user and iterating through them to revoke each one.

Here is an example demonstrating how you might structure this operation using Eloquent:

```php
use App\Models\User;
use Laravel\Passport\PersonalAccessToken;

class AccountDeactivationService
{
    public function deactivateUser(User $user)
    {
        // 1. Find all personal access tokens associated with the user
        $tokens = $user->tokens()->get();

        if ($tokens->isNotEmpty()) {
            foreach ($tokens as $token) {
                // 2. Revoke each token individually
                $token->revoke();
            }
            // Optional: Log or handle bulk operation success
            \Log::info("Successfully revoked " . $tokens->count() . " tokens for user ID: " . $user->id);
        }

        // 3. Proceed with account deactivation (e.g., soft delete)
        $user->delete(); // Or handle soft deletion if preferred
    }
}
```

### Best Practices and Performance Considerations

1.  **Database Efficiency:** While iterating through the collection works, for extremely large user bases with millions of tokens, consider performing a direct database query to revoke multiple records at once if your ORM supports it efficiently. However, iterating over the Eloquent collection, as shown above, is generally clear, maintainable, and perfectly adequate for most applications when dealing with Passport's token structure.
2.  **Scope Check:** Always ensure that the user object you are operating on is properly authorized to perform this action before touching their session data. This aligns with the principle of least privilege when handling sensitive account management features in Laravel, as advocated by resources like those found at [laravelcompany.com](https://laravelcompany.com).
3.  **Asynchronous Processing:** For very large operations (e.g., deactivating a user who has thousands of tokens), consider pushing this revocation task to a queue worker rather than blocking the HTTP request thread. This improves user experience and system resilience, especially when dealing with complex state changes in Laravel applications.

## Conclusion

Invalidating all tokens upon account deactivation moves your security posture from reactive (revoking one token upon logout) to proactive (cleaning up all session artifacts upon account termination). By leveraging Eloquent relationships within the Laravel Passport framework, you can ensure that user sessions are completely terminated when an account is deactivated. Always prioritize data integrity and performance when managing these critical security pathways.
