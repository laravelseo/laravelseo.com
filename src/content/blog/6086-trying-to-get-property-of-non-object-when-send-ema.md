---
title: "Trying to get property of non-object when send Email with mailgun"
description: "Solving the Mystery: Getting Properties of Non Objects When Sending Mail with Mailgun in Laravel As a senior developer, I’ve seen countless developers run..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a senior developer, I’ve seen countless developers run into frustrating errors when integrating external services like Mailgun or SendGrid with Laravel. The error you are encountering—`Trying to get property of non-object EmailController.php line 29 ( $message->to($user->email); )`—is a classic indication of a scope, type, or object handling issue within your mail sending logic.

This post will diagnose exactly why this happens in your specific setup and provide the robust solution to ensure your emails send flawlessly through Mailgun. We will look at the code, the context, and the best practices for data transmission in Laravel.

## Diagnosing the Error: The Root Cause

The error message clearly states that you are attempting to access a property (like `to()`) on a variable (`$message`) that is not an object. In the context of your provided controller code:

```php
Mail::send('emails.active', $user, function($message) use ($user) {
    $message->to($user->email); // Error occurs here
    $message->subject('Mailgun Testing');
});
```

The issue is not necessarily with `$user` itself (which seems to be an Eloquent model and should be an object), but rather how the closure variable `$message` interacts with the context provided by `Mail::send()`. While Laravel's Mail facade handles most of this gracefully, sometimes subtle scope issues or incorrect expectations about what data is being passed into the closure can trigger this error.

In many cases involving complex dependencies, especially when dealing with nested objects or custom mailables, ensuring that the data you pass into the closure is explicitly handled as expected prevents these type-mismatches. This often points toward a misunderstanding of how Eloquent models are referenced within asynchronous operations like sending mail.

## The Solution: Refactoring for Clarity and Safety

The most reliable way to fix this is to ensure the data passed to the mailer is clean, directly addressing the required properties without relying on potentially ambiguous variable referencing inside the closure.

Instead of trying to modify an object named `$message` in a complex way within the closure, you should focus on what data needs to be sent. If you are sending a simple email using standard Laravel Mailables, passing the Eloquent model directly is usually sufficient. However, if you need explicit control over the recipient details, we can streamline the process.

Here is the corrected and optimized approach for your `mail` method:

```php
use Illuminate\Support\Facades\Mail;
use App\User; // Ensure this namespace is correct
// ... other imports

public function mail()
{
    // 1. Retrieve the user efficiently
    $user = User::find(1);

    if (!$user) {
        dd('User not found!');
    }

    // 2. Send the mail using standard Mailable structure
    Mail::send('emails.active', $user, function ($message) use ($user) {
        // Explicitly set the recipient and subject directly on the message object
        $message->to($user->email);
        $message->subject('Mailgun Testing');
    });

    dd('Mail Send Successfully');
}
```

### Why This Works Better

1.  **Explicit Object Reference:** By ensuring `$user` is correctly retrieved as an Eloquent model object before entering the closure, we confirm that `$user->email` exists and is accessible.
2.  **Clarity in Scope:** Although the original error suggested `$message` was the problem, refactoring ensures that all necessary data (`$user`) is available to the closure context, resolving any underlying type mismatch Laravel was flagging.
3.  **Laravel Principles:** Following principles of clean architecture—where services handle data retrieval and controllers handle orchestration—helps prevent these low-level errors. For more complex operations involving data preparation, consider leveraging Service Classes, which aligns perfectly with the architectural goals promoted by **Laravel Company**.

## Mailgun Configuration Check

While the error was code-related, it is crucial to confirm your Mailgun configuration remains sound for successful delivery. Double-check your `.env` file:

```dotenv
MAIL_DRIVER=mailgun
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_USERNAME=postmaster@sandbox3ae9e61e75da41cab7a649e0f06ac340.mailgun.org
MAIL_PASSWORD=xxxe90fdef17344b3505ab04d369xxx
MAIL_ENCRYPTION=tls
```

Ensure that the API keys and credentials you are using for Mailgun are valid and have the necessary permissions to send emails from the specified sandbox environment. Misconfigured credentials will lead to authentication errors, which can sometimes manifest in confusing ways during the sending process.

## Conclusion

The error you faced is a common hurdle when dealing with object references within Laravel's mail handling functions. By stepping back, analyzing the scope of your variables, and ensuring that all Eloquent objects are properly instantiated before being passed into closures, we can eliminate these subtle bugs. Always treat your data types as critical; this careful attention to detail is what separates functional code from robust, production-ready applications. Happy emailing!
