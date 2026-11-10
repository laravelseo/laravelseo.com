---
title: "How to add a custom User Provider in Laravel 5.4"
description: "Mastering Custom Authentication: How to Add a Custom User Provider in Laravel 5.4 Building custom authentication flows, especially when integrating with..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Errors"]
featured: false
---

Building custom authentication flows, especially when integrating with external APIs, is a common requirement for enterprise applications. When you need to move beyond the default Eloquent model binding and introduce entirely new data sources—like an external API—you need to dive into Laravel's authentication scaffolding.

The scenario you described—creating a custom provider that fetches user data from an external JSON response rather than a standard database table—is a perfect example of extending Laravel’s capabilities. However, as you discovered, correctly handling dependency injection within the `AuthServiceProvider` when overriding base classes like `EloquentUserProvider` can lead to confusing errors.

This post will walk you through the correct architectural approach for implementing custom user providers in Laravel 5.4, resolving the issues you encountered, and guiding you toward a robust solution.

## Understanding Laravel Authentication Providers

Laravel uses the concept of "Providers" to decouple where user data comes from (e.g., database, LDAP, API) from how Laravel handles authentication logic. A provider is essentially a service that knows how to fetch a user record based on a given identifier.

Your goal is to create a provider named `jsonresponse` that maps to the `customusers` model and fetches data from an external API.

### The Pitfall: Dependency Injection Issues

The errors you encountered (`Argument 1 passed to Illuminate\Auth\EloquentUserProvider::__construct() must be an instance of Illuminate\Contracts\Hashing\Hasher...`) stem from how Laravel attempts to inject dependencies (like the hashing mechanism or the application container) into your custom provider when it’s registered via `AuthServiceProvider`. When you extend a base class, you must ensure that any methods you override correctly handle the arguments passed by the framework.

The key is not just extending the class, but ensuring your implementation adheres to the expected interface for user retrieval.

## Step-by-Step Implementation for a Custom Provider

Instead of immediately overriding complex constructor logic, let’s focus on creating a provider that cleanly handles the specific logic for your external API integration.

### 1. Define the Custom Provider Class

Extend `EloquentUserProvider` as you planned, but focus your implementation within the `retrieveByCredentials` method, which is where the actual fetching happens.

```php
<?php

namespace App\Providers;

use Illuminate\Auth\EloquentUserProvider;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Facades\Http; // Useful for API calls

class JsonResponseUserProvider extends EloquentUserProvider
{
    /**
     * Retrieve a user by credentials (e.g., username/email).
     *
     * @param  array  $credentials
     * @return \Illuminate\Contracts\Auth\Authenticatable|null
     */
    public function retrieveByCredentials(array $credentials)
    {
        // 1. Extract the necessary identifier (e.g., email from the API response)
        $email = $credentials['email'] ?? null;

        if (!$email) {
            return null;
        }

        // 2. Call your external API to fetch user data
        try {
            $response = Http::withToken('your_api_token')->get("https://external-api.com/users/{$email}");

            if ($response->successful()) {
                $userData = $response->json();
                
                // 3. Map the external data to your local model (App\Admin)
                $adminUser = new \App\Admin;
                $adminUser->fill($userData); // Assuming keys match
                $adminUser->save();
                
                return $adminUser;
            }

        } catch (\Exception $e) {
            // Handle API errors gracefully
            return null; 
        }

        return null;
    }
}
```

### 2. Registering the Provider Correctly in `AuthServiceProvider`

The registration step is crucial. You register your custom provider with Laravel, telling it which class to use for a specific name. You no longer need to manually instantiate the provider inside the closure if you are using standard registration methods, especially when extending Eloquent providers.

In `app/Providers/AuthServiceProvider.php`, register your provider under the `'providers'` array:

```php
use App\Providers\JsonResponseUserProvider; // Import your new class

public function boot()
{
    $this->registerPolicies();

    // Register the custom provider here to link the 'jsonresponse' guard 
    // to our custom logic.
    Auth::provider('jsonresponse', function ($app, array $config) {
        // Return an instance of your custom provider class
        return new JsonResponseUserProvider($app['hash'], $config['model']);
    });
}
```

### 3. Configuring the Providers in `config/auth.php`

Finally, ensure your configuration maps these providers to the correct guards and models:

```php
'providers' => [
    'users' => [
        'driver' => 'eloquent',
        'model' => App\User::class,
    ],
    'customusers' => [
        // Point this provider name to your custom class implementation
        'driver' => 'jsonresponse', 
        'model' => App\Admin::class, // The model we are populating via the API
    ],
],
```

## Conclusion

Implementing custom user providers is an advanced technique that requires a solid understanding of Laravel’s service container and authentication lifecycle. The errors you faced were related to dependency injection timing; by focusing your logic inside methods like `retrieveByCredentials` and ensuring you return the expected interface types, you can successfully delegate the complex external API interaction while still integrating smoothly with Laravel's robust security framework. For more detailed insights into building scalable systems on the Laravel platform, exploring resources from [laravelcompany.com](https://laravelcompany.com) is highly recommended.
