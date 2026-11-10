---
title: "Laravel: Access Model instance in Form Request when using Route/Model binding"
description: "Laravel: Accessing Bound Model Instances within Form Requests – The Right Way As a senior developer working within the Laravel ecosystem, we often..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As a senior developer working within the Laravel ecosystem, we often encounter scenarios where dependency injection and route model binding seem straightforward. You successfully bind an Eloquent model to a route parameter, and it seamlessly arrives in your controller method. However, when you introduce a `FormRequest` layer for validation, this flow can break down, leading to confusion about how to inject that bound instance into the request object itself.

This post dives into the specific challenge of accessing a bound Eloquent model instance within a Form Request and explores why common attempts fail, presenting the most robust, idiomatic Laravel solution.

## The Problem: Bridging Model Binding and Validation Context

You have correctly set up route model binding:
```php
// Route setup
Route::model('brand', Brand::class)->parameters([
    'brand' => 'brand',
]);
```
This ensures that when a request hits a route expecting a `Brand`, Laravel automatically resolves and injects the correct `Brand` instance into your controller method.

Your goal is to use this specific `Brand` instance within an `EditBrandRequest` to define custom, context-aware validation rules. You want something like: "Ensure the user only edits this specific brand."

As you discovered, trying to inject the model directly into the Form Request's constructor or the `rules()` method does not work as expected. This is because standard dependency injection mechanisms applied to Form Requests primarily focus on request data (input fields) and do not automatically propagate already bound route parameters into the request object in this manner.

```php
// User attempt that fails:
class EditBrandRequest extends Request
{
    public function __construct(Brand $brand) // Fails to get the bound instance correctly
    {
        dd($brand); 
    }

    public function rules(Brand $brand) // Fails to get the bound instance correctly
    {
        dd($brand);
    }
}
```
In these scenarios, you are essentially injecting a *new* or *unrelated* instance, rather than leveraging the already established route binding.

## The Idiomatic Laravel Solution: Controller as the Source of Truth

The most effective and cleanest way to handle model context is to maintain the separation of concerns that Laravel encourages. Form Requests should focus strictly on **request data validation**, not complex object retrieval or state management.

Instead of trying to force the model instance into the Request, we leverage the fact that the model is already available where you need it: in your controller method. The controller acts as the orchestrator, utilizing the bound model for both fetching and validation setup.

### Step 1: Rely on Route Model Binding in the Controller

Let your controller handle the dependency injection of the model instance directly:

```php
use App\Models\Brand;
use App\Http\Requests\EditBrandRequest;

class BrandController extends Controller
{
    // Laravel automatically injects the resolved 'Brand' instance here
    public function edit(EditBrandRequest $request, Brand $brand)
    {
        // The $brand instance is fully available for use.
        // We can now use it to define complex rules or perform logic before saving.

        $validated = $request->validated();

        // Example: Custom validation based on the model state
        if ($brand->is_archived && $request->has('name')) {
            $request->validate([
                'name' => 'You cannot edit an archived brand.',
            ]);
        }

        // Proceed with saving logic...
    }
}
```

### Step 2: Use the Form Request for Input Validation Only

Keep your `EditBrandRequest` focused purely on validating the *input data* provided in the request payload. This keeps the Form Request lightweight, reusable, and focused on its primary responsibility—request validation.

```php
// app/Http/Requests/EditBrandRequest.php

class EditBrandRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Or implement proper authorization logic
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        // Focus only on validating the incoming data fields
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            // Any other input-based rules
        ];
    }
}
```

## Conclusion

The confusion arises from trying to inject a high-level resource (the Model) into a low-level validation layer (the Form Request). In the Laravel architecture, dependency resolution should flow from the route binding down to the controller, where the full context of the requested resource resides. By letting the controller handle the injection of the bound model and using the Form Request strictly for input rules, you adhere to best practices, resulting in cleaner, more maintainable code.

For deeper dives into how Laravel manages routes and dependencies, exploring official documentation like [laravelcompany.com](https://laravelcompany.com) is highly recommended.
