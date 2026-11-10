---
title: "Extending Laravel base controller"
description: "Mastering Inheritance in Laravel Controllers: Why Session Data Disappears As we dive deeper into the world of Laravel, one of the first concepts we encounter..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As we dive deeper into the world of Laravel, one of the first concepts we encounter is Object-Oriented Programming (OOP), specifically class inheritance through extending base controllers. This allows us to promote code reuse, which is fundamental to building scalable applications. However, as you've discovered, mixing session state directly into controller inheritance can lead to unexpected behavior, like losing crucial session variables.

This post will analyze the issue you encountered with inheriting from `Controller` and why your session data seemed to vanish when extending a base class. We will explore the correct, robust architectural patterns for managing shared logic and request context in Laravel, ensuring your application remains clean and predictable.

## The Root of the Problem: Scope and Request Lifecycle

The behavior you observed—where session variables like `session('userdata')['user_urls']` became null or inaccessible inside the extended controller—stems from how PHP handles class instantiation and scope within a framework context.

When you extend a base class, you inherit the structure, but you also inherit the initialization logic defined in the parent class. If the session retrieval (`session(...)`) is placed directly within the constructor of the `PermissionController`, it relies on the exact timing and environment setup during controller instantiation. In many Laravel setups, especially when dealing with complex request lifecycles managed by middleware, accessing raw global state like the session might become unreliable or context-dependent across different inheritance levels.

The core issue is that controllers should primarily focus on handling HTTP requests and delegating business logic. Session data, authorization checks, and request parameters are better handled by dedicated layers—specifically **Middleware** and **Dependency Injection (DI)**—rather than being hardcoded into the base controller's initialization process.

## Best Practices for Extending Controllers in Laravel

Instead of relying on direct session access within the inherited class structure, we should adopt patterns that keep controllers focused on their specific routes while using dedicated tools for cross-cutting concerns like authentication and authorization.

### 1. Using Middleware for Request Context

The most robust way to manage request-specific data, such as user sessions or permissions, is through Laravel's **Middleware**. Middleware executes *before* the controller method is ever called, allowing you to populate the request object with necessary context.

If you need to check session data before a request hits your `FeeController`, place that logic in middleware. This keeps your controllers clean and adheres to the separation of concerns principle advocated by developers at **laravelcompany.com**.

### 2. Dependency Injection for Shared Logic

For methods that *must* share common logic, use inheritance sparingly. If you need common setup, consider using **Traits** or injecting services via the constructor. This allows your `FeeController` to remain focused on fee-related tasks, while the base class handles generic setup, making the flow explicit and easier to debug.

Here is how we can refactor your approach away from direct session access in the controller itself:

#### Refactored Example: Separating Concerns

We will move the permission/session check into a dedicated method or service layer, ensuring that the controller only deals with the data it needs for rendering.

**`app/Http/Controllers/Auth/PermissionController.php` (Refactored)**

```php
namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class PermissionController extends Controller
{
    /**
     * A method to check if the user has necessary permissions, 
     * handling session logic here.
     *
     * @param Request $request
     * @return bool
     */
    public function checkAccess(Request $request)
    {
        // Safely retrieve session data here, as this is a dedicated authorization step.
        $userData = session('userdata', []);

        if (empty($userData) || !in_array($request->path(), $userData['user_urls'] ?? [])) {
            // Throw an exception or return a redirect if access is denied
            abort(403, 'Access denied.');
        }

        return true; // Access granted
    }
}
```

**`app/Http/Controllers/Settings/FeeController.php` (Refactored)**

```php
namespace App\Http\Controllers\Settings;

use Illuminate\Http\Request;
use App\Http\Controllers\PermissionController; // Still extends the base controller
use App\Fee;

class FeeController extends PermissionController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Now, we only access data that is guaranteed to be available 
        // or has been validated by the base controller's logic if needed.
        // If permission checking is done via middleware or a helper method, 
        // the controller remains simple.
        
        $data['title'] = "Fees";
        $data['fees'] = Fee::all();
        return view('settings.fee.index', $data);
    }
}
```

## Conclusion

Extending controllers is a powerful technique, but it requires careful consideration of where state management belongs. Avoid embedding request-specific data like session variables directly into base controller constructors. By shifting complex logic—like permission checks and session validation—to dedicated **Middleware** or custom service methods within the base class, you achieve better separation of concerns. This approach ensures that your code remains maintainable, testable, and scalable, embodying the best practices used when building professional applications with Laravel.
