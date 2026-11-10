---
title: "How to change From Name in Laravel Mail Notification"
description: "Title: Simple Guide to Modifying the Sender Name in Laravel Mail Notifications Introduction: Personalized email experiences are essential for effective..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Simple Guide to Modifying the Sender Name in Laravel Mail Notifications

Introduction: Personalized email experiences are essential for effective communication with users of your application. Sometimes, however, you might need to modify the from name displayed in your Laravel mail notifications. In this blog post, we will explore how to change the sender's name in a Laravel-based application, emphasizing the importance of using best practices and following proper coding conventions.

1. Understanding the Problem: The issue discussed here is commonly faced when you want to display your own custom name instead of "Example" as the sender's name in your application's mail notifications.

2. Analyzing the Current Code: Most likely, your Laravel project has defined a default sender's email address and name within the mail configuration file. You can locate this file under the config directory of your Laravel application. The typical location is "config/mail.php." Here's how it might look:

```
'from' => [
    'address' => env('MAIL_FROM_ADDRESS'),
    'name' => env('MAIL_FROM_NAME', 'Example')
],
```

3. Modifying the Mail Configuration File: To change the sender name, you need to edit or create a .env file as follows:

- Create a new ".env" file in the root directory of your Laravel application if one doesn't exist already. This file should contain environment variables for your application.

- Add these environment variables into your ".env" file: MAIL_FROM_ADDRESS and MAIL_FROM_NAME, as shown below. You can update the values with your desired sender details:

```
MAIL_FROM_ADDRESS=your_email@example.com
MAIL_FROM_NAME=Your Company Name
```

4. Testing Your Changes: With the modified .env file in place, run the following command to refresh your Laravel configuration cache and apply the new changes:

```
php artisan config:cache
```

5. Verifying the Result: Send a test mail notification using Artisan's `mail:test` command or create a simple controller method with a 'sendMailNotification' action to test your sender name update. Here is an example code for creating and sending a notification using Mail::to():

```
use Illuminate\Support\Facades\Mail;

class TestController extends Controller
{
    public function sendMailNotification() {
        $mailData = [
            'title' => 'Test Email Subject',
            'body' => 'This is the test email body content.'
        ];

        Mail::to('your_email@example.com')->send(new \Illuminate\Notifications\Messages\MailMessage($mailData));
    }
}
```

6. Conclusion: Now that you have successfully modified and tested your Laravel mail notification sender name, you can confidently deploy the application with a personalized email experience for your users. Follow best practices and maintain application security by using environment variables, rather than hard coding sensitive information within your codebase. Feel free to learn more about Laravel's mailing system on the official documentation and explore our blog posts at https://laravelcompany.com/blog/.
