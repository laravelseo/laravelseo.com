---
title: "stream_socket_enable_crypto(): Peer certificate CN=`<hostname>' did not match expected CN=`smtp-relay.sendinblue.com'"
description: "Deciphering SMTP SSL Errors in Laravel: Troubleshooting stream socket enable crypto() As a senior developer working with modern PHP frameworks like..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a senior developer working with modern PHP frameworks like Laravel, we often encounter subtle but frustrating errors when dealing with external services, especially those involving secure protocols like SMTP. The error message you are seeing—`stream_socket_enable_crypto(): Peer certificate CN=\`\<hostname>\' did not match expected CN=\`smtp-relay.sendinblue.com'`—is a classic indicator of an SSL/TLS handshake failure related to certificate validation during the connection attempt.

This post will dissect this specific error in the context of your Laravel mail configuration, provide a step-by-step diagnosis, and offer robust solutions to ensure your application can reliably send emails.

---

## Understanding the Certificate Mismatch Error

The core issue lies in the server attempting to establish a secure connection (TLS/SSL) with the SMTP host (`smtp-relay.sendinblue.com`). For this connection to be secure and trustworthy, the server must present a certificate whose Common Name (CN) or Subject Alternative Name (SAN) exactly matches the hostname you are trying to connect to.

When PHP (or the underlying stream socket layer) encounters this mismatch, it throws an error because the identity presented by the certificate does not align with the host specified in your configuration. In simple terms: **The server is saying, "I am X," but the client expected "Y."**

This usually points to one of three primary problems:
1.  **Incorrect Hostname:** The hostname configured in your application doesn't match what the SMTP server presents.
2.  **Certificate Issue:** The certificate itself is misconfigured, expired, or issued for a different domain.
3.  **Man-in-the-Middle (MITM) Interference:** Something is intercepting the traffic, causing the validation to fail.

## Diagnosing Your Laravel Mail Configuration

Let's examine the configuration you provided:

```php
// .env file excerpt
MAIL_HOST=smtp-relay.sendinblue.com
MAIL_ENCRYPTION=tls

// config/mail.php excerpt
'smtp' => [
    'host' => env('MAIL_HOST', 'smtp.mailgun.org'), // Note: This line uses a fallback, but the failure happens when connecting to sendinblue.com
    // ... other settings
],
```

The error specifically mentions `expected CN=\`smtp-relay.sendinblue.com'`. This implies that whatever process is performing the connection is expecting the certificate presented by the server to be for `smtp-relay.sendinblue.com`.

### Step 1: Verify Hostname Consistency

The most critical step is ensuring absolute consistency between your `.env` configuration and the actual endpoint you are connecting to.

**Action:** Double-check that `MAIL_HOST` in your `.env` file is *exactly* what Sendinblue requires for SMTP relay, which appears to be `smtp-relay.sendinblue.com`. If there are any typos, extra spaces, or incorrect protocol prefixes, the mismatch will occur.

### Step 2: Check Server Certificate Integrity
