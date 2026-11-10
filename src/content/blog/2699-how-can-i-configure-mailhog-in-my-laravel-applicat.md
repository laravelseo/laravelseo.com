---
title: "How can i configure mailhog in my laravel application"
description: "Troubleshooting Mail Configuration: Connecting Laravel to MailHog/Mailpit Locally As a senior developer, I often encounter frustrating connection errors when..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a senior developer, I often encounter frustrating connection errors when setting up email services in a Laravel application, especially during local development. The scenario you described—where your `.env` file is set for an external service (like Mailgun) but you receive a failure trying to connect to `mailpit:1025`—points to a classic configuration clash between production settings and local testing environments.

This post will walk you through diagnosing why this error occurs and provide the correct steps to configure your Laravel application to successfully use MailHog or Mailpit for development purposes, ensuring smooth email testing.

---

## Understanding the Connection Error

The error message you are seeing is highly specific:
`Connection could not be established with host "mailpit:1025": stream_socket_client(): php_network_getaddresses: getaddrinfo for mailpit failed:`

This error does *not* mean your Mailgun credentials are wrong. Instead, it means the PHP mailer component is attempting to establish a network connection to a hostname (`mailpit`) that it cannot resolve or reach on the specified port (`1025`). This usually happens because:

1.  **Configuration Conflict:** Your application's environment variables are pointing toward an external SMTP server (e.g., Mailgun), but the underlying mailer configuration is still defaulting to a local testing endpoint (MailHog/Mailpit).
2.  **Server Not Running:** The MailHog or Mailpit service itself is not running on your machine, making the hostname unreachable.
3.  **Incorrect Host Mapping:** The way Laravel resolves the host name within the environment context is failing.

## The Solution: Configuring for Local Testing with MailHog/Mailpit

When developing locally, the goal is to bypass external SMTP services and route all outgoing mail through a local testing server like MailHog or Mailpit. To achieve this, you must explicitly configure Laravel's mail settings in your `.env` file to point to `localhost` or the specific host where MailHog/Mailpit is running.

### Step 1: Adjusting Your Environment Variables

You need to modify your `.env` file to tell Laravel to use a local mail server instead of an external one. You should focus on setting the `MAIL_MAILER` variable correctly for development.

Here is how you should structure your configuration for local testing:

```dotenv
MAIL_MAILER=smtp
MAIL_HOST=127.0.0.1  # Use localhost or 127.0.0.1 for local connections
MAIL_PORT=1025      # MailHog/Mailpit default port
MAIL_ENCRYPTION=null # Often null or 'tls' for local testing if not using SSL setup
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"
```

**Why this works:** By setting `MAIL_MAILER=smtp` and pointing `MAIL_HOST` to `127.0.0.1:1025`, you instruct the Laravel mailer to attempt a connection to your local machine on the standard MailHog/Mailpit port, resolving the network issue you were experiencing with the hostname `mailpit`.

### Step 2: Ensuring MailHog/Mailpit is Running Correctly

Before testing the configuration above, ensure that your MailHog or Mailpit instance is actively running. If you are using Docker (which is highly recommended for Laravel setups), confirm that the necessary mail service container is active and accessible on your host machine's network.

If you are running MailHog via Docker Compose, make sure all services are started:

```bash
docker-compose up -d
```

### Step 3: Best Practices for Environment Management

As you manage complex configurations like this in Laravel, adhering to best practices is crucial. Always treat your environment variables as dynamic settings rather than hardcoded values. When setting up new features or services, understanding how configuration layers interact is key. For more advanced insights into structuring application configuration within the Laravel ecosystem, consulting resources like [laravelcompany.com](https://laravelcompany.com) can be very helpful.

## Conclusion

The problem you faced was a mismatch between your intended operational mode (testing locally via MailHog/Mailpit) and your configured environment settings (pointing to an external service). By adjusting the `MAIL_HOST` and `MAIL_PORT` variables in your `.env` file to explicitly target `127.0.0.1:1025`, you correctly redirect the mailer process to your local testing server, resolving the connection
