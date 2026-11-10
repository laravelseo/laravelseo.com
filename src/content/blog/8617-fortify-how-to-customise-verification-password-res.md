---
title: "Fortify - How to customise verification / password reset emails?"
description: "Fortify Customization: Mastering Verification and Password Reset Emails Implementing robust authentication features like those provided by Laravel Fortify is..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

Implementing robust authentication features like those provided by Laravel Fortify is a huge step forward for any application. However, as you discovered, customizing the default email templates—especially for critical flows like password resets or email verifications—often requires delving into the architecture of Laravel rather than blindly editing vendor files. The confusion you are experiencing regarding hooks and custom methods is completely valid; there isn't always a single, obvious documentation path for deep customization.

As a senior developer, I can guide you through the correct, maintainable way to achieve this customization, focusing on decoupling your presentation layer from the core logic.

## Why Direct File Edits Are a Bad Idea

You are absolutely right to avoid editing files within the `vendor` directory. When you update Laravel or Fortify versions, these changes will be wiped out, forcing you to repeat the work every time. This violates the principle of separation of concerns. Instead of patching the core framework code, we should leverage Laravel’s built-in event system and notification architecture.

The correct approach is to intercept the process where the email is *prepared* or *sent*, rather than modifying the underlying mailer logic itself.

## The Recommended Approach: Custom Notifications and Events

Fortify relies on Laravel's Notification system to dispatch emails. To customize these emails, you should focus on creating custom notification classes that Fortify (or your application logic) can use instead of the defaults.

### Step 1: Creating Custom Mailables

Instead of modifying how Fortify generates its verification link, we modify *what* is sent. You create a new Mailable class specifically for your needs.

For example, if you want to change the tone or layout of the email sent upon verification, you would define a custom Mailable that inherits from Laravel's base classes:

```php
// app/Mail/CustomVerificationEmail.php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Contracts\Queue\ShouldQueue;

class CustomVerificationEmail extends Mailable
{
    use Queueable;

    public $user;

    /**
     * Create a new message instance.
     *
     * @param  \App\Models\User  $user
     */
    public function __construct($user)
    {
        $this->user = $user;
    }

    public function build()
    {
        return $this->subject('Verify Your Account')
                     ->view('emails.custom_verification', ['user' => $this->user]); // Points to your custom Blade view
    }
}
```

### Step 2: Hooking into the Notification Flow

To make Fortify use this new Mailable, you need to tell Laravel’s notification system to use it when a verification event occurs. This is typically done by binding or overriding the default notification that Fortify uses. While there isn't always a single simple method directly exposed by Fortify for this specific hook, we can leverage **Event Listeners**.

You can listen for the relevant authentication events (e.g., `Registered` or custom verification events) and manually dispatch your custom notification instead of letting the default one fire. This keeps the logic clean and manageable, adhering to modern Laravel principles outlined by resources like https://laravelcompany.com.

If you are specifically looking to modify how Fortify handles the *sending* mechanism for verification, investigate if Fortify provides a service provider hook or an event that fires just before notification dispatch. If not, creating a custom controller action that triggers your desired notification upon successful verification is often the most straightforward path.

## Conclusion: Building Extensible Systems

Customizing framework features like those in Laravel Fortify should always prioritize extensibility over modification. By focusing on custom Mailable classes and event listeners instead of direct file manipulation, you ensure that your application remains stable across updates. This approach results in cleaner code, easier maintenance, and a system that aligns perfectly with the principles of modern PHP development. Start by defining what content you need to change, then build the notification around that requirement.
