---
title: "Mail::send() not working in Laravel 5"
description: "Troubleshooting Mail::send() Errors in Laravel 5: Why Your Email Functionality Broke As a senior developer working with the Laravel ecosystem, you’ve..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a senior developer working with the Laravel ecosystem, you’ve likely encountered migration issues when upgrading frameworks. The error `'Class 'App\Http\Controllers\Mail' not found'` when attempting to use functions like `Mail::send()` is a classic symptom of changes in how Laravel handles facades, service providers, and class loading between major versions, particularly the transition from Laravel 4 to Laravel 5.

This post will diagnose why this error occurs in your specific scenario and provide you with the modern, robust solution for sending emails in a Laravel application.

---

## The Root Cause: Facades and Service Container Changes

The issue you are facing stems from fundamental changes in how Laravel manages its services and facades across different versions. In older versions like Laravel 4, the way classes were loaded and referenced was different. When migrating to Laravel 5, the underlying service container and class loading mechanisms were refined.

When you try to call a static method on a facade (like `Mail::send()`), if the necessary service provider or autoloading mechanism hasn't been correctly established for that specific context, PHP cannot resolve the class path, leading to the `'Class not found'` error.

In essence, the direct use of `Mail::send()` in a controller is often an anti-pattern because it ties your business logic directly to the email sending mechanism, making testing and maintenance difficult. Furthermore, relying on this direct method can become brittle when dealing with configuration changes or service provider updates inherent in Laravel 5+.

## The Correct Approach: Using Mailable Classes

Instead of manually manipulating the `Mail` facade to construct an email within your controller, the recommended best practice in modern Laravel development is to utilize **Mailable classes**. Mailable classes encapsulate all the logic required for building and sending an email (the view, the data, the subject, etc.). This separation of concerns makes your code cleaner, more testable, and adheres better to object-oriented principles.

To implement this correctly, you need three main components:

1.  **The Mailable Class:** A dedicated class that defines *what* the email should look like.
2.  **The Mail Trait/Interface (Optional but good practice):** Defining the contract for sending mail.
3.  **The Controller/Job:** The controller simply dispatches the Mailable, letting Laravel handle the actual delivery process.

### Step-by-Step Implementation

Let's refactor your `UserController` logic to use this superior method. Assume you have a Mailable class named `VerifyAccountMail`.

#### 1. Create the Mailable Class

Create the mail class that handles the content and recipients:

```php
// app/Mail/VerifyAccountMail.php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VerifyAccountMail extends Mailable
{
    use Queueable, SerializesModels;

    public $username;
    public $tmpPass;

    /**
     * Create a new Mailable instance.
     */
    public function __construct($username, $tmpPass)
    {
        $this->username = $username;
        $this->tmpPass = $tmpPass;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('Verify your Account')
                    ->view('emails.verify'); // This points to your Blade view file
    }
}
```

#### 2. Refactor the Controller Logic

Now, in your controller, you simply create an instance of the Mailable and dispatch it. The error disappears because you are no longer trying to call a static method on a potentially misconfigured facade; you are utilizing standard object instantiation and dispatching.

```php
// In UserController.php

use App\Mail\VerifyAccountMail; // Import your Mailable
use Illuminate\Support\Facades\Mail; // Use the facade only for sending

public function store(CreateUserRequest $request)
{
    // ... (Existing database logic remains the same) ...

    if ($user) {
        $tmp_pass = str_random(10);

        // 1. Create the Mailable instance with necessary data
        $mail = new VerifyAccountMail($user->username, $tmp_pass);

        // 2. Dispatch the mail via the Mail facade
        Mail::send($mail); // This is clean and relies on established service providers

        return Redirect::to('/')
            ->with('message', 'Thanks for signing up! Please check your email.');
    }
    // ... (rest of the function) ...
}
```

## Conclusion

The error `'Class 'App\Http\Controllers\Mail' not found'` indicates a structural issue related to how you are invoking Laravel services. While it might have worked in older versions, relying on direct facade calls for complex tasks is fragile. By migrating towards using Mailable classes and leveraging Laravel's queue system, as demonstrated above, you ensure your email functionality remains robust, scalable, and compliant with modern Laravel standards. Always strive to use the intended patterns when working with frameworks like Laravel, which emphasizes clean architecture and dependency management, much like the principles outlined on https://laravelcompany.com.
