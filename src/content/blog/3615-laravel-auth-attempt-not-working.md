---
title: "Laravel Auth attempt not working"
description: "Troubleshooting Laravel Auth Failures with Custom Eloquent Models Setting up custom authentication systems in Laravel by replacing default models like User..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Setting up custom authentication systems in Laravel by replacing default models like `User` with custom ones (e.g., `Admin`) is a common architectural choice for complex applications. However, when you introduce this customization, subtle errors in the setup—especially concerning password hashing and model configuration—can lead to frustrating authentication failures.

This post will dissect the steps you outlined, diagnose why your `Auth::attempt()` call is likely failing, and provide the robust solutions necessary for implementing custom Eloquent-based authentication successfully. This approach aligns perfectly with the principles of clean, scalable architecture promoted by frameworks like [Laravel](https://laravelcompany.com).

## Analyzing the Custom Authentication Setup

You have correctly implemented the structural steps: creating a model (`Admin`), a migration, updating the authentication provider in `config/auth.php`, and setting up routes. The failure point almost always lies in how Laravel attempts to verify the provided credentials against the stored data.

Let’s review the critical components you provided:

### 1. The Model and Migration
Your model correctly implements `Authenticatable`, and your migration defines the necessary fields (`email`, `password`). This part is structurally sound.

```php
// Admin.php
class Admin extends Model implements \Illuminate\Contracts\Auth\Authenticatable
{
    use Authenticatable;
}
```

### 2. The Seeder Issue (The Root Cause)
The most significant error in your provided setup, which directly causes `Auth::attempt()` to fail, is how you are seeding the password:

```php
// AdminTableSeeder.php (Problematic Code)
$admin->email='test@123.com';
$admin->password='test@123.com'; // <<< WARNING: Storing plain text passwords!
$admin->save();
```

**The Problem:** When Laravel attempts to log a user in using `Auth::attempt()`, it internally hashes the provided password and compares it to the hashed value stored in the database. If you save the plaintext password directly, the hashing mechanism fails because it cannot match the plain text input with the expected hash format.

### 3. The Login Attempt Logic
Your controller logic uses `Auth::attempt()`:

```php
// AdminController.php
dd(Auth::attempt(['email' => $request['email'], 'password' => $request['password']]));
```

This function relies entirely on the password being correctly hashed in the database for a successful match. If the data isn't hashed, this attempt will always return `false`.

## The Solution: Implementing Proper Password Hashing

To fix this issue and ensure secure authentication, you must use Laravel’s built-in hashing capabilities before saving any password to the database. This is a fundamental best practice in modern application development, ensuring that even if the database is compromised, the passwords remain protected.

### Step 1: Hash Passwords During Seeding
Never store plaintext passwords. Use the `Hash` facade to generate a secure hash for every password entry.

Modify your seeder to use `Hash::make()`:

```php
use Illuminate\Support\Facades\Hash;

class AdminTableSeeder extends Seeder
{
    public function run()
    {
        $admin = new \App\Admin;
        // Correctly hash the password before saving
        $admin->email = 'test@123.com';
        $admin->password = Hash::make('test'); // Use Hash::make()
        $admin->save();
    }
}
```

### Step 2: Handling Login Input (Best Practice)
When handling user input in your login form (`login.blade.php`), ensure you are using proper POST redirects and session management, which you have done correctly by including the CSRF token.

For production systems, always rely on Laravel's built-in authentication scaffolding or robust package solutions when setting up custom models. For instance, understanding how Eloquent models interact with the `Authenticatable` trait is key to mastering data persistence in Laravel.

## Conclusion

The failure of your authentication attempt was not due to a flaw in the routing or controller logic, but rather an oversight in the fundamental security practice of password handling—specifically, failing to hash the password before persisting it to the database. By consistently applying hashing functions like `Hash::make()` when dealing with sensitive data, you ensure that Laravel’s authentication system can perform its comparisons correctly.

By adhering to these principles, you establish a secure and functional custom authentication layer, paving the way for more complex and robust features in your application, as is the goal of building sophisticated systems on the [Laravel](https://laravelcompany.com) foundation.
