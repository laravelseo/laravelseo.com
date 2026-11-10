---
title: "Laravel 5.4 Mail, passing data"
description: "Mastering Data Passing in Laravel Mail: A Deep Dive for Laravel 5.4 Sending dynamic data via email is a fundamental requirement for most web applications,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Errors"]
featured: false
---

Sending dynamic data via email is a fundamental requirement for most web applications, whether it's notifications, order confirmations, or contact form submissions. When working with Laravel's Mail system, the challenge often lies not just in sending the mail, but in correctly structuring and passing that variable data into your Mailable class and subsequently rendering it in your Blade template.

As a senior developer, I’ve seen developers encounter errors like the one you described—trying to pass an object where a string is expected. This usually points to a misunderstanding of how Laravel expects data to flow through its mailables. Let's dissect your scenario from Laravel 5.4 and build a robust, scalable solution.

## The Challenge: Passing Data to a Mailable

You are attempting to integrate form data (`nom`, `prenom`, `email`, `message`) into an email template. Your approach involves creating a dedicated Mailable class (`Contact`) that accepts this data in its constructor. While this is a valid pattern, the way you initiate the mail sending often needs refinement to avoid type errors.

The error "can't pass an object as string" typically arises when the Mail facade expects a specific structure (like an Eloquent model or a Mailable instance) and receives raw data that it cannot serialize correctly for the transport layer. The key is ensuring your Mailable class properly exposes the data intended for the view.

## The Solution: Structuring Your Mailable Correctly

The most idiomatic way to handle this in Laravel is to ensure your Mailable acts as a container for all necessary information, and that the data structure passed into it is clean and predictable.

### 1. Refactoring the Mailable Class

Instead of relying solely on constructor injection for everything, we will refine the `Contact` class to be responsible for structuring the data before building the view. This makes the mailer reusable and cleaner.

**Refined `app/Mail/Contact.php`:**

```php
<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class Contact extends Mailable
{
    use Queueable, SerializesModels;

    public $nom;
    public $prenom;
    public $email;
    public $message;

    /**
     * Create a new Mailable instance.
     *
     * @param array $data The data passed from the controller.
     */
    public function __construct(array $data)
    {
        $this->nom = $data['nom'];
        $this->prenom = $data['prenom'];
        $this->email = $data['email'];
        $this->message = $data['message'];
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        // Pass all necessary attributes directly to the view
        return $this->view('emails.hello')
                    ->with([
                        'nom' => $this->nom,
                        'prenom' => $this->prenom,
                        'email' => $this->email,
                        'message' => $this->message,
                    ]);
    }
}
```

### 2. Adjusting the Controller Logic

With the Mailable class correctly defined to hold and structure the data, your controller logic becomes cleaner and directly addresses the type expectations of the Mail facade.

**Refined Controller Snippet:**

```php
use Illuminate\Support\Facades\Mail;
// ... other necessary imports

public function store(Request $request)
{
    $validatedData = $this->validate($request, [
        'nom' => 'required|alpha',
        'prenom' => 'required|alpha',
        'email' => 'required|email',
        'message' => 'required',
    ]);

    // Create the Mailable instance directly with the validated data
    Mail::to('myadress')->send(new Contact($validatedData));

    return redirect()->back()->with('success', 'Message sent successfully!');
}
```

## The Template Integration

Your Blade template remains perfectly fine, as it expects the variables to be available when the Mailable is built:

**`resources/views/emails/hello.blade.php`:**

```html
<!DOCTYPE html>
<html lang="en-US">
<head>
    <meta charset="utf-8">
</head>
<body>
    <h2>Demande d'informations</h2>

    <div>
        <p>Vous recevez ce mail via le formulaire de contact du site.</p>
        <p>Adresse mail du contact: {{ $email }}</p>
        <p>Nom: {{ $nom }} / Prénom: {{ $prenom }}</p>
        <h3>Message du contact:</h3>
        <p>{{ $message }}</p>
    </div>
</body>
</html>
```

## Conclusion

The error you encountered is usually a symptom of mismatched expectations between the data structure provided and what the Mail facade expects. By ensuring your Mailable class fully encapsulates all necessary data (as demonstrated by injecting the array into the constructor) and explicitly passing the formatted variables in the `build()` method, we achieve reliable email delivery.

Remember, when leveraging complex features like email sending in Laravel, adhering to the principles of clear object-oriented design—especially around your Mailable classes—is crucial for writing maintainable code. For deeper insights into structuring data and services within the Laravel ecosystem, I highly recommend exploring the official documentation found at [https://laravelcompany.com](https://laravelcompany.com). Happy coding!
