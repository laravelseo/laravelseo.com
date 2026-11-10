---
title: "Verify third party JWT with Laravel"
description: "Verifying Third Party JWTs with Laravel: Mastering Asymmetric Signature Validation As developers integrating modern microservices and external identity..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

As developers integrating modern microservices and external identity providers, handling JSON Web Tokens (JWTs) is a daily necessity. You are correct in your assessment: while packages like `tymondesigns/jwt-auth` excel at *creating* tokens, they often fall short when it comes to complex, robust *validation* against external, asymmetric signing keys provided via JWKS endpoints.

This post will walk you through the technical requirements for validating third-party JWTs in a Laravel application and guide you toward the best architectural approach, focusing specifically on solving that crucial signature verification step.

---

## The Anatomy of JWT Validation

When your custom API receives a bearer token, validation is not a single step; it’s a multi-layered security check. To ensure the token is both authentic and trustworthy, you must follow the sequence you outlined:

1.  **Parse the JWT:** Decode the header, payload, and signature to extract the claims.
2.  **Validate the Signature (The Hard Part):** This confirms that the token was signed by the expected party (your Identity Provider) using the correct private key. Since your provider uses RS256 via a JWKS endpoint, you need to fetch their public keys from `https://{domain}/.well-known/jwks.json` and use them to verify the signature against the token's header.
3.  **Validate Standard Claims:** Check expiration (`exp`), issuer (`iss`), and audience (`aud`) claims to ensure temporal and intended validity.
4.  **Check Custom Permissions (Scopes):** Verify that the token contains the necessary scopes or roles required for access to the specific microservice endpoint.

The difficulty lies in step #2. Most token libraries abstract away the complexity of fetching public keys from JWKS; therefore, finding a package that seamlessly integrates this dynamic key retrieval into the standard Laravel flow can be challenging.

## The Solution: Custom Implementation with Established Tools

While a single "magic bullet" package might not exist for every niche setup, the most robust and secure solution is often to leverage established PHP cryptography libraries in conjunction with your knowledge of OAuth 2.0/OIDC standards. This approach gives you complete control over the validation process, which is critical when dealing with sensitive API access.

We recommend using a library like `firebase/php-jwt` for the initial token parsing and signature verification, combined with custom logic to handle the JWKS fetching.

### Step-by-Step Implementation Guide

#### 1. Fetching the Public Keys (JWKS)

Before validating any incoming token, your application must securely fetch the public keys from the Identity Provider's JWKS URL. This is typically done once or periodically to cache the keys for faster validation.

```php
use GuzzleHttp\Client;

class KeyFetcher
{
    protected $client;
    protected $jwksUrl;
    protected $keys = [];

    public function __construct(string $jwksUrl)
    {
        $this->jwksUrl = $jwksUrl;
        $this->client = new Client();
    }

    public function fetchKeys()
    {
        $response = $this->client->request('GET', $this->jwksUrl);
        $data = json_decode($response->getBody()->getContents(), true);
        
        // Store the public keys, typically mapping the 'kid' (Key ID) to the public key
        $this->keys = $data['keys'] ?? []; 
    }

    public function getKey($kid)
    {
        // Logic here to find the correct public key based on the token's 'kid' header value
        if (!isset($this->keys[$kid])) {
            throw new \Exception("Public key not found for KID: " . $kid);
        }
        return $this->keys[$kid]['n']; // Return the modulus (public key component)
    }
}
```

#### 2. Validating the Token

Once you have the public key, you can use the `firebase/php-jwt` library to perform the actual signature check. This process ensures that the token has not been tampered with since it was issued by the trusted provider.

```php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

// Assuming $token is the incoming JWT string and $publicKey is fetched from JWKS
try {
    $decoded = JWT::decode($token, new Key($publicKey, 'RS256'));

    // 3. Validate Standard Claims (Expiration, Issuer, Audience)
    if ($decoded->iss !== 'https://your-idp.com' || $decoded->aud !== 'your-api-client') {
        throw new Exception('Invalid token claims.');
    }

    // 4. Custom Scope/Permission Check
    if (!in_array($decoded->scope, ['read', 'write'])) {
         throw new Exception('Insufficient permissions.');
    }

    return $decoded;

} catch (Exception $e) {
    // Handle invalid signature, expired token, or claim errors
    return response()->json(['error' => 'Token validation failed', 'message' => $e->getMessage()], 401);
}
```

## Conclusion: Building Trust in Your API

Validating third-party JWTs is a cornerstone of building secure, distributed systems. By moving away from relying solely on token creation packages and embracing a modular approach—combining robust cryptographic libraries with custom logic that adheres to OIDC standards—you gain the necessary control. This method ensures your Laravel application remains resilient, secure, and fully compliant, reinforcing the architectural principles that guide modern frameworks like those promoted by **Laravel** and its ecosystem. Remember, security is not a feature you bolt on; it's the foundation you build upon.
