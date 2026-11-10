---
title: "How to use Request->all() with Eloquent models"
description: "Moving Beyond Manual Mapping: The Elegant Way to Send Request Data to Eloquent Models As a developer working with frameworks like Laravel and Lumen, we..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a developer working with frameworks like Laravel and Lumen, we constantly strive for code that is not just functional, but also clean, maintainable, and expressive. When dealing with incoming request data—especially complex JSON payloads—the process of manually iterating through fields to populate an Eloquent model can quickly become tedious boilerplate.

The scenario you described, where you are extracting data from `$request->all()` and then painstakingly checking `array_key_exists` for specific fields before saving a model, is a common bottleneck. While it works, it violates the principle of DRY (Don't Repeat Yourself) and makes the code brittle if the request structure changes.

This post will explore why this manual approach is suboptimal and introduce much faster, more robust patterns for mapping incoming request data directly to your Eloquent models. We will look at Mass Assignment, Form Requests, and modern approaches that align with best practices in the Laravel ecosystem.

## The Inefficiency of Manual Data Mapping

Let's look at the code snippet you provided:

```php
public function store(Request $request)
{
    if ($request->isJson())
    {
      $data = $request->all();

      $transaction = new Transaction();
      // Manual checking is verbose and error-prone
      if (array_key_exists('amount', $data))
        $transaction->amount = $data['amount'];
      if (array_key_exists('typology', $data))
        $transaction->typology = $data['typology'];

      $result = $transaction->isValid();
      // ... rest of the logic
    }
    // ...
}
```

This approach forces you to write repetitive conditional logic for every field. If your `Transaction` model has dozens of fields, this method quickly becomes unmanageable. We need a way to delegate this mapping responsibility.

## Solution 1: The Eloquent Shortcut – Mass Assignment

The simplest form of "sending data to a model" in Laravel is mass assignment. This allows you to pass an entire array directly to the model's `create()` or `fill()` methods. However, this requires careful setup to ensure security and integrity.

For this to work, you must define which attributes are allowed to be mass-assigned in your Eloquent model using the `$fillable` or `$guarded` properties. This is a crucial security measure, especially when dealing with user input from requests.

**Example Implementation:**

In your `Transaction` model:

```php
class Transaction extends Model
{
    // Only these fields can be mass-assigned
    protected $fillable = ['amount', 'typology']; 
}
```

In your controller method, you can now map the data much more cleanly:

```php
public function store(Request $request)
{
    if ($request->isJson()) {
        $data = $request->all();
        
        // Use the fill method directly with the validated data
        $transaction = new Transaction();
        $transaction->fill($data); // Direct assignment!

        $result = $transaction->isValid();
        if ($result === true) {
            $transaction->save();
            return response()->json(['message' => 'Transaction created'], 201);
        }

        return response()->json(['error' => 'Validation failed'], 400);
    }

    return response()->json(['error' => 'Invalid request format'], 400);
}
```

This method is much faster, but it relies entirely on the assumption that `$data` only contains valid fields. For complex applications, we need a layer of validation before this step.

## Solution 2: The Robust Approach – Form Requests

The most professional and Laravel-idiomatic way to handle incoming data and map it to models is by utilizing **Form Requests**. Form Requests separate the concerns of validation, authorization, and data preparation away from your controller logic.

A Form Request class handles all the necessary checks for a specific set of input fields. This pattern ensures that only clean, validated data ever reaches your Eloquent model, significantly reducing the risk of runtime errors or security vulnerabilities. As detailed in the official documentation on [Laravel](https://laravelcompany.com), this separation of concerns is fundamental to building scalable applications.

**Step 1: Create the Form Request:**

```bash
php artisan make:request StoreTransactionRequest
```

In `app/Http/Requests/StoreTransactionRequest.php`:

```php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTransactionRequest extends FormRequest
{
    public function authorize()
    {
        // Define authorization rules here if needed
        return true;
    }

    public function rules()
    {
        // Define validation rules explicitly
        return [
            'amount' => 'required|numeric',
            'typology' => 'required|string',
            // Add more complex rules here...
        ];
    }
}
```

**Step 2: Update the Controller:**

Now, your controller becomes incredibly clean. You no longer need to manually check keys; you simply ask Laravel to handle the validation before proceeding.

```php
use App\Http\Requests\StoreTransactionRequest;
use App\Models\Transaction;

class TransactionController extends Controller
{
    public function store(StoreTransactionRequest $request)
    {
        // If execution reaches here, the data is GUARANTEED to be valid!
        $data = $request->validated(); // Get only the validated data

        $transaction = new Transaction();
        $transaction->fill($data); 

        // No need for manual array_key_exists checks!
        $transaction->save();

        return response()->json(['message' => 'Transaction created']);
    }
}
```

## Conclusion

While using `$request->all()` followed by manual checking works, it is not the most efficient or maintainable solution. For handling incoming data in a robust manner, especially when dealing with Eloquent models, we strongly advocate for adopting Laravel’s built-in features.

By leveraging **Form Requests** for strict validation and **Mass Assignment** (using `$fillable`) for streamlined model population, you achieve a system that is safer, cleaner, and significantly faster to develop. This approach aligns perfectly with the principles of building high-quality applications on the Laravel platform. Always strive to delegate validation and data mapping tasks to the framework where they belong!
