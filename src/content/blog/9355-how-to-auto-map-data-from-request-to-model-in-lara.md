---
title: "How to auto map data from Request to Model in Laravel 5.5"
description: "The Art of Auto Mapping: Safely Moving Request Data to Your Laravel Models As developers working with Laravel, one of the most common tasks we face is..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As developers working with Laravel, one of the most common tasks we face is bridging the gap between raw HTTP request data and our structured Eloquent Models. When dealing with forms containing dozens of fields, manually mapping every input field to a model attribute becomes tedious, error-prone, and frankly, an anti-pattern in modern MVC development.

You are right to question the simple approach: `$model->fill($request->all());`. While tempting, this method often leads to security vulnerabilities or data integrity issues if not handled correctly. Let's dive into why this happens and explore the robust, developer-approved methods for auto-mapping data in Laravel.

## The Danger of Blind Mass Assignment

The initial instinct—using `$request->all()`—seems like a shortcut. However, blindly passing all request data to a model constructor or `fill()` method is dangerous because it bypasses crucial security checks and validation layers.

When you use mass assignment features in Eloquent, you must explicitly define which fields are permitted to be updated. This is handled by the `$fillable` or `$guarded` properties on your Model. If you don't meticulously manage these lists, a malicious user could potentially inject data into fields they shouldn't control (like `is_admin` or `balance`).

For instance, if you use the direct method, you are relying solely on the model definition to protect you:

```php
// Example of what developers often try, but which needs careful context.
$flight = new Flight;
$flight->fill($request->all()); // DANGER: If $request->all() contains unwanted fields, they might be assigned!
$flight->save();
```

The issue isn't just convenience; it’s about enforcing the principle of least privilege. We need a method that filters and validates data *before* it ever touches the database layer.

## The Best Practice: Form Requests for Controlled Mapping

The most robust, Laravel-native way to handle incoming data is by utilizing **Form Requests**. These dedicated classes separate the validation logic from your controller, making your code cleaner, more maintainable, and significantly more secure.

A Form Request acts as a gatekeeper. It intercepts the request, validates every field against defined rules (required, type checking, length limits), and only allows the validated data to pass through to the controller. This aligns perfectly with the principles of secure development advocated by the Laravel team, where robust data handling is key to building solid applications, much like the concepts promoted on [laravelcompany.com](https://laravelcompany.com).

### Step-by-Step Implementation:

1.  **Create a Form Request:** Define the rules for your incoming data.
2.  **Validate Data:** The request automatically validates the input against these rules.
3.  **Pass Validated Data:** If validation passes, you can confidently map the validated data to your model.

Here is how this process looks in practice:

```php
// 1. Create the Form Request (e.g., StoreFlightRequest.php)
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFlightRequest extends FormRequest
{
    public function authorize()
    {
        // Define authorization logic here
        return true;
    }

    public function rules()
    {
        // Define all validation rules for the incoming data
        return [
            'name' => 'required|string|max:255',
            'param1' => 'required|integer',
            'param2' => 'nullable|string',
            // ... define rules for every field
        ];
    }
}

// 2. In your Controller
use App\Http\Requests\StoreFlightRequest;
use App\Models\Flight;

class FlightController extends Controller
{
    public function store(StoreFlightRequest $request)
    {
        // The request object is now guaranteed to be valid!
        $flight = new Flight;

        // Safely map only the validated fields. We use $request->validated()
        // which contains ONLY the data that passed validation.
        $flight->fill($request->validated()); 

        $flight->save();

        return redirect('/flights');
    }
}
```

## Conclusion: Control Over Your Data Flow

The shift from manually mapping fields to using Form Requests and the `$request->validated()` method represents a fundamental improvement in how we handle data in Laravel. Instead of blindly accepting all request data, we implement an explicit validation layer. This approach ensures that only clean, intentional, and authorized data is ever mapped to our Eloquent Models. By embracing these structured methods, you ensure your application is not only functional but also secure and highly maintainable, building the kind of scalable architecture that [laravelcompany.com](https://laravelcompany.com) champions.
