---
title: "how to set cookie with httponly flag in vuejs and vuex that cookie cames from server(Laravel)"
description: "How to Set Secure Cookies with HttpOnly Flag in Vue.js and Laravel As developers building modern full stack applications, securing session management and..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "Errors"]
featured: false
---

As developers building modern full-stack applications, securing session management and token handling is paramount. When dealing with authentication tokens like JSON Web Tokens (JWTs), deciding where and how to store them—client-side vs. server-side—is a critical architectural decision. Specifically, ensuring these tokens are stored in cookies with the `HttpOnly` flag is essential for mitigating Cross-Site Scripting (XSS) vulnerabilities.

This post will walk you through the secure process of setting an `HttpOnly` cookie containing your JWT token, flowing from your Laravel backend to your Vue.js frontend.

## The Security Imperative: Why HttpOnly Matters

The core problem you are facing is deciding whether to store sensitive data in client-side storage (like `localStorage` or session storage) or server-side cookies. Storing tokens directly in JavaScript-accessible storage makes them vulnerable to theft via XSS attacks.

The `HttpOnly` flag on a cookie instructs the browser to prevent client-side scripts (JavaScript) from accessing that cookie. This creates a crucial defense layer: even if an attacker successfully injects malicious script onto your Vue application, they cannot read the sensitive authentication token stored in that cookie. Therefore, the responsibility for setting and managing these secure tokens must reside entirely on the server side—in your Laravel application.

## Architecture: Server-Side Token Management

For robust security with JWTs, the recommended pattern is to have the server (Laravel) handle the issuance of the token and manage its storage via HTTP responses. The frontend (Vue.js) should only interact with the API, relying on the browser to automatically attach these secure cookies to subsequent requests.

When a user successfully logs in:
1.  The Vue application sends credentials to Laravel.
2.  Laravel validates the credentials, generates the JWT, and prepares the response.
3.  Crucially, Laravel sets the JWT as an `HttpOnly` cookie in the HTTP response header.
4.  Vue receives the response and simply proceeds, without ever directly touching the token string itself.

## Implementation in Laravel (The Backend)

Since the token is a sensitive credential, setting it must happen within your Laravel controller logic after successful authentication. You can leverage Laravel's `Response` object to set custom headers, including cookies.

In your provided example, where you generate the token, you need to modify how you return the response to include the cookie header.

Here is how you can modify your `respondWithToken` method in Laravel to set an `HttpOnly` cookie:

```php
// In your AuthController.php (or relevant controller)

protected function respondWithToken($token)
{
    // 1. Define the cookie parameters
    $cookieName = 'jwt_token';
    $domain = config('app.domain'); // Use your application domain for security
    $expiry = now()->addMinutes(60); // Set expiration time

    // 2. Create the response object
    return response()->json([
        'access_token' => $token,
        'token_type'   => 'bearer',
        'expires_in'   => auth()->getTTL() * 60
    ])
    ->cookie(
        $cookieName,          // Name of the cookie
        $token,               // Value of the cookie (the JWT)
        $expiry,              // Expiration time
        'httpOnly',           // *** THE CRITICAL SECURITY FLAG ***
        'secure',             // Recommended for HTTPS environments
        true                  // SameSite=Lax or Strict is recommended for CSRF protection
    );
}
```

### Explanation of the Cookie Method

By using the `->cookie()` method on the response object, Laravel handles the complex process of generating the `Set-Cookie` header correctly. The key parameters here are:

*   **`'httpOnly'`**: This flag ensures that client-side scripts like `document.cookie` cannot access this cookie, significantly boosting security against XSS attacks.
*   **`'secure'`**: Always use this if your application runs over HTTPS (which it should). This forces the browser to only send the cookie over secure connections.
*   **`SameSite`**: Setting this (e.g., `'Lax'` or `'Strict'`) is vital for modern CSRF protection, preventing the cookie from being sent with cross-site requests.

This approach ensures that the sensitive token is managed securely by the browser according to server-defined policies, aligning perfectly with best practices demonstrated by frameworks like those provided by [laravelcompany.com](https://laravelcompany.com).

## Consumption in Vue.js (The Frontend)

In your Vuex store actions, you no longer need to manually handle storing the token in `localStorage`. When the response from `/login` is received, if the server successfully set the cookie, the browser automatically stores it.

Your Vue logic can focus purely on managing application state based on the API response:

```javascript
// In your Vuex store actions
const actions = {
    login({commit}, user) {
        return new Promise((resolve, reject) => {
            commit('auth_request');
            Axios.post(`${api_base_url}/login`, user)
            .then(resp => {
                // Since the token is in an HttpOnly cookie, we don't need to store it locally.
                // The browser handles persistence securely.
                commit('auth_success', true); 
                resolve(resp)
            })
            .catch(err => {
                commit('auth_error');
                reject(err)
            })
        })          
    },
}
```

## Conclusion

By shifting the responsibility of token storage and setting to the server, you significantly enhance the security posture of your application. Using Laravel's response capabilities to set `HttpOnly` cookies is the correct, secure, and scalable way to manage JWT authentication in a Vue/Laravel ecosystem. Always prioritize server-side control for sensitive data; this is a fundamental principle of secure web development.
