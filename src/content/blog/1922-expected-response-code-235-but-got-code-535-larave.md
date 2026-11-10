---
title: "Expected response code 235 but got code 535 laravel send email using office365 smtp"
description: "Title: Solving Common Issues with Office365 SMTP and Laravel Email Sending Introduction: Email is an essential aspect of most web applications, and using an..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content"]
featured: false
---

Title: Solving Common Issues with Office365 SMTP and Laravel Email Sending

Introduction:
Email is an essential aspect of most web applications, and using an external email service like Office365 for sending emails can provide better security and flexibility. However, sometimes issues arise that cause the email to fail. In this blog post, we will explore how to identify and correct some common problems you may encounter when setting up Laravel for Office365 SMTP authentication.

Solution 1: Checking Email Credentials
The first step in troubleshooting Office365 SMTP email issues is ensuring that the credentials provided are valid. Double-check your `MAIL_USERNAME` and `MAIL_PASSWORD` values in the .env file to verify they are correct. Additionally, make sure you have enabled IMAP access for your account by logging into Office365 and visiting the app settings page.

Solution 2: Authenticator Issues
In some cases, SMTP servers may expect a certain authentication protocol. In our example (LOGIN), we are using the SwiftMailer package to authenticate with the server. Make sure that the email address you're authenticating with in your code matches the one specified in the .env file. If they don't match, change them both accordingly.

Solution 3: Port and Encryption Settings
Ensure that your `MAIL_PORT` value is set to 587 for Office365 SMTP as it uses TLS encryption on this port. Additionally, check if the encryption method you are using in the .env file matches what your server expects (eg, `TLS`, `SSL`, or `STARTTLS`). For Office365, use `TLS`.

Solution 4: Mail Driver Configuration
Laravel supports different drivers for sending emails. Ensure that your `MAIL_DRIVER` setting is set to 'smtp' since you are using Office365 SMTP configuration. This will provide the necessary settings for authenticating with the server and sending emails effectively.

Solution 5: Checking Email Content
The issue you mentioned could also be related to your email content. Sometimes, content blocks or images may cause formatting issues that can lead to authentication errors. Ensure that your email template is clean and valid HTML without any potential security threats (such as JavaScript code). You can use an HTML validation tool like W3C's to verify the content before sending the email.

Final Checklist:
To summarize, here are some steps you should follow when troubleshooting Office365 SMTP authentication issues in Laravel applications:
1. Double-check your credentials and ensure IMAP access is enabled.
2. Ensure that the email address used for authentication matches your .env file setting.
3. Set `MAIL_PORT` to 587, `MAIL_DRIVER` to 'smtp', and enable TLS encryption.
4. Use a clean and valid HTML template for your emails.

Conclusion:
By following these steps and best practices, you should be able to effectively troubleshoot common issues with Office365 SMTP authentication in Laravel applications. If the problem persists, consider reaching out to Office365 support or Laravel community for guidance on advanced troubleshooting techniques.

Remember that it is always a good practice to test your application on multiple environments, such as local and production servers, before moving into live deployment. This ensures optimal performance across all operating conditions.
