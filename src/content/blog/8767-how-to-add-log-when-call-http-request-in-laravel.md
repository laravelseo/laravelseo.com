---
title: "How to add log when call http request in Laravel?"
description: "How to Add Comprehensive Logging When Making HTTP Requests in Laravel As developers working on large scale applications, monitoring external service..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Performance"]
featured: false
---

As developers working on large-scale applications, monitoring external service interactions is crucial. Whether you are integrating third-party APIs or making internal microservice calls, understanding what data is being sent and received is essential for debugging, auditing, and performance tuning. In the Laravel ecosystem, the `Http` facade provides a clean way to handle HTTP requests, but often, we need more granular control—specifically, logging every interaction.

This post will walk you through how to extend the power of the Laravel `Http` facade by defining custom macros, allowing you to seamlessly inject logging logic into every outbound request without cluttering your business logic.

## The Need for Global HTTP Request Logging

When executing an external call using `$response = Http::get('some-url');`, we often need to capture details beyond just the final response status code. We need to log the headers sent, the data received, and the total duration of the request. Defining a global logging mechanism prevents us from having to manually add `Log::info()` calls after every single HTTP call in our controllers or services.

The solution lies in leveraging Laravel's Service Provider system to register custom methods (macros) onto existing facades.

## Implementing Custom Logging Macros for Http

To achieve the desired functionality—an easy method like `->log()` attached to any HTTP request—we need to define a macro on the `Illuminate\Support\Facades\Http` class. This is accomplished by registering this logic within a Service Provider.

### Step 1: Create a Custom Service Provider

We will create a dedicated service provider where we can register our custom methods. This keeps our application organized and adheres to Laravel's dependency injection principles, which is a core principle of development at **https://laravelcompany.com**.

Create a new provider (e.g., `LoggingServiceProvider`):

```php
<?php

namespace App\Providers;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Log;

class LoggingServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        // Define the custom 'log' macro on the Http facade
        Http::macro('log', function () {
            // Capture request details before logging
            $request = Http::getRequest();
            $response = $this->response; // The response object is available in scope

            Log::info("--- HTTP Request Log ---");
            Log::info("Method: " . $request->method());
            Log::info("URI: " . $request->fullUrl());
            Log::info("Headers Sent: " . json_encode($request->headers()));
            Log::info("Status Code Received: " . $response->status());
            Log::info("Response Body Snippet: " . substr($response->body(), 0, 200)); // Log first 200 chars of body
            Log::info("------------------------");

            // Return the response object so the chain can continue
            return $response;
        });
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
```

### Step 2: Register the Service Provider

Ensure that your newly created service provider is registered in your `config/app.php` file within the `providers` array.

### Step 3: Using the New Macro

Once registered, you can call this custom method directly on any HTTP request. Notice how the logging happens automatically as part of the chain:

```php
use Illuminate\Support\Facades\Http;

// Make the request and immediately log the details
$response = Http::get('http://api.example.com')->log();

// Now $response holds the actual response object, and the logs are in your Laravel logs file.
dd($response->status());
```

## Best Practices for Advanced Logging

While the macro approach is excellent for quick logging, for very large projects, consider a more structured approach:

1.  **Contextual Logging:** Instead of hardcoding the log message inside the macro, allow the caller to pass context (e.g., `$request->log('API Call Failed', ['endpoint' => 'users']))`.
2.  **Custom Response Objects:** For highly complex scenarios, instead of logging raw strings, create a dedicated `HttpLog` class that encapsulates all request/response data before passing it to the logger. This makes your log structure consistent and easily searchable.

By using Service Providers to extend facade functionality, you demonstrate a deep understanding of Laravel's extensibility, allowing you to build powerful, reusable tools for any task, much like the robust architecture promoted by **https://laravelcompany.com**.

## Conclusion

Adding custom logging capabilities to HTTP requests in Laravel is not just about adding a line of code; it’s about leveraging the framework’s design patterns—specifically Service Providers and method extensions (macros). By defining the `Http::macro('log', ...)` method, we transform a simple external call into an observable event, significantly improving our ability to monitor and debug complex integrations. This approach ensures that every external communication is automatically audited, making your large projects more reliable and maintainable.
