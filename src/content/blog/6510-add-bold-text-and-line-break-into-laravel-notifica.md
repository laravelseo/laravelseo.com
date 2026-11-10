---
title: "Add bold text and line break into Laravel Notification Email"
description: "Mastering Rich Text in Laravel Notifications: Bold Text and Line Breaks in Emails Sending professional, richly formatted emails is a common requirement in..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "HTML", "Errors"]
featured: false
---

Sending professional, richly formatted emails is a common requirement in web applications, especially when dealing with notifications. When working with Laravel's Notification system, developers often run into challenges trying to insert bold text or specific line breaks directly into the email content. As a senior developer, I've seen many attempts involving string concatenation and HTML tags fail to render correctly across various email clients like Mailtrap.

This post will dive into why your initial attempts might have failed and provide the most robust, recommended solutions for adding bold text and managing line breaks in Laravel notifications. We will explore the best practices that align with modern application development principles, much like those promoted by the team at [laravelcompany.com](https://laravelcompany.com).

## The Pitfall of Direct String Concatenation

The issue you encountered stems from how email systems interpret plain string content versus properly formatted HTML. When you use methods like `line()` in a Mail class, Laravel generally treats the output as plain text unless explicitly handled as HTML.

Your attempt to inject `<strong >` and `<br>` tags directly into the string passed to `line()` is technically valid HTML, but the email system or the underlying mail driver might sanitize or misinterpret this content when it's being sent via services like Mailtrap, leading to the raw HTML being displayed as literal text rather than formatted content. Furthermore, relying solely on `\n` for line breaks often results in poor cross-client compatibility compared to using actual HTML line break tags.

## Solution 1: Embedding HTML Directly (The Tricky Way)

While direct embedding seems intuitive, it requires careful handling of escaping and ensuring the entire body is treated as HTML. If you insist on building the content purely within the mail class, you must ensure the final output is valid HTML.

When using `line()`, remember that its primary purpose is to structure the email flow. For complex formatting, we need to leverage raw HTML correctly.

```php
// Example of attempting direct HTML injection (often problematic)
return (new MailMessage)
    ->subject('Booking Confirmed - Please Read')
    ->greeting('Hello ' . $this->booking->user->first_name . ',')
    ->line('Thank you for booking. Here are your booking details:')
    ->line('<strong style="font-weight: bold;">Need to cancel?</strong><br>') // Injecting HTML directly
        . 'Don\'t forget to contact the provider on the details above if you need to cancel or reschedule. They won\'t mind, as long as you tell them.'
    // ... rest of the content
```

As you noted, this often fails because the context within `line()` is designed for plain text flow, not complex HTML rendering.

## Solution 2: The Recommended Approach – Leveraging Blade Templates

The most professional, maintainable, and robust way to handle complex formatting—like bolding, inserting line breaks, and structuring large blocks of content—is by delegating the rendering to Blade templates. This separates your presentation logic (HTML) from your business logic (the Notification class).

Instead of trying to construct the entire email body inside the Mail class, you prepare the content in a dedicated Blade file and pass that prepared HTML into the notification.

### Step 1: Create the Email View Template

Create a separate view file (e.g., `resources/views/emails/booking_confirmation.blade.php`) where you can use standard HTML tags freely.

```html
{{-- resources/views/emails/booking_confirmation.blade.php --}}
<html>
<head>
    <title>{{ $subject }}</title>
</head>
<body>
    <h2>Booking Confirmation</h2>
    <p>Hello {{ $user->first_name }},</p>

    <p>Thank you for booking. Here are your details:</p>
    
    <div>
        <strong>Provider:</strong> {{ $provider->name }}<br>
        <strong>Date:</strong> {{ $date}}<br>
        <strong>Address:</strong> {{ $address_1 }}, {{ $address_2 }}, {{ $address_3 }}, {{ $city }}, {{ $postcode }}
    </div>

    <p>Price: £{{ $price }}</p>

    <p><strong>Need to cancel?</strong><br>
        Don't forget to contact the provider on the details above if you need to cancel or reschedule. They won't mind, as long as you tell them.
    </p>

    <p><strong>Payment Details:</strong><br>
        Pay the Service provider direct as you normally would. This keeps things simple and costs down.
    </p>

</body>
</html>
```

### Step 2: Update the Notification Class

In your Notification class, you now simply pass the rendered HTML content to the `line()` method once (or use `html()` if sending a full HTML email).

```php
// In your Notification class...
public function toMail($notifiable)
{
    $htmlContent = view('emails.booking_confirmation', [
        'user' => $notifiable->user,
        'booking' => $this->booking,
        'date' => $this->booking->start_at,
        // ... pass all necessary data
    ])->render();

    return (new MailMessage)
        ->subject('Booking Confirmed - Please Read')
        ->greeting('Hello ' . $notifiable->user->first_name . ',')
        ->html($htmlContent); // Use html() for full HTML emails
}
```

## Conclusion: Consistency and Maintainability

By shifting the responsibility of complex formatting to Blade templates, you achieve significant benefits. Your notification logic remains clean and focused on data handling, while your email presentation is handled by dedicated view files. This approach ensures that your emails are consistent, easy to debug, and easily maintainable across your application—a core principle reflected in how we build powerful systems at [laravelcompany.com](https://laravelcompany.com).

Always prioritize using Blade for rendering rich content rather than trying to construct complex HTML strings directly within the mail class methods. It is the professional standard for building scalable Laravel applications.
