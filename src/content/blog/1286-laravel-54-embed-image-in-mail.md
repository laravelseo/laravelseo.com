---
title: "laravel 5.4 embed image in mail"
description: "Title: Embedding Images in Laravel 5.4 Emails: A Comprehensive Guide Body: In recent versions of the popular PHP framework Laravel, there has been an..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Title: Embedding Images in Laravel 5.4 Emails: A Comprehensive Guide

Body:
<p>In recent versions of the popular PHP framework Laravel, there has been an increasing emphasis on providing a seamless user experience to facilitate communication between applications and users. One such feature is the capability to embed images in emails sent using Laravel's mail functionality.</p>

<p>The official documentation provides a straightforward approach to achieve this, as per the given example code:</p>

<pre><code>&lt;img src="{{ $message-&gt;embed(public_path().'/img/official_logo.png') }}"&gt;
</code></pre>

<p>However, you may encounter an error when trying to embed images in emails sent from your Laravel 5.4 application. This is often because the Mailable class, which is used to handle email communication with users, does not have direct access to the $message variable. Instead, it uses a different variable called $this.</p>

<p>To remedy this issue, you can make the necessary adjustments in your application code. First, let us examine how you are calling the mail function:</p>

<pre><code>&lt;?php
    \Mail::to($user)-&gt;send(new WelcomeCandidate($user, $request-&gt;input('password')));
?>
</code></pre>

<p>Here, you are using the Mail facade to send an email by calling the 'send' method. The argument passed is a new instance of your WelcomeCandidate class that inherits from Mailable.</p>

<p>To embed images in this scenario, you should first declare a variable inside your WelcomeCandidate class and then make it accessible as shown below:</p>

<pre><code>&lt;?php
    namespace App\Mail;

    use Illuminate\Bus\Queueable;
    use Illuminate\Mail\Mailable;
    use Illuminate\Queue\SerializesModels;
    use Illuminate\Contracts\Queue\ShouldQueue;

    // Import the message variable from Laravel's default Mailable class
    use Illuminate\Mail\Message;

    // Add a new property to your WelcomeCandidate class
    public $message;

    ...

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(User $user, $password)
    {
        // Add the inherited message variable from Mailable class and assign it to your custom $message property
        $this-&gt;message = Message::create([
            'subject' => 'Welcome!',
        ]);
        $this-&gt;user = $user;
        $this-&gt;password = $password;
    }

    ...
</code></pre>

<p>Once this is done, you can now use your custom $message property to embed images in the email template as follows:</p>

<pre><code>&lt;img src="{{ $this-&gt;message-&gt;embed(public_path().'/img/official_logo.png') }}"&gt;
</code></pre>

<p>By making the necessary adjustments and leveraging the features provided by Laravel 5.4, you can seamlessly embed images in your emails without causing any errors or issues for your users.</p>

<p><strong>Conclusion:</strong> Embedding images in Laravel 5.4 emails requires understanding the relationship between various classes and properties within the framework and ensuring that they are properly configured to facilitate email communication. By following the steps described above, you can successfully embed images in your mailing system while providing a smooth user experience.</p>
