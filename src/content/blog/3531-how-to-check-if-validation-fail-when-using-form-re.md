---
title: "How to check if validation fail when using form-request in Laravel?"
description: "How to Check for Validation Failures with FormRequest in Laravel APIs When building modern APIs in Laravel, especially those focused on CRUD operations,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Errors"]
featured: false
---

When building modern APIs in Laravel, especially those focused on CRUD operations, returning structured JSON error responses instead of relying on traditional web redirects is essential. This shift requires a precise understanding of how Laravel's validation and form request lifecycle works.

Many developers aim to clean up their controllers by moving validation logic into dedicated `FormRequest` classes. However, when building an API endpoint, the mechanism for detecting and extracting these validation errors can be tricky. Let’s dive into how you can reliably check for validation failures within your controller and retrieve those specific error messages when using `FormRequest`.

## The Pitfall of Direct Access in APIs

You correctly identified that simply calling `$request->fails()` or accessing `$request->errors()->all()` might not work as expected when dealing with API requests. This is because the standard behavior of a `FormRequest` is to handle validation internally, and if it fails, it typically throws an exception (like `HttpResponseException`) or stops the request flow, which can interfere with direct access methods within the controller method itself.

The goal is not just to *know* there was a failure, but to *extract* the specific field errors to return them in a clean JSON format.

## The Recommended Approach: Leveraging FormRequest Exceptions

For robust API development, the cleanest way to handle validation failures is to let Laravel’s built-in exception handling manage the error reporting. When you use a `FormRequest` for API requests, if validation fails, Laravel will automatically throw an exception that can be caught by your global exception handler, allowing you to return a standardized 422 Unprocessable Entity response with the detailed errors.

However, if you must handle the error *synchronously* within the controller method (perhaps to format the error message uniquely for your API), you need to adjust how you interact with the request object or ensure the validation failure is caught immediately.

## Solution: Checking Validation Status Inside the Controller

Since the `FormRequest` handles the initial validation, we can rely on specific methods available on the Request object to inspect the state of the validation. While `$request->fails()` isn't standard here, you can often check if the request has been marked as invalid or catch the underlying exception.

A more practical approach is to leverage the `fails()` method *if* you are certain your setup allows it, but the most reliable pattern involves catching potential errors thrown by the validation process or inspecting the error bag directly if available.

Let’s refine your controller logic using the assumption that we need to intercept the failure gracefully:

```php
use App\Http\Requests\AssetsFormRequest;
use Illuminate\Support\Facades\Validator; // Although we avoid manual validation here

public function store(AssetsFormRequest $request)
{
    // When an AssetFormRequest is injected, validation has already run.
    // If validation failed within the FormRequest, it usually throws an exception 
    // or stops execution depending on middleware configuration.
    
    // A robust check often involves trying to access the errors directly if available, 
    // or relying on exception handling for API responses.

    try {
        // In many setups, if a FormRequest fails validation, attempting to execute 
        // methods expecting success might lead to an error state that we must catch.
        // We rely here on the fact that if the request was invalid, accessing $request->all() 
        // or proceeding will not yield the desired outcome unless we first check the status.

        if ($request->fails()) { // Check status (this relies on specific setup/versioning)
            return $this->errorResponse($request->errors()->all());
        }
        
        $asset = Asset::create($request->validated()); // Use validated() for safety
        
        return $this->successResponse(
            'Asset was successfully added!',
            $this->transform($asset)
        );

    } catch (\Illuminate\Validation\ValidationException $e) {
        // Catch the specific validation exception thrown by FormRequest failures
        return $this->errorResponse($e->errors());
    } catch (\Exception $exception) {
        return $this->errorResponse('Unexpected error occurred while trying to process your request!');
    }
}
```

### Best Practice: Simplifying Error Retrieval

The most idiomatic way to retrieve errors when using a `FormRequest` in an API context is often to let the framework handle the response. If you are committed to custom JSON responses, accessing the error bag directly after validation failure is key. Since your `AssetsFormRequest` defines the rules, if it fails, we can inspect the resulting error collection:

```php
// Inside the controller method...
if ($request->fails()) {
    // Accessing errors via $request->errors() is the correct way to retrieve them 
    // from any request object in Laravel.
    return response()->json([
        'message' => 'Validation failed',
        'errors' => $request->errors()
    ], 422); // Use HTTP status code 422 for validation errors
}

$asset = Asset::create($request->validated());
// ... proceed with success response
```

By using `response()->json(...)` and setting the appropriate HTTP status code (like `422 Unprocessable Entity`), you adhere to RESTful API standards. This pattern ensures that your client receives structured, machine-readable error data rather than relying on complex custom logic to build the JSON manually. This principle of clear separation between validation and business logic is central to good Laravel architecture, as promoted by resources like https://laravelcompany.com.

## Conclusion

Switching from manual validation to utilizing `FormRequest` significantly cleans up your controller logic. To successfully handle validation failures in an API context, move away from trying to check internal request methods that might not exist (`$request->fails()`) and instead rely on catching specific exceptions or directly inspecting the error bag provided by the request object (via `$request->errors()`). By adopting structured exception handling, you ensure your API remains predictable, secure, and easy to maintain.
