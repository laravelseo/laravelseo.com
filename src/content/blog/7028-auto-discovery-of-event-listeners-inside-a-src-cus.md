---
title: "Auto-discovery of event listeners inside a src custom directory"
description: "Auto discovery of Event Listeners in Modular Laravel Applications Dealing with application structure and auto discovery mechanisms can often lead to subtle,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Dealing with application structure and auto-discovery mechanisms can often lead to subtle, frustrating roadblocks. As developers move beyond monolithic structures into modular designs—like those using custom `src` directories for modules—the way frameworks handle class loading and service discovery needs careful examination.

If you are experiencing issues with `php artisan event:list` failing to discover listeners located outside the standard `app/Listeners` directory, you've hit a common point of friction between conventional Laravel conventions and customized architectural patterns. Let’s dive into why this happens and how to correctly implement auto-discovery in your modular setup.

## Understanding Laravel's Event Discovery Mechanism

Laravel relies on a combination of the Service Container and specific boot methods to register and discover components, including event listeners. When you use methods like `withEvents()`, Laravel needs a reliable way to map file paths to actual PHP classes that are registered within the application's scope.

The default behavior works seamlessly because the framework is hardcoded to look in predictable locations, such as `app/Listeners`. This path aligns perfectly with how Laravel’s dependency injection (DI) container resolves class namespaces based on the PSR-4 autoloading defined in your `composer.json`.

## The Conflict: Autoloading vs. Discovery Paths

The core issue you are facing stems from a mismatch between where the classes are *defined* (via PSR-4) and where the discovery mechanism is *told* to look for them (`withEvents()`).

Let’s look at your setup:

```json
// composer.json autoload section
"psr-4": {
    "App\\": "app/",
    "Modules\\": "src/Modules/" // This defines the module structure
}
```

When you try to register a path like `__DIR__ . '/../src/Modules/ModuleA/Listeners'`, you are pointing the discovery mechanism to a physical directory. While PHP can load these classes via autoloading, Laravel’s event discovery often expects paths that are relative to the application root or explicitly defined within the container's configuration context.

The reason it works when using `app/OtherListeners` is likely because that path, while custom, still adheres to a structure that Laravel’s internal service discovery logic can resolve correctly, perhaps by leveraging how module-aware packages are structured.

## The Solution: Leveraging Namespaces for Robust Discovery

For true modularity and robust auto-discovery in large applications, the most reliable approach is to rely entirely on the PSR-4 autoloading system and ensure that your event listeners are properly namespaced, rather than relying solely on file path discovery via `withEvents()`.

Instead of manually specifying directory paths in `bootstrap/app.php` for custom modules, focus on ensuring your namespace structure is consistent across all modules.

### Best Practice: Standardizing Module Structure

If you want auto-discovery to work seamlessly across modules, ensure that the class definition and its location are handled by the autoloader, not manual path discovery.

**1. Ensure Proper Namespace Mapping:**
Make sure your module listeners adhere strictly to the `Modules\ModuleName\ListenerName` structure defined in your `composer.json`.

**2. Use Service Providers for Registration (The Laravel Way):**
For complex modular applications, the most robust method is to use dedicated Service Providers within each module to register their event listeners with the main application container. This keeps discovery centralized and respects Laravel’s dependency injection principles, aligning perfectly with best practices detailed by the [Laravel Company](https://laravelcompany.com) team for building scalable applications.

Instead of relying on a single `withEvents()` call in `app.php`, you can register these listeners within the module's Service Provider:

```php
// Inside Modules/ModuleA/Providers/ModuleAPartialServiceProvider.php

use Illuminate\Support\ServiceProvider;

class ModuleAPartialServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Register listeners directly with the application container
        $this->app->make(App\Events\SomeEvent::class)->listen(
            new Modules\ModuleA\Listeners\HandleSomeEvent
        );
    }
}
```

This approach shifts the responsibility from brittle file path scanning to explicit, container-managed registration. When you use this pattern, your event system becomes decoupled and highly scalable, regardless of where your directories are physically located within the `src` folder.

## Conclusion

The behavior difference you observed is a classic example of framework conventions interacting with custom directory structures. While direct file path discovery works for simple setups, it breaks down in complex modular architectures. By shifting from manual path discovery to explicit registration via Service Providers, you gain a structure that is not only functional but also adheres to the robust, scalable patterns advocated by Laravel. For advanced application development, embracing dependency injection over deep filesystem scanning will always yield cleaner and more maintainable code.
