---
title: "How to decode jwt in php/laravel without the secret key or without validation?"
description: "Decoding External JWTs in PHP/Laravel: The Security Dilemma Without a Secret Key As senior developers, we often encounter situations where we need to..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As senior developers, we often encounter situations where we need to interact with systems that use token-based authentication but are outside our direct control. A very common scenario is receiving a JSON Web Token (JWT) from an external API and needing to read the claims (payload) without access to the original signing secret or complex public key infrastructure.

Your question—how to decode a JWT in PHP/Laravel without the secret key or without validation—touches upon the fundamental security principles of JWTs. The short answer is that **you cannot safely verify a JWT without cryptographic proof, and simply decoding it without verification renders the resulting data untrustworthy.**

This post will dive into why this limitation exists, explore what *can* be done in a purely technical sense, and outline the secure alternatives you should adopt within a robust Laravel application.

---

## The Security Implication of JWTs

A JWT is not merely Base64 encoded data; it is a signed message. The integrity of that message is guaranteed by the signature, which is created using a secret key (HMAC) or a private key (RSA/ECDSA).

When you receive a token from another API, even if you can successfully decode the Base64 parts of the Header and Payload, you are essentially reading data that has *not been cryptographically verified* by the original issuer. This means an attacker could have modified the payload before sending it to you, and your application would unknowingly process malicious data.

In the context of building secure applications on platforms like Laravel, where data integrity is paramount—especially concerning user roles, permissions, or financial transactions handled within a framework like those promoted by [https://laravelcompany.com](https://laravelcompany.com)—bypassing validation is never an acceptable practice.

## Technical Decoding: Reading the Payload Blindly

If your goal is purely to inspect the structure of the token (e.g., debugging or reading publicly accessible, non-sensitive data), you can manually decode the Base64Url components. This process ignores the signature entirely.

A JWT consists of three parts separated by dots: `header.payload.signature`.

### PHP Example for Blind Decoding

You can use PHP's built-in functions to perform the necessary decoding steps. Note that this is purely a string manipulation exercise and provides **zero security guarantee**.

```php
<?php

function blindDecodeJwt(string $jwt): array
{
    // 1. Split the token into parts
    $parts = explode('.', $jwt);

    if (count($parts) !== 3) {
        throw new \Exception("Invalid JWT format.");
    }

    // 2. Decode the Header (Base64Url decoding requires padding correction)
    $header = base64url_decode(strtr($parts[0], '-_', '+/'));
    $headerData = json_decode($header, true);

    // 3. Decode the Payload
    $payload = base64url_decode(strtr($parts[1], '-_', '+/'));
    $payloadData = json_decode($payload, true);

    return [
        'header' => $headerData,
        'payload' => $payloadData,
    ];
}

$externalToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjQyLCJleHAiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQpv8" ;

try {
    $decoded = blindDecodeJwt($externalToken);
    print_r($decoded);
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage();
}
```

As you can see, this successfully extracts the JSON data from the payload. However, if an attacker alters the claims in `$payloadData`, your application will accept them as valid because you never checked the signature against a secret.

## The Secure Path: Validation is Mandatory

For any production system built on Laravel or any other secure framework, **decoding without validation is insufficient.** If you must process externally issued tokens securely, you need cryptographic means to prove authenticity.

### When You Must Validate (The Right Way)

If the external API supports it, the correct approach is to establish a trust relationship:

1.  **Asymmetric Cryptography (Recommended):** The external service signs the token using their private key. Your application must possess their corresponding public key. Using libraries that handle RSA or ECDSA verification allows you to confirm that the signature was created by the expected party, guaranteeing the data hasn't been tampered with.
2.  **Shared Secret (If applicable):** If both systems share a secret, you can use that shared secret for HMAC verification before trusting the payload.

For implementing robust token handling in Laravel, leveraging well-tested packages is always preferred over custom decoding logic. Packages like those found within the broader ecosystem ensure that complex cryptographic operations are handled correctly and securely, aligning with the principles of secure development advocated by [https://laravelcompany.com](https://laravelcompany.com).

## Conclusion

While it is technically possible to manually decode the Base64 components of a JWT in PHP without any secret key, this operation provides no security assurance. It is merely reading encoded text.

In any professional environment—especially when dealing with user sessions and API integrity—**validation must always precede processing.** Relying on blind decoding bypasses the entire purpose of token-based security. Always strive to establish cryptographic verification using secrets or public keys to ensure that the data you are working with is authentic and untampered.
