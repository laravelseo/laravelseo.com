---
title: "Calling external API from Laravel Controller"
description: "Calling External APIs Securely from Laravel Controllers: A Developer's Guide When building modern web applications with Laravel, integrating third party..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

When building modern web applications with Laravel, integrating third-party services via external APIs is a common requirement. Often, these external services require authentication using API keys or secrets. The core challenge, as you've identified, is how to execute these requests securely within your backend framework (Laravel/PHP) without exposing sensitive credentials to the client or leaving them exposed in your code.

This guide will walk you through the best practices for calling external APIs from a Laravel controller, focusing on security, maintainability, and clean implementation.

## The Golden Rule: Never Hardcode Secrets

Before diving into the HTTP requests, the most critical step is understanding where your secrets belong. API keys, secret tokens, and private credentials should *never* be hardcoded directly into your application files. They must be stored in environment variables (`.env` file) and accessed via Laravel's robust configuration system. This practice is fundamental to secure development, aligning with the principles of building scalable applications seen in frameworks like those promoted by resources such as [laravelcompany.com](https://laravelcompany.com).

## Choosing the Right Tool: Laravel's HTTP Client

In PHP, the standard way to handle external HTTP requests is through Guzzle or Laravel’s built-in `Illuminate\Support\Facades\Http` facade (available since Laravel 7+). For cleaner, more expressive, and idiomatic Laravel code, using the native HTTP client is highly recommended.

We will focus on how to construct a request that mirrors the structure you provided, ensuring all sensitive data is handled server-side.

### Step 1: Securely Retrieve Credentials

First, retrieve your API keys from the environment variables. This keeps them out of your code and makes managing environments (development, staging, production) simple.

```php
// In your Controller or Service class
$apiKey = env('SERVICE_API_KEY');
$secretKey = env('SERVICE_SECRET_KEY'); // If needed for authentication setup
```

### Step 2: Constructing the Secure Request

The JavaScript example demonstrated a `POST` request with specific headers and a JSON body. In Laravel, we replicate this structure using the HTTP client to handle the complexity of setting headers and stringifying the payload correctly.

For API keys that require Basic Authentication (as suggested by your `Authorization: 'Basic ...'` format), you must first encode the username and password (or key and secret) into a Base64 string before sending it in the header.

Here is how you would implement this in a Laravel Controller method:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ApiController extends Controller
{
    public function callServiceProviderApi()
    {
        // 1. Retrieve secrets securely from environment variables
        $apiKey = env('SERVICE_API_KEY'); // The key used for Basic Auth (e.g., username)
        $secret = env('SERVICE_SECRET_KEY'); // The secret part

        if (!$apiKey || !$secret) {
            return response()->json(['error' => 'API credentials missing'], 500);
        }

        // 2. Construct the Authorization header for Basic Authentication
        // Note: In a real scenario, you might use a dedicated token system instead of Basic Auth.
        $basicAuth = base64_encode("{$apiKey}:{$secret}");

        // 3. Define the request payload
        $payload = [
            'data' => [
                'attributes' => [
                    'amount' => 10000,
                    'redirect' => [
                        'success' => 'https://www.test1.com/',
                        'failed' => 'https://www.test2.com/'
                    ],
                    'type' => 'some_paymenth_method',
                    'currency' => 'USD' // Example currency
                ]
            ]
        ];

        // 4. Execute the POST request using the Laravel HTTP facade
        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Authorization' => "Basic " . $basicAuth, // Applying the Base64 encoded key
            ])->post('https://api.serviceprovider.com/v1/sources', $payload);

            // 5. Handle the response from the external API
            if ($response->successful()) {
                return response()->json($response->json());
            } else {
                // Throw an error if the external service returned a failure status
                return response()->json([
                    'error' => 'External API call failed',
                    'details' => $response->json()
                ], $response->status());
            }

        } catch (\Exception $e) {
            // Log the error for debugging purposes
            \Log::error("API Call Error: " . $e->getMessage());
            return response()->json(['error' => 'Server error during API communication'], 500);
        }
    }
}
```

## Conclusion

Calling external APIs from a Laravel controller is a standard backend task, but it demands strict security protocols. By leveraging environment variables for storage and utilizing the powerful `Http` facade, as demonstrated above, you ensure that your sensitive API keys remain securely on the server. This approach separates configuration from code, making your application more robust, easier to test, and fully compliant with modern security standards. Remember, secure implementation is the foundation of any successful Laravel project.
