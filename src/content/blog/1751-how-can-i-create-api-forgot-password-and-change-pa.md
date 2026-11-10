---
title: "How can I create api forgot password and change password in laravel?"
description: "Title: How to Create an API for Forgot Password and Change Password Functionality Using Laravel and Passport Introduction In this comprehensive tutorial, we..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Title: How to Create an API for Forgot Password and Change Password Functionality Using Laravel and Passport

Introduction

In this comprehensive tutorial, we will learn how to create an application programming interface (API) to handle the forgotten password process and change password functionality using Laravel. We will also utilize Passport, a package that simplifies implementing API authentication in your applications. By following these steps, you can create secure API endpoints for managing user accounts.

Step 1: Install and Configure Laravel
Ensure you have the required dependencies installed on your machine. Create a new Laravel project using `composer create-project --prefer-dist laravel/laravel [ProjectName]`. Navigate to the directory containing your new project and run `php artisan serve` to start the development server.

Step 2: Set Up Passport
To enable authentication, install Passport by running `composer require laravel/passport`. Next, publish the required configurations using `php artisan vendor:publish --provider="Laravel\Passport\PassportServiceProvider"`. Modify the configuration file (config/auth.php) to allow API access and set the personal access client ID to be null.

Step 3: Create User Model and Migration
Create a user model to represent your users with relevant information. Make sure the password is stored as hashed data using Laravel's built-in hasher. Run the migration command `php artisan make:migration create_users_table` to generate a new migration file. Open this file and define the table structure, including columns for each attribute you wish to store.

Step 4: Create the Forgot Password API Endpoint
Create a new controller called 'AuthController' that handles the forgot password process. Include methods to handle different requests like `storeForgotPassword` for requesting a new password and `resetForgotPassword` for changing the password upon receiving a token in your email. Utilize Passport's built-in functionality to authenticate these requests:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Validator;
use App\Models\User;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Validation\ResetsPasswords;

class AuthController extends Controller
{
    use ResetsPasswords;
    /**
     * Handle the password reset request.
     *
     * @param Request $request
     */
    public function storeForgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => Rule::exists('users')->where(function ($query) {
                return $query->selectRaw("CONCAT(id, '_", "password_reset_token") as id_token");
            })->notRegex('b/^(.+)_(\d{4})(\d{4})(\d{4})(\d{4})$/', 'invalid_token')
                ->uniqueTo('users'),
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->messages()], 409);
        }

        // Generate a reset token and store it with the user account
        $user = User::findOrFail($request->input('id'));
        $token = Str::random(16);
        $user->password_reset_token = $token;
        $user->save();

        Mail::to($request->email)->send(new ForgotPasswordEmail($user, $token));
        return response()->json(['success' => 'We have emailed your password reset link.']);
    }
}
```

Step 5: Configure Email Notifications
Create a new "ForgotPasswordEmail" class that extends Laravel's default notification class and overrides the build method to send an email with the reset token, subject, and content as required by your system. This will allow you to send custom password reset emails to users who request it through these API endpoints.

Step 6: Create the Change Password Endpoint
Create a new controller called "UserController" to handle user requests, including password changes. Add methods that map to appropriate routes and authenticate using Passport's built-in functionality:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function changePassword(Request $request)
    {
        Auth::loginUsingId($request->user()->id);
        $validator = Validator::make($request->all(), [
            'password' => Rule::exists('password_resets', 'token')->where(function ($query) use ($request) {
                return $query->selectRaw("COUNT(*)")->whereColumn('users.id', 'password_resets.user_id')
                    ->andWhereColumn('password_resets.email', '=', $request->email);
            })->notRegex('b/^(.+)_(\d{4})(\d{4})(\d{4})(\d{4})$/', 'invalid_token'),
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->messages()], 409);
        }

        $user = Auth::user();
        $hashedPassword = Hash::make($request->input('new_password'));
        $user->update([
            'email' => $request->input('email'),
            'password' => $hashedPassword,
        ]);

        return response()->json(['success' => 'Your password has been changed successfully.']);
    }
}
```

Conclusion
By following the steps outlined in this blog post, you can effectively create an API for handling forgotten password and change password functionality using Laravel with Passport authentication. It is essential to continuously practice security measures like user account verification and implementation of rate limiting to maintain the integrity of your system while providing a seamless experience for users.
