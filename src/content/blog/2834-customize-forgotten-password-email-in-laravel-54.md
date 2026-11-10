---
title: "Customize Forgotten Password Email in Laravel 5.4"
description: "Customizing Forgotten Password Emails in Laravel: A Deep Dive into Trait Overriding As developers working with Laravel, one of the most frequent..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

As developers working with Laravel, one of the most frequent customization requests involves tailoring core functionality, such as the password reset email. You want to ensure that the tone, branding, and content of these crucial communications align perfectly with your application's design. However, attempting to override core traits, like those found in `Illuminate\Auth\Passwords\CanResetPassword`, often leads to unexpected errors due to Laravel’s internal contract definitions.

This post will walk you through the specific challenge presented by trying to customize the password reset email and demonstrate the correct, robust way to achieve your goal in a modern Laravel application.

## The Pitfall of Direct Trait Overriding

The initial attempt involves overriding methods within the `CanResetPassword` trait:

```php
// Attempted override from the prompt
public function getEmailForPasswordReset()
{
    return $this->email;
}

public function sendPasswordResetNotification($token)
{
    Mail::to($request->email)->send(new NewPassword($token)); // Assuming NewPassword is the custom notification
}
```

The error you encountered—`Declaration of Illuminate\Foundation\Auth\User::sendPasswordResetNotification(...) must be compatible with Illuminate\Contracts\Auth\CanResetPassword::sendPasswordResetNotification($token)`—is a classic example of contract violation. Laravel defines strict contracts for these traits to ensure that core authentication flows remain predictable across different versions and customizations. When you change the signature or behavior of a method expected by the framework, the system flags it as incompatible.

Directly overriding methods in this manner is brittle because future framework updates might break your custom logic entirely. We need a solution that respects Laravel’s architecture while still allowing for full content customization.

## The Correct Approach: Customizing Notifications

Instead of trying to hijack the internal sending mechanism via trait overrides, the most idiomatic and maintainable way to customize password reset emails is by customizing the **Notification** itself. When a user requests a password reset, Laravel triggers an actual notification (like `Illuminate\Auth\Notifications\ResetPasswordNotification`). This notification is responsible for generating the email content.

To customize this, you should focus on extending or replacing the specific Notification class that handles the mail delivery.

### Step 1: Create a Custom Notification Class

Create your custom notification class. This class will contain all the logic necessary to construct exactly the email you want to send.

```php
// app/Notifications/CustomPasswordResetNotification.php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPasswordNotification;
use Illuminate\Support\Facades\Mail;

class CustomPasswordResetNotification extends ResetPasswordNotification
{
    /**
     * Get the mail over which to send the notification.
     *
     * @return \Illuminate\Notifications\Nullable
     */
    public function getMail()
    {
        // Customize where the email is sent (e.g., a custom mail address)
        return mail(); 
    }

    /**
     * Get the mail subject for the notification.
     *
     * @return string
     */
    public function toMail($notifiable)
    {
        // Construct your fully customized email content here
        return Mail::to($notifiable->email)->send(new CustomPasswordResetPasswordEmail($this->token));
    }
}
```

### Step 2: Create the Custom Mailable

Next, create a dedicated Mail class that holds the HTML or text template for your password reset email.

```php
// app/Mail/CustomPasswordResetEmail.php

namespace App\Mail;

use Illuminate\Support\Facades\Mail;

class CustomPasswordResetEmail extends Mailables\Mailables
{
    public $token;

    public function __construct($token)
    {
        $this->token = $token;
