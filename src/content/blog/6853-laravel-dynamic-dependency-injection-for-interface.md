---
title: "(Laravel) Dynamic dependency injection for interface, based on user input"
description: "Dynamic Dependency Injection: Selecting Services Based on User Input in Laravel I am currently facing a very interesting dilemma with my architecture and..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

I am currently facing a very interesting dilemma with my architecture and implementation. It is a classic scenario that often catches developers—how do we elegantly handle dependency selection when the choice is determined dynamically by external factors, like user input?

I have an interface called `ServiceInterface` which has a method called `execute()`. Then I have two different implementations for this interface: `Service1` and `Service2`, both implementing the `execute` method properly.

I have a controller called `MainController`, and it uses standard dependency injection for the `ServiceInterface`. The problem is, since both `Service1` and `Service2` are valid implementations, the container doesn't know which one to resolve by default. I need to select between them based on a value derived from user input (e.g., a chosen option from a previous step).

I am currently solving this using session values or conditional logic directly within the controller to instantiate the correct service. However, I strongly feel that this approach is brittle, violates the Single Responsibility Principle, and muddies the clean separation of concerns that frameworks like Laravel are designed to enforce. I want to know if others have faced this, and more importantly, what is the robust, idiomatic way to solve it using dependency injection principles?

---

## The Pitfalls of Runtime Selection in DI

The instinct to resolve dependencies based on runtime user input is understandable. However, when we talk about Dependency Injection (DI), the goal is to keep the controller—the presentation layer—as thin and focused as possible. When the controller must decide *which* concrete class to instantiate, it starts mixing business logic into a layer that should only handle request routing and response formatting.

Relying on session values or complex `if/else` blocks inside a controller to resolve dependencies creates several problems:

1.  **Violation of SRP:** The controller is now responsible for knowing the entire dependency landscape, not just coordinating requests.
2.  **Reduced Testability:** Testing the controller requires setting up specific session states or mocking complex conditional logic, making unit tests cumbersome and fragile.
3.  **Container Bypass:** You are bypassing the powerful service container mechanism that Laravel provides for managing object lifecycles and dependencies.

The correct approach is to delegate the responsibility of *choosing* the dependency to a dedicated component—a pattern known as the **Factory** or **Strategy Pattern**.

## The Recommended Solution: Using a Dynamic Factory

Instead of having the controller decide, we should have an intermediary layer that handles the selection logic *before* the service is injected. This keeps our Service Container clean and allows us to manage complex object creation outside the request cycle.

Here is how you can implement this elegantly in a Laravel context:

### Step 1: Define a Service Resolver (Factory)

Create a dedicated class responsible solely for knowing how to construct the correct service based on external parameters.

```php
// app/Services/ServiceResolver.php

namespace App\Services;

use App\Services\Service1;
use App\Services\Service2;
use Illuminate\Support\Facades\App;

class ServiceResolver
{
    /**
     * Resolves the correct service implementation based on user choice.
     *
     * @param string $type The requested service type (e.g., 'service1' or 'service2')
     * @return \App\Services\ServiceInterface
     */
    public function resolve(string $type): \App\Services\ServiceInterface
    {
        switch ($type) {
            case 'service1':
                return new Service1();
            case 'service2':
                return new Service2();
            default:
                throw new \InvalidArgumentException("Invalid service type requested.");
        }
    }
}
```

### Step 2: Binding the Resolver to the Container

We bind this resolver into the container. This makes it available for injection wherever needed.

```php
// app/Providers/AppServiceProvider.php (or a dedicated ServiceServiceProvider)

use App\Services\ServiceResolver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Bind the resolver so it can be injected elsewhere
        $this->app->singleton(ServiceResolver::class, function ($app) {
            return new ServiceResolver();
        });
    }
    // ...
}
```

### Step 3: Injecting and Resolving in the Controller

Now, the controller no longer needs to know about `Service1` or `Service2`. It only asks the container for the `ServiceResolver`, passes the user input, and receives the fully resolved interface.

```php
// app/Http/Controllers/MainController.php

namespace App\Http\Controllers;

use App\Services\ServiceResolver;
use Illuminate\Http\Request;

class MainController extends Controller
{
    protected $resolver;

    // Inject the resolver via constructor (best practice)
    public function __construct(ServiceResolver $resolver)
    {
        $this->resolver = $resolver;
    }

    public function execute(Request $request)
    {
        // Assume user input is retrieved from session or request
        $serviceType = $request->input('service_choice', 'service1'); // Example input

        try {
            // Delegate the selection logic entirely to the resolver
            $service = $this->resolver->resolve($serviceType);

            // Now we use the injected interface, unaware of the concrete class used
            $result = $service->execute();

            return response()->json(['message' => 'Service executed successfully', 'result' => $result]);

        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
```

## Conclusion

By employing the **Factory/Resolver pattern**, we have successfully moved the dynamic dependency selection logic out of the controller and into a dedicated service. This adheres to the principles of SOLID design, making our code significantly more maintainable, testable, and aligned with Laravel's philosophy of leveraging the Service Container for managing complexity. When building robust applications, always strive to let your container handle the wiring; delegate conditional choices to specialized components like our `ServiceResolver`. For more deep dives into advanced service binding in the framework, I highly recommend exploring resources from [laravelcompany.com](https://laravelcompany.com).
