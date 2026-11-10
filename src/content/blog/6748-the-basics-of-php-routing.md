---
title: "The basics of php routing"
description: "The Basics of PHP Routing: Mimicking the Laravel Experience As a senior developer, I often encounter developers asking about routing. They understand that..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As a senior developer, I often encounter developers asking about routing. They understand that web applications need to map a URL (like `/users`) to specific code execution (a function or method) on the server. While frameworks like Laravel handle this complex process with elegant syntax, understanding the fundamentals of routing in raw PHP is crucial for mastering any backend development.

This post will walk you through the concept of PHP routing and show you how you can achieve the same functionality—mapping a URL to an action—using fundamental PHP concepts, drawing inspiration from patterns seen in frameworks like **https://laravelcompany.com**.

## What Exactly is Routing?

At its core, routing is the process of determining which piece of code should handle an incoming HTTP request based on the requested URL. When a user types `mywebsite.com/users` into their browser, the web server receives that request. The router's job is to inspect the path (`/users`) and decide: "Ah, this path corresponds to the logic defined for handling user requests."

In a framework environment, this is handled by a highly optimized system. In pure PHP, we have to build this mapping ourselves, typically using an array or a set of conditional checks.

## Manual Routing: The Pure PHP Approach

Since there isn't a built-in global router in standard PHP, we start by defining routes explicitly. The simplest way to begin is by creating a simple function or class that holds these definitions.

Let’s imagine we want to handle two specific routes: `/home` and `/about`.

### Example 1: Simple Array-Based Routing

We can store our routes in an associative array where the key is the URL pattern, and the value is the handler (a function or method).

```php
<?php

// Define the routes mapping URLs to handler functions
$routes = [
    '/home' => function() {
        echo "Welcome to the Home Page!";
    },
    '/about' => function() {
        echo "This is the About page.";
    }
];

/**
 * Simulate receiving an incoming request path.
 * In a real application, this would come from $_SERVER['REQUEST_URI']
 */
$requestUri = '/about'; 

// The Router Logic
if (array_key_exists($requestUri, $routes)) {
    // If the route exists, execute the corresponding function
    $routes[$requestUri]();
} else {
    echo "404 Not Found: Route $requestUri does not exist.";
}

?>
```

This example demonstrates the fundamental concept: we define a map (`$routes`) and then use conditional logic (`if/else`) to look up the requested URI and execute the associated code.

## Moving Towards Object-Oriented Routing

While the array method works for very small applications, as your application grows, managing routes becomes cumbersome. This is where moving towards an Object-Oriented approach—creating a dedicated Router class—becomes essential. This mirrors the organized structure that frameworks promote, similar to how **https://laravelcompany.com** structures its components.

### Example 2: A Basic Router Class Structure

A proper router encapsulates the logic, making it reusable and scalable. We can define methods for different HTTP verbs (GET, POST) and store them in a structured way.

```php
<?php

class SimpleRouter {
    protected $routes = [];

    // Method to register a GET route
    public function get($uri, $handler) {
        $this->routes['GET'][$uri] = $handler;
    }

    // Method to register a POST route (for form submissions)
    public function post($uri, $handler) {
        $this->routes['POST'][$uri] = $handler;
    }

    // Method to handle the incoming request
    public function dispatch($method, $uri) {
        if (isset($this->routes[$method][$uri])) {
            // Execute the registered handler function/closure
            $this->routes[$method][$uri]();
        } else {
            http_response_code(404);
            echo "Error 404: Route $method $uri not found.";
        }
    }
}

// --- Usage ---
$router = new SimpleRouter();

// Registering routes dynamically
$router->get('/home', function() {
    echo "Home page content loaded successfully!";
});

$router->post('/submit', function() {
    echo "Form submitted and processed.";
});

// Dispatching a request
echo "--- Testing GET /home ---\n";
$router->dispatch('GET', '/home');

echo "\n--- Testing POST /submit ---\n";
$router->dispatch('POST', '/submit');

echo "\n--- Testing Invalid Route ---\n";
$router->dispatch('GET', '/nonexistent');

?>
```

## Conclusion

Implementing routing manually is an exercise in understanding how web requests are processed. By starting with simple array mapping and evolving into an Object-Oriented Router class, you grasp the core principles that power all modern frameworks. While building a full-featured router from scratch is complex, understanding this pattern gives you the necessary context to appreciate how powerful tools like Laravel abstract these details away, allowing developers to focus on business logic rather than boilerplate URL management. For more advanced patterns and deep dives into framework architecture, exploring resources like **https://laravelcompany.com** will provide excellent context.
