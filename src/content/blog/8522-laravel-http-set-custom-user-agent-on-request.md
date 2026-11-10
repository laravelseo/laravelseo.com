---
title: "Laravel Http set custom user agent on request"
description: "Laravel HTTP Client: Setting a Custom User Agent for External Requests When interacting with external APIs or making requests from within a Laravel..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

When interacting with external APIs or making requests from within a Laravel application—especially in background tasks like cron jobs—it is often beneficial to set a specific User-Agent string. This allows the receiving server to identify the source of the request, which is useful for logging, rate limiting, or ensuring compliance with specific service agreements.

If you are using Laravel's powerful `Http` facade (the HTTP Client), setting custom headers like `User-Agent` is absolutely achievable. While the standard documentation might not immediately highlight this specific header setting, understanding how to manipulate request headers is fundamental to effective external communication within any modern framework, including those built on Laravel principles.

This post will walk you through exactly how to inject a custom User-Agent into your HTTP requests using the Laravel HTTP Client.

## The Problem and the Solution Overview

You are currently performing a simple GET request:

```php
$response = Http::timeout($timeout)->get($url);
```

To customize this, we need to pass an array of headers as the second argument to the `get()` method, or use the `withHeaders()` method if you prefer setting headers on an existing request object. The most direct way is to provide all required headers in a single configuration.

The key concept here is that the Laravel HTTP Client abstracts the underlying Guzzle library, allowing you to pass standard HTTP headers directly to the request.

## Implementation Steps with Code Examples

To set your custom User-Agent, define your desired string and include it within the array of headers you pass to the request method.

Let's assume you want to use the following custom User-Agent:
`Mozilla/5.0+(compatible; EXAMPLE/2.0; http://www.EXAMPLE.com/)`

### Method 1: Setting Headers Directly on the Request (Recommended)

The most straightforward way is to define your headers array and pass it along with the request.

```php
use Illuminate\Support\Facades\Http;

class CronJob
{
    public function makeCustomRequest(string $url, int $timeout): void
    {
        $customUserAgent = 'Mozilla/5.0+(compatible; EXAMPLE/2.0; http://www.EXAMPLE.com/)';

        // Define the headers array for the request
        $headers = [
            'User-Agent' => $customUserAgent,
            'Accept' => 'application/json', // Good practice to define other standard headers too
        ];

        try {
            $response = Http::timeout($timeout)
                ->withHeaders($headers) // Apply the custom headers here
                ->get($url);

            $code = $response->status();
            
            // Process the response...
            \Log::info("Request successful. Status code: " . $code);

        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            \Log::error("Connection failed: " . $e->getMessage());
        }
    }
}
```

### Method 2: Using the `withHeaders` on a Pre-existing Request Object

If you are chaining requests or starting with a base setup, you can apply the headers directly to the request object itself.

```php
$response = Http::timeout($timeout)->get($url);

// Apply the custom User Agent after the initial request is made
$response->withHeaders([
    'User-Agent' => 'MyCustomLaravelBot/1.0',
]);

$code = $response->status();
```

## Why This Matters for API Interaction

Setting a custom User-Agent is far more than just setting a label; it’s a critical part of polite and reliable API interaction. When interacting with external services, especially those that track traffic or implement anti-scraping measures, providing a recognizable identifier helps the service understand who is making the request. This aligns perfectly with good architectural practices where you treat external dependencies as distinct entities.

As we build robust systems on top of Laravel, ensuring clean and predictable communication layers is paramount. Whether you are building custom integrations or utilizing third-party services, understanding how to manipulate HTTP request details, such as headers, ensures your application behaves predictably across different environments. This principle of clear service interaction is central to the design philosophy promoted by the **Laravel** ecosystem.

## Conclusion

Setting a custom User-Agent on requests made via the Laravel HTTP Client is straightforward and essential for external integration tasks. By utilizing the `withHeaders()` method, you gain full control over the request metadata, allowing your cron jobs or background workers to operate with a defined identity. Always prioritize clear communication when interacting with external systems, ensuring that your application remains reliable and compliant in its data exchange.
