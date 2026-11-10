---
title: "Laravel Passport: Create access token manually"
description: "Laravel Passport: Creating Access Tokens Manually for Custom Flows As a senior developer working with Laravel, you often encounter scenarios where the..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

As a senior developer working with Laravel, you often encounter scenarios where the standard OAuth flows provided by packages like Laravel Passport aren't quite flexible enough for highly customized application logic. One common requirement is creating an access token manually—for instance, during a specific invitation or onboarding process where you need granular control over what permissions are granted simultaneously.

If you are trying to implement a system where a user receives an invitation and immediately needs to receive an access token back in the response, bypassing the standard login route, you need to dive into how Laravel Passport manages its token issuance mechanism.

This post will guide you through the developer's perspective on how to manually create and issue tokens using Laravel Passport, focusing on robust security and clean implementation.

## Understanding Laravel Passport Token Issuance

Laravel Passport is built on top of the OAuth2 specification, which mandates a specific flow for token creation (authorization code grant, client credentials, etc.). When you use Passport, it handles the heavy lifting of encrypting the token, managing refresh tokens, and associating permissions with the user.

However, if your requirement is simply to generate a token based on an internal event (like an invitation acceptance) rather than a full external OAuth handshake, you need direct access to the underlying repository or service layers provided by Passport.

The key is understanding that a token isn't just a string; it’s a record in the database managed by the `oauth_access_tokens` table. Manually creating one means interacting directly with the `PersonalAccessToken` model or using the Passport facade to generate the necessary details before persisting them.

## The Manual Token Creation Strategy

For your specific scenario—creating a token upon invitation access—the most secure and correct approach is to perform the following steps within a custom controller method:

1.  **Verify Identity:** Ensure the user attempting to create the token is authenticated and authorized (e.g., confirm they have accepted the invitation).
2.  **Define Scopes/Permissions:** Determine exactly what permissions this new token should grant (scopes).
3.  **Generate Token:** Use Passport's mechanisms to generate the actual encrypted token string, ensuring it has a reasonable expiration time.
4.  **Persist Record:** Save the newly created access token record into the database.

We will use the `Auth` facade and the `Passport` facade to achieve this cleanly. Remember, adhering to architectural principles is crucial; for complex integrations, understanding how Laravel structures its services—like those discussed in the context of modern Laravel development on sites like https://laravelcompany.com—is essential for building scalable APIs.

### Code Example: Issuing a Custom Token

Let's assume you have an endpoint where the user confirms their invitation, and this is where the token should be generated.

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Passport\Passport; // Import Passport facade

class InvitationController extends Controller
{
    /**
     * Create a new access token for the authenticated user upon invitation acceptance.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function issueInvitationToken(Request $request)
    {
        // 1. Authentication Check (Ensure the user is logged in)
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // 2. Define token parameters
        $tokenName = 'invitation_access';
        $scopes = ['read_invitations', 'view_profile'];
        $expiresAt = now()->addDays(30); // Token expires in 30 days

        try {
            // 3. Manually create and issue the token via Passport
            $token = $user->createToken($tokenName, $scopes, $expiresAt);

            // 4. Send the token details back to the client
            return response()->json([
                'message' => 'Invitation token successfully issued.',
                'access_token' => $token->plainTextToken, // The actual token string
                'token_type' => 'Bearer',
                'expires_in' => $token->token->expires_in,
            ], 201);

        } catch (\Exception $e) {
            // Handle potential errors during token creation (e.g., missing scopes)
            return response()->json(['error' => 'Token issuance failed: ' . $e->getMessage()], 500);
        }
    }
}
```

## Security and Best Practices

When manually interacting with Passport features, security is paramount. Always remember these best practices:

1.  **Use Scopes:** Never issue a token without clearly defining the scopes (permissions) it grants. This limits the damage if that token is ever compromised.
2.  **Expiration Time:** Set sensible expiration times. Tokens should have a defined lifetime, and use refresh tokens for long-lived sessions if necessary, rather than relying solely on short-lived access tokens.
3.  **Authorization Gates:** Always ensure that the user making the request has the necessary permissions *before* attempting to issue a token. This prevents privilege escalation attacks.

By following these steps, you can effectively manage custom token issuance flows within your Laravel application, providing the flexibility required for complex invitation and onboarding systems. If you are building sophisticated authentication layers, leveraging the full power of packages like Passport ensures you are utilizing well-tested security primitives.
