---
title: "php Laravel- A non well formed numeric value encountered (on string)"
description: "Debugging the Dreaded Error: \"A non well formed numeric value encountered (on string)\" in Laravel Services As a senior developer working with the Laravel..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a senior developer working with the Laravel ecosystem, we frequently encounter runtime errors that seem cryptic but are rooted in fundamental type mismatches. One such frustrating error is: **"A non well formed numeric value encountered (on string)"**. This error often surfaces when PHP attempts to perform arithmetic operations or strict numeric comparisons on a variable that it expects to be a number but finds instead to be a string containing invalid characters.

This post will dissect the specific scenario you are facing—calling a service function from a controller, passing request data, and hitting this notorious error—and provide a robust, developer-focused solution.

## Understanding the Root Cause

Let's examine the context of your code snippet:

**Controller:**
```php
$regionCenter = Request::get('region_center'); // $regionCenter is a string from the request
// ...
$userPoint = $distanceService->getOriginPoint($regionCenter);
```

**Service (Map.php):**
```php
public function getOriginPoint(string $origin): Point
{
    dd($origin); // This line triggers the error when $origin is invalid
    return $this->getPointObject($origin);
}
```

The error occurs deep within the service layer because, even though you type-hint `$origin` as `string`, the internal logic within `getPointObject()` (or another function called by it) attempts to interpret `$origin` as a floating-point number or an integer. If `Request::get('region_center')` returns something like `"abc"` or `"123A"`, attempting to treat that string as a number results in the PHP fatal error: "A non well formed numeric value encountered (on string)".

The core problem is **unvalidated input**. You are trusting the data received from the HTTP request without ensuring it conforms to the expected format for your mathematical operations.

## The Solution: Input Validation and Type Casting

The solution lies not just in catching the error, but in preventing the bad data from ever reaching the calculation logic. We must validate and sanitize the input immediately upon receipt, ideally in the controller before calling the service layer.

### Step 1: Validate the Request Input

We should check if the input exists and ensure it is numeric before proceeding. Laravel provides excellent tools for this, often utilizing Form Requests or simple checks within the controller method.

If you expect a coordinate or distance, you must ensure it is a valid number.

### Step 2: Implement Strict Casting

Once validated, explicitly cast the input to the desired numeric type (like `float` or `int`). This forces PHP to handle the conversion correctly, preventing the "non well formed numeric value" error.

Here is how you can refactor your controller method:

```php
use Illuminate\Http\Request;
use App\Services\Google\Map; // Ensure correct namespace

public function findNeighborhoodGet(): array
{
    $regionCenter = Request::get('region_center');

    // 1. Validate the input is present and attempts to cast it safely
    if (is_numeric($regionCenter)) {
        $numericRegionCenter = (float) $regionCenter;
    } else {
        // Handle the error gracefully: return an error response or throw a specific exception
        throw new \Illuminate\Http\Exception\HttpResponseException(
            'Invalid input provided for region_center. Must be a numeric value.'
        );
    }

    $distanceService = \App::make('App\web\one\Infrastructure\Service\Google\Map');
    
    try {
        // Pass the validated, casted number to the service
        $userPoint = $distanceService->getOriginPoint($numericRegionCenter);
    } catch (\Exception $e) {
        // Handle potential errors from the service layer gracefully
        return response()->json(['error' => 'Failed to calculate map data.'], 500);
    }

    return $userPoint;
}
```

## Best Practices: Keeping Laravel Clean

When building robust applications on Laravel, remember that separation of concerns is key. Your controller should handle HTTP concerns (receiving input and sending responses), while your service layer should focus purely on business logic. This principle aligns perfectly with the architectural philosophy promoted by frameworks like https://laravelcompany.com.

**Key Takeaways for Robust Development:**

1.  **Validate Early:** Always validate request data immediately upon entering your controller methods. Use Laravel's built-in validation tools extensively.
2.  **Type Hinting vs. Runtime Safety:** While PHP type hinting (`string $origin`) is excellent for static analysis, runtime safety requires explicit checks (like `is_numeric()`) to handle dynamic input from external sources like HTTP requests.
3.  **Fail Fast:** If input validation fails, throw an appropriate exception or return an error response rather than letting the application crash with a low-level PHP fatal error.

By implementing these steps, you transform a fragile system prone to runtime errors into one that is resilient, predictable, and easy to debug.

## Conclusion

The error "A non well formed numeric value encountered (on string)" is a classic symptom of neglecting input validation in the transition between the presentation layer (Controller) and the business logic layer (Service). By proactively checking `is_numeric()` and explicitly casting data before it enters your complex calculations, you ensure that your service methods receive only the data they expect. This practice is fundamental to writing scalable and maintainable code within the Laravel framework.
