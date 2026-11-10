---
title: "replace password reset mail template with custom template laravel 5.3"
description: "Title: Customizing Password Reset Email Templates in Laravel 5.3: A Comprehensive Guide Body: You've utilized the php artisan make:auth command, and your..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "HTML", "PHP"]
featured: false
---

Title: Customizing Password Reset Email Templates in Laravel 5.3: A Comprehensive Guide

Body:
<p>You've utilized the <code>php artisan make:auth</code> command, and your authentication system is almost working as expected. Now, you wish to modify the Forgot Password functionality by sending a customized template via email. In this article, we will guide you through the steps on how to change the default template with a custom one in Laravel 5.3.</p>

<h2>Locating the Default Template</h2>
<p>The password reset process involves two main components: the Mailer class and the Password Reset Controller. To modify the content of the email, we first need to locate where this data is being passed. In Laravel 5.3, the default template for the forgot password email can be found within the /vendor/laravel/framework/src/Illuminate/Auth/Email/Password/ConfirmToken.php file.</p>

<h2>Customizing the Template</h2>
<p>Now that you've located the default template, it is time to create your custom template. Your new template should contain all of the HTML elements you wish to appear in the final email. You can either copy and paste this content into an existing file or create a new one in your project directory. It is advised to follow best practices by creating a dedicated folder for emails within your application. Let's assume that you have created your folder at /resources/views/emails.</p>

<h2>Configuring the Mailer</h2>
<p>Next, we need to configure our custom template in the Mailer class. Open the /vendor/laravel/framework/src/Illuminate/Mail/Mailer.php file and locate the $forceSwift to false line. Modify this setting such that it reads <code>const FORCE_SWIFT = false;</code>. This will prevent Laravel from automatically using SwiftMailer for all email functionality, allowing us to replace the default template with our custom one.</p>

<h2>Modifying the Password Reset Controller</h2>
<p>Now that you've changed the configuration settings, we need to update the PasswordResetController.php file located within /app/Http/Controllers/Auth/Password. At line 85, you will find a piece of code that looks like this: <code>$user = User::find($id);</code>. Replace this line with the following: <code>$user = User::find($id); Mail::send('emails.custom_reset_mail', ['url' => $link], function ($message) use ($email, $token) {
      $message->to($email)
            ->subject(config('app.name').' - Reset Your Password')
            ->from(config('mail.from.address'), config('mail.from.name'))
            ->replace('http://localhost/', 'http://'.request()->getHttpHost().request()->getPathInfo());
    });</code>. This code will call the mail function, passing in your custom template file (custom_reset_mail) and all required parameters.</p>

<h2>Testing Your Changes</h2>
<p>Lastly, let's test your changes. Run <code>php artisan migrate:fresh --seed</code> to reset your database, then run the authentication command again using <code>php artisan make:auth</code>. Remember to log out and try the forgot password feature to see if the custom template is used instead of the default one. If everything works as intended, you can now celebrate this new achievement in Laravel 5.3!</p>

<h2>Conclusion</h2>
<p>Customizing your password reset email templates offers a professional and unique touch to your application. With these steps and the provided code snippets, you now have a clear understanding of how to modify the default Laravel template and configure it to work with your customized version. Keep in mind that this process may vary depending on your specific project setup. Happy coding!</p>

Remember to incorporate backlinks from the text: https://laravelcompany.com/blog/custom-password-reset-email-templates-in-laravel-53 and include relevant code examples or best practices within the body of the article.
