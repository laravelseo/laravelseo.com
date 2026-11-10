---
title: "Laravel: retrieve bound model from request"
description: "Laravel: Retrieving Bound Models within a FormRequest Is there any easy way of retrieving the route's bound model within a FormRequest class? When building..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Is there any easy way of retrieving the route's bound model within a `FormRequest` class?

When building robust, permission-aware applications in Laravel, we often find ourselves needing to perform authorization checks before processing input. This usually happens within the `FormRequest`, as it acts as the gatekeeper for data validation and authorization. The challenge arises when you need access to the actual Eloquent model instance—the resource being requested—to make those checks.

This post dives into how Laravel handles model binding and provides the definitive method for accessing that bound model directly within your request class.

## Understanding Route Model Binding

The foundation of this solution lies in Laravel's powerful **Route Model Binding**. When you define a route like this:

```php
Route::put('/bookings/{booking}', [BookingController::class, 'update'])->bind('booking');
```

Laravel automatically attempts to resolve the `{booking}` segment by finding a matching model (in this case, an Eloquent `Booking` model) and injects that specific instance into your controller method.

Crucially, when you use Route Model Binding, Laravel makes that bound model available as a typed argument to any class that handles the request, including your `FormRequest`. This is achieved through dependency injection mechanisms.

## The Solution: Injecting Models into FormRequests

You are correct in observing that methods like `$this->all()` only provide the raw input data (the request parameters), not the Eloquent model itself. To access the bound model within the `FormRequest`, you must explicitly declare it as a parameter in your method signature, just as you would in a controller.

When defining a validation or authorization rule inside the `FormRequest`, simply type-hint the model you expect to be bound by the route:

```php
// app/Http/Requests/BookingUpdateRequest.php

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Booking; // Ensure your model is imported

class BookingUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        // We can access the bound model here!
        $booking = $this->route('booking'); // Or rely on method injection (see below)

        if (!$booking) {
            return false;
        }

        // Example authorization check: Check ownership
        return $booking->owner->user_id === auth()->id();
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules()
    {
        // ... standard validation rules
    }
}
```

### The Preferred Method: Method Parameter Injection

While using `$this->route('model_name')` works, the most idiomatic and clean way within a `FormRequest` is to leverage direct method injection into your request methods. If you are validating a specific route structure, Laravel handles the binding automatically when you type-hint the model in the method signature:

```php
// app/Http/Requests/BookingUpdateRequest.php

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Booking;

class BookingUpdateRequest extends FormRequest
{
    /**
     * The booking model bound to this request.
     */
    public function update(Booking $booking) // <-- Model injected here!
    {
        // Now we have direct access to the bound model instance
        if ($booking->owner->user_id !== auth()->id()) {
            $this->throwValidationException('Unauthorized action.');
        }

        // Proceed with updates...
        $booking->update($this->validated());
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize()
    {
        // The $booking variable is available here because it was injected!
        if (!$this->route('booking')) {
            return false;
        }
        
        $booking = $this->route('booking');

        return $booking->owner->user_id === auth()->id();
    }
}
```

## Why This Approach is Superior

This pattern brings significant architectural benefits. By retrieving the model within the `FormRequest`, you achieve **Separation of Concerns (SoC)**:

1.  **Cleaner Controllers:** Your controller methods remain focused purely on handling HTTP requests and delegating logic, rather than managing complex authorization checks against Eloquent models.
2.  **Reusability:** The authorization logic is centralized in the `FormRequest`. This means any endpoint using that request class inherits the same, secure permission rules.
3.  **Laravel Idiomatic:** This aligns perfectly with Laravel's philosophy of using route model binding and dependency injection to keep the code DRY (Don't Repeat Yourself) and highly maintainable.

By mastering how models are bound and injected into your Request classes, you move beyond simple input validation and start building truly secure and elegant Laravel applications, as promoted by the community at [laravelcompany.com](https://laravelcompany.com).
