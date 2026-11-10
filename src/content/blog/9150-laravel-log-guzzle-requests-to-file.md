---
title: "Laravel - Log Guzzle requests to file"
description: "Laravel & Guzzle: How to Log Every Request Made by Your HTTP Client When developing applications that interact with external APIs, debugging can quickly..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

When developing applications that interact with external APIs, debugging can quickly become a nightmare. You might see perfect results in Postman or a browser extension, but when implementing those calls within your PHP application using an HTTP client like Guzzle, tracing exactly what went wrong—or what data was sent—can be incredibly difficult. Debugging network communication often requires visibility into the raw request and response streams.

The question arises: Is there a robust way to log every single request made by a Guzzle client? The answer is absolutely yes, and the most elegant solution lies in leveraging Guzzle’s powerful **Middleware** system.

## Why Middleware is the Perfect Tool for Logging

Guzzle is designed around the concept of middleware, which allows you to intercept the HTTP request before it is sent and the response after it is received. This interception point is perfect for logging. Instead of digging into complex stream operations manually, middleware provides a clean hook where you can inject custom logic—such as logging headers, request bodies, timestamps, and status codes—without modifying the core Guzzle functionality.

This approach keeps your application decoupled and adheres to SOLID principles. When building robust services in Laravel, understanding how external dependencies interact is key, and using built-in patterns like middleware is a strong practice, much like adhering to the principles discussed at resources like [laravelcompany.com](https://laravelcompany.com).

## Implementing a Custom Logging Middleware

To log Guzzle requests effectively, we will create a custom handler that plugs into the Guzzle stack. This handler will execute logic for every request and response cycle.

Here is a practical example demonstrating how to set up a simple logging middleware:

```php
use GuzzleHttp\Promise\PromiseInterface;
use Psr\Http\Message\RequestInterface;
use Psr\Http\Message\ResponseInterface;
use GuzzleHttp\Middleware;
use Psr\Log\LoggerInterface;

class RequestLoggerMiddleware
{
    protected $logger;

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    public function __invoke(callable $handler): callable
    {
        return function (RequestInterface $request, array $options) use ($handler) {
            // 1. Log the Request details before sending
            $this->logger->info('Guzzle Request Started', [
                'method' => $request->getMethod(),
                'uri' => (string) $request->getUri(),
                'headers' => $request->getHeaders(),
            ]);

            // Pass the request to the next handler in the stack
            $promise = $handler($request, $options);

            // 2. Handle the Response once it comes back
            return $promise->then(
                function (ResponseInterface $response) use ($request) {
                    // Log the response details after receiving
                    $this->logger->info('Guzzle Request Completed', [
                        'status_code' => $response->getStatusCode(),
                        'uri' => (string) $request->getUri(),
                        'response_body_snippet' => substr((string) $response->getBody(), 0, 200) . '...', // Log a snippet of the body
                    ]);
                    return $response;
                },
                function ($exception) use ($request) {
                    // Handle request failures
                    $this->logger->error('Guzzle Request Failed', [
                        'uri' => (string) $request->getUri(),
                        'error' => $exception->getMessage(),
                    ]);
                    throw $exception;
                }
            );
        };
    }
}

// --- Usage Example in your Laravel Service/Controller ---

use GuzzleHttp\Client;
use Monolog\Logger;
use Monolog\Handler\StreamHandler;

// Setup Logger (e.g., using Laravel's built-in logging channel)
$logger = new Logger('guzzle_requests');
$logger->pushHandler(new StreamHandler('logs/guzzle.log', Logger::INFO));

// Create the custom middleware
$loggerMiddleware = new RequestLoggerMiddleware($logger);

// Create the Guzzle Client with the middleware stack
$client = new Client([
    'base_uri' => 'https://api.example.com/',
    'handler' => Middleware::stack([
        $loggerMiddleware, // Our custom logger sits here!
        Middleware::history($logger, 10) // Example of another useful Guzzle middleware
    ])
]);

// Make the request
try {
    $response = $client->get('users/1');
    // The logs will now be written to logs/guzzle.log
} catch (\Exception $e) {
    echo "An error occurred: " . $e->getMessage();
}
```

## Conclusion

By implementing a custom middleware, you transform Guzzle from a black box into a transparent system that reports its activities. This method provides comprehensive logging for every request and response, allowing developers to easily diagnose latency issues, authentication failures, or data mismatches without having to manually inspect raw sockets. For any serious project leveraging external APIs within a Laravel environment, adopting this pattern is not just a debugging trick—it is a fundamental practice for creating maintainable and debuggable services.
