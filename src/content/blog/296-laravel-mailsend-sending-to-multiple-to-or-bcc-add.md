---
title: "Laravel Mail::send() sending to multiple to or bcc addresses"
description: "Title: Sending Emails with Multiple Recipients Using Laravel's Mail::send() Method Body: You might have encountered some difficulties when using Laravel's..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content"]
featured: false
---

Title: Sending Emails with Multiple Recipients Using Laravel's Mail::send() Method

Body: You might have encountered some difficulties when using Laravel's <code>Mail::send()</code> method to send emails to multiple recipients (both to and BCC). This blog post aims to provide a comprehensive explanation on how to approach this issue, as well as offer best practices for your Laravel applications.

First, let's take a closer look at the two options you tried:

1. Chaining
   <pre><code>// for example
$emails = array("myemail1@email.com", "myemail2@email.com");
$input = Input::all();

Mail::send('emails.admin-company', array('body' => Input::get('email_body')), 
function($message) use ($emails, $input) {
    $message
    -&gt;from('admin@admin.org', 'Administrator')
    -&gt;subject('Admin Subject');

        foreach ($emails as $email) {
            $message->to($email);
        }
});</code></pre>
   In this case, you are chaining the function calls to set the recipient's email address. While this works for a single recipient, it fails when sending emails to multiple recipients since the <code>Mail::send()</code> method requires an array of recipients as the first argument.

2. Passing an Array
   <pre><code>// for example
$emails = array("myemail1@email.com", "myemail2@email.com");
$input = Input::all();

Mail::send('emails.admin-company', array('body' => Input::get('email_body')), 
    function($message) use ($emails, $input) {
        $message
        -&gt;from('admin@admin.org', 'Administrator')
        -&gt;subject('Admin Subject');

        $message->to($emails);
});</code></pre>
   In this case, you tried passing an array of email addresses as the recipients but ended up with failure messages and returned <code>Mail::failures()</code>. This is expected behavior since Laravel's API documentation states that the <code>to()</code> method should be passed a string or array rather than an object containing multiple properties, like a <code>Message</code> instance.

Now let's address your problem and provide the correct solution:

1. Use separate methods for each recipient type (to, cc, bcc)
   Instead of using Laravel's built-in <code>Mail::send()</code> method with extra chaining or array passing, you should use separate methods for each recipient type. This will remove the issue of passing an object and make your code cleaner.
   
   For example:
   <pre><code>$to = array("myemail1@email.com", "myemail2@email.com");
   $cc = array(); // add any cc recipients if needed
   $bcc = array("secretrecipient@example.com");

   Mail::send('emails.admin-company', array('body' => Input::get('email_body')), 
       function($message) use ($to, $cc, $bcc) {
           $message
           -&gt;from('admin@admin.org', 'Administrator')
           -&gt;subject('Admin Subject');

           $message->to($to); // add multiple to recipients
           $message->cc($cc); // add cc recipients if needed
           $message->bcc($bcc); // add bcc recipients
       });</code></pre>
2. Understand the API better
   The Laravel documentation states that <code>to()</code>, <code>cc()</code>, and <code>bcc()</code> methods should be used with strings or arrays of email addresses rather than an object representing a message like $message. Make sure to follow these guidelines to avoid any issues.
  
   
The provided solutions above should help you successfully send emails to multiple recipients using Laravel's <code>Mail::send()</code> method, enabling you to chain the method calls or pass an array of addresses as required. Just ensure your understanding of the API and use separate methods for each recipient type when necessary.

Remember, always check the documentation thoroughly and look for best practices before attempting any solution. You can also refer to Laravel's extensive <a href="https://laracasts.com">video tutorial library</a> and community support on platforms like <a href="https://stackoverflow.com/questions/tagged/laravel">Stack Overflow</a>.

For a more in-depth understanding of this topic, check the Laravel documentation about <a href="http://laravel.com/docs/5.7/mail">Mail Handling</a> and how to <a href="http://laravel.com/docs/5.7/mail#creating-emails">create emails</a>. You'll find useful examples and guidelines on handling multiple recipients, attachments, content, and more.

By following these steps and improving your understanding of Laravel's API, you will be better equipped to tackle any potential issues while working with mail functionality in your Laravel applications.
