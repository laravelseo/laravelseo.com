---
title: "How to override the validation rule login Laravel\\Fortify?"
description: "How to Override Validation Rules in Laravel Fortify's LoginRequest As developers working within the Laravel ecosystem, we often encounter situations where we..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As developers working within the Laravel ecosystem, we often encounter situations where we need to extend or customize functionality provided by scaffolding packages like Laravel Fortify. A common hurdle arises when trying to modify core classes residing in the `vendor` directory. In this case, you want to add an extra validation rule to the standard `LoginRequest`, but you cannot directly edit the source files.

This post will walk you through the correct, idiomatic way to achieve your goal: overriding and extending the validation rules defined within Laravel Fortify's request classes without breaking future updates.

## The Challenge: Protecting Vendor Code

The core issue stems from encapsulation. When you see a class defined in `vendor/laravel/fortify/...`, it is intended to be treated as an external dependency. Attempting direct modifications breaks the principle of separation and will likely be overwritten during package updates, leading to frustrating maintenance issues.

The solution lies in leveraging Object-Oriented Programming (OOP) principles—specifically inheritance—to customize behavior while respecting the structure provided by the framework.

## The Solution: Extending the Base Request Class

Since `LoginRequest` extends Laravel's base `FormRequest`, we can create our own custom request class that inherits all the functionality of the Fortify request and simply overrides the specific methods we need, such as `rules()`.

Here is how you implement this customization. We will create a new request class in our application's `app` directory to house our custom logic.

### Step 1: Create the Custom Request Class

Create a new file, for instance, `app/Http/Requests/CustomLoginRequest.php`. This class will extend the original Fortify request.

```php
<?php

namespace App\Http\Requests;

use Laravel\Fortify\Http\Requests\LoginRequest as FortifyLoginRequest;
use Illuminate\Foundation\Http\FormRequest;

class CustomLoginRequest extends FortifyLoginRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        // Ensure authorization logic is respected, often inheriting from the parent.
        return parent::authorize();
    }

    /**
     * Get the validation rules that apply to the request.
     * This is where we override and extend the rules.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules()
    {
        // Start with the original Fortify rules
        $rules = parent::rules();

        // Add your custom validation rule here
        $rules['password'] = array_merge($rules['password'], ['min:12']); // Example: Enforce a minimum password length

        return $rules;
    }
}
```

### Step 2: Bind the Custom Request in Your Controller

Once the custom request is defined, you need to instruct your controller or route to use this new class instead of the default Fortify one. This is typically done by binding it in your route definition or controller method.

For example, in a controller:

```php
use App\Http\Requests\CustomLoginRequest;

class AuthController extends Controller
{
    public function login(CustomLoginRequest $request)
    {
        // The validation rules for this request are now the ones defined 
        // in CustomLoginRequest::rules()
        $validated = $request->validated();

        // ... proceed with login logic
    }
}
```

## Best Practices and Architectural Insight

This approach is highly recommended because it adheres to the SOLID principles. Instead of modifying vendor code, you are extending functionality through composition, which keeps your application decoupled and maintainable. This pattern ensures that if Laravel Fortify updates its internal structure, your custom logic remains isolated and protected.

When building complex applications on top of frameworks like Laravel, understanding how to extend base classes is fundamental. As you build out features using the vast ecosystem provided by [Laravel](https://laravelcompany.com), mastering these OOP patterns allows you to create bespoke solutions without fighting against framework updates. Think about how this mirrors the architecture behind other components in the wider Laravel landscape.

## Conclusion

To successfully override validation rules in Laravel Fortify's `LoginRequest`, avoid direct modification of vendor files. Instead, implement a dedicated custom request class that extends `Laravel\Fortify\Http\Requests\LoginRequest` and overrides the `rules()` method. This pattern provides a clean, robust, and future-proof way to customize framework behavior while maintaining excellent separation of concerns.
