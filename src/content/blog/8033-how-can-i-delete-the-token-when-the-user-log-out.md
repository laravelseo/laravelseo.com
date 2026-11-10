---
title: "How can I delete the token when the user log out?"
description: "How to Delete Access Tokens Upon User Logout in Laravel: A Practical Guide Building secure, token based APIs is the cornerstone of modern web development...."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Building secure, token-based APIs is the cornerstone of modern web development. When users log in, they receive an access token that grants them access to protected resources. The logical next step in securing the session is ensuring that when a user explicitly logs out, that access token is immediately invalidated on the server side.

This guide will walk you through the correct implementation for deleting access tokens after a user logs out in a Laravel application, focusing on best practices using Laravel's authentication and token management features.

## Understanding Token-Based Authentication in Laravel

In your setup, you are utilizing a pattern common with Laravel Sanctum (or similar token systems) where an access token is generated upon successful login and is sent with every subsequent API request. This token acts as the user's session credential for accessing protected endpoints.

The core challenge is not just clearing a database entry; it’s ensuring that when a client sends this token to your `/logout` endpoint, you successfully revoke its authority.

As we explore this, remember that Laravel provides robust tools for managing these relationships, which is key to maintaining data integrity and security across your application, much like the architecture promoted by the team at [laravelcompany.com](https://laravelcompany.com).

## Implementing the Logout Functionality

The mechanism you proposed—iterating through the user's tokens and deleting them—is exactly the right approach. The key is ensuring that this logic is executed *only* for the currently authenticated user.

Let's refine your `logout` method within your `UserController`. We will ensure we are correctly targeting the tokens associated with the currently logged-in user, which is automatically provided by the `Auth::user()` helper.

Here is the complete, robust implementation for your logout functionality:

```php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User; // Assuming you have a User model

class UserController extends Controller
{
    // ... (login and register methods remain the same)

    /**
     * Logout Method: Deletes all access tokens for the authenticated user.
     */
    public function logout()
    {
        // 1. Ensure a user is authenticated
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // 2. Delete all tokens associated with the authenticated user
        // This iterates over the relationships configured for your token model (e.g., PersonalAccessToken)
        $user = Auth::user();
        $user->tokens()->delete(); // A cleaner, more direct way if using Eloquent relationships

        /* 
         * Alternative approach (if you are strictly dealing with raw tokens):
         * Auth::user()->tokens()->each(function($token) {
         *     $token->delete();
         * });
         */
        
        return response()->json([
            'message' => 'Logged out successfully!',
            'status_code' => 200
        ], 200);
    }

    // ... (other methods)
}
```

### Why This Approach Works

1.  **Contextual Security:** By calling `Auth::user()`, you guarantee that the deletion operation is scoped only to the tokens belonging to the user making the request. This prevents one user from accidentally deleting another user's access token.
2.  **Token Invalidation:** When you call `$user->tokens()->delete()` (or the iterative equivalent), you are directly instructing the database to remove the record representing that specific access token. Once deleted, any attempt by the client to use that token for further API calls will fail authentication checks, effectively logging the user out.
3.  **API Flow:** When a client sends the `logout` request with their Bearer token, your backend verifies the token, identifies the owner, and immediately revokes all associated tokens, achieving a clean session termination.

## Securing Your Routes

Finally, ensure your routing setup properly protects this endpoint. As you correctly identified, grouping routes with middleware is essential for security.

In your `api.php` file, ensure that only authenticated users can access the logout route:

```php
Route::middleware('auth:api')->group(function(){
    // This route requires a valid token to be present and authenticated
    Route::get('logout', 'App\Http\Controllers\UserController@logout');
});
```

By following these steps, you establish a secure and reliable logout mechanism. You have successfully implemented a server-side revocation process, which is the most critical step in managing stateless API authentication. Always prioritize security when dealing with user sessions and tokens!
