---
title: "Authenticator LOGIN returned Expected response code 235 but got code \"535\", with message \"535 Incorrect authentication data \""
description: "Title: Troubleshooting Incorrect Authentication Data Errors During SMTP Email Sending in Laravel Applications Body: Hi i am trying to send emails in laravel...."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Errors"]
featured: false
---

Title: Troubleshooting Incorrect Authentication Data Errors During SMTP Email Sending in Laravel Applications

Body:

Hi i am trying to send emails in laravel. But when trying to send it is generating following error and mails are not sending. But everything worked fine in localhost without any problems. This issue can be quite frustrating, especially if you're new to Laravel or email configuration. Thankfully, there are several reasons why this could happen, and by addressing each one, we can ensure the smooth functioning of your application.

Firstly, it is crucial to understand that the error message "535 Incorrect authentication data" indicates that either the SMTP server is rejecting your credentials or your application code is not providing the correct username and password. To investigate this further, follow these steps:

1. Confirm the validity of your SMTP credentials: Make sure you are using a correct email address (`MAIL_USERNAME`) and its corresponding password (`MAIL_PASSWORD`) in your .env file. If you're unsure about your credentials, try sending emails from another account or resetting your email password.

2. Verify SMTP port and encryption settings: Ensure that the mail configuration in your .env file is accurate. The default configuration should be `MAIL_DRIVER=smtp`, `MAIL_HOST=smtp.gmail.com`, `MAIL_PORT=587`, `MAIL_ENCRYPTION=tls`. If you're using a different SMTP service, adjust the hostname and encryption accordingly.

3. Try a different driver: Laravel supports various email drivers, including SendGrid, Mailgun, or Mandrill. If the issue persists with the default SMTP driver, consider switching to one of these alternative services and configuring your application accordingly. This may help diagnose if the problem is related to server-side issues or your particular setup.

4. Test your credentials on the command line: To further isolate the source of the issue, you can try sending emails from the command line's mail function. Connect to your server using SSH and run `php artisan tinker`, then enter the following commands:

   a. `\Illuminate\Support\Facades\Mail::raw('Your test email content', function ($message) { $message->from('no-reply@lifelove.com', 'LifeLoveAndOtherThings'); $message->subject('Test Email Subject'); });`
   b. `Mail::to('youremail@example.com')->send($email);`
   c. `\Artisan::call('mail:test', ['--queue' => false]);`

If these commands return emails successfully, then the issue is most likely related to Laravel code or configuration. Otherwise, there may be a wider server-side problem that requires further investigation.

In conclusion, troubleshooting SMTP authentication errors in Laravel applications involves ensuring correct credentials and settings. If the above steps fail to resolve your issues, you should consider consulting professional Laravel developers for expert assistance. Be sure to maintain proper email configuration and test your application regularly to avoid future issues with sending emails and maintaining smooth communication channels with users.
