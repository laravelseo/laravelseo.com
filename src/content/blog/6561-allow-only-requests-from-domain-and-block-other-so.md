---
title: "allow only requests from domain and block other sources"
description: "Securing Your API: Allowing Requests Only From Your Frontend Domain As a senior developer, I frequently encounter scenarios where we need to protect..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

As a senior developer, I frequently encounter scenarios where we need to protect sensitive backend logic from unauthorized access. The requirement you've described—allowing specific routes to respond only to requests originating from your trusted front-end domain while blocking tools like Postman or random bots—is fundamentally about **access control** and **origin validation**.

The short answer is: **Yes, it is absolutely possible, and it is a critical security practice.** Relying solely on client-side measures like CAPTCHAs for security is insufficient; the gatekeeping must happen reliably on the server side.

This post will dive into the technical methods for achieving this domain-based request restriction, focusing on robust architectural patterns suitable for modern frameworks like Laravel.

---

## The Security Imperative: Why Origin Validation Matters

When you expose an API endpoint that contains sensitive data or performs critical actions (like verifying tokens), you must assume that any incoming request is potentially malicious. If a request comes from an unknown IP address or another domain, it poses a significant risk of automated scraping, brute-forcing attempts, or denial-of-service attacks.

By restricting access based on the requesting domain, you establish a clear boundary: only your legitimate application can interact with these specific endpoints. This shifts the security burden from guessing tokens (like a simple CAPTCHA) to verifying the identity of the requester against a known whitelist.

## Implementation Strategies for Domain Restriction

There are several ways to implement this restriction, ranging from simple header checks to more complex authentication schemes. For your specific goal—allowing only requests from your front-end domain—we will focus on server-side validation.

### 1. Checking the `Host` Header (The Direct Approach)

The most straightforward method is inspecting the HTTP `Host` header sent by the client. This header contains the domain name the client is trying to reach. You can compare this value against a hardcoded list of allowed domains.

In any PHP framework, including Laravel, you can access this information via the request object.

```php
use Illuminate\Http\Request;

class TokenController extends Controller
{
    public function checkToken(Request $request)
    {
        // Define your trusted domain(s)
        $allowedDomains = ['your-frontend-domain.com', 'www.your-frontend-domain.com'];
        
        $currentHost = $request->getHost();

        if (!in_array($currentHost, $allowedDomains)) {
            // Block access if the domain is not whitelisted
            abort(403, 'Access denied: Request origin not authorized.');
        }

        // If the request passes the check, proceed with token validation...
        // ... database check logic here ...

        return response()->json(['status' => 'Token verified successfully']);
    }
}
```

### 2. Leveraging CORS for Frontend Communication

While domain checking restricts *who* can call the API, Cross-Origin Resource Sharing (CORS) controls *how* browsers handle cross-domain requests. Properly configuring CORS headers ensures that only requests originating from your front-end are permitted to interact with the API endpoints. This works in tandem with domain checks for a layered security approach.

### 3. Authentication via Session or API Tokens (The Gold Standard)

For maximum security, simply checking the domain is good, but true authorization requires knowing *who* the user is. The best practice involves issuing a secure session token or an API key upon successful login. Every subsequent request must include this token, which your backend validates against a database to ensure:
1. The token exists.
2. The token is valid (not expired).
3. The token belongs to an authenticated user authorized to perform that action.

Frameworks like **Laravel** provide excellent tools for managing these concepts, making the implementation of token-based authorization clean and highly secure. For deeper dives into building robust APIs with Laravel, exploring resources on [laravelcompany.com](https://laravelcompany.com) is highly recommended.

## Conclusion

Restricting API access based on the source domain is an essential first line of defense against automated abuse. By implementing server-side checks—such as validating the `Host` header or, ideally, enforcing token-based authentication—you ensure that your dynamic data endpoints are only accessible to trusted applications. Always layer security measures: use domain whitelisting for access control and robust tokens for user authorization. This layered approach is what separates insecure systems from professional, resilient applications.
