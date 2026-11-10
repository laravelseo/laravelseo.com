---
title: "Laravel - Login with username, email or phone"
description: "Title: Extending Laravel Login with Multiple Authentication Methods Body: As a developer, you might have encountered different login scenarios where your..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Title: Extending Laravel Login with Multiple Authentication Methods

Body:

As a developer, you might have encountered different login scenarios where your users want to authenticate using various methods such as username, email, or phone number alongside the traditional password. The Laravel framework provides an excellent starting point for implementing this functionality, which we will cover in this post. We'll also discuss issues you may encounter and how they can be resolved.

Firstly, let us start with authentication controllers called `LoginController` and `RegisterController`. These controllers handle the Login and Registration processes, respectively. In your existing code, you might have extended the AuthenticatesUsers trait for both these controllers. This ensures that your login process works fine with either username or email, as it is already implemented in the framework by default.

Now, if you wish to add support for logging in with a phone number too, you can start by adding the field for storing the user's phone number to your database table and modifying your registration form accordingly. Then, modify the `RegisterController` to validate and create the new user account upon registration:

```php
// App/Http/Controllers/Auth/RegisterController.php

protected function validator(array $data)
{
    // Adding phone validation
    return Validator::make($data, [
        'name' => 'required|string|max:255',
        'username' => 'required|string|max:20|unique:users',
        'phone' => 'required|string|max:20|unique:users',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:6|confirmed',
        'gender' => 'required|bool',
    ]);
}

protected function create(array $data)
{
    if ($data['gender']) {
        // Logic for gender avatar
    } else {
        // Logic for gender avatar
    }
    return User::create([
        'name' => $data['name'],
        'gender' => $data['gender'],
        'username' => $data['username'],
        'phone' => $data['phone'],
        'email' => $data['email'],
        'password' => bcrypt($data['password']),
        'slug' => str_slug($data['username']),
        'avatar' => $avatar,
    ]);
}
```

Next, you need to modify your `LoginController` to handle the phone logins:

```php
// App/Http/Controllers/Auth/LoginController.php

/**
 * Get the needed authorization credentials from the request.
 *
 * @param  \Illuminate\Http\Request  $request
 * @return array
 */
protected function credentials(Request $request)
{
    if ($request->phone) { // If phone is provided, use it as an authentication method
        return [
            'phone' => $request->get('phone'),
            'password' => $request->get('password')
        ];
    } else if (is_numeric($request->get('email'))) { // If email is a number, likely a phone number
        return ['phone' => $request->get('email'), 'password' => $request->get('password')];
    } else if ($request->has('username')) { // Use username if provided
        return [
            'username' => $request->get('username'),
            'password' => $request->get('password')
        ];
    }
    return ['email' => $request->get('email'), 'password' => $request->get('password')]; // Default email and password authentication
}
```

This way, you can enable your users to log in with their preferred username, email or phone number. However, note that you might need to tweak the above code as per individual requirements and database structure. Also, ensure that you have included essential routes and views for login and registration processes.

Finally, if you face any issues while implementing this functionality, such as "These credentials do not match our records" errors, carefully check your controller methods, database fields or rules, and validation logic. Ensure consistent naming conventions across all involved components.

With these steps, you can achieve the desired login authentication for multiple user identifiers in Laravel. Make sure to test thoroughly after each change and optimize the code as needed. Remember that security is of utmost importance when handling user credentials.
