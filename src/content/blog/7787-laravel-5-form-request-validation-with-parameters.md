---
title: "Laravel 5 Form request validation with parameters"
description: "Mastering Dynamic Validation: Passing Context to Laravel Form Requests As developers using Laravel, we frequently encounter scenarios where our validation..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers using Laravel, we frequently encounter scenarios where our validation rules need context—data that isn't present in the incoming HTTP request but is essential for determining validity. A common hurdle arises when attempting to use Eloquent model data (like an existing `business_id`) directly within the `rules()` method of a Form Request class.

This post dives deep into how to correctly pass external parameters, such as an associated model object, into your validation logic, providing a robust and scalable solution for complex form editing scenarios.

## The Challenge: Context in Validation

You are trying to achieve dynamic validation rules based on an existing record. Let's look at the initial setup you described:

```php
public function rules()
{
    return [
        'name' => 'required|unique:businesses,name,' . $business->id, // Hypothetical attempt
        'url' => 'required|url|unique:businesses'
    ];
}
```

While the intent is clear—to ensure uniqueness based on a specific record ID—Laravel's Form Request validation mechanism typically runs in isolation during the request lifecycle. Directly accessing `$business` inside `rules()` often fails because the Form Request class doesn't inherently know about the controller's injected models unless that context is explicitly passed to it.

## The Solution: Injecting Context via the Controller

The fundamental principle in Laravel architecture is Separation of Concerns. The Form Request should focus purely on *what* data is valid, while the Controller should handle *how* that data is validated and *what* context is required.

The correct way to pass dynamic context is by injecting the necessary model into the Form Request class through the controller method signature. This leverages Laravel's powerful dependency injection capabilities.

### Step 1: Modify the Form Request to Accept Context

Instead of trying to access a global variable, we will modify the `rules()` method to accept the necessary ID as an input parameter from the controller.

For this example, let's assume you are editing a business and need the `$businessId` to enforce uniqueness rules correctly.

### Step 2: Implement the Controller Logic

The controller is the intermediary responsible for fetching the data and preparing it for validation.

```php
use App\Http\Requests\BusinessEditRequest;
use App\Models\Business;

class BusinessController extends Controller
{
    public function postBusinessEdit(BusinessEditRequest $request, Business $business)
    {
        // Now we pass the necessary ID context to the request object.
        $validatedData = $request->validated();

        // We can manually adjust the rules or use a dedicated method if needed,
        // but for basic validation, ensuring the data is passed correctly is key.
        return response()->json(['message' => 'Business updated successfully']);
    }
}
```

### Step 3: Update the Form Request to Utilize the Context

The Form Request now accepts the necessary ID and uses it to construct dynamic rules. Notice how we use the injected parameter within the `rules()` method.

```php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Rule;

class BusinessEditRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Or implement your authorization logic
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        // Retrieve the ID passed from the controller via the request object.
        $businessId = $this->route('business'); // Or use a parameter injected directly if using route model binding

        return [
            'name' => [
                'required',
                Rule::unique('businesses')->where('id', '!=', $businessId) // Exclude the current record from uniqueness check
            ],
            'url' => [
                'required',
                'url',
                Rule::unique('businesses')->where('id', '!=', $businessId) // Apply exclusion here too
            ]
        ];
    }
}
```

**Note on Route Model Binding (Best Practice):** In modern Laravel, the cleanest approach is often to rely on **Route Model Binding**. If your route defines `/{business}` and you use `BusinessEditRequest $request`, Laravel automatically resolves the `$business` model instance. You can then access this via `$request->route('business')` or directly within the request if configured correctly, making the setup cleaner than manual injection in every form request. This aligns perfectly with best practices laid out by the [Laravel documentation](https://laravelcompany.com).

## Conclusion

When dealing with dynamic validation rules that depend on external data, avoid trying to access variables outside the scope of the Request class. Instead, follow the principle of dependency injection: let the Controller handle fetching the necessary context (like the `$business` model) and pass that context explicitly into the Form Request. This keeps your validation logic clean, testable, and adheres to Laravel’s architectural philosophy, ensuring a more maintainable application structure.
