---
title: "How to make email login case insensitive with Laravel 5.5 authentication"
description: "How to Make Email Login Case Insensitive with Laravel 5.5 Authentication When you start building authentication systems in Laravel, using the scaffolding..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

When you start building authentication systems in Laravel, using the scaffolding tools like `php artisan make:auth` is a fantastic time-saver. However, as we dive deeper into application logic, we often encounter subtle issues related to data handling, and one common stumbling block is case sensitivity—especially when dealing with user-entered data like email addresses.

This post addresses a specific pain point: ensuring that users can log in regardless of the casing they use for their registered email address (e.g., `MyEmail@domain.com` vs. `myemail@domain.com`). While technically, many database systems default to case-sensitive comparisons, we need to adjust Laravel’s default behavior during the authentication attempt.

## The Case Sensitivity Dilemma in Authentication

The core issue stems from how Eloquent and underlying SQL databases handle string comparisons. As you correctly noted, theoretically, the portion of an email before the `@` symbol might be treated differently based on the database collation settings. If we rely solely on standard `WHERE` clauses in `Auth::attempt()`, we risk denying legitimate users access simply due to mismatched casing.

We are looking for a way to intercept the login credentials, normalize the email address to a consistent format (usually lowercase), and then use that normalized value for the database lookup. Directly modifying internal Laravel methods is often discouraged, but in specific scenarios like authentication flows, overriding input processing can be an effective pragmatic solution.

## The Solution: Overriding Input Processing

Since we need to ensure the email used for login matches the stored email case-insensitively, the best approach is to normalize the email address *before* it is passed to the credential verification step. This requires hooking into where Laravel gathers and processes the credentials during the login attempt.

We will achieve this by implementing a Mutator on the User model and ensuring our custom controller handles the modification of the submitted data before attempting authentication.

### Step 1: Normalizing the Email in the Model

First, we implement a mutator method on the `User` model to ensure that any email attribute is automatically stored or retrieved in lowercase. This makes the model itself aware of the standardized format.

In your `app/User.php` file, add the following method:

```php
public function getEmailAttribute($value)
{
    // Ensure all emails are stored and retrieved in lowercase for consistency
    return strtolower($value);
}
```

This ensures that whether a user saves `Test@example.com` or `test@example.com`, the underlying data in the database is consistently stored as `test@example.com`.

### Step 2: Modifying Credentials in the Controller

Next, we need to apply this same normalization logic when handling the incoming request during the login attempt. This involves modifying the controller responsible for authentication, such as your custom `LoginController`. We will intercept the submitted username and ensure it is lowercased before passing it to the authentication mechanism.

In your `app/Http/Controllers/Auth/LoginController.php`, modify the method where you process credentials:

```php
protected function credentials()
{
    $username = $this->username(); // Get the raw input username
    $credentials = request()->only($username, 'password');

    // Apply the case-insensitivity logic here before attempting login
    if (isset($credentials[$username])) {
        $credentials[$username] = strtolower($credentials[$username]);
    }
    
    return $credentials;
}
```

By implementing this layering—normalizing the data at the Model level and again at the Controller level—we ensure that the email being used for the database lookup is standardized to lowercase, effectively neutralizing the case sensitivity issue during authentication. This pattern shows how customizing Laravel's core flows can be done effectively without rewriting entire packages.

## Conclusion

While it might seem like an overly complex solution just to handle email casing, this approach provides robust consistency for your user base. By using mutators in the Eloquent model and carefully managing input within your authentication controllers, you achieve case-insensitive login functionality. Remember, when dealing with data integrity in Laravel applications, understanding the flow of data—from request to controller to model—is key. For more in-depth guidance on building robust systems on the Laravel framework, always refer to official documentation and best practices found at [laravelcompany.com](https://laravelcompany.com).
