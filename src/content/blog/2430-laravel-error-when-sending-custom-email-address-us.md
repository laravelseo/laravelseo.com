---
title: "Laravel error when sending custom email address using smtp server"
description: "Solving the SSL Handshake Nightmare: Why Your Custom SMTP Email Fails in Laravel As a senior developer working with Laravel applications, configuring..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a senior developer working with Laravel applications, configuring external services like SMTP for sending emails is a fundamental step. However, when dealing with custom or complex mail servers, unexpected connection errors can derail your workflow. You’ve encountered a frustrating error: `SSL operation failed with code 1. OpenSSL Error messages: error:1408F10B:SSL routines:ssl3_get_record:wrong version number`.

This post dives deep into why this specific error occurs when configuring SMTP in Laravel, especially when using custom email addresses, and provides a step-by-step guide to resolving the issue.

## Understanding the Error: SSL Negotiation Failure

The error message you are seeing—`wrong version number` during an SSL operation—is not typically an error within your Laravel code itself, but rather a failure in the initial handshake between your PHP application (via OpenSSL) and the remote SMTP server (`mail.propnex.sg`).

In essence, this means the client and the server could not agree on the security protocol version (TLS/SSL) they should use to establish a secure connection.

### Why Does This Happen?

When setting up an SMTP connection, there are several common reasons for this failure:

1.  **Protocol Mismatch:** The server might be expecting a modern TLS version (like TLS 1.2 or 1.3), but the underlying OpenSSL library or PHP configuration is attempting to negotiate an older or incompatible protocol.
2.  **Authentication Format:** Often, the issue lies in how you are supplying the `MAIL_USERNAME` and `MAIL_PASSWORD`. Many SMTP servers require a specific login format (e.g., separate `user@domain.com` for username and password) rather than using the full email address as the sole username.
3.  **Server Misconfiguration:** The remote server might be improperly configured to handle SSL/TLS negotiation, leading to this generic error when the connection is initiated.

## Debugging Your Laravel SMTP Configuration

Let's look closely at your configuration snippet:

```php
MAIL_HOST=mail.propnex.sg
MAIL_PORT=587
MAIL_USERNAME=xx.xxxxx@propnex.sg // <-- Potential Issue Area
MAIL_PASSWORD=xxxxxxxx
MAIL_ENCRYPTION=ssl
```

The primary suspect here is setting `MAIL_USERNAME` to the full email address (`xx.xxxxx@propnex.sg`). While some systems allow this, standard SMTP usually requires a dedicated login name and password for authentication.

### Step 1: Verify SMTP Credentials with Your Provider

Before touching Laravel, you must confirm the exact credentials provided by your client (Propnex). Ask them specifically:
*   What is the exact SMTP hostname?
*   What is the correct SMTP port (587 or 465)?
*   Does the login require a separate username and password, or can it use the full email address for authentication?

### Step 2: Adjusting the Laravel Configuration

Based on common SMTP practices, try adjusting your configuration. If the server expects a standard username/password structure
