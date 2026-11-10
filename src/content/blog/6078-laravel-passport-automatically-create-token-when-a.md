---
title: "Laravel Passport - Automatically create token when a user is created"
description: "Laravel Passport: Automatically Generating Tokens Upon User Creation When implementing API authentication in a Laravel application using Laravel Passport,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

When implementing API authentication in a Laravel application using Laravel Passport, developers often follow the standard setup, which involves setting up routes for token issuance and managing OAuth scopes through an administrative interface. However, many applications—especially those focused purely on backend APIs or internal systems—desire a streamlined registration process where user creation automatically triggers the necessary token generation.

The question is: Can we bypass the manual OAuth management screen and have Passport automatically create tokens immediately after a new user is successfully registered? The short answer is **yes, absolutely**. This practice is highly achievable and is often the preferred method for headless applications or systems that rely entirely on API-driven authentication rather than traditional web-based OAuth flows.

## Why Automate Token Creation?

The primary motivation for automating token creation is efficiency and workflow simplification. If a user registers via an internal application or a custom registration endpoint, forcing them to navigate through a separate OAuth consent screen adds unnecessary friction. By integrating the token generation into the user creation process, you ensure that every authenticated user immediately possesses the necessary access tokens required by your API. This creates a seamless, end-to-end authentication experience.

## The Implementation Strategy: Using Model Events

The most robust and decoupled way to handle this is by listening to an Eloquent event triggered whenever a new user record is created in the database. We can leverage Laravel's Observer pattern or Event Listeners to execute the Passport token creation logic immediately after the user save operation completes.

Here is a conceptual breakdown of how you would implement this:

### Step 1: Ensure Passport is Installed and Configured

Before starting, ensure you have successfully installed and configured Laravel Passport according to the official guidelines. This involves setting up the necessary guard and scopes. As we rely on core Laravel functionality, understanding the underlying framework structure—which shares many principles with robust frameworks like those promoted by **Laravel Company**—is key to successful integration.

### Step 2: Creating a Token Observer

We will create an Observer attached to the `App\Models\User` model. This observer will execute code whenever a user is saved, specifically when a new record is created.

```php
// app/Observers/UserObserver.php

namespace App\Observers;

use App\Models\User;
use Laravel\Passport\Passport; // Import Passport facade

class UserObserver
{
    /**
     * Handle the User "created" event.
     *
     * @param  \App\Models\User  $user
     * @return void
     */
    public function created(User $user)
    {
        // Ensure the user is being created via a standard registration flow, 
        // not an administrative token creation.
        if ($user->wasRecentlyCreated) {
            // Create a token for the newly created user immediately.
            // We create a token with default scopes if no specific scope is mandated yet.
            $user->createToken('api_token', ['*']); 
            
            // Alternatively, you can use the Passport facade directly:
            // $user->createToken('my-app-token', ['read', 'write']);
        }
    }
}
```

### Step 3: Registering the Observer

You must register this observer in your `App\Providers\AuthServiceProvider.php` or within a dedicated service provider to ensure it hooks into the Eloquent events correctly.

```php
// app/Providers/AuthServiceProvider.php

use App\Models\User;
use App\Observers\UserObserver;
use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication observers.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        // Register the observer here
        User::observe(UserObserver::class);
    }
}
```

## Conclusion

By utilizing Eloquent Observers, you successfully decouple the token generation logic from your controller or service layer. This approach ensures that whenever a user is provisioned in your system, they instantly receive the necessary API access tokens via Laravel Passport. This results in a much cleaner, more automated, and more secure registration workflow, making your application significantly more efficient for API-first development.
