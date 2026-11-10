---
title: "How Send emails in queue in Laravel"
description: "Mastering Asynchronous Communication: How to Send Emails in a Queue in Laravel Sending emails is a fundamental part of almost any application, whether it’s..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Sending emails is a fundamental part of almost any application, whether it’s subscription notifications, password resets, or transactional alerts. When dealing with high volumes of emails, attempting to send them synchronously within an HTTP request can lead to slow response times and timeouts. This is where queuing becomes essential.

If you are finding that your email queue attempts aren't working, the issue usually lies not in the syntax itself, but in understanding the full pipeline: configuring the mailer, setting up the queue driver, and ensuring you have a dedicated worker running to process those jobs.

As a senior developer, I’ve seen many developers run into this exact hurdle. Let’s break down the correct, robust way to handle queued emails in Laravel, moving beyond simple syntax errors to true asynchronous processing.

## Why Simple Queuing Fails (and What You Need)

The snippet you provided hints at using the `Mail::queue()` method:

```php
Mail::queue('emails.mailsubscribe', ['email' => $email], 
    function($message) use($email)
    {
       $message->to('user@xxx.in')->subject('Subscribe: XXXXX');
    });
```

While this syntax attempts to queue a job, simply calling `Mail::queue()` only places the request onto the queue driver (like Redis or Beanstalkd). It does **not** execute the sending process immediately. If you don't have a separate process actively listening to that queue, the email will never be sent.

To make this work reliably, you need three core components:

1.  **Mail Setup:** You must have configured your mail configuration (usually via `.env` files) for the transport mechanism you intend to use (SMTP, Mailtrap, etc.).
2.  **Queue Driver:** Laravel needs a queue driver configured in `config/queue.php`.
3.  **The Worker Process:** Crucially, you must run a long-running process—the queue worker—that constantly pulls jobs off the queue and executes the corresponding code.

## The Best Practice: Using Mailable Classes

The most idiomatic and maintainable way to handle emails in Laravel is by leveraging **Mailable classes**. This separates the *what* (the email content) from the *how* (the delivery mechanism).

### Step 1: Create the Mailable

First, define your mailable class. This class holds all the necessary data and formatting for the email.

```php
// app/Mail/SubscriptionMail.php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SubscriptionMail extends Mailable
{
    use Queueable, SerializesModels;

    public $emailAddress;
    public $subscriptionId;

    public function __construct($email, $subscriptionId)
    {
        $this->emailAddress = $email;
        $this->subscriptionId = $subscriptionId;
    }

    public function build()
    {
        return $this->subject('Subscription Confirmation')
                    ->view('emails.subscription'); // Reference your Blade view
    }
}
```

### Step 2: Dispatch the Mailable to the Queue

Instead of manually queuing the message content, you dispatch an instance of the Mailable class. Laravel handles the serialization and queuing automatically.

```php
use App\Mail\SubscriptionMail;
use Illuminate\Support\Facades\Mail;

// ... inside your controller or service
$user = User::find(1); // Example user data

Mail::queue(new SubscriptionMail($user->email, $user->subscription_id));
```

### Step 3: Run the Queue Worker

Finally, to ensure these jobs are processed, you must run the worker in your terminal:

```bash
php artisan queue:work
# Or for production environments:
php artisan queue:listen
```

## Troubleshooting Common Issues

If your emails still aren't sending, check these common pitfalls:

1.  **Configuration:** Ensure your `.env` file has valid SMTP credentials configured correctly if you are using a real mail driver. Check the documentation on setting up services by reviewing resources like those provided by [laravelcompany.com](https://laravelcompany.com) for configuration guidance.
2.  **Driver Status:** Verify that your chosen queue driver (e.g., Redis or Database) is running and accessible by your application.
3.  **Worker Health:** Check the output of your `queue:work` command. If jobs are stuck, it usually indicates a connection issue or an error within the mailer itself that stopped execution.

## Conclusion

Sending emails in a queue is not just about writing one line of code; it’s about architecting an asynchronous system. By moving from manual message queuing to dispatching Mailable objects and ensuring your queue worker is operational, you create a scalable, resilient, and high-performing application. Embrace the power of Laravel's queue system to ensure your notifications are delivered reliably, regardless of how many users you serve.
