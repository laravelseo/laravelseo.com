---
title: "Vue.js / Laravel - Handle logout correctly"
description: "Vue.js / Laravel: Handling Logout Correctly in Token Based SPAs Building a Single Page Application (SPA) with a backend like Laravel, especially when using..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "PHP"]
featured: false
---

Building a Single Page Application (SPA) with a backend like Laravel, especially when using token-based authentication (like Laravel Sanctum or Passport), introduces specific complexities when managing user sessions and logouts. As you’ve discovered, simply removing tokens from `localStorage` on the client side often fails to immediately terminate the session because the server might still process stale information or the client may rely on cached state.

This post will dissect the issue you are facing and provide a robust, developer-approved strategy for implementing secure and immediate logouts in your Vue/Laravel setup.

## The Pitfall of Client-Side Only Logout

Your current approach involves correctly revoking tokens on the Laravel backend:

```php
// AuthController.php snippet
public function logout()
{
    $accessToken = auth()->user()->token();
    // Revoke refresh token
    DB::table('oauth_refresh_tokens')
        ->where('access_token_id', $accessToken->id)
        ->update(['revoked' => true]);

    // Revoke access token
    $accessToken->revoke();

    return response()->json(['status' => 200]);
}
```

This server-side revocation is crucial. However, the failure to log out *immediately* on the client side stems from a disconnect between what the browser *thinks* it needs to do (clear local storage) and what the application *needs* to enforce (session invalidation across all subsequent requests). When a user navigates to a protected route, the frontend might still attempt an API call using a token that hasn't been fully invalidated in the client's context, or the session state on the server isn't immediately reflected for routing decisions.

## The Correct Strategy: Server-Driven Session Termination

For true security and immediate logout, the logout process must be authoritative—meaning the server dictates the session status. While client-side cleanup is necessary for UX, it should not be the sole mechanism for security enforcement.

The most reliable pattern involves ensuring that when a user attempts to access any protected resource, the API gateway checks the token's validity *before* granting access.

### Step 1: Backend Enforcement (Laravel)

Your backend logic for revocation is sound, but we must ensure it’s tied directly to the authentication guard. Ensure you are using Laravel's built-in mechanism correctly. For instance, if you are using Sanctum or Passport, simply revoking the token via the model relationship usually suffices *if* your middleware correctly checks this revocation status on every request.

### Step 2: Frontend Cleanup and Redirection (Vue)

The Vue application’s job is to handle the user experience—clearing local state and redirecting them immediately. The redirection should happen *after* a successful confirmation that the logout request was accepted by the server.

Modify your `Layout.vue` method to prioritize the redirect immediately upon receiving a success response:

```javascript
// Layout.vue methods
methods: {
    async logout() {
        try {
            const response = await axios.post('/api/logout');
            
            // 1. Successfully received server confirmation (token revoked)
            localStorage.removeItem('token');
            localStorage.removeItem('expiration');

            // 2. Immediately redirect the user to the login page
            this.$router.push("/login");

        } catch (error) {
            console.error("Logout failed:", error);
            // Handle errors gracefully, perhaps reload or show a message
            location.reload();
        }
    }
}
```

By making this an `async` operation and ensuring the redirection follows the successful API response, you create a transactional flow. The user is not left in an ambiguous state; they receive confirmation (or error) from the server before the client-side state changes are finalized.

## Best Practices for Secure Token Handling

To further solidify your session management, focus on these principles, which align with secure architectural patterns promoted by organizations like [laravelcompany.com](https://laravelcompany.com):

1.  **Statelessness via Tokens:** Rely on the token itself for authorization, keeping your API stateless. The token is the proof of identity; its validity must be checked on every request.
2.  **Token Invalidation as Key:** Ensure that any mechanism used to revoke a token (like in your `logout` method) is immediately respected by all subsequent middleware checks. If you are using Laravel Sanctum, ensure your API routes are protected by the `auth:sanctum` middleware, which handles the token validation inherently.
3.  **Session vs. Token:** For SPAs, tokens (like JWTs or Sanctum tokens) manage authorization for API calls, while server-side sessions manage application state. A logout should primarily invalidate the token and redirect the user away from authenticated views.

## Conclusion

The issue you encountered is a common synchronization problem between frontend UX and backend security enforcement. By shifting the responsibility of session termination to the backend (revoking tokens) and ensuring the frontend reacts immediately to that server confirmation (clearing local storage and redirecting), you create a robust, secure logout flow. Always treat API calls as transactions: confirm success on the server before finalizing client-side state changes.
