---
title: "How to compare two encrypted(bcrypt) password in laravel"
description: "How to Securely Compare Two Bcrypt Passwords in Laravel As a senior developer, one of the most fundamental concepts we deal with when handling user..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

As a senior developer, one of the most fundamental concepts we deal with when handling user credentials is password management. Storing passwords in plaintext is an absolute security disaster. The industry standard solution is to use strong, one-way hashing algorithms like bcrypt. However, simply storing two hashes does not automatically mean they are equal. To compare them securely, you must rely on the specific functions provided by your framework, ensuring that the comparison process is handled safely and correctly.

This post will dive into how to correctly compare two bcrypt hashes within a Laravel application, focusing on security best practices using the built-in `Hash` facade.

## The Security Pitfall: Why Direct Comparison Fails

When you store a password using bcrypt (or any strong hashing algorithm), the resulting string—the hash—is not mathematically reversible. This is intentional and crucial for security. If you attempt to use standard string comparison operators like `==` on two stored hashes, they will almost certainly evaluate to `false`, even if they represent the same original password.

This is because bcrypt includes a unique **salt** within the hash itself. The salt ensures that even if two users choose the exact same password (e.g., 'password123'), their resulting hashes will be completely different, making direct comparison impossible without re-hashing the input against the stored hash.

The goal isn't to compare `$hash1 == $hash2`; the goal is to verify if a *submitted* plain-text password matches a *stored* hash securely.

## The Laravel Solution: Using `Hash::check()`

Laravel provides the necessary tools within the `Illuminate\Support\Facades\Hash` class to handle this comparison safely. The primary method for verifying a submitted password against a stored hash is `Hash::check()`. This function takes the plain-text input and the stored hash, performs the hashing operation internally on the input using the salt embedded in the stored hash, and then compares the result securely.

Let’s look at how this works with your provided examples:

```php
$pass1 = '$2y$10$ooPG9s1lcwUGYv1nqeyNcO0ccYJf8hlhm5dJXy7xoamvgiczXHB7S';
$pass2 = '$2y$10$QRgaiS6bpATKKQeT22zGKuHq.edDfXQc2.4B3v.zaN.GtGwoyQuMy';

// Attempting to check if the plain text 'test' matches hash1
$isMatch1 = Hash::check('test', $pass1); 

// Attempting to check if the plain text 'test' matches hash2
$isMatch2 = Hash::check('test', $pass2);

var_dump($isMatch1, $isMatch2); // Output: bool(true), bool(true) if both hashes were generated from 'test'
```

As demonstrated above, `Hash::check('password', $storedHash)` returns `true` only if the plain-text password provided matches the hash stored in `$storedHash`. This method is robust because it avoids ever needing to decrypt or reverse the hash; it simply re-hashes the input and compares the resulting hashes.

## Practical Application: Authentication Flow

In a real-world Laravel application, this comparison happens during login or password updates. When a user attempts to log in, you retrieve the stored hash from the database (e.g., using Eloquent) and compare the submitted password against it.

Here is a simplified conceptual example of how this fits into a typical authentication flow:

```php
use Illuminate\Support\Facades\Hash;
use App\Models\User;

// 1. Find the user from the database
$user = User::find(1);

if ($user) {
    // 2. Use Hash::check() to verify the submitted password against the stored hash
    if (Hash::check($request->password, $user->password)) {
        // Password is correct! Log the user in.
        return true;
    } else {
        // Password failed verification.
        return false;
    }
}
```

This approach keeps your application secure and follows the principles outlined by the Laravel team regarding data security and authentication practices. For more advanced password management, always leverage Laravel’s features for token handling and encryption whenever possible, as seen in robust implementations on the [laravelcompany.com](https://laravelcompany.com).

##
