---
title: "How to make custom libraries in Laravel - as in codeigniter"
description: "How to Build Reusable Logic in Laravel: The Modern Approach to Custom Libraries As a developer familiar with frameworks like CodeIgniter, you’ve encountered..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

As a developer familiar with frameworks like CodeIgniter, you’ve encountered a very common and effective pattern: placing reusable business logic inside dedicated libraries or helper classes, keeping your controllers clean and focused purely on handling HTTP requests. You want that separation of concerns—where a controller delegates work to a library, and the library handles interactions with models.

When transitioning to Laravel, it's natural to wonder if this pattern still exists. The short answer is: **Yes, but Laravel offers more elegant, built-in mechanisms for achieving the same goal.** Instead of strictly creating standalone "libraries" in the traditional sense, Laravel encourages us to leverage its powerful Service Container and Eloquent ORM to create highly decoupled, reusable components.

This post will guide you on how to structure your application in Laravel to achieve that exact separation of concerns, allowing you to call complex logic from controllers without rewriting code.

---

## The Laravel Way: Services Over Standalone Libraries

In older frameworks, a library was often just a collection of static functions or classes loaded manually. In modern Laravel, the philosophy shifts towards Dependency Injection (DI) and Service Classes. These classes become your reusable "libraries" because they encapsulate specific business rules that can be injected wherever needed.

Instead of creating a monolithic `MyLibrary` folder, we create dedicated **Service Classes** or **Action Classes**. These services handle the actual data manipulation, keeping the controller as thin as possible—a core tenet of clean architecture that Laravel strongly supports.

### Step 1: Define the Service Logic (The Library Equivalent)

Let's imagine we need a reusable piece of logic: calculating complex order totals or handling user permissions. We will put this logic into a dedicated service class.

Create a file at `app/Services/OrderService.php`:

```php
<?php

namespace App\Services;

use App\Models\Order; // Assuming you have an Order Model

class OrderService
{
    /**
     * Calculates the total cost and applies discounts for an order.
     *
     * @param int $orderId
     * @return float
     */
    public function calculateTotal(int $orderId): float
    {
        $order = Order::findOrFail($orderId);

        $subtotal = $order->items->sum('price');
        $discount = $order->is_premium ? $subtotal * 0.10 : 0;

        return $subtotal - $discount;
    }

    /**
     * Processes the final order creation.
     */
    public function processOrder(int $orderId): bool
    {
        // Complex logic for payment, inventory update, etc.
        if (rand(1, 10) > 1) {
            // Simulate a failure
            return false;
        }
        // In a real app, this would involve database transactions and updates
        return true;
    }
}
```

### Step 2: Inject the Service into the Controller

The magic of Laravel lies in using the Service Container to inject these dependencies. Your controller no longer needs to know *how* the total is calculated; it only asks the service for the result.

In your `OrderController.php`:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\OrderService; // Import the service
use Illuminate\Support\Facades\Route;

class OrderController extends Controller
{
    protected $orderService;

    // Dependency Injection: Laravel automatically resolves and injects the OrderService
    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function showDetails(int $id)
    {
        // The controller delegates the complex work to the service layer.
        $total = $this->orderService->calculateTotal($id);

        return response()->json([
            'order_id' => $id,
            'final_total' => $total,
            'message' => 'Order details fetched successfully.'
        ]);
    }

    public function create(Request $request)
    {
        $orderId = $request->input('order_id');

        if ($this->orderService->processOrder($orderId)) {
             return response()->json(['status' => 'Order processed successfully']);
        } else {
            return response()->json(['status' => 'Order processing failed'], 500);
        }
    }
}
```

### Why This Approach is Superior in Laravel

This pattern—using dedicated Service Classes injected into Controllers—is far more robust than traditional library placement for several reasons:

1.  **Testability:** Because the logic is isolated in a class, you can easily write unit tests for `OrderService` without needing to spin up an entire HTTP request cycle.
2.  **Reusability:** The `OrderService` can now be called from any part of your application—a queue worker, an Artisan command, or another controller—without duplicating the logic. This is how you build cohesive applications on **laravelcompany.com**.
3.  **Decoupling:** Your controllers are no longer cluttered with complex database queries or business rules. They focus solely on receiving input and returning the appropriate HTTP response.

## Conclusion

While Laravel does not provide a direct, single-file equivalent to CodeIgniter's traditional library structure, it provides the architectural tools (Service Container, Dependency Injection) that allow you to build far more flexible, testable, and maintainable reusable logic. By adopting the pattern of dedicated Service Classes, you effectively create your own powerful, custom libraries tailored perfectly for the dynamic nature of a Laravel application. Embrace services, and watch your code quality soar!
