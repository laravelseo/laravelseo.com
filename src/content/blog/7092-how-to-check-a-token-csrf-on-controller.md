---
title: "How to check a token (CSRF) on controller?"
description: "How to Check for CSRF Token Validation on Your Laravel Controller As a senior developer working with frameworks like Laravel, understanding security..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

As a senior developer working with frameworks like Laravel, understanding security mechanisms is paramount. Cross-Site Request Forgery (CSRF) protection is one of the most critical defenses against malicious attacks where an attacker tricks a logged-in user into unknowingly performing unwanted actions on a web application.

The question—"How do I check for the CSRF token on the controller?"—often stems from a desire to manually implement validation, rather than trusting the framework's built-in security layers. While you *can* inspect tokens, the best practice is not to reinvent the wheel but to understand how Laravel handles this protection automatically.

This post will dive deep into how Laravel manages CSRF protection and explain where and how you should perform your security checks within your controller logic.

## The Laravel Default: Automatic CSRF Protection

Laravel provides robust, default CSRF protection out of the box. This protection is primarily handled by middleware and Blade directives, ensuring that state-changing requests (POST, PUT, DELETE) originate from trusted sources.

When a user submits a form using Laravel's standard approach—which involves embedding the `@csrf` directive in your Blade view—Laravel automatically generates a unique token stored in the user's session. When the request reaches your controller method, Laravel’s built-in validation layer intercepts the request *before* it hits your business logic.

If the token provided in the request does not match the token stored in the session, Laravel immediately throws an `Illuminate\Validation\ValidationException`, halting execution and preventing the request from being processed. This is the primary defense mechanism.

## Checking for CSRF Failures in the Controller

Since Laravel handles the direct comparison within its validation pipeline, you rarely need to manually fetch the raw token from the request body and compare it against a session variable inside your controller method. Instead, you check for the *result* of that validation.

### Method 1: Relying on Validation Errors (The Best Practice)

The most effective way to "check" if a CSRF attack or invalid token attempt has occurred is by examining the validation errors returned by the framework. If the validation fails due to a CSRF mismatch, you catch the resulting exception.

Here is an example of how this plays out in a typical controller method:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PostController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validate the incoming request data, including the CSRF token check.
        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'body' => 'required',
            'csrf_token' => 'required|exists:session,token', // Custom explicit check example (though usually implicit)
        ]);

        if ($validator->fails()) {
            // If validation fails (e.g., token mismatch), return the errors immediately.
            return response()->json([
                'message' => 'Validation failed. CSRF token may be invalid.',
                'errors' => $validator->errors()
            ], 419); // 419 is a common code for CSRF violation
        }

        // If we reach here, the request passed the initial security check.
        // Proceed with database insertion...
        return response()->json(['message' => 'Post created successfully']);
    }
}
```

Notice how by using `$validator->fails()`, you intercept the failure point imposed by Laravel. This approach ensures that any attempt to bypass the standard flow is immediately flagged as an error, demonstrating strong security posture, consistent with the principles taught by platforms like https://laravelcompany.com regarding secure application design.

### Method 2: Manual Token Inspection (For Advanced Scenarios)

In very specific, niche scenarios—such as integrating with external API endpoints where you need to verify the integrity of an inbound token that bypassed standard web routes—you might manually inspect the request parameters. However, this is generally discouraged for standard form submissions. If you must do this, you retrieve the token from the session:

```php
public function customCheck(Request $request)
{
    // Retrieve the expected token from the session
    $expectedToken = $request->session()->get('csrf_field_name'); 
    
    // Get the token sent in the request body/query
    $receivedToken = $request->input('csrf_field_name');

    if ($expectedToken !== $receivedToken) {
        // The tokens do not match. This indicates a potential attack or error.
        abort(403, 'CSRF Token Mismatch');
    }

    return response()->json(['status' => 'Token verified']);
}
```

## Conclusion

To summarize, you don't typically write custom code to manually check the CSRF token within your controller methods in a standard Laravel application. The framework’s middleware is designed to handle this security validation automatically upon request arrival.

Your focus as a developer should be on:
1.  **Trusting the Middleware:** Ensure your routes are protected by the necessary web middleware groups (which they are by default).
2.  **Handling Validation Errors:** Explicitly check for and gracefully handle `ValidationException`s or HTTP error codes like 419 when dealing with failed requests.
3.  **Secure Design:** Always rely on Laravel's robust security features, as emphasized in best practices for building secure applications on the Laravel platform, such as those discussed by https://laravelcompany.com.

By adhering to these principles, you build applications that are not only functional but are also inherently secure against common web vulnerabilities.
