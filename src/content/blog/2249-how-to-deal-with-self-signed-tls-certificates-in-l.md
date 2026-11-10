---
title: "How to deal with self-signed TLS certificates in Laravel's SMTP driver?"
description: "Title: Tackling SSL Certificate Issues with Self Signed TLS in Laravel's SMTP Driver Body: Dealing with self signed TLS certificates can be quite a..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "PHP", "Errors"]
featured: false
---

Title: Tackling SSL Certificate Issues with Self-Signed TLS in Laravel's SMTP Driver

Body:

Dealing with self-signed TLS certificates can be quite a challenge, especially when working with Laravel's SMTP driver. Self-signed certificates are often used for testing purposes during development or by small businesses that do not have the resources to acquire trusted SSL certificates from reliable Certificate Authorities (CA). However, it is essential to understand how to mitigate these self-signed certificate issues and ensure smooth email delivery using Laravel's SMTP driver.

First, you must understand that Laravel's default behavior requires valid SSL/TLS certificates. This means your SMTP server must possess a valid and trusted SSL certificate for secure communication between the PHP script running on your Laravel application and its email server. The error message "stream_socket_enable_crypto(): SSL operation failed with code 1. OpenSSL Error messages: error:14090086:SSL routines:SSL3_GET_SERVER_CERTIFICATE:certificate verify failed" indicates that the connection to your SMTP server failed due to the certificate verification failure.

To fix this issue, you have multiple options. The most recommended approach is to obtain a trusted SSL certificate from a reputable Certificate Authority (CA). This process can be expensive but offers the best security and peace of mind for your email communications. However, we will assume that obtaining a trusted certificate is not an option for you.

In this case, using Laravel's SMTP driver with a self-signed SSL certificate requires some additional configuration. The first step would be to generate a self-signed certificate using OpenSSL or any other similar tool. Here is a basic example:

```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout key.pem -out cert.pem -config openssl.cnf
```

This will generate a self-signed certificate in the "cert.pem" file and a private key in the "key.pem" file. The "-x509", "-nodes", "-days 365", "-newkey rsa:2048", and "-out_private key.pem" options are used to create a self-signed certificate with an expiry date of one year, using RSA encryption with a key length of 2048 bits.

Next, you should set the SMTP configuration in your Laravel application's '.env' file. Ensure that the "ssl" option is set to "false", indicating that self-signed certificates will not be validated during email communication:

```env
MAIL_DRIVER=smtp
MAIL_HOST=mail.mydomain.com
MAIL_PORT=26
MAIL_FROM_ADDRESS='mailer@mydomain.com'
MAIL_FROM_NAME='Mailer'
MAIL_USERNAME=mailer
MAIL_PASSWORD=secret
MAIL_ENCRYPTION=tls
MAIL_SSL_VERIFY=false
```

Although setting the "ssl_verify" option to "false" will disable SSL certificate verification, it is not considered a secure solution. It is recommended that you acquire a trusted SSL/TLS certificate for use with your SMTP server and Laravel's SMTP driver. However, if this is not feasible at the moment, using self-signed certificates in conjunction with disabling SSL certificate validation provides an acceptable alternative.

Remember to always keep your security measures up-to-date by regularly updating your software and ensuring that you take necessary measures such as using strong passwords, encrypting data, and deploying a VPN. In cases where SSL certificate verification is disabled due to the use of self-signed certificates, ensure that you communicate any risks associated with this configuration choice to your organization or clients.
