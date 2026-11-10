---
title: "Laravel pass model class as paramter in function"
description: "Passing Eloquent Models into Helper Functions: Resolving Type Errors in Laravel As developers move from simple CRUD operations to more complex application..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As developers move from simple CRUD operations to more complex application architectures, we often seek ways to abstract repetitive logic into reusable helper classes or services. The scenario presented—trying to pass a Model class reference into a static method and encountering a type error—is a very common hurdle when dealing with object-oriented principles within the Laravel ecosystem.

This post will dissect why your attempt failed and demonstrate the correct, idiomatic way to manage Eloquent Models when creating reusable database operations in Laravel.

## The Problem: Static Methods vs. Model Instances

You correctly identified that you want to centralize the deletion logic into a `Crud` helper class. However, the type error arises from a fundamental misunderstanding of what your static method expects versus what you are providing.

Let’s look at the conflict:

**Your Controller Call:**
```php
return Crud::destroy(MyModel::class, $request); // Passing a string (the class name)
```

**Your Helper Method Expectation:**
```php
public static function destroy(Model $model, Request $request)
// It strictly expects an instance of the Model class.
```

The error message—`Type error: Argument 1 passed to App\Helper\Crud::destroy() must be an instance of Illuminate\Database\Eloquent\Model, string given`—tells us exactly what is wrong: you passed the *class name* as a string instead of an *actual Model object*.

When working with Eloquent and data access in Laravel, we should always pass concrete objects (instances) rather than class definitions when performing runtime actions.

## The Solution: Passing Eloquent Model Instances

The solution lies in fetching the specific model instance you want to operate on within your Controller *before* delegating the operation to your helper class. This keeps your controller responsible for data retrieval and your helper class responsible only for execution logic, adhering to good separation of concerns.

### Step 1: Fetch the Model in the Controller

Instead of passing `MyModel::class`, you must fetch the specific record you intend to delete using Eloquent's methods (`find`, `findOrFail`, etc.).

```php
use App\Models\MyModel; // Ensure you import your model
use Illuminate\Http\Request;

public function destroy(Request $request)
{
    // 1. Find the record based on the ID provided in the request
    $model = MyModel::findOrFail($request->input('id'));

    try {
        // 2. Pass the actual Model instance to the helper
        $result = Crud::destroy($model, $request);

        return response()->json([
            'status' => 'success',
            'message' => 'Deleted successfully',
            'output' => $result // Return the result from the helper
        ]);
    } catch (\Exception $e) {
        return response()->json(['status' => 'error', 'message' => 'Something went wrong!!', 'exception_message' => $e]);
    }
}
```

### Step 2: Refine the Helper Class

Your `Crud` class remains clean and focused. It now receives exactly what it needs: an object that already has all the necessary Eloquent methods attached to it.

```php
namespace App\Helper;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class Crud extends \Illuminate\Http\Controllers\Controller // Note: Adjust inheritance if needed, or use a dedicated Service class.
{
    /**
     * Handles the deletion logic for any Eloquent Model instance.
     *
     * @param Model $model The Eloquent model instance to delete.
     * @param Request $request The request data.
     */
    public static function destroy(Model $model, Request $request)
    {
        try {
            // Now we call delete() directly on the passed instance
            $output = $model->delete(); 

            return response()->json([
                'status' => 'success',
                'message' => 'Deleted successfully',
                'output' => $output
            ]);
        } catch (\Exception $e) {
            // Handle potential database or model errors gracefully
            return response()->json(['status' => 'error', 'message' => 'Something went wrong!!', 'exception_message' => $e]);
        }
    }
}
```

## Best Practices and Laravel Philosophy

This approach aligns perfectly with the principles of Object-Oriented Programming (OOP) and Laravel’s philosophy. By passing an **instance** of a Model, you leverage Eloquent's built-in methods directly. This is far more flexible than trying to implement complex reflection logic within a static helper method.

For larger applications, consider moving this logic out of a simple `Controller` inheritance structure and into dedicated **Service Classes**. Service classes are excellent for encapsulating business logic—like deletion operations—making your codebase cleaner and easier to test. This pattern is highly encouraged when building robust applications using Laravel.

## Conclusion

To successfully pass a Laravel Model into a function, you must provide an actual **instance** of that model, not just its class name (string). By fetching the necessary data in your controller and passing the resulting Eloquent object to your helper methods, you resolve type errors and establish a clear separation of concerns. This pattern ensures your code is robust, readable, and fully leverages the power of the Eloquent ORM.
