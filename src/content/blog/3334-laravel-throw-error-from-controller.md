---
title: "Laravel: Throw error from controller"
description: "Laravel: How to Throw a 404 Error When a Model is Not Found in Your Controller As developers working with Laravel, one of the most common issues we encounter..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "PHP", "Errors"]
featured: false
---

As developers working with Laravel, one of the most common issues we encounter is handling "Not Found" scenarios gracefully. The situation you described—attempting to access properties on a non-existent model, leading to errors like `get property of non-object`—is a classic symptom of not properly validating resource existence before attempting to retrieve data.

When building robust APIs or web applications with Laravel, the goal is always to ensure that if a requested resource does not exist in the database, the system responds with the correct HTTP status code, which for missing resources is **404 Not Found**.

This guide will walk you through the most idiomatic and efficient ways to achieve this in your Laravel controller, moving from manual checks to leveraging Eloquent’s built-in mechanisms.

---

## The Problem with Manual Checks

Your initial approach involves manually checking if a model exists:

```php
public function showPartner($id = 0){
    if ($id > 0) {
        $partner = Partner::find($id);

        if (empty($partner)) {
            return // What should be returned here?
        }
    }
}
```

While this logic is technically sound, it forces you to write boilerplate code for every single resource lookup. If you forget a check or mismanage the return value, you risk introducing bugs. Furthermore, if you are dealing with complex relationships, manually checking existence becomes cumbersome and error-prone. We want Laravel to handle these checks for us.

## Solution 1: The Eloquent Way – Using `findOrFail()` (Recommended)

The most elegant and recommended way to handle missing models in Laravel is by using the `findOrFail()` method provided by the Eloquent ORM. This method attempts to find a record. If it succeeds, it returns the model. If it fails to find any record, **it automatically throws a `ModelNotFoundException`**, which Laravel’s exception handler catches and translates into an HTTP 404 response for you.

This approach is cleaner, more concise, and fully leverages Laravel's built-in error handling mechanisms. This is a fundamental best practice when dealing with routes that expect a specific resource to exist. As we explore deeper aspects of Eloquent and database interactions on the [Laravel Company website](https://laravelcompany.com), this principle remains central to efficient development.

Here is how you apply it to your controller method:

```php
use App\Models\Partner;
use Illuminate\Http\Request;

class PartnerController extends Controller
{
    public function showPartner($id)
    {
        // If the Partner with this ID does not exist, 
        // Laravel automatically throws a 404 error.
        $partner = Partner::findOrFail($id);

        // If the code reaches here, the partner object definitely exists.
        return response()->json($partner); 
    }
}
```

**Why this is superior:** Instead of writing `if (empty(...)) { abort(404); }`, you delegate the responsibility of finding and error reporting to Eloquent. This keeps your controller focused on business logic rather than boilerplate validation.

## Solution 2: Manual Abort for Specific Scenarios

If, for some very specific reasons (e.g., you need custom error messages or want to handle the response entirely within the controller without relying solely on Eloquent's exception handling), you prefer manual control, you can use the `abort()` helper function. This method directly stops execution and sends an HTTP response with the specified status code.

```php
public function showPartner($id)
{
    $partner = Partner::find($id);

    if ($partner === null) {
        // Manually aborts the request and returns a 404 response.
        abort(404, 'Partner not found.');
    }

    return response()->json($partner);
}
```

While this works perfectly, it is generally considered less idiomatic than using `findOrFail()`. For standard resource retrieval scenarios, sticking to Eloquent’s exception-throwing capabilities provides a more cohesive and maintainable codebase.

## Conclusion

When developing with Laravel, prioritize leveraging the framework's built-in features over reinventing the wheel. For handling missing resources, always default to using **`findOrFail()`**. It ensures that your application remains robust, readable, and adheres to Laravel's conventions, resulting in cleaner code that is easier to maintain as your project scales. Always aim for solutions that let Eloquent handle the heavy lifting!
