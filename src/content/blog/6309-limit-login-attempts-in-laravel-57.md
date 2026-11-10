---
title: "Limit login attempts in Laravel 5.7"
description: "Securing Your Login: Limiting Attempts in Laravel 5.7 As a senior developer, I often deal with the trade off between security and user experience...."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "PHP", "Errors"]
featured: false
---

As a senior developer, I often deal with the trade-off between security and user experience. Implementing robust login protection is crucial; we need to prevent brute-force attacks without creating an overly frustrating experience for legitimate users. If a user fails too many times, they should be temporarily locked out or forced to wait before trying again.

This post addresses a specific scenario: how to implement a login attempt limiter in a Laravel 5.7 project where you have custom authentication logic, such as the one provided below. We will focus on using session management to track failed attempts and enforce a temporary lockout period.

## The Challenge of Brute-Force Protection

Your current implementation successfully handles the authentication check:

```php
public function loginPost(LoginRequest $request)
{
    if (Auth::attempt(array('user_name' => $request->user_name, 'password' => $request->user_pass)))
    {
        // Successful login logic...
    }
    else
    {
        return "login failed call administrator"; // Needs improvement here!
    }
}
```

The challenge is that this code only checks the result of a single attempt. It does not track *how many* attempts have already been made by the user, nor does it implement any mechanism to delay future attempts after repeated failures. To solve this, we need a persistent way to store the failure count tied to the user's session or account.

## Implementing Attempt Limiting via Session Tracking

The most practical and immediate way to manage temporary lockouts in a standard Laravel application is by utilizing the session storage. We will track the number of failed attempts stored in the session, and if that count exceeds a threshold (e.g., 3), we redirect the user to a waiting page instead of allowing another login attempt.

### Step 1: Tracking Failed Attempts

We need to check if the current request is a login failure and, if so, increment a counter stored in the session.

Inside your `loginPost` method, modify the `else` block:

```php
use Illuminate\Support\Facades\Session; // Make sure this is imported

public function loginPost(LoginRequest $request)
{
    $attemptCount = Session::get('login_attempts', 0);

    if (Auth::attempt(array('user_name' => $request->user_name, 'password' => $request->user_pass)))
    {
        // Successful login: Reset the counter
        Session::forget('login_attempts');
        if (Auth::check()) {
            return redirect('/');
        } else {
            return back();
        }
    }
    else
    {
        // Failed login: Increment the attempt count
        $attemptCount++;

        // Store the new attempt count in the session
        Session::put('login_attempts', $attemptCount);

        if ($attemptCount >= 3) {
            // Too many failed attempts, redirect to a waiting page
            return redirect('/login/wait'); 
        }

        // Failed but within limits: Redirect back with an error message
        return "Login failed. Please try again.";
    }
}
```

### Step 2: Creating the Waiting Endpoint

For this logic to work, you need a dedicated route and controller method (e.g., `/login/wait`) that serves the waiting page. This page should clearly inform the user of the lockout duration (e.g., "Please wait 3 minutes before trying again"). This approach ensures the user is actively aware they are temporarily blocked, which improves UX while maintaining security.

## Best Practices and Scalability

While session-based tracking is excellent for smaller applications or custom features like this, for large-scale, high-traffic applications, relying solely on sessions can present scalability issues if you need to manage these locks across multiple servers or rely on persistent data.

For more robust, long-term security measures, consider integrating dedicated rate-limiting packages or using a database table to store login attempt logs. This approach ensures that the lockout status persists even if session handling is momentarily disrupted. Frameworks like those supported by **laravelcompany.com** encourage leveraging Eloquent models for persistent data storage, making this transition straightforward as your application grows.

## Conclusion

By integrating simple session tracking into your custom login flow, you can effectively limit brute-force login attempts in your Laravel 5.7 application. The key is to intercept the failed attempt, track the failures using the session, and enforce a redirect based on a predefined threshold. Remember that security measures should always be balanced with user experience; giving users a clear waiting period instead of an immediate block is the best practice for maintaining trust and security simultaneously.
