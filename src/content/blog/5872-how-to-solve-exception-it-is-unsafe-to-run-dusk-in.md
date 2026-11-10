---
title: "How to solve Exception It is unsafe to run Dusk in production in laravel 5.5?"
description: "How to Solve the \"It is unsafe to run Dusk in Production\" Exception in Laravel 5.5 Migrating projects and dealing with environment specific exceptions is a..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Performance", "PHP", "Errors"]
featured: false
---

Migrating projects and dealing with environment-specific exceptions is a rite of passage for every developer. You build something great locally, but when deploying to production, unexpected errors pop up. One such frustrating issue developers encounter when using testing tools like Dusk in a live environment is the exception: "It is unsafe to run Dusk in production."

This post dives deep into why this error occurs, analyzes why your initial attempt at conditional registration failed, and provides robust solutions to safely manage Dusk integration across your Laravel application.

## Understanding the Root Cause

The message you are seeing stems from a built-in safety mechanism within the Dusk package or Laravel's testing infrastructure. Dusk is designed for end-to-end browser automation, which involves making external HTTP requests and interacting with the DOM. Running these heavy operations on a live production server poses significant risks: potential performance degradation, unintended side effects on live data, and general instability.

Laravel, in line with strong architectural principles, enforces this safety check to prevent accidental execution of testing code in environments where it is not intended. When you deploy your application, the framework attempts to initialize all service providers, including those related to UI testing, leading to this explicit warning or exception if Dusk components are detected during the bootstrap process.

## Why Your Initial Attempt Didn't Work

You correctly tried to use conditional logic within `AppServiceProvider.php` to register Dusk only in local or testing environments:

```php
public function register()
{
    // Dusk, if env is appropriate
    if ($this->app->environment('local', 'testing')) {
        $this->app->register(DuskServiceProvider::class);
    }
}
```

While this logic is sound for general application setup, the error you are encountering suggests that the detection mechanism is either bypassed or triggered at a level deeper than standard service provider registration. This often happens because the check is performed during the core framework bootstrap before your custom providers are fully initialized, or because the Dusk package has its own internal boot sequence that executes independently of standard environment checks.

## The Correct Solution: Environment-Specific Class Loading and Exclusion

Instead of relying solely on conditional registration within the service provider, a more robust solution involves ensuring that any code execution related to testing tools is strictly gated by the environment settings or handled via explicit exclusion paths. For serious production deployments, treating the production environment as entirely test-free is paramount.

Here is a refined approach focusing on explicit control over when Dusk components are loaded:

### 1. Isolate Testing Concerns

Keep all heavy testing setups and service registrations strictly confined to environments where they are expected (i.e., `local` or `testing`). For production, you must ensure that no code path leads to the instantiation of these tools.

### 2. Using Environment Variables for Strict Control

Since you are moving from Laravel 5.4 to 5.5, leveraging environment variables is the cleanest way to control behavior across different deployment stages. Instead of checking `local` or `testing`, check if the application is in a mode where testing tools *should* be enabled.

If you are deploying to production, ensure that `$APP_ENV` is strictly set to `production`. If your system detects any ambiguity, it should default to safety measures.

### 3. Conditional Registration Refined

If you must register the service provider conditionally, ensure the check is comprehensive and covers all potential states where Dusk might be inadvertently loaded:

```php
use Illuminate\Support\ServiceProvider;
use Dusk\ServiceProvider as DuskServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Only register Dusk if we are deliberately running tests or local development.
        if (in_array(app()->environment(), ['local', 'testing'])) {
            $this->app->register(DuskServiceProvider::class);
        }
    }

    public function boot()
    {
        // Ensure no Dusk-related booting happens in production, even if the registration somehow slips through.
        if (app()->environment('production')) {
            // Explicitly prevent any potential further Dusk bootstrapping here if necessary.
            // This step is often more effective than just conditional registration alone.
        }
    }
}
```

## Best Practices for Laravel Deployments

As you scale your application, remember that separation of concerns is key. The core logic and controllers should remain pristine in production. Testing tools, like Dusk, belong strictly to the development pipeline. When focusing on enterprise-grade solutions, always adhere to best practices outlined by organizations like [Laravel Company](https://laravelcompany.com). This focus on clean architecture ensures that your application remains stable regardless of the environment it is deployed to.

## Conclusion

The "It is unsafe to run Dusk in production" exception is a symptom of running testing infrastructure outside its intended scope. By moving away from simple conditional registration and adopting stricter, explicit environmental checks—and ensuring that no execution path leads to Dusk initialization when `APP_ENV` is set to `production`—you can eliminate this error completely. Focus on keeping your production environment focused solely on serving live requests, and reserve testing tools for the development sandbox.
