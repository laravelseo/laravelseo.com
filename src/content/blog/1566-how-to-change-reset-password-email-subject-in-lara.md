---
title: "How to change reset password email subject in laravel?"
description: "Title: Customizing Laravel's Default Reset Password Email Subject Introduction Laravel is a powerful PHP framework that provides many features out of the..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "HTML", "PHP"]
featured: false
---

Title: Customizing Laravel's Default Reset Password Email Subject

Introduction
Laravel is a powerful PHP framework that provides many features out of the box. As a beginner, you may need to customize certain aspects of your application, including changing the subject line for password reset emails sent from your app. In this blog post, we will guide you through the process.

Prerequisites
Before modifying the email subject, make sure you have installed Laravel 5.3 and configured the SMTP settings for sending emails using Gmail (or another email provider). Additionally, you need to scaffold your authentication by running the command `php artisan make:auth`. If it's not already set up, follow this guide from Laracasts on setting up your project for password resets.

Changing the Reset Password Email Subject
To change the default email subject line "Reset Password", you need to modify the mail template and override the function that sends the reset link. 

1. Open the `/resources/views/emails` folder and locate the file called `password/reset.blade.php`. You will find the HTML code for the password reset email, including the subject line. Make changes to the subject as desired. For example: replace "Reset Password" with your preferred subject like "Password Reset Notification".

2. In the same folder, create a new file called `reset_link_email.php` and add the following code:

   ```php
    <?php namespace Illuminate\Auth;

       class SendResetLinkEmail extends Mailable {
           public $token;

           /**
            * Create a new instance.
            *
            * @return void
            */
           public function __construct($email, $token)
           {
               // Pass the email and token to the constructor, which will be used in the view
               $this->to($email)->subject('Your custom subject line here');
               $this->token = $token;
           }

           /**
            * Build the message.
            *
            * @return $this
            */
           public function build()
           {
               // Return the modified content of the email template with your new subject line
               return $this->view('auth.passwords.reset_link')->subject($this->subject)->with(array('token' => $this->token, 'email' => $this->toEmail()));
           }
       }
   ```

3. In the `/app/Http/Controllers/Auth` folder, open `ForgotPasswordController.php` and locate the function `sendResetLinkEmail`. Replace it with this code:

   ```php
    public function sendResetLinkEmail($email) {
       // Get the password broker instance for resetting passwords
       $broker = app('password.broker');
       $response = $broker->sendResetLink($email);

       return new SendResetLinkEmail($email, $response->getToken());
    }
   ```

4. Finally, in `ForgotPasswordController.php`, replace the line `return view('auth.passwords.reset')->with(...` with this:

   ```php
       return app('middleware.send.resetlink')($email)->view('auth.passwords.reset');
   ```

By following these steps, you have successfully changed your default reset password email subject line to a custom one. If you need further assistance or more detailed examples, refer to the resources mentioned at the beginning of this blog post. Happy coding!
