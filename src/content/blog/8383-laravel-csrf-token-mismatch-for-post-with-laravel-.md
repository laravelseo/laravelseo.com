---
title: "Laravel “CSRF token mismatch” for POST with laravel-cors and axios"
description: "Laravel \"CSRF Token Mismatch\" for POST with laravel cors and Axios: Decoding the Cross Origin Headache As senior developers working with modern API..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As senior developers working with modern API architectures, managing cross-origin requests—especially when dealing with security mechanisms like CSRF protection and CORS policies—can often lead to frustrating debugging sessions. One common sticking point arises when combining Laravel’s default CSRF token handling, `laravel-cors`, and modern HTTP clients like Axios.

This post dives deep into a specific scenario: why POST requests fail with a "CSRF token mismatch" error when using `laravel-cors` across different domains and trying to implement bearer token authentication via Axios. We will analyze the interaction between CORS preflight checks, Laravel's session security, and custom header manipulation to find the root cause.

## The Setup: CORS, CSRF, and Cross-Origin APIs

The scenario involves a Laravel application (`domain_A`) serving an API that needs to be consumed by another domain (`domain_B`). Security dictates that this access must be governed by both CORS rules (allowing cross-origin communication) and CSRF protection (preventing unauthorized state-changing requests).

You have correctly set up `barryvdh/laravel-cors` in your `Kernel.php`, allowing specific origins:

```php
// Example configuration in config/cors.php
return [
    'allowedOrigins' => ['http:www.domain_b.com', 'https:www.domain_b.com'],
    // ... other settings
];
```

This setup correctly handles the CORS preflight checks for methods like `POST`. However, the "CSRF token mismatch" error occurs when Laravel’s backend expects a specific CSRF token value that is not being correctly supplied or validated during the POST request initiated by Axios.

## Analyzing the Mismatch: Why POST Fails

The core conflict lies in how CSRF tokens are expected to be delivered versus how authentication tokens (like Bearer tokens) are delivered.

1.  **CSRF Token Mechanism:** Laravel's default setup relies on embedding a token (via a meta tag) and expecting it to be present either as a header (`X-CSRF-TOKEN`) or as a request body/form field for state-changing requests (POST, PUT, DELETE).
2.  **CORS Interaction:** When CORS is active, the browser enforces strict policies. The information you are trying to pass (the CSRF token) must be accessible and correctly formatted according to the server's expectations.
3.  **The Axios/Bearer Conflict:** In your attempt to use a Bearer token for authorization alongside the CSRF mechanism, you are mixing two distinct security layers. If the endpoint is configured strictly for CSRF protection on state changes, simply adding an `Authorization` header might be insufficient or misinterpreted by Laravel’s middleware chain if it expects the explicit token.

The fact that GET requests pass while POST requests fail suggests that the standard CSRF token mechanism (which often works well for simple GET) is being bypassed or incorrectly handled for complex POST requests involving custom headers, leading to the mismatch error on the server side.

## The Solution: Synchronizing Token Delivery and Authentication

To resolve this, we need to ensure that the necessary security tokens are explicitly included in the request body or headers as expected by the Laravel backend, alongside your authentication token.

Instead of relying solely on Axios to manage the CSRF token placement, ensure you retrieve the CSRF token from the page context and include it correctly in your request payload or headers.

### Recommended Axios Implementation Strategy

For state-changing POST requests where you are using Bearer authentication, the most robust approach is often to send both the session-based CSRF token (if required by the route) *and* the bearer token for authorization.

If the Laravel endpoint strictly requires the CSRF token, ensure it's passed via a header that mimics the default expectation or as part of the body structure expected by your application logic.

Here is a refined approach focusing on clarity and security:

```javascript
import axios from 'axios/index';

const baseDomain = "https://domain_a";
const baseURL = `${baseDomain}`;

// 1. Retrieve the CSRF token from the document head
const csrfToken = document.head.querySelector('meta[name="csrf-token"]').content;

// 2. Define the authentication token (Bearer Token)
const authToken = 'your_bearer_jwt_token'; // Replace with actual token logic

const headers = {
   'Content-Type': 'application/json',
   // Include the standard CSRF token header, as CORS allows it
   'X-CSRF-TOKEN': csrfToken, 
   // Include the Authorization header for authentication
   'Authorization': `Bearer ${authToken}`,
};


export default axios.create({
    baseURL,
    headers: headers, // Apply combined headers here
});

// Example POST request
async function postData(endpoint, data) {
    try {
        const response = await Repository.post(endpoint, data);
        return response.data;
    } catch (error) {
        console.error("Error during POST request:", error);
        // Handle the specific mismatch error if it still occurs
        throw error; 
    }
}

// Usage:
// postData(`${resource}/${$playerId}/${$cozzaloID}`, body);
```

By explicitly setting both `X-CSRF-TOKEN` and `Authorization` headers, you satisfy both the Cross-Origin policy requirements (CORS) and the Laravel application's security checks (CSRF token validation and bearer token authentication). This ensures that all necessary context is provided for the server to correctly validate the request before processing it.

## Conclusion

The "CSRF token mismatch" error in cross-origin POST requests is rarely a simple CORS configuration issue; it is usually a symptom of mismatched security expectations between the browser, the CORS layer, and the backend framework's CSRF middleware. By treating the request as a holistic transaction—providing both necessary authentication credentials (Bearer) and state security tokens (CSRF)—you can successfully navigate these complex interactions. Always remember that robust API design requires synchronizing client-side data transmission with server-side security expectations, which is a core principle of well-architected systems like those found on **laravelcompany.com**.
