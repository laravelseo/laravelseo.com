---
title: "Laravel send email, error: Argument 2 passed to"
description: "Fixing the Laravel Email Error: Understanding Argument 2 passed to Illuminate\\Mail\\Mailer::send() As a senior developer working with the Laravel ecosystem,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

As a senior developer working with the Laravel ecosystem, you often encounter seemingly simple errors that hide deeper misunderstandings about how facades and classes interact. The error you are facing—`FatalThrowableError in Mailer.php line 149: Type error: Argument 2 passed to Illuminate\Mail\Mailer::send() must be of the type array, object given`—is a classic example of a type mismatch. It signals that the data structure you provided to the `Mail::send()` method does not conform to what the underlying mailer expects.

This post will dive deep into why this error occurs when sending emails in Laravel and show you the correct, robust way to handle transactional emails using Mailable classes, ensuring your code is clean, maintainable, and adheres to best practices outlined by the [Laravel documentation](https://laravelcompany.com/docs).

## The Root Cause: Data vs. Mailable Objects

The error arises because the `Mail::send()` method expects arguments that represent actual **Mailable objects** or a specific structure defined within Laravel’s mailer system, not just raw associative arrays containing data intended for message construction.

In your original code snippet, you were attempting to pass an array directly as the first argument:
```php
Mail::send(['name' => $name], function ($message) use (...) { /* ... */ });
```
Laravel’s mailer mechanism expects specific objects (Mailable classes) that define *what* data should be sent and *how* it should be formatted. When you pass a simple array, the internal type checker throws an error because it cannot interpret that array as a valid Mailable structure for sending.

## The Best Practice: Embracing Mailable Classes

The most robust and scalable way to handle email sending in Laravel is by utilizing **Mailable classes**. A Mailable class encapsulates all the necessary logic for constructing the email content, including defining the sender, recipient, subject, and attachments. This separation of concerns makes your code cleaner and easier to debug, aligning perfectly with how modern application architecture should be designed.

### Step 1: Create the Mailable Class

First, define a dedicated class that will handle the email structure. For a registration confirmation, we'll create a simple class.

```php
// app/Mail/RegistrationMail.php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class RegistrationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $userName;
    public $temporaryPassword;

    /**
     * Create a new Mailable instance.
     */
    public function __construct($name, $password)
    {
        $this->userName = $name;
        $this->temporaryPassword = $password;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('Rejestracja Magazyn')
                    ->from('us@example.com', 'System Magazyn')
                    ->view('emails.registration_details') // Assuming you create a Blade view
                    ->with([
                        'user_name' => $this->userName,
                        'temp_password' => $this->temporaryPassword,
                    ]);
    }
}
```

### Step 2: Correctly Send the Email

Now, instead of passing raw data to `Mail::send()`, you instantiate your Mailable class and pass the necessary dynamic data to its constructor. This satisfies the requirements of the Mailer facade.

Here is how you would integrate this fix into your controller method:

```php
use Illuminate\Support\Facades\Mail;
use App\Mail\RegistrationMail; // Import your new Mailable

public function store(CreateUserRequest $request)
{
    $name = Input::get('name');
    $imie = Input::get('imie');
    $nazwisko = Input::get('nazwisko');
    $email = Input::get('email');
    $password = Input::get('password');

    // 1. Save the user first (Crucial step!)
    $user = User::create([
        'name' => $name,
        'imie' => $imie,
        'nazwisko' => $nazwisko,
        'email' => $email,
        // Store hashed password here!
    ]);

    // 2. Send the email using the Mailable object
    Mail::send(new RegistrationMail($name, $password));

    Session::flash('addUserOK', 'Użytkownik dodany poprawnie.');
    return redirect('user');
}
```

## Conclusion: Clean Code Wins

The error you encountered is a valuable lesson: always use the intended architectural pattern provided by the framework. While passing raw data *can* work in simpler scenarios, relying on Mailable classes elevates your application's quality. It enforces structure, separates presentation logic (the Mailable) from business logic (the Controller), and ensures that when you follow guides like those found on [Laravel](https://laravelcompany.com/docs), your code is not just functional, but truly maintainable and scalable. By embracing Mailable objects, you ensure that the `Mail` facade operates exactly as intended every time.
