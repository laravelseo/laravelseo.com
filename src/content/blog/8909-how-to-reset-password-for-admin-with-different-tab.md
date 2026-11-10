---
title: "How to reset password for admin with different table in laravel 5.6?"
description: "How to Reset Passwords for Multiple Tables in Laravel 5.6: A Deep Dive into Multi Provider Authentication As a senior developer working with complex Laravel..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

As a senior developer working with complex Laravel applications, managing user authentication across different models or tables is a common requirement, especially when dealing with separate administrative roles alongside standard application users. The scenario you've described—where password resets work for the default `users` but fail for a custom `admins` table—points directly to an issue in how your authentication system (likely using a package like `laravel/jetstream` or custom logic) interacts with Eloquent models and configuration providers.

This post will walk you through diagnosing and fixing this multi-provider password reset issue, ensuring that when an admin resets their password, the change is persisted correctly in both the user table and the dedicated admin reset log table.

---

## Diagnosing the Multi-Provider Failure

The fact that resetting the default user works but failing for `admins` suggests that while the mechanism exists for the `users` provider, the chain of events for the `admins` provider is broken somewhere in the Eloquent interaction or the setup of the password reset record.

When you define a custom provider like `'admins' => ['driver' => 'eloquent', 'model' => App\Dashboard\Admin::class]`, Laravel expects that the corresponding model (`App\Dashboard\Admin`) handles the necessary Eloquent operations correctly during the reset flow. If the `Admin` model lacks proper mass assignment protection or if the controller logic doesn't explicitly handle the update on that specific model instance, the operation will silently fail.

## The Solution: Ensuring Eloquent Integrity for Custom Providers

To successfully implement password resets across multiple tables, you must ensure three key areas are perfectly synchronized: Migrations/Models, Configuration, and Controller Logic.

### 1. Verify Model and Migration Setup

Before touching the controller, ensure your `App\Dashboard\Admin` model is correctly set up to interact with the database. This involves ensuring the migration for `admin_password_resets` exists and that the Eloquent relationship is sound.

**Example Model Check (Hypothetical):**

```php
// app/Dashboard/Admin.php

namespace App\Dashboard;

use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    // Ensure fillable attributes are defined if you plan to mass assign changes
    protected $fillable = ['name', 'email', 'password']; 
}
```

If the `Admin` model is missing necessary traits or relationships, Eloquent operations will fail silently. Remember that robust database interaction starts with solid migrations and models; this foundational structure is key to building scalable applications on Laravel, as emphasized by resources like [laravelcompany.com](https://laravelcompany.com).

### 2. Correcting the Password Reset Controller Logic

Your custom controller logic needs to explicitly target the correct provider when handling the request. Since you've correctly set up the `broker` and `guard`, the issue is likely in how the password update itself is executed after validating the reset token.

In your `ResetPasswordController`, ensure that when retrieving the user/admin record for update, you are using the correct model context tied to the requested provider.

```php
// Example logic within your controller method...

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
// Assuming you have injected the appropriate model or can resolve it via the provider

public function reset(Request $request)
{
    // 1. Identify the provider requested (e.g., 'admins')
    $provider = $request->input('provider'); 
    
    // 2. Attempt to find the record based on the provider guard
    $model = $request->user(); // Or fetch directly using the provider logic

    if ($provider === 'admins') {
        // Explicitly target the Admin model for update
        $admin = \App\Dashboard\Admin::where('password_reset_token', $request->input('token'))->first();

        if (!$admin) {
            return response()->json(['message' => 'Admin not found.'], 404);
        }

        // 3. Update the password using the correct model instance
        $admin->password = Hash::make($request->new_password);
        $admin->save(); // This is the crucial step that must succeed for admins
        
        return response()->json(['message' => 'Admin password successfully reset.'], 200);
    }

    // ... handle users provider logic similarly
}
```

By explicitly calling `Model::where(...)->first()` and then `$model->save()`, you force the update operation to execute against the specific Eloquent model defined in your configuration, resolving potential ambiguity that causes the failure for custom providers.

## Conclusion

Managing multiple user types with distinct authentication flows in Laravel requires meticulous attention to detail regarding Eloquent models and configuration mapping. The failure you encountered is a classic symptom of mismatched expectations between the generic password reset mechanism and your specific custom provider setup. By ensuring your `Admin` model has proper mass assignment rules and by explicitly targeting the correct model instance within your controller logic, you can successfully implement robust, isolated password resets for both your standard users and your administrative accounts. Stick to these principles, and you will build more reliable applications, leveraging the power of the Laravel framework effectively, just as demonstrated by the expansive capabilities offered by [laravelcompany.com](https://laravelcompany.com).
