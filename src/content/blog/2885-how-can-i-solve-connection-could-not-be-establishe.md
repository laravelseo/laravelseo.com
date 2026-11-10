---
title: "How can I solve \"Connection could not be established with host smtp.gmail.com\"?"
description: "How to Solve \"Connection could not be established with host smtp.gmail.com\" on Staging Servers Dealing with connection errors when sending emails is one of..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["PHP", "Errors"]
featured: false
---

Dealing with connection errors when sending emails is one of the most frustrating hurdles in web development. You can send emails perfectly fine on your local machine, but when deploying to a staging or production server, you encounter cryptic errors like `Connection could not be established with host smtp.gmail.com [Connection timed out #110]`. This usually signals a problem outside of your application code—it's almost always related to networking, firewall rules, or specific SMTP authentication requirements imposed by the mail provider.

As a senior developer, I’ve seen this exact scenario repeatedly. The fact that it works locally but fails on the server points directly to an environmental mismatch between your local environment and your remote hosting environment. Let's break down why this happens and provide a comprehensive solution.

## Understanding the "Connection Timed Out" Error

The error `Connection timed out` means your PHP application (via SwiftMailer or the underlying stream functions) attempted to initiate a TCP connection to `smtp.gmail.com` on port 587, but the server either didn't respond within the allotted time or the connection was blocked somewhere along the network path.

When this occurs on a remote server, the most common culprits are:

1.  **Outbound Firewall:** The server’s outbound firewall (like `iptables` or cloud security groups) is blocking the outgoing connection to external SMTP servers.
2.  **Port Blockage:** A specific port
