---
title: "Passing dependency parameters to App::make() or App::makeWith() in Laravel"
description: "Mastering Dynamic Dependency Injection: Passing Parameters to App::make() in Laravel When building complex applications in Laravel, managing dependencies is..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

When building complex applications in Laravel, managing dependencies is the core of leveraging the framework's power. We rely heavily on the Service Container to handle object instantiation and dependency resolution. However, sometimes, we need more flexibility than simple type-hinting allows—we need to pass dynamic configuration parameters directly into the creation process.

This post addresses a common scenario: how to dynamically set properties on a prerequisite dependency before it is injected into another class via `App::make()` or similar container methods. We will explore why the direct approach you tried might feel incorrect and demonstrate the most robust, idiomatic Laravel solutions.

## The Challenge: Dynamic Configuration at Runtime

You are aiming for this flow:
1. Receive dynamic parameters from a controller (e.g., `$something`, `$somethingElse`).
2. Use these parameters to configure an intermediate dependency (`MyDependency`).
3. Use the configured dependency to instantiate the final class (`MyClass`).

Your attempt involved binding `MyClass` in the Service Provider using a closure:

```php
$this->app->bind('MyClass', function ($app, $parameters) {
    $objDependency = new MyDependency();
    $objDependency->setSomething($parameters['something']);
    $objDependency->setSomethingElse($parameters['somethingElse']);
    return new MyClass($objDependency);
});
```

While this *can* work, it blurs the line between dependency resolution (what the container does) and business logic instantiation (what your code dictates). It forces the Service Container to manage complex setup logic that might be better isolated elsewhere.

## The Recommended Solution: Embracing Factories and Resolvers

The most robust and scalable way to handle dynamic object creation with configuration in Laravel is by separating the concerns using **Factories** or **Resolvers**. This pattern keeps your Service Providers clean and adheres to the principle of separation of concerns, which aligns perfectly with Laravel's philosophy regarding design patterns.

Instead of making the binding itself responsible for complex setup, we delegate the creation logic to a dedicated factory.

### Step 1: Create a Factory for the Dependency

Let’s create a factory that handles the specific configuration requirements for `MyDependency`. This encapsulates the complicated setup logic.

```php
// app/factories/MyDependencyFactory.php

namespace App\Factories;

use App\Models\MyDependency; // Assuming MyDependency is a model or simple class
use Illuminate\Support\Arr;

class MyDependencyFactory
{
    public static function make(array $attributes = [])
    {
        // Merge dynamic parameters into the attributes being passed to the constructor or setter methods.
        $dependency = new MyDependency();
        
        if (isset($attributes['something'])) {
            $dependency->setSomething($attributes['something']);
        }
        if (isset($attributes['somethingElse'])) {
            $dependency->setSomethingElse($attributes['somethingElse']);
        }

        return $dependency;
    }
}
```

### Step 2: Bind the Factory in the Service Container

Now, we bind the factory instead of the final class. This allows us to resolve the dependency using the dynamic parameters provided at runtime.

In your `AppServiceProvider`:

```php
use App\Factories\MyDependencyFactory;

public function register()
{
    // Bind the Factory itself if needed, or bind the concrete implementation directly.
    $this->app->singleton(MyDependency::class, function ($app) {
        // Use the factory to resolve and configure the dependency
        return MyDependencyFactory::make($app->parameters()); // Or pass specific parameters here
    });

    // If you still need to bind 'MyClass' specifically:
    $this->app->bind('MyClass', function ($app, array $parameters) {
        // Resolve the already configured dependency
        $dependency = $app->make(MyDependency::class); 
        
        return new MyClass($dependency);
    });
}
```

### Step 3: Resolving via `App::make()` in the Controller

The controller now remains clean. It only needs to provide the necessary configuration data, letting the container handle the complex instantiation chain.

```php
use Illuminate\Http\Request;

class MyController extends Controller
{
    public function dynamicSetup(Request $request)
    {
        $something = $request->input('something');
        $somethingElse = $request->input('somethingElse');

        // The container resolves 'MyClass', which in turn resolves the configured 
        // 'MyDependency'.
        $objMyClass = app('MyClass'); 

        return response()->json(['status' => 'Class created successfully']);
    }
}
```

## Conclusion: Why This Approach Wins

The initial approach of putting all setup logic inside a single closure within the Service Provider is brittle. It tightly couples your service provider to the specific creation method, making it harder to test and reuse the dependency configuration.

By adopting the **Factory Pattern** combined with the Service Container's binding capabilities, we achieve several benefits:

1.  **Separation of Concerns:** Factories handle *how* an object is built; the Service Container handles *when* and *what* objects are available.
2.  **Testability:** The factory logic is isolated and easily unit-tested without needing a full HTTP request cycle.
3.  **Scalability:** If you need to pass configuration parameters to dozens of dependencies, this pattern scales much better than embedding complex runtime logic into bindings.

For advanced dependency management in Laravel, understanding how the container resolves objects through factories is crucial for writing clean, maintainable code, especially as your application grows. Keep exploring the power of the Service Container—it truly is the backbone of modern PHP frameworks like **Laravel** (`https://laravelcompany.com`).
