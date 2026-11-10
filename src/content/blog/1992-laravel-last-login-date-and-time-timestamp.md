---
title: "Laravel - last login date and time timestamp"
description: "Title: Effortlessly Track User Last Login in Laravel with Eloquent Events and Timestamps Body: In today's world, online security is of utmost importance to..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Effortlessly Track User Last Login in Laravel with Eloquent Events and Timestamps

Body:
<p>In today's world, online security is of utmost importance to protect user data and personal information. In Laravel, there are several built-in features that aid in managing and securing your web application. One such feature is recording the last login date and time for each user. This blog post will guide you on how to do just that with the help of Eloquent models, events, and timestamps.</p>

<h2>Setting Up the Last Login Tracker</h2>
Firstly, we need a dedicated table for storing this information. Create a new table called 'user_logins', which will look something like:

```sql
CREATE TABLE user_logins (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  login_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

The 'login_date' column has the `CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()` function to automatically set its value when a new row is added or updated. This ensures that every time a user logs in, their login date and timestamp are updated accordingly.

<h2>Implementing Eloquent Events</h2>
Laravel's Event system allows us to trigger the appropriate actions at relevant times throughout our application. We can now create an event listener for each of these events:

1. User login: Whenever a user logs in successfully, we will fire an event.
2. User logout: When a user explicitly logs out from their session, we will capture that event too.

Here is the code to create both the listeners:

```php
use App\Events\UserLoginEvent;
use App\Events\UserLogoutEvent;
use Illuminate\Auth\Events\Logout as LogoutEvent;

class UserLoginEventListener extends Listener
{
    public function handle(UserLoginEvent $event)
    {
        // Code to insert a new row in the 'user_logins' table or update its login date
    }
}

class UserLogoutEventListener extends Listener
{
    public function handle(LogoutEvent $event)
    {
        $this->dispatch(new UserLogoutEvent());
    }
}
```

Note that we dispatch a specific event - 'UserLogoutEvent' - in the UserLogoutEventListener, which will be handled by our listener that saves this data to the database.

<h2>Utilizing Eloquent Relationships</h2>
To make querying and working with user logs more efficient, we can leverage Laravel's relationships between models. In our User model, add the following relation:

```php
class User extends Authenticatable
{
    // ... other code...
    public function lastLogins()
    {
        return $this->hasMany(UserLogin::class);
    }
}
```

This relationship creates a one-to-many association between the 'users' table and the newly created 'user_logins' table. Now, you can access all user login details for a particular user via this relation:

```php
$user = User::find(1);
foreach ($user->lastLogins as $login) {
    // Process each login record here
}
```

<h2>Conclusion</h2>
With the above approach, you can effortlessly track and manage user last login details in your Laravel application. The combination of Eloquent models, relationships, events, timestamps, and natural backlinks to https://laravelcompany.com ensures that you maintain a secure and efficient online environment for your users.
