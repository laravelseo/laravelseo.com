---
title: "Laravel 5.4 - How to use multiple error messages for the same custom validation rule"
description: "Laravel 5.4: Handling Multiple Error Messages for Custom Validation Rules As developers building complex applications with Laravel, one of the most common..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As developers building complex applications with Laravel, one of the most common pain points arises when creating custom validation rules that involve multiple conditional checks. You want your validation to be robust—checking for email existence *and* email validity—but you also need the feedback to be granular. You want specific error messages like "Email not found" or "Invalid email format," rather than a generic failure message.

This post dives into how to achieve this fine-grained control when implementing custom validation logic in Laravel, moving beyond simple boolean returns to deliver context-aware error messages.

## The Challenge with Standard Validation Rules

When you create a custom rule using `Validator::extend()`, the closure passed to it is primarily designed to return a single boolean value: `true` (valid) or `false` (invalid). While you can manually throw exceptions within this closure, Laravel's default error reporting mechanism often struggles to map these internal states directly into specific, contextual messages for the user.

Your initial attempt highlights this limitation:

```php
// Inside your custom rule closure...
if (! $user) {
    $attribute->error_message = 'email not found'; // This doesn't always surface correctly as a standard validation error
    return false;
}
// ... and so on.
```

The core issue is that the validator framework expects a clear pass/fail signal, making it difficult to inject multiple, distinct failure reasons simultaneously without resorting to creating separate, redundant rules (which defeats the purpose of DRY principles).

## The Solution: Structuring Logic for Contextual Errors

To achieve the behavior you desire—similar to built-in rules like `between` or `size` which handle multiple conditions—we need to restructure our custom rule to explicitly manage and report *all* potential failure states. Instead of just returning `false`, we will leverage Laravel’s error reporting mechanisms to set specific messages based on the condition that failed.

The key is to perform all necessary checks inside your rule and, if any check fails, use the `$validator->errors()->add()` method to explicitly register each failure reason. This ensures that the resulting errors are correctly attached to the field in the model.

### Implementing Multi-Error Messaging in a Custom Rule

Let's refactor your custom rule to handle both conditions and report separate messages:

```php
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Validator;
use App\Models\User; // Assuming you have a User model

class ValidatorServiceProvider extends ServiceProvider
{
    public function boot()
    {
        Validator::extend('checkEmailPresenceAndValidity', function ($attribute, $value, $parameters, $validator) {
            $user = User::where('email', $value)->first();
            
            // 1. Check for existence
            if (! $user) {
                $validator->errors()->add($attribute, 'Email not found.');
                return false; // Stop further checks if the record doesn't exist
            }
            
            // 2. Check for validity (assuming valid_email is a computed attribute)
            if (! $user->valid_email) {
                $validator->errors()->add($attribute, 'The email provided is invalid.');
                return false; // Stop further checks if the email format is wrong
            }
            
            // If all checks pass
            return true;
        });
    }

    public function register()
    {
        //
    }
}
```

### How This Works: Granular Control

By utilizing `$validator->errors()->add($attribute, $message)`, we are directly instructing the validator instance to record a specific error message against the attribute. This allows us to provide distinct feedback for each failed prerequisite.

If the user submits an email that doesn't exist, the rule immediately adds: `"Email not found."` If they submit an existing-looking email that fails your custom `valid_email` check, it adds: `"The email provided is invalid."` This successfully mimics the behavior of rules like `between` or `size`, providing highly contextual and actionable feedback to the end-user.

## Conclusion

Creating reusable validation logic in Laravel often requires moving beyond simple boolean checks. By understanding how to interact with the `$validator` instance—specifically by using `$validator->errors()->add()` within your custom rule closures—you can transform a single, monolithic validation check into a sophisticated system capable of providing multiple, context-specific error messages. This approach ensures your application remains clean, adheres to DRY principles, and delivers an excellent user experience, aligning perfectly with the best practices promoted by the Laravel team at https://laravelcompany.com.
