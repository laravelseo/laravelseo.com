---
title: "How to create aliases in laravel?"
description: "How to Create Custom Aliases and Services in Laravel: Beyond Simple Facades As a senior developer working with the Laravel ecosystem, you often run into a..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

As a senior developer working with the Laravel ecosystem, you often run into a common need: abstracting complex database interactions or application logic behind simple, readable entry points. You want to achieve something like `Auth::user()` for authentication access or `Setting::method()->value` for cleaner data retrieval in your views and controllers.

The mechanism you are looking for involves understanding the distinction between Laravel Facades, Service Classes, and Service Providers. This post will walk you through the proper architectural patterns to create these custom aliases effectively.

## Understanding Laravel Aliases: Facades vs. Services

When developers talk about "aliases" in Laravel, they are usually referring to one of two concepts: **Facades** or **Service Classes**. The choice depends entirely on what you are aliasing—a static entry point (Facade) or an object that performs complex business logic (Service).

### 1. Using Facades for Static Access

Laravel's built-in Facades (like `Route`, `DB`, or `Auth`) are essentially static wrappers around classes, making them incredibly easy to use. They are perfect for accessing global application services quickly.

For your example of something like `Auth::user()`, Laravel already provides this functionality through the `Auth` facade. You generally do not need to recreate this unless you are building a massive, custom package.

### 2. Creating Custom Service Aliases (The Architectural Approach)

If you want to create a custom alias for complex logic—like accessing data from a specific model in a structured way, such as `Setting::method()->value`—you should lean towards creating dedicated **Service Classes** and binding them using **Service Providers**. This approach keeps your code testable, decoupled, and adheres to SOLID principles.

## Procedure: Implementing Custom Data Access with Services

Let’s focus on achieving the desire to access settings data cleanly within your application structure. Instead of overloading an Eloquent model directly, we will create a dedicated service layer for configuration management.

### Step 1: Create the Service Class

First, define a class that encapsulates the logic you want to expose. This class will handle the interaction with the database.

```php
// app/Services/SettingService.php

namespace App\Services;

use App\Models\Setting; // Assuming you have a Setting model
use Illuminate\Support\Facades\DB;

class SettingService
{
    /**
     * Retrieves a specific setting value cleanly.
     *
     * @param string $key
     * @return mixed
     */
    public function getValue(string $key)
    {
        $setting = Setting::where('key', $key)->first();

        if (!$setting) {
            throw new \Exception("Setting not found for key: " . $key);
        }

        // Return the value, mimicking a method call structure
        return $setting->value;
    }
}
```

### Step 2: Registering the Service via a Service Provider

This is where you tell Laravel how to resolve your new service. Service Providers are the central place for bootstrapping and binding services in Laravel. This prevents the need to manually instantiate classes everywhere.

You would typically create a dedicated provider, or register it within your main `AppServiceProvider`.

```php
// app/Providers/AppServiceProvider.php (or a custom SettingServiceProvider)

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\SettingService; // Import the service class

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Binding the interface (or concrete class) to the container.
        // This allows us to resolve 'SettingService' anywhere using the container.
        $this->app->bind(SettingService::class, function ($app) {
            return new SettingService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
```

### Step 3: Using the Alias in Controllers and Views

Now, instead of directly querying Eloquent inside your controllers or views, you inject or resolve this service. While we haven't created a formal Facade yet, resolving services via the container is the most robust pattern.

In a Controller:
```php
// app/Http/Controllers/SettingController.php

use App\Services\SettingService;

class SettingController extends Controller
{
    protected $settingService;

    public function __construct(SettingService $settingService)
    {
        $this->settingService = $settingService;
    }

    public function showSettings()
    {
        // Use the service to get data cleanly
        $value = $this->settingService->getValue('theme');
        return view('settings', ['theme_value' => $value]);
    }
}
```

In a Blade View:
The controller passes the already processed data, keeping the view clean and focused on presentation.

## Conclusion

Creating custom aliases in Laravel is less about creating new Facades from scratch and more about establishing a robust service layer. While Facades are excellent for accessing core framework features, **Service Providers** are the correct tool for binding complex, custom application logic—like your `SettingService`—into the Laravel container. This pattern ensures that your application remains highly maintainable, testable, and scalable. By following this Service-Oriented approach, you move away from static global calls toward explicit dependency injection, which is a hallmark of high-quality Laravel development, aligning perfectly with best practices found on platforms like https://laravelcompany.com.
