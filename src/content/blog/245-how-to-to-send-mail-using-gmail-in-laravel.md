---
title: "How to to send mail using gmail in Laravel?"
description: "Title: A Comprehensive Guide on Sending Emails Using Gmail with Laravel Body: For many developers working with Laravel, sending emails from localhost can be..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Google"]
featured: false
---

Title: A Comprehensive Guide on Sending Emails Using Gmail with Laravel
Body:
<p>For many developers working with Laravel, sending emails from localhost can be a challenging task when first tackled. However, fear not; this blog post will walk you through the process of setting up your Laravel application to utilize Gmail as its SMTP server for email sending. We'll discuss configuring your Laravel app, troubleshooting common issues, and optimizing the code for best practices.</p>

<h3>Configure Your Laravel App</h3>
To start, you need to modify your Laravel configuration files and settings for email communication. Firstly, open up the <code>config/mail.php</code> file within your Laravel application and make amends accordingly:

```php
return [
    ....
    'driver' => env('MAIL_DRIVER', 'smtp'),
    'host' => env('MAIL_HOST', 'smtp.gmail.com'),
    'port' => env('MAIL_PORT', 587),
    ...
];
```

Here, the 'driver' is set to smtp, the host to smtp.gmail.com, and the port to 587. These settings are default and should work fine for most users. For more detailed information on these parameters, refer to Laravel's official documentation on mail configuration options: https://laravel.com/docs/mail.

<h3>Enable Less Secure Apps in Gmail Settings</h3>
The next step is to enable "Less Secure Apps" within your Google account settings. This option allows third-party applications, such as Laravel, to send emails using Gmail as an SMTP server without the need for two-factor authentication or authorization codes.

To do this, follow these steps:
1. Log in to your Google account and navigate to https://www.google.com/settings/security.
2. Select "Less secure apps" from the sidebar menu.
3. Toggle on the switch next to "Allow less secure apps".
4. Confirm by clicking "Turn on less secure app access".

<h3>Create a Gmail Application-Specific Password</h3>
Now, you need to create an application-specific password for your Laravel application. This acts as an additional layer of security and is necessary for your code to access the Gmail SMTP server without compromising your account's standard login credentials. Follow these steps:

1. Log in to your Google account at https://www.google.com/settings/security.
2. From the sidebar menu, select "Signing in to Google".
3. Click on the button labeled "App passwords" below the section titled "Managing your accounts' security".
4. Select "Other (Custom name)" and enter a descriptive name for your Laravel application. This will help you keep track of which applications have access to your Gmail account.
5. Click on "Generate" to create a new, application-specific password. Use this password within your <code>.env</code> file as the 'password' value in the mail configuration (refer to the previous code snippet).
6. Save this password in a safe place as you will need it when configuring your Laravel application.

<h3>Configure Your .env File</h3>
Finally, open up your <code>.env</code> file and modify it accordingly:

```bash
MAIL_DRIVER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com  # Replace this with your actual Gmail address
MAIL_PASSWORD=app-specific-password   # Replace with the application-specific password you just created
```

<h3>Testing and Troubleshooting</h3>
To verify if the mail configuration is working as expected, try sending a test email from within your Laravel application. If it fails to send, check that the Gmail settings are correctly enabled in the Google account and that your <code>.env</code> file has been properly updated. Ensure that your Gmail password is correct and corresponds to the application-specific one you previously generated.

If you encounter issues with sending emails from localhost, verify your Laravel version compatibility with the SMTP driver and ensure that both the <code>MAIL_DRIVER</code> and <code>MAIL_HOST</code> values are correctly set up. If your application is running in a remote environment, make sure the SMTP host address matches the Gmail SMTP server's address (e.g., smtp.gmail.com).

<h3>Conclusion</h3>
With these steps, you should now be capable of sending emails using Gmail within your Laravel application. Remember to always double-check your configuration settings and test the functionality before deploying it in a production environment for optimal performance. For further assistance or more information on this topic, feel free to refer to https://laravelcompany.com/blog/sending-emails-using-gmail-with-laravel/.
