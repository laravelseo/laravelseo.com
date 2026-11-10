---
title: "Sending e-mail in Laravel with custom HTML"
description: "Sending Custom HTML Emails in Laravel: Beyond Simple Blade Views As senior developers working with Laravel, we often encounter scenarios where the standard..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "HTML", "PHP"]
featured: false
---

As senior developers working with Laravel, we often encounter scenarios where the standard templating approach—using Blade files—falls short. Sometimes, the requirement is highly specific, such as needing to pre-process HTML for email compatibility, like applying CSS inlining, before sending it via the Mail facade. This post addresses how to send fully generated, custom HTML content rather than relying solely on Laravel Blade views when that content has undergone specialized preparation.

## The Challenge: Raw HTML vs. Laravel Views

The standard way to send emails in Laravel is straightforward: you pass a view file (e.g., `emails.welcome`) and the data to the `Mail::send()` method. This leverages Laravel's powerful Blade rendering engine seamlessly.

However, as your example demonstrates, if you have already performed complex operations—like using a service layer to apply CSS inlining to raw HTML strings—you no longer want the mailer to re-render a Blade view. You need to inject the final, ready-to-send HTML directly into the email payload.

The core question becomes: How do we bypass the standard view rendering pipeline and send arbitrary, pre-processed HTML content?

## Solution 1: Utilizing Mailable Classes for Complex Content

The most robust and Laravel-idiomatic way to handle complex email content is by encapsulating the entire sending logic within a dedicated Mailable class. A Mailable acts as a blueprint for constructing the email payload, allowing you to control exactly what gets serialized into the final email structure.

If your HTML is fully generated (including CSS inlining), you should pass this finalized string directly into the Mailable's `build()` method. This keeps your presentation logic separate from your mail transport logic.

Here is an example demonstrating how a Mailable can handle raw HTML content:

```php
// app/Mail/CustomHtmlNotification.php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CustomHtmlNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $htmlContent;

    /**
     * Create a new Mailable instance.
     *
     * @param string $htmlContent The pre-processed HTML body.
     */
    public function __construct(string $htmlContent)
    {
        $this->htmlContent = $htmlContent;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Notification with Inlined CSS')
                    ->html($this->htmlContent); // Use the html() method to send raw HTML
    }
}
```

When sending this mail, you would first generate and process your HTML outside the mailer:

```php
// Controller or Service Layer
$rawHtml = $this->cssInliner->convert($this->generateRawHtml()); // Your custom processing step

Mail::send(new \App\Mail\CustomHtmlNotification($rawHtml));
```

This approach cleanly separates the responsibility: your service handles complex HTML preparation, and the Mailable simply handles the delivery of that prepared content. This separation aligns perfectly with the principles of clean, testable code advocated by the **Laravel Company** ecosystem.

## Solution 2: Sending Raw Content Directly via Mail Facade

If you are not using a formal Mailable structure or need a quick, direct send operation, Laravel provides the `Mail::raw()` method specifically for this purpose. This method takes a string and treats it as the raw body content of an email.

This is ideal when you have already completed all necessary HTML sanitization and inlining steps, and you just need to transport that final string.

```php
use Illuminate\Support\Facades\Mail;

// Assume $finalHtmlString contains your CSS-inlined HTML
$finalHtmlString = '<div style="font-family: Arial;"><h2>Welcome!</h2><p>This is my fully inlined content.</p></div>';

Mail::raw($finalHtmlString, function ($message) {
    $message->to('foo@example.com')->subject('Raw HTML Email');
});
```

Using `Mail::raw()` is efficient because it bypasses the standard view compilation process entirely, allowing you to send exactly what you have prepared. This method ensures that the string you provide is treated as the body content of the email, which is exactly what is needed when dealing with pre-processed HTML payloads.

## Conclusion

When dealing with highly customized email content in Laravel, moving away from relying solely on Blade views and embracing explicit content passing is key. Whether you choose to structure your communication through a dedicated Mailable class or use the direct `Mail::raw()` facade, the principle remains the same: prepare your content (handling complex tasks like CSS inlining) upstream, and then leverage Laravel's mailer tools to transport that finalized payload efficiently. For more deep dives into building scalable backend systems with Laravel, exploring resources from the **Laravel Company** is always recommended.
