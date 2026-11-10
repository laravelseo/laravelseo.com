---
title: "Error Call to undefined function App\\Http\\Controllers\\Admin\\get_option()"
description: "Solving the Migration Nightmare: Why Your Custom Helper Function Fails Across Laravel Versions As a senior developer who has navigated the evolution of the..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a senior developer who has navigated the evolution of the Laravel framework—from the early days of 5.4 all the way through major updates to 7.1+—I understand the frustration that comes with dependency and migration issues. The specific error you are encountering, `Error Call to undefined function App\Http\Controllers\Admin\get_option()`, points directly to a fundamental change in how your application structure or code is being loaded or referenced across different Laravel versions.

This post will dissect why this happens, examine the underlying causes related to framework evolution, and provide a modern, robust solution for handling configuration or option retrieval in large applications.

---

## The Root Cause: Framework Evolution and Autoloading Changes

The core problem isn't usually a single line of code being broken; it’s often how PHP autoloading, namespaces, and the structure of helper functions are interpreted across major framework releases.

In your case, you have a function defined outside of the typical class-based structure (perhaps in a global helper or a separate file), which was accessible in Laravel 5.4 but is now failing in Laravel 7.1.4. This discrepancy often arises because:

1.  **Namespace Changes:** Laravel updates frequently adjust how namespaces are resolved, especially when moving towards stricter PSR-4 standards. If your custom function relies on a specific class or model being loaded via the standard mechanism, a change in the application's bootstrapping process can break this dependency.
2.  **Helper Context Loss:** In older versions, helper functions might have been implicitly available. In newer versions, developers are pushed toward explicit Dependency Injection (DI) and Service Classes to manage business logic, making reliance on global functions less reliable.
3.  **Autoloading Errors:** The error message suggests PHP cannot find the function definition where it expects it to be, indicating an issue with how your application's autoloader maps the code location during runtime in the newer environment.

The attempt to use `$dayRegister = User::where('create_at','>'+strtotime('-'.get_option('chart_day_count',10).' day')+12600)-gt;get();` reveals that the system is trying to execute a function (`get_option`) directly within an Eloquent chain, which requires the function to be accessible globally or properly injected.

## The Solution: Embracing Service Classes and Eloquent Scopes

Relying on global helper functions for complex data retrieval—especially when those functions interact with models like `\App\Models\Option`—is brittle. A more robust, maintainable approach in modern Laravel development is to encapsulate this logic within dedicated **Service Classes** or use **Eloquent Accessors**. This aligns perfectly with the architectural principles advocated by teams focused on building scalable applications, such as those promoted by the [Laravel Company](https://laravelcompany.com).

Instead of having a standalone function that depends on global state, we should make the data retrieval method an inherent part of the model or a dedicated service.

### Refactoring Example: Moving Logic to a Service

Let's refactor your option logic into a dedicated service class. This makes the code testable, decoupled, and version-agnostic.

**1. Create the Option Retrieval Service:**

```php
// app/Services/OptionService.php

namespace App\Services;

use App\Models\Option;

class OptionService
{
    /**
     * Retrieves an option value based on its key, falling back to a default.
     *
     * @param string $optionKey The key to look up.
     * @param mixed $default The default value if not found.
     * @return mixed
     */
    public function getOptionValue(string $optionKey, $default = null)
    {
        // Use Eloquent's find method for better performance and clarity
        $option = Option::where('option', $optionKey)->value('value');

        if ($option !== null) {
            return $option;
        }

        return $default;
    }
}
```

**2. Update the Controller to Use the Service:**

Now, inject this service into your controller instead of relying on an undefined global function.

```php
// app/Http/Controllers/Admin/UserController.php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Services\OptionService; // Import the new service

class UserController extends Controller
{
    protected $optionService;

    // Dependency Injection via constructor
    public function __construct(OptionService $optionService)
    {
        $this->optionService = $optionService;
    }

    public function user()
    {
        // Use the service method instead of the global function call
        $chartDayCount = $this->optionService->getOptionValue('chart_day_count', 10);

        $userCount = User::where('admin','0')->count();
        $adminCount = User::where('admin','1')->count();
        // ... other counts remain the same

        // Use the retrieved value in your query safely
        $dayRegister = User::where('create_at', '>', strtotime("-" . $chartDayCount . ' day') + 12600)
            ->get();

        return view('admin.report.user', [
            'userCount' => $userCount,
            'adminCount' => $adminCount,
            // ... other variables
            'dayRegister' => $dayRegister
        ]);
    }
}
```

## Conclusion

The migration from Laravel 5 to 7 highlights a crucial principle in software development: **Avoid global state and external helper functions for complex business logic.** While it might seem simpler initially, these functions introduce significant fragility when the framework evolves. By refactoring your logic into dedicated Service Classes and utilizing proper Dependency Injection, you ensure that your application remains clean, maintainable, and compatible across future Laravel versions. Focus on structuring your code around Eloquent relationships and services; this is the path to building robust applications, just as recommended by the community at [Laravel Company](https://laravelcompany.com).
