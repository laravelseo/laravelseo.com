---
title: "Laravel 5 How to check password reset token if it has expired or not"
description: "Laravel 5: How to Check Password Reset Token Expiration Reliably Developing secure authentication flows is paramount in any web application. When..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP", "Errors"]
featured: false
---

Developing secure authentication flows is paramount in any web application. When implementing features like password resets, ensuring that tokens are valid and have not expired is not just a convenience—it is a critical security measure. As a developer using frameworks like Laravel 5, we often encounter scenarios where the framework's default settings need careful manual reinforcement to achieve true robustness.

This post dives deep into your specific challenge: manually checking if a password reset token has expired within your Laravel application, moving beyond simple time-based expiration settings to ensure maximum security.

## The Challenge with Default Expiration

You are correct in observing that while Laravel’s configuration (like the `auth` settings) defines an expiration window, it doesn't always handle the automatic cleanup of expired records immediately upon a request. For critical operations like password resets, relying solely on time-based expiry is insufficient if you need immediate validation and error handling when a user attempts to use an old link.

The goal is to ensure that every time a token is presented, we perform an explicit database check against the record's status. This approach puts full control back into your application logic, which is essential for security-sensitive features.

## Implementing a Robust Token Validation Check

Instead of relying on raw SQL queries directly in your view layer (as you started with), the best practice in Laravel is to encapsulate this logic within your Eloquent Model. This keeps your business logic clean, reusable, and adheres to the principles of object-oriented programming that underpin great frameworks like Laravel.

Let's assume you have a `PasswordReset` model corresponding to your `password_resets` table.

### 1. Setting up the Model Relationship

Ensure your model correctly maps to the database table:

```php
// app/Models/PasswordReset.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PasswordReset extends Model
{
    protected $table = 'password_resets';
    // Ensure timestamps are managed if you use them for expiry
    public $timestamps = true; 
}
```

### 2. Creating the Validation Method

We will add a method directly to the model to handle the validation logic. This makes checking token validity centralized and easy to call from your controllers.

```php
// app/Models/PasswordReset.php (continued)

use Illuminate\Support\Facades\DB; // We can still use DB facade if needed, but Eloquent is preferred.

class PasswordReset extends Model
{
    // ... existing code ...

    /**
     * Check if the password reset token is valid and not expired.
     *
     * @param string $token The token to validate.
     * @return bool True if the token exists and has not expired.
     */
    public function isValidToken(string $token): bool
    {
        // Use Eloquent's find method for efficient retrieval
        $reset = $this->where('token', $token)->first();

        if (!$reset) {
            return false; // Token does not exist
        }

        // Check the expiration timestamp. Assuming you store 'expires_at' in the DB.
        // Use the carbon/datetime functions if dealing with timezone complexities, 
        // but standard PHP comparison works fine for basic checks.
        if ($reset->expires_at && $reset->expires_at->isPast()) {
            // Optional: Mark the token as invalid or soft-delete it here for cleanup
            $this->delete(); 
            return false; // Token has expired
        }

        return true; // Token is valid
    }
}
```

### 3. Using the Validation in the Controller

Now, when a user clicks the reset link and hits your controller method, you can use this clean method to validate the token before proceeding with the password update.

```php
// app/Http/Controllers/Auth/ResetController.php

use App\Models\PasswordReset;
use Illuminate\Http\Request;

class ResetController extends Controller
{
    public function sendResetLink(Request $request)
    {
        // ... logic to generate and store token ...
    }

    public function resetPassword(Request $request, $token)
    {
        $passwordReset = PasswordReset::where('token', $token)->first();

        if (!$passwordReset) {
            return redirect()->back()->with('error', 'Invalid token.');
        }
        
        // *** The crucial check ***
        if (!$passwordReset->isValidToken($token)) {
            return redirect()->back()->with('error', 'This password reset link has expired or is invalid.');
        }

        // If validation passes, proceed with the actual reset logic...
        // ...
    }
}
```

## Conclusion: The Power of Eloquent Abstraction

By moving the complex database interaction into an Eloquent method like `isValidToken()`, you achieve several benefits. First, your code is cleaner and more readable. Second, you are leveraging Laravel’s ORM capabilities, which helps maintain consistency across your application. This focus on clean, object-oriented design is exactly what separates functional applications from robust, scalable systems, aligning perfectly with the philosophy behind building applications on platforms like https://laravelcompany.com. Always prioritize clear data flow and validation when dealing with user security.
