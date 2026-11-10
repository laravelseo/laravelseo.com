---
title: "Unable to use Laravel Factory in Tinker"
description: "Solving the Mystery: Why You Can't Use Model Factories in Laravel Tinker As a senior developer navigating the intricacies of the Laravel ecosystem, you often..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a senior developer navigating the intricacies of the Laravel ecosystem, you often encounter small, frustrating hurdles when moving between command-line interactions and interactive debugging sessions. One common sticking point is trying to use Eloquent Model Factories directly within the Laravel Tinker shell.

If you are attempting to use syntax like `factory(App\Item::class)->create();` inside Tinker and are hitting a fatal error like `Call to undefined function factory() in Psy Shell`, you are not alone. This issue stems from how the execution context of Tinker differs slightly from the standard Artisan command environment, particularly regarding global helper function loading.

This post will diagnose exactly why this happens and provide the correct, robust ways to create your models within the Laravel environment.

---

## Understanding the Error: Context Matters in Tinker

The error message—`Call to undefined function factory() in Psy Shell`—tells us that the PHP interpreter running inside the Psy Shell (which powers Tinker) cannot find a globally defined function named `factory()`.

While Laravel defines factories and Eloquent models, these features are typically loaded and exposed through specific entry points: Artisan commands or methods called on an instantiated model. When you directly type factory helpers into Tinker, the environment sometimes fails to recognize the necessary facades or helper functions unless they are explicitly invoked in a recognized manner.

In essence, Tinker is designed more for inspecting live application state (data, routes, controllers) rather than executing complex static creation logic that relies on the underlying service container setup in a specific way.

## The Correct Approaches to Factory Creation

Instead of trying to invoke a global `factory()` function directly in Tinker, we need to use the established Laravel patterns. Here are the three most reliable methods for creating model instances, whether you are in Tinker or any other part of your application logic.

### Method 1: Using Eloquent Model Methods (The Recommended Way)

The most idiomatic and robust way to create models is by leveraging the methods provided directly on the Eloquent model itself. This approach relies purely on the relationship defined within your model, making it highly readable and framework-aware.

If you have a factory set up for `Item`, you can call it like this:

```php
// Inside Tinker
\App\Models\Item::factory()->create();
```

**Why this works:** This method explicitly tells Eloquent (and thus the framework) to use the factory associated with that specific model class (`Item`), ensuring all necessary setup and relationship handling is correctly executed. This pattern aligns perfectly with the principles of clean, object-oriented development championed by Laravel.

### Method 2: Executing Artisan Commands (The Standard Workflow)

For bulk creation or complex seeding, the preferred method in a development workflow is to use Artisan commands. This ensures that all service providers and environment configurations are loaded correctly before executing the task.

You can create a factory using the `make:factory` command, and then use Tinker to interact with the resulting data or models:

```bash
php artisan make:factory ItemFactory --model=Item
```

After creating the factory, you would typically run your seeding commands, keeping Tinker focused on debugging specific queries rather than heavy object creation.

### Method 3: Invoking Factory Methods via Facades (Advanced)

If you absolutely need to abstract the creation process into a helper function *within* Tinker for convenience, you must ensure you are importing or accessing the necessary facades correctly. While less common for simple model creation, this requires careful setup. For general application logic, relying on Eloquent methods (Method 1) is far superior.

## Conclusion

The error you encountered in Tinker is a symptom of scope and context rather than a bug in Laravel itself. By shifting your mindset from trying to
