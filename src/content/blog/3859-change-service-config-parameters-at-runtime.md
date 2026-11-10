---
title: "Change service config parameters at runtime"
description: "Dynamic Configuration at Runtime: Mastering Service Parameter Changes in Laravel As developers working with dynamic applications, one frequent challenge..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Performance", "PHP"]
featured: false
---

As developers working with dynamic applications, one frequent challenge arises: how do we handle service configuration parameters that need to change based on real-time data retrieved from a database, rather than being fixed during the application bootstrap? This is particularly common when dealing with external API keys or domain settings, such as Mailgun credentials, which are stored in your system.

In this post, I’ll walk you through the developer perspective on how to manage and change service configuration parameters dynamically within a Laravel application, ensuring that services like Mail are initialized with the correct, up-to-date settings just before execution.

## The Static vs. Dynamic Configuration Dilemma

When you set up your configuration in `config/services.php`, Laravel caches these values during the initial request cycle. While this is efficient for static data, it becomes problematic when those settings are mutable and sourced from a database. If you need to update the domain or secret mid-request flow (perhaps based on user input or a recent DB change), relying solely on the standard configuration file will lead to stale data being used by your service classes.

The core issue is ensuring that the code calling `Mail::send()` accesses the *most current* parameters, not just the ones loaded at application startup.

## Solution: Dynamic Configuration via Service Abstraction

Instead of trying to modify the global configuration array directly—which can lead to caching issues and poor separation of concerns—the best practice in a robust Laravel application is to abstract this logic into dedicated service classes or facades that handle the data retrieval dynamically.

We can create a dedicated Mailgun service layer that fetches its credentials whenever it needs to execute an action. This approach keeps your configuration clean while allowing for runtime flexibility, aligning with strong design principles often discussed in modern PHP architecture, much like the patterns promoted by the Laravel community.

### Implementing Runtime Parameter Fetching

Let’s assume you have a mechanism to fetch these dynamic settings from your database. We will create a service that reads this data on demand.

First, let's define a simple interface or contract for our service access:

```php
// app/Services/MailgunService.php

namespace App\Services;

use Illuminate\Support\Facades\Config;

class MailgunService
{
    protected string $domain;
    protected string $secret;

    /**
     * Constructor initializes the service by fetching dynamic parameters.
     */
    public function __construct()
    {
        // Fetching from config, which in a real application would be dynamically loaded 
        // or persisted based on runtime context.
        $this->domain = Config::get('services.mailgun.domain', env('mailgun_domain'));
        $this->secret = Config::get('services.mailgun.secret', env('mailgun_secret'));
    }

    /**
     * Method to dynamically update parameters based on runtime context.
     */
    public function updateCredentials(string $newDomain, string $newSecret): void
    {
        $this->domain = $newDomain;
        $this->secret = $newSecret;
        // In a production scenario, you might write these new values back to the DB here.
    }

    public function sendMail(string $to, string $subject, string $body): bool
    {
        // Use the dynamically updated properties for the actual sending logic
        \Log::info("Attempting to send mail via domain: " . $this->domain);
        // ... actual Mailgun API call logic using $this->domain and $this->secret
        return true; 
    }
}
```

### Utilizing the Dynamic Service

Now, instead of directly accessing a static configuration value before sending, you inject and utilize this dynamic service. This shifts the responsibility of configuration management into a dedicated object, making your controllers or jobs cleaner and more testable.

In your controller or job where you initiate the sending process:

```php
use App\Services\MailgunService;

class MailController extends Controller
{
    protected MailgunService $mailgunService;

    public function __construct(MailgunService $mailgunService)
    {
        $this->mailgunService = $mailgunService;
    }

    public function sendDynamicMail($recipient, $subject, $body)
    {
        // 1. Retrieve the latest parameters from your dynamic source (e.g., DB lookup)
        $runtimeDomain = $this->fetchDomainFromDatabase(); // Hypothetical DB call
        $runtimeSecret = $this->fetchSecretFromDatabase(); // Hypothetical DB call

        // 2. Update the service object with runtime data BEFORE sending
        $this->mailgunService->updateCredentials($runtimeDomain, $runtimeSecret);

        // 3. Execute the send operation using the freshly updated context
        $success = $this->mailgunService->sendMail($recipient, $subject, $body);

        if ($success) {
            return response()->json(['status' => 'Mail sent successfully']);
        } else {
            return response()->json(['status' => 'Mail failed'], 500);
        }
    }
}
```

## Conclusion

Managing runtime configuration in Laravel requires moving beyond static file configurations. By abstracting service interactions into dedicated, stateful classes—like our `MailgunService`—you gain the necessary control to inject, update, and manage parameters dynamically. This pattern promotes better separation of concerns, enhances testability, and ensures that your application remains flexible, regardless of where your sensitive settings are stored (database, environment variables, or configuration files). Embrace dependency injection and service layering, as these principles form the backbone of scalable Laravel development—a philosophy strongly supported by the architecture seen in projects like those on **laravelcompany.com**.
