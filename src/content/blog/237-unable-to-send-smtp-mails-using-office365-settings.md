---
title: "Unable to send SMTP mails using office365 settings"
description: "Title: Troubleshooting SMTP Mail Issues with Office 365 for Laravel Developers Introduction: Laravel is a popular PHP framework that makes web application..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

Title: Troubleshooting SMTP Mail Issues with Office 365 for Laravel Developers

Introduction:
Laravel is a popular PHP framework that makes web application development easier by providing various built-in features, including a powerful mailing system. Integrating your app with an office365 mail server can pose challenges, as it often requires thorough research and understanding of the underlying issues. In this blog post, we will delve deeper into these problems and provide solutions for sending SMTP mails using Office 365 settings in Laravel.

1. Understanding the Error Message:
The error message "554 5.2.0 STOREDRV.Submission.Exception:SendAsDeniedException.MapiExceptionSendAsDenied; Failed to process message due to a permanent exception with message Cannot submit message" indicates that there's something preventing the mail from being sent through your Office 365 account. It could be because of security measures, restrictions on sending emails from non-client devices or even incorrect configuration settings in the SMTP server.

2. Confirming Authentication:
Ensure you are using the correct credentials (username and password) for your Office 365 mailbox. For added security, check if the IMAP or POP3 authentication has been enabled on your account. You can do this by logging into your Office 365 account and navigating to Settings > Mail > Account > Automatic configuration settings > Outgoing server requirements.

3. Checking SMTP Server Authentication:
Ensure that the SMTP server is authenticated using TLS encryption. TLS stands for Transport Layer Security, which provides secure communication between your application and Office 365 mail server. To enable this, modify your .env file as follows:

    MAIL_DRIVER=smtp
    MAIL_HOST=smtp.office365.com
    MAIL_PORT=587
    MAIL_USERNAME='username@domain.com' // Your email address
    MAIL_PASSWORD=password
    MAIL_ENCRYPTION=tls

4. Enabling SMTP Relay:
SMTP relay is an essential component for sending emails through Office 365 mail servers. In some instances, the system may have been configured to restrict relaying outbound messages from non-Office 365 addresses. To enable this feature on your server, follow these steps:

a) Log in to your Office 365 portal.
b) Click Settings > Exchange Admin Center.
c) Go to Mail Flow > Delivery.
d) Select the checkbox that says 'Enable SMTP Relay for Outlook and non-Outlook apps'.
e) Save changes.

5. Configuring SPF Records:
SPF (Sender Policy Framework) is a critical measure to minimize email spoofing by specifying which mail servers are authorized to send emails on behalf of your domain. If your domain or website is hosted elsewhere, you may need to adjust the settings to allow Laravel's server as a valid sender. To do this:

a) Log in to your DNS provider's portal.
b) Navigate to the appropriate records section (e.g., 'Domain Settings' for GoDaddy).
c) Modify or create an SPF record that includes both Google Apps (or Office 365 if you have set it up) and your Laravel server. For example:

    v=spf1 a mx include:google.com include:_spf.google.com include:_spfs.microsoft.com ~all

   - This record uses the '~' wildcard at the end, which allows all mail servers not listed in the record to send emails on behalf of the domain but with reduced confidence. You can change this as needed for better security.

6. Configuring DKIM and DMARC:
DKIM (Domain Keys Identified Mail) and DMARC (Domain-based Message Authentication, Reporting & Conformance) are additional email authentication measures designed to prevent spam and phishing emails. To configure these settings for Office 365, follow the instructions provided in this guide:
<a href="https://docs.microsoft.com/en-us/exchange/mail-flow/manage-dmarc/configure-dmarc" rel="noreferrer">Configuring DMARC for Office 365</a>

7. Testing and Troubleshooting Email Delivery:
After implementing these measures, test your application's email functionality to ensure the issue has been resolved. If problems still persist, review your configuration settings, check for any errors in mailer logs, and consult with Office 365 support to further investigate potential issues.

Conclusion:
Sending SMTP mails using Office 365 can be challenging without the correct understanding of authentication and email delivery protocols. By following these steps and ensuring proper configuration settings, you'll be able to successfully send emails from your Laravel application while keeping security measures in place. If you continue facing issues despite implementing all these suggestions, consider reaching out to Office 365 support for further assistance or seeking external resources on the matter.
