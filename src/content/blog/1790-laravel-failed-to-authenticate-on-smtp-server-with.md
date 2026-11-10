---
title: "Laravel - Failed to authenticate on SMTP server with username"
description: "Title: Troubleshooting SMTP Authentication Issues in Laravel Applications Body: When using Laravel 5.8 to send notifications, you might encounter an..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Google", "Errors"]
featured: false
---

Title: Troubleshooting SMTP Authentication Issues in Laravel Applications

Body:

When using Laravel-5.8 to send notifications, you might encounter an authentication issue on your SMTP server that results in a failure. The error message may appear similar to this one:

<pre><code>Failed to authenticate on SMTP server with username "noblemfd@gmail.com" using 3 possible authenticators. Authenticator LOGIN returned Expected response code 23 ▶
535 5.7.8  https://support.google.com/mail/?p=BadCredentials n13sm8684140wmd.21 - gsmtp
". Authenticator PLAIN returned Expected response code 235 but got code "535", with message "535-5.7.8 
Username and Password not accepted. Learn more at
535 5.7.8  https://support.google.com/mail/?p=BadCredentials n13sm8684140wmd.21 - gsmtp
". Authenticator XOAUTH2 returned Expected response code 250 but got code "535", with message "535-5.7.8 
Username and Password not accepted. Learn more at
535 5.7.8  https://support.google.com/mail/?p=BadCredentials n13sm8684140wmd.21 - gsmtp
</code></pre>

In such a scenario, follow these steps to resolve the issue:

1. Check Your Environment Variables: Make sure your .env file is correctly configured with proper SMTP credentials. In this case, your configuration is as follows:

<pre><code>MAIL_DRIVER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_USERNAME=noblemfd@gmail.com
MAIL_PASSWORD=**** # Replace with your actual password
MAIL_ENCRYPTION=ssl</code></pre>

2. Change SMTP Port and SSL/TLS Settings: Modify the port number (MAIL_PORT) and encryption type (MAIL_ENCRYPTION) to ensure they match the SMTP server configuration. For Gmail, the default port is 587, but you might need to try other ports like 465 for secure connections with SSL/TLS.

3. Try Different Authentication Methods: If the initial authentication failed, try using different methods. Laravel supports multiple authentication mechanisms such as LOGIN, PLAIN, and XOAUTH2. Enable all of them by setting the following in your .env file:

<pre><code>MAIL_PLUGIN=loginsmtp,plainsmtp,xoauth2smtp</code></pre>

4. Allow Less Secure Apps Access: Sometimes, email providers like Gmail may block less secure app access due to security reasons. Ensure that you have enabled this setting in your Google account by following these steps:

1. Go to https://myaccount.google.com/security.
2. Scroll down and check the box next to "Allow less secure apps."
3. Click Save Changes at the bottom of the page.

5. Reconfigure SMTP Credentials in Laravel: If none of these steps worked, you might need to reconfigure your SMTP credentials. Ensure that your username (MAIL_USERNAME) and password (MAIL_PASSWORD) are correct. In some cases, using an app-specific or API key could also be helpful.

6. Test Your Configurations: After making all the necessary changes, test your configurations to see if you can send a simple email from your Laravel application. If the tests fail, double-check your settings and consult the documentation for any additional troubleshooting tips.

7. Seek Help and Support: If you are still unable to authenticate on the SMTP server, reach out to your hosting provider or email service provider's support team for further guidance. They can provide valuable insights into their specific infrastructure and help you resolve the issue.

Conclusion: Authenticating with an SMTP server can sometimes be challenging due to various configurations and security measures. By following these steps, you should be able to identify and resolve any authentication issues in your Laravel-based applications. Remember to always keep your environment variables updated with accurate information and seek support when needed.
