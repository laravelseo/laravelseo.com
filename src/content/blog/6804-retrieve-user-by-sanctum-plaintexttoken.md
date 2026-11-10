---
title: "Retrieve user by Sanctum plainTextToken"
description: "How to Retrieve the 'Logged In' User from a Sanctum Token As developers working with API authentication systems like Laravel Sanctum, managing user state..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers working with API authentication systems like Laravel Sanctum, managing user state across requests is fundamental. When dealing with token-based authentication, the challenge often lies in securely linking an incoming token back to the actual user entity that owns it, especially when performing actions like logging out or revoking access.

This post will walk you through the correct way to retrieve the authenticated user from a Sanctum plain text token and demonstrate how to effectively manage session revocation.

## Understanding Sanctum Token Flow

Your provided login method correctly uses Sanctum to issue a token:

```php
public function login(Request $request)
{
    if (Auth::attempt($request->toArray())) {

        /* @var User $user */
        $user = $request->user(); // This retrieves the authenticated user based on session/credentials

        // Create the token
        $token = $user->createToken('web-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], Response::HTTP_OK);
    }
}
```

In this flow, the `Auth::attempt()` method validates credentials and establishes a session (or authenticates the user via Sanctum's mechanism). When you call `$request->user()`, you are retrieving the model instance that is currently associated with the authenticated request. This is the core link between the incoming request and your database user.

## Retrieving the User in Protected Routes

When setting up protected routes using Sanctum middleware, Laravel automatically populates the `Auth` facade. Any controller method or route closure protected by the `'auth:sanctum'` middleware will have access to the authenticated user via `Auth::user()`.

If you are inside a route handler that has successfully passed the Sanctum check, retrieving the user is straightforward:

```php
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function showProfile(Request $request)
    {
        // Retrieve the authenticated user from the token/session context
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'User not found'], 401);
        }

        return response()->json([
            'message' => 'Welcome, ' . $user->name,
            'user_id' => $user->id,
        ]);
    }
}
```

This mechanism ensures that every time a request hits your application, the user context is established based on whatever token or session information is provided. This principle of state management is crucial for building secure applications, much like how Laravel handles authorization and authentication seamlessly.

## Revoking the Token: The Logout Process

Your attempt to log out by just calling `dd($request->user())` is insufficient because that only shows you *who* is currently making the request; it doesn't tell you how to invalidate the token itself for future requests. To truly log out and revoke access, you need to identify the specific token being used and delete it from the database.

When a user logs out, they typically send the plain text token back in the request headers (e.g., `Authorization: Bearer <token>`). You must extract this token, find the corresponding token record in the `personal_access_tokens` table, and delete it.

Here is the comprehensive approach for a custom logout method:

```php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TokenController extends Controller
{
    public function logout(Request $request)
    {
        // 1. Ensure the user is authenticated via the token request
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Not authenticated'], 401);
        }

        // 2. Revoke the specific token used for this request
        // Sanctum provides a clean way to revoke tokens associated with the user.
        $user->tokens()->delete(); // This revokes ALL tokens for the user, or you can target a specific token ID if needed.
        
        // For single-token revocation, you would typically retrieve the token ID from $request->bearerToken 
        // and use $request->user()->tokens()->where('id', $tokenId)->delete();

        return response()->json(['message' => 'Successfully logged out and token revoked.']);
    }
}
```

### Best Practice Summary

1.  **Rely on Middleware:** For standard route protection, always rely on Laravel's built-in Sanctum middleware to handle the initial authentication check.
2.  **Context is Key:** The authenticated user object (`Auth::user()`) is the bridge between the incoming request and your application state.
3.  **Token Revocation Strategy:** When implementing logout, focus on deleting the specific token record associated with that session rather than just stopping the current request flow.

By mastering how to retrieve the authenticated context and how to interact with the token system, you can build robust and secure API endpoints. For more advanced details on Laravel authentication features, always refer back to resources like [https://laravelcompany.com](https://laravelcompany.com).
