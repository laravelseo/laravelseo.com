---
title: "Laravel mail does not comply with RFC 2822, 3.6.2"
description: "Decoding the Error: Why Laravel Mail Fails on RFC 2822 Compliance for Multiple Recipients As senior developers working with email systems, we often encounter..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Errors"]
featured: false
---

As senior developers working with email systems, we often encounter subtle yet frustrating errors that stem from the complex standards governing communication protocols. Recently, I came across a common stumbling block when using Laravel’s `Mail` facade to send emails to multiple recipients—specifically, errors related to RFC 2822 compliance regarding address lists.

If you are attempting to use methods like `cc()` or `bcc()` with an array of addresses and receive the cryptic error: "Address in mailbox given [2@test.com,3@test.com,4@test.com] does not comply with RFC 2822, 3.6.2," you are hitting a fundamental limitation in how email headers must be structured.

This post will dissect why this happens and provide the robust solution to ensure your mass email delivery is compliant and reliable within the Laravel ecosystem.

## The Anatomy of the Problem: RFC 2822 and Email Addresses

The error message points directly to the structure of the email header itself, specifically how multiple recipients are listed in the `To`, `CC`, or `BCC` fields. RFC 2822 defines the syntax for email addresses. When a single header field (like `To:`) contains multiple recipients, these recipients must be separated according to strict rules.

The issue arises when you concatenate multiple email addresses into a single string—as you are doing with comma-separated values—and pass that entire string to the underlying mailer function. The mailer interprets this concatenated string as a single, invalid mailbox address rather than an instruction to distribute the message to several
