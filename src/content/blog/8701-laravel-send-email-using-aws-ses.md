---
title: "Laravel Send email using AWS SES"
description: "Sending Emails in Laravel with AWS SES: Debugging the Transport Exception As a senior developer, I frequently encounter situations where custom mailer..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a senior developer, I frequently encounter situations where custom mailer configurations—especially when integrating third-party services like AWS SES—lead to subtle but frustrating transport errors. You've correctly identified that while setting up the configuration files seems perfect, the actual email delivery fails, resulting in an error like the `Swift_TransportException` you are seeing.

This post will dissect the configuration you provided, analyze why you are encountering this specific error when using AWS SES instead of traditional SMTP (like Mailtrap), and guide you toward a robust solution. We will explore the nuances of integrating external APIs into Laravel's mail system.

## Understanding the Setup and the Error

You have established a sophisticated setup by attempting to route email through AWS SES using a custom driver:

**Your Configuration Snippets:**
*   `.env`: Defines `MAIL_MAILER=ses`, `SES_KEY`, `SES_KEY_SECRET`, and `SES_REGION`.
*   `config/mail.php`: Sets the default mailer to `ses`.
*   `config/services.php`: Maps the `'ses'` service with your AWS credentials.

**The Problem:**
When you test with Mailtrap or cPanel SMTP, everything works because those systems use standard, well-understood SMTP protocols where the response codes (like 354) are expected by the underlying transport layer. However, when switching to an API-based service like AWS SES, the interaction shifts from a direct SMTP handshake to an HTTP request/response pattern mediated by AWS SDK calls.

The error message:
```
message: "Expected response code 354 but got code "503", with message "503 RCPT command expected\r\n"
```
This specific error indicates a mismatch in the communication protocol or expectation between your Laravel mailer package (likely SwiftMailer or Symfony Mailer) and the AWS SES endpoint. The system expects an SMTP-like response during the delivery process, but instead receives an HTTP status code (503 Service Unavailable), suggesting the connection is being handled at an HTTP level rather than a pure SMTP level, or that the authentication/session setup for SES is incomplete in this context.

## The Root Cause: Custom Mailer Implementation

The issue rarely lies in the `.env` files themselves; it resides deep within how the `ses` mailer driver attempts to execute the actual sending logic. Since you are customizing the transport layer, you need to ensure that your custom implementation correctly handles the AWS SDK interaction and error mapping for SES API calls, rather than expecting raw SMTP responses.

A robust approach involves creating a dedicated Mailer class that encapsulates the AWS SDK calls. This keeps your service configuration clean and adheres to the principles of separation of concerns, which is crucial in building scalable applications, much like the architecture promoted by **Laravel Company**.

### Best Practice: Implementing a Custom SES Mailer

Instead of relying on generic SMTP classes to handle an API integration, you should implement a custom mailer that uses the AWS SDK directly. This gives you full control over error handling specific to SES.

Here is a conceptual example of how you might structure this custom driver (this requires defining a new class and registering it in `config/mail.php`):

```php
// Example conceptual implementation for your custom SES Mailer
namespace App\Mail;

use Illuminate\Support\Facades\Http;
use Illuminate\Contracts\Mail\Mailer;

class SesMailer implements Mailer
{
    protected $key;
    protected $secret;
    protected $region;

    public function __construct(string $key, string $secret, string $region)
    {
        $this->key = $key;
        $this->secret = $secret;
        $this->region = $region;
    }

    public function send(object $message)
    {
        // 1. Prepare the message body and recipient data for SES API call
        $messageBody = $message->content;
        $recipient = $message->to;

        // 2. Construct the AWS SDK request payload (using HTTP client)
        $response = Http::withHeaders([
            'Authorization' => 'AWS4-HMAC-SHA256 Credential=' . $this->key,
            'Content-Type' => 'application/json'
        ])->post("https://ses.amazonaws.com/artications/send")
          ->withBody(json_encode([
              'Destination' => ['ToAddresses' => [$recipient]],
              'Message' => ['Subject' => ['Subject' => $message->subject, 'Body' => ['Text' => $messageBody]]],
              'Source' => ['Address' => config('mail.from')] // Use configured sender address
          ]))
          ->send();

        // 3. Handle the response and throw specific exceptions on failure
        if ($response->status() !== 200) {
            throw new \Exception("AWS SES API Error: Status " . $response->status() . " - " . $response->body());
        }

        return true;
    }
}
```

### Final Steps for Success

1.  **Register the Driver:** Ensure your `config/mail.php` correctly points to this custom implementation instead of relying on default SMTP settings.
2.  **Verify IAM Permissions:** Double-check that the IAM role or user associated with your AWS keys has the necessary permissions (`ses:SendEmail`, `ses:SendRawEmail`).
3.  **Check Region Consistency:** Ensure the region specified in your `.env` (`us-east-1`) matches the region where you configured your SES sender.

## Conclusion

Switching from traditional SMTP testing to an API-driven service like AWS SES requires moving beyond simple configuration files. The `Swift_TransportException` is a signal that the transport layer logic needs to be re-written to correctly handle HTTP communication and AWS SDK responses instead of expecting legacy SMTP feedback. By implementing a custom mailer driver, as demonstrated above, you gain the necessary control to manage these API interactions cleanly. Always prioritize modularity when integrating external services in Laravel; this approach ensures your application remains maintainable and scalable.
