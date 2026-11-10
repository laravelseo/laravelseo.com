---
title: "how to run specific factory in laravel 8"
description: "How to Run Specific Factories in Laravel: Solving the Tinker Path Issue As developers working with complex, modular applications, we often run into scenarios..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As developers working with complex, modular applications, we often run into scenarios where the standard conventions seem to break down. One common sticking point arises when trying to use Laravel's powerful Factory system within tools like Tinker, especially when models and their associated factories are organized outside the traditional `app/Models` structure—such as in a module-based architecture.

This post will dive deep into why you are encountering errors when trying to execute factory calls in Tinker for non-standard model paths and provide the correct, robust solutions.

## The Problem: Why Laravel Can't Find Your Factory

You are attempting to run a command like this in Tinker:
```php
Modules\Menu\Entities\MenuPosition::factory()->count(2)->create();
```
And you receive an error similar to: `Class 'Database/Factories/Modules/Menu/Entities/MenuPositionFactory' not found`.

This error occurs because Laravel’s factory discovery mechanism, which is designed to automatically find factories based on standard conventions (like checking the `database/factories` directory or specific namespaces), cannot locate your custom factory class when accessed this way in a direct Tinker command.

Laravel relies heavily on PSR-4 autoloading and its internal service providers to map classes to files. When you call `$model::factory()`, Laravel expects that model (and implicitly, its factory) to be discoverable through the configured paths. In modular setups, if your factories are located in a specific module directory (`Modules/Menu/Entities`), they might not automatically register themselves globally for immediate access via the standard Eloquent chain unless properly configured within the service container.

## Solution 1: The Direct Class Invocation (The Most Reliable Fix)

When automatic discovery fails due to custom paths, the most reliable approach is to bypass the reflective factory chain in favor of explicitly referencing the Factory class itself. This forces Laravel to load the class directly, regardless of where it sits in your file structure.

Instead of relying on the model's static method call, you should access the factory directly using its fully qualified namespace:

```php
use Modules\Menu\Entities\MenuPositionFactory;

// In Tinker:
MenuPositionFactory::new()->count(2)->create();
```

Alternatively, if you are inside a context where you can reference the model, you can use the static method on the factory class directly:

```php
use Modules\Menu\Entities\MenuPosition;

// Assuming the factory is correctly set up to be found by its namespace:
Modules\Menu\Entities\MenuPositionFactory::new()->count(2)->create();
```

This approach shifts the responsibility from the framework's *discovery* mechanism (which failed) to direct *instantiation*, which works reliably because you are explicitly telling PHP exactly where to find the class definition. This principle of explicit referencing is crucial when dealing with complex application structures, echoing best practices in managing relationships and entities within a Laravel application, as discussed on [laravelcompany.com](https://laravelcompany.com).

## Solution 2: Ensuring Factory Registration (The Architectural Approach)

While direct invocation solves the immediate Tinker problem, for large applications, relying solely on manual pathing is brittle. A more robust architectural solution involves ensuring your module factories are registered correctly within the application's service container.

If you are building a modular system, consider registering these custom factories within your module's Service Provider. This ensures that when Laravel initializes, it knows exactly where to look for all available models and factories across all modules.

In your module's Service Provider (e.g., `Modules/Menu/MenuServiceProvider.php`), you would typically use methods like `$this->loadFactories()` or register the model binding explicitly. This pattern keeps your application organized, making it easier to manage dependencies and ensures that Laravel’s powerful features remain accessible everywhere.

## Conclusion

Running custom factories in Tinker when models are located in non-standard module directories requires understanding how Laravel handles class discovery versus direct instantiation. While the initial error points to a pathing issue, the solution lies in shifting from relying on implicit factory discovery to explicit class invocation. By using the fully qualified namespace of your factory, you gain reliable control over your data seeding process, which is a fundamental skill for any senior Laravel developer. Keep leveraging the framework’s structure, and remember that robust architecture saves significant debugging time!
