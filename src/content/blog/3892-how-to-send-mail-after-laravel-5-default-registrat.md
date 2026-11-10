---
title: "How to send mail after Laravel 5 default registration?"
description: "How to Send Mail After Laravel 5 Default Registration: Extending Core Functionality As developers diving into Laravel, it’s common to start with the..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

As developers diving into Laravel, it’s common to start with the default scaffolding provided by the framework. When you need to extend core functionality—like adding email notifications or complex database operations during a registration flow—you move beyond the boilerplate and start leveraging Laravel's powerful event system and Eloquent capabilities.

This post will guide you through extending the standard Laravel 5 registration process to achieve two specific goals: sending an email upon successful registration and creating a corresponding entry in a related role management table (using a package like Entrust).

## The Laravel Approach: Leveraging Events for Post-Registration Logic

Laravel is designed around the principle of separation of concerns. Instead of cluttering your controller with business logic, we should use Eloquent Events or Model Observers to handle actions that occur *after* a model is saved. This keeps our code clean and adheres to good architectural practices, which is crucial when building robust applications, much like the principles laid out by the [Laravel Company](https://laravelcompany.com).

### Step 1: Setting up Email Notifications

Sending an email upon registration is a classic use case for Laravel's Notification system. This should not be handled directly in your controller; rather, it should be triggered when the user record is created.

**A. Create the Mailable:**
First, define what the email content will look like by creating a Mailable class.

```php
// app/Mail/RegistrationMail.php
namespace App\Mail;

use Illuminate\Support\Facades\Mail;
use App\Models\User; // Assuming you have a User model
use Illuminate\Mail\Mailable;

class RegistrationMail extends Mailable
{
    public $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function build()
    {
        return $this->view('emails.welcome')
                     ->with([
                         'user' => $this->user,
                     ]);
    }
}
```

**B. Configure the Mail:**
Ensure your `.env` file is configured to use a mail driver (like Mailtrap or SMTP).

**C. Triggering the Email via Observer (Best Practice):**
We will use an Eloquent Observer attached to the `User` model to listen for the `created` event and dispatch the notification.

```php
// app/Observers/UserObserver.php
namespace App\Observers;

use App\Models\User;
use App\Mail\RegistrationMail;

class UserObserver
{
    public function created(User $user)
    {
        // Dispatch the email immediately after the user is saved to the database
        Mail::to($user->email)->send(new RegistrationMail($user));
    }
}
```

**D. Registering the Observer:**
Finally, register this observer in your `App\Providers\EventServiceProvider` or directly in your `App\Models\User` model boot method.

## Step 2: Integrating Role Management (Entrust)

The second requirement—creating a role entry upon user registration via Entrust—must also happen post-save. This is where the Observer pattern shines, as we can chain multiple actions together.

Assuming you have established the necessary Eloquent relationships between `User` and your role table:

```php
// app/Observers/UserObserver.php (Adding the Role Logic)

use App\Models\Role; // Assuming your role model exists

class UserObserver
{
    public function created(User $user)
    {
        // 1. Send Registration Email (from Step 1)
        Mail::to($user->email)->send(new RegistrationMail($user));

        // 2. Create the initial role entry using Entrust logic (Conceptual Example)
        // In a real scenario, you would use Entrust's service or direct Eloquent interaction here.
        $role = Role::create([
            'user_id' => $user->id,
            'name' => 'default_user', // Or whatever the default role is
            // ... other necessary fields for Entrust setup
        ]);

        // Log or handle any other complex actions here...
    }
}
```

## Conclusion

Extending default Laravel functionality requires moving away from monolithic controller logic and embracing the framework's event-driven architecture. By utilizing Eloquent Observers, we successfully decoupled the responsibility of sending emails and managing related database entries from the registration controller. This pattern ensures that your application remains scalable, maintainable, and adheres to the clean structure championed by modern frameworks like Laravel. Always remember to explore how powerful features like these are built into the core framework; understanding this foundation is key to mastering any complex project you build with [Laravel Company](https://laravelcompany.com).
