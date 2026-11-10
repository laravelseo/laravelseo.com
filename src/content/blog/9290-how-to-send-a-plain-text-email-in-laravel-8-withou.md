---
title: "How to send a plain text email in Laravel 8 without using a blade?"
description: "How to Send a Plain Text Email in Laravel 8 Without Using Blade As developers working within the Laravel ecosystem, we often need to handle various types of..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "HTML", "PHP"]
featured: false
---

As developers working within the Laravel ecosystem, we often need to handle various types of communication—from complex HTML emails built with Blade templates to simple, direct plain text notifications. The question arises: If I only need to send raw text and want to avoid the overhead or complexity of rendering a full Blade view for a single email, how do I achieve this efficiently in Laravel 8?

The short answer is that you absolutely can, and often should, bypass Blade when sending simple, static content. Relying solely on Blade for every communication task introduces unnecessary coupling. We need to leverage Laravel's core Mail functionality directly.

## Understanding the Goal: Plain Text vs. Templating

When we talk about avoiding Blade, we are essentially saying we want to avoid using the view engine to construct the email body. This is perfectly valid if your content is static or dynamically generated purely as a string.

Blade is fantastic for dynamic presentation, conditional logic, and complex HTML structures that require component reuse. However, for a simple SMS notification or a raw log entry delivered via email, constructing the message directly within your controller logic or a dedicated service class is often cleaner and more performant.

## Method 1: Sending Raw Text Directly via the Mail Facade

The most straightforward way to send plain text is by utilizing the `Mail` facade. While Laravel heavily promotes Mailable classes for structured emails, you can use the underlying methods to send raw content directly if necessary. For a simple notification, we focus on setting the message body explicitly.

Here is an example demonstrating how to construct and send a plain text email:

```php
use Illuminate\Support\Facades\Mail;
use App\Mail\PlainTextNotification; // Assuming you use a Mailable for structure

class NotificationController extends Controller
{
    public function sendSimpleText()
    {
        $recipient = 'user@example.com';
        
        // 1. Construct the plain text body directly as a string
        $plainTextBody = "Hello, this is a simple plain text notification from Laravel. Data sent: 42.";

        // 2. Create the Mailable instance (even if we are sending raw data)
        $mail = new PlainTextNotification($plainTextBody);

        // 3. Send the email using the Mail facade
        Mail::send($mail, function ($message) use ($recipient) {
            $message->to($recipient);
            // Optionally set a plain text version if your Mailable supports it
            $message->subject('Simple Plain Text Alert');
        });

        return "Email sent successfully.";
    }
}
```

In this approach, the heavy lifting of formatting is done in PHP string concatenation before handing the data off to the mailer. This keeps the presentation logic separate from the view layer, adhering to good architectural principles that underpin robust applications, much like the structure promoted by the Laravel team at https://laravelcompany.com.

## Method 2: Structuring Content with Mailable Classes

Even when sending plain text, creating a dedicated Mailable class is highly recommended. It allows you to encapsulate the email logic, subject line management, and potential attachment handling into one cohesive unit. This pattern makes your code reusable and easier to maintain as your application grows.

If you are storing your email templates in a database (as mentioned in your context), you would load that raw text string from the database when instantiating the Mailable.

```php
// app/Mail/PlainTextNotification.php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PlainTextNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $plainTextContent;

    /**
     * Create a new Mailable instance.
     *
     * @param string $content The raw plain text content to be sent.
     */
    public function __construct(string $content)
    {
        $this->plainTextContent = $content;
    }

    /**
     * Build the message.
     *
     * @return \Illuminate\Mail\Mailables\Message
     */
    public function build()
    {
        // In a real scenario, you would use this content to define headers or specific plain text formats.
        return $this->subject('Plain Text Notification')
                    ->text($this->plainTextContent); // Use the built-in text method for raw body
    }
}
```

This Mailable pattern ensures that your email sending process remains decoupled from Blade rendering, focusing purely on data transmission. When working with Eloquent models and database interactions in Laravel, understanding these core services is key to building scalable solutions.

## Conclusion

To send plain text emails in Laravel 8 without resorting to Blade for the body content, focus on leveraging the `Mail` facade and structuring your data cleanly using Mailable classes. By treating the email content as raw string data managed within your service layer or model, you achieve better separation of concerns. This approach keeps your application robust, scalable, and easy to maintain, ensuring that whether you are sending complex HTML emails or simple text alerts, your code remains clean and efficient.
