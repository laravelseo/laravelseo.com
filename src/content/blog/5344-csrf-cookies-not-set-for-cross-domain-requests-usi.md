---
title: "CSRF Cookies Not Set for Cross Domain Requests using Laravel Sanctum and Angular"
description: "Solving CSRF Cookie Mismatches with Laravel Sanctum and Angular SPAs Across Domains Overview Dealing with cross domain authentication, especially when..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

## Overview

Dealing with cross-domain authentication, especially when integrating a backend API like Laravel Sanctum with a Single Page Application (SPA) like Angular, often introduces complex challenges related to Cross-Origin Resource Sharing (CORS) and cookie management. The scenario you've described—where the initial CSRF token request works on the server side but no cookies are set in the browser, leading to subsequent authentication failures—is a classic symptom of misconfigured cross-domain credential handling.

You are attempting to bridge two distinct origins (`http://tenant.api.hydrogen.local` for the API and `http://localhost:8100` for the SPA), and Sanctum relies on setting session/CSRF cookies that must be correctly scoped across these boundaries. While you have implemented several relevant settings (like `SESSION_DRIVER=cookie`, `supports_credentials = true`), the failure suggests a subtle mismatch in how the browser interprets the cookie domain versus the origin headers being sent.

This post will dissect why this happens and provide the definitive, robust configuration required to ensure Sanctum's stateful authentication mechanism functions correctly when dealing with separate domains.

## The Root Cause: Domain and Cookie Scoping Issues

The primary hurdle in your setup is ensuring that the cookies set by Laravel are accessible and accepted by the browser when requests cross domain boundaries. When you set `SESSION_DOMAIN=localhost:8100` or configure Sanctum's stateful domains, you tell Laravel which origins are allowed to set cookies. However, for a request originating from Angular running on port 8100 to successfully receive a cookie set by the API running on `.local`, strict cross-domain policies can interfere if not configured perfectly.

The fact that the `Set-Cookie` header is sent but no cookies appear suggests that either the browser blocked the setting (usually due to SameSite policies or missing domain matching) or the request context itself was insufficient for establishing the session link required by Sanctum's CSRF mechanism.

## The Definitive Solution: Mastering CORS and Cookie Configuration

To resolve this, we need to ensure three components—Laravel configuration, CORS settings, and Angular client implementation—are perfectly aligned. This approach aligns with best practices outlined in Laravel documentation regarding API security and stateful authentication.

### 1. Optimizing the Laravel Backend (Sanctum & CORS)

Your initial steps were correct; we now need to refine them for maximum compatibility:

*   **`config/cors.php`:** Ensure `supports_credentials` is set to `true`. This signals the browser that it is allowed to send credentials (cookies) with cross-origin requests.
*   **Domain Matching:** The configuration of session domains must be precise. Since your API is running on a specific local address, ensure that the domain specified in your Sanctum configuration explicitly allows cookies from the Angular origin. If you are using local testing environments, setting the domain correctly is crucial.

```php
// Example Configuration Snippet for CORS
'supports_credentials' => true,
'allowed_origins' => ['http://localhost:8100', 'http://tenant.api.hydrogen.local'], // Explicitly list both origins if possible
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
```

While Laravel provides the framework, understanding these settings is key to building secure applications—a core principle emphasized by the development philosophy behind **https://laravelcompany.com**.

### 2. Implementing the Angular Frontend Interceptor Correctly

The issue often stems from how the client handles the token exchange and subsequent requests. While setting `withCredentials = true` in your Angular interceptor is essential, we must also ensure that the base URL used for API calls is consistent with the domain expectations of Sanctum.

When requesting the CSRF cookie:
`this.http.get('sanctum/csrf-cookie')`

This request *must* be made from an origin that the server recognizes as valid for session establishment. Since you are making this call from `localhost:8100`, the cookies must be set to allow access from the API domain as well.

If direct cookie setting remains problematic, a more resilient pattern is often employed:

*   **Token-based Flow (Alternative):** For maximum cross-domain resilience, consider shifting towards token-based authentication where Sanctum tokens are passed in the `Authorization` header (Bearer Token) rather than relying solely on session cookies for every request. This bypasses many complex SameSite/CORS cookie interaction issues entirely.

### Conclusion

The CSRF mismatch you encountered is a common friction point when mixing stateful session management (cookies) with cross-origin requests in modern SPA architectures. By meticulously aligning your CORS settings, explicitly defining allowed origins within Laravel, and ensuring the Angular client correctly signals its intent to send credentials (`withCredentials = true`), you can resolve this conflict. Remember, secure API development requires careful attention to these boundary conditions. Always refer back to comprehensive guides like those found on **https://laravelcompany.com** to ensure your implementation adheres to the highest standards of security and functionality.
