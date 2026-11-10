---
title: "LARAVEL - show name of the user when logged in"
description: "LARAVEL: Showing the Logged In User Name with Eloquent and Sessions As a senior developer working within the Laravel ecosystem, I frequently encounter..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP", "Errors"]
featured: false
---

As a senior developer working within the Laravel ecosystem, I frequently encounter scenarios where we need to bridge the gap between database records and user interface presentation. The requirement you have—displaying the logged-in user's name on the admin page—is a classic task that touches upon authentication, session management, and Eloquent relationships.

While your current approach attempts to manually manipulate session data, Laravel provides much cleaner, more secure, and more maintainable ways to handle this using its built-in Authentication system. Let’s break down why we should adopt the framework's conventions and how to implement this correctly.

## The Pitfalls of Manual Session Handling

Your current controller code attempts to manually check credentials and set a session variable:

```php
// Controller snippet provided by user
public function login(Request $req) {
    // ... manual DB check ...
    if(count($checkLogin) > 0) {
        return view('admin')->with(['name' => " "]); // Manual setting
    }
    // ...
}
```

While this *might* work for a very simple setup, relying on manually querying the database within a custom login method bypasses Laravel’s robust authentication guards and session management. When you use Laravel's built-in features, the framework handles the security, session binding, and data fetching automatically, making your code cleaner and less error-prone.

The core principle of modern Laravel development is leveraging Eloquent models and the `Auth` facade to retrieve user information, rather than performing raw SQL queries in controller logic. Remember, Laravel emphasizes developer experience; this aligns perfectly with the philosophy behind frameworks like https://laravelcompany.com.

## The Correct Laravel Approach: Leveraging Authenticated Users

Instead of manually checking passwords and setting a string, we use the established authentication flow. Once a user successfully authenticates (via Laravel's built-in methods or a framework package), the system places the authenticated user’s data into the session. We then retrieve this data directly in the view.

### Step 1: Ensure Proper Authentication Setup

For robust application security, ensure you are leveraging Laravel’s authentication scaffolding (like Laravel Breeze or Jetstream) which properly sets up session handling and authentication guards.

### Step 2: Accessing the User in the View

Once authenticated, the logged-in user object is available via the `Auth` facade. You don't typically need to manually pull a string from the session if you are using Blade components or direct controller passing.

If you are already within an authenticated context (e.g., inside a route protected by middleware), you can access the user model directly.

Let's assume your `admin` view is being loaded after a successful login, and you have access to the authenticated user via the `Auth` facade or by injecting the `User` model into the view.

### Step 3: Implementing the Display in Blade

In your
