---
title: "How to add custom claims to laravel-passport Access token?"
description: "How to Add Custom Claims to Laravel Passport Access Tokens As developers leveraging Laravel Passport for authentication, you are familiar with its..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

As developers leveraging Laravel Passport for authentication, you are familiar with its foundation: JSON Web Tokens (JWT). While Passport handles the heavy lifting of token issuance and validation, understanding how to inject custom data—or "claims"—into that token is crucial for building sophisticated, context-aware APIs.

You are asking a perfectly valid question: If I use Laravel Passport, can I add claims like `2fa_status` to my Access Token so they are available during API calls? The short answer is **yes, absolutely**. This process involves customizing the payload when the token is generated.

This post will walk you through the technical mechanism of adding custom claims to your Laravel Passport tokens and how to consume that data securely in your API endpoints.

---

## Understanding JWT Claims

Before diving into the implementation, it’s important to understand what a JWT claim is. A JWT payload consists of three parts: the header, the payload (claims), and the signature. The payload contains the claims—statements about an entity (typically the user) and additional metadata. Standard claims like `sub` (subject), `exp` (expiration time), and `iat` (issued at) are mandatory for any JWT.

Custom claims are arbitrary key-value pairs you define to carry specific, application-specific information. For example, instead of just verifying who the user is, you might want to verify their 2FA status or roles directly within the token itself.

## Implementing Custom Claims with Laravel Passport

Laravel Passport leverages the underlying JWT library. To add custom claims, you need to intercept the token creation process and manually inject your data into the token payload before it is signed and issued.

This customization usually happens within the logic that generates the token, often leveraging the `createToken` method provided by the Passport guard.

Here is a conceptual example demonstrating how you would modify the token creation process to include custom claims, such as `2fa_status`:

```php
use Laravel\Passport\ApiToken;

// Assume $user is the authenticated Eloquent model
$user = User::findOrFail($userId);

// 1. Define the custom claims you want to add
$customClaims = [
    '2fa_status' => true, // Example: Set 2FA status to true
    'role' => 'admin',     // Example: Add a role claim
];

// 2. Create the token using the standard method
$tokenResult = $user->createToken('Personal Access Token');

// 3. Manually inject the custom claims into the token payload
// Note: In modern Passport implementations, this often involves manipulating the token data before final serialization, 
// or ensuring your token generation logic handles these extensions correctly when using custom scopes/abilities.
$token = $tokenResult->plainTextToken; // Or use the token object specific to your setup

// For demonstration purposes, if you are manually constructing the payload (which is advanced), 
// you would structure it like this before passing it to the JWT encoder:
$payload = [
    'aud' => '7',
    'jti' => $tokenResult->id,
    'iat' => time(),
    'exp' => time() + (60 * 60), // Token expires in one hour
    'sub' => $user->id,
    'scopes' => ['read', 'write'], // Passport scopes are standard
    '2fa_status' => $customClaims['2fa_status'], // <-- Injecting the custom claim
];

// In a real scenario, you would ensure your token serialization mechanism accepts and includes these extra fields.
```

**Best Practice Note:** While the above shows the concept, in many Passport setups, the structure of the token payload is dictated by the core JWT library bindings. The most robust way to handle custom claims that need to be universally readable is often to extend or customize the Passport token entity itself, ensuring these fields are part of the standard token serialization chain. This level of detail in handling authentication artifacts aligns with the architectural quality seen across the **Laravel Company** ecosystem.

## Retrieving Custom Claims in API Calls

Once the token is issued containing these custom claims, the next step is to ensure your API endpoints can read them. When a request hits your protected route, Passport automatically decrypts and validates the JWT. The resulting decoded payload will contain all the claims you embedded.

In your controller or service layer, after successfully authenticating the user via Passport middleware, you access the token payload directly. If you structured your token correctly, these custom fields will be available immediately:

```php
// Example within an authenticated route handler
public function getUserData(Request $request)
{
    // The authenticated user object already contains the claims embedded in the token
    $user = $request->user(); 

    // Accessing the custom claim directly from the payload data associated with the token
    $twoFAStatus = $request->user()->token()->payload()['2fa_status']; 
    
    return response()->json([
        'user_id' => $user->id,
        'name' => $user->name,
        'two_factor_enabled' => $twoFAStatus // Successfully retrieved custom claim
    ]);
}
```

## Conclusion

Adding custom claims to Laravel Passport access tokens is entirely achievable by extending the data structure that your JWT payload contains. It moves beyond simple identity verification into providing rich, context-specific information directly within the token. By carefully managing the serialization and deserialization of these claims, you can build highly flexible and efficient APIs. Always ensure that any custom fields you introduce are clearly documented and handled consistently across your application to maintain robust security and data integrity.
