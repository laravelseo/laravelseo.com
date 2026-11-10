---
title: "Laravel: Argument 2 passed to Illuminate\\Auth\\SessionGuard::__construct()"
description: "Title: Understanding and Solving Argument Error in Laravel Auth Guard Configuration Introduction to Laravel's Authentication System Laravel framework uses..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

Title: Understanding and Solving Argument Error in Laravel Auth Guard Configuration

Introduction to Laravel's Authentication System
Laravel framework uses authentication to manage user credentials, ensuring secure access by providing different guards. These guards allow the application to authenticate users based on their needs and requirements. In this blog post, we will discuss how to resolve an argument error in Laravel's authentication system using a custom guard for 'residents'.

The Problem: Argument Error Passed to Illuminate\Auth\SessionGuard::__construct()
When you create a new guard called 'residents', which is an exact copy of the default 'User' class, and change the guard, this error appears. The error message states that argument 2 must be an instance of Illuminate\Contracts\Auth\UserProvider while null was given. This issue indicates that the relationship between the authentication classes and your custom guard is not correctly configured.

Solution: Ensuring Proper Authentication Configuration
To resolve this problem, you need to properly configure and align your controllers with the laravel configuration files so that the framework can recognize and validate your custom guard. Here's a step-by-step process to solve the issue:

1. Review auth.php Configuration File
The config/auth.php file contains the default authentication configurations for Laravel. It includes information about guards, providers, passwords, etc., that affect the authentication processes. Review your configuration settings and ensure they are correct and consistent with your needs.

2. Customize Your Guards
In your custom guard, define a new model which will be used as the 'residents' provider. This will help Laravel to correctly identify your guard when authenticating users based on this model:

App\ApiModels\Resident.php
```php
namespace App\ApiModels;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Resident extends Authenticatable {
    ...
}
```

3. Modify Controllers Accordingly
Your API controllers should be updated to reflect the new guard configuration, allowing for authentication based on your custom model:

Api\ResidentsController.php
```php
namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

/**
 * Models
 */
use App\ApiModels\Resident;

class ResidentsController extends Controller {
    public function __construct() {
        /**
         * Middleware(s)
         */
        $this->middleware('auth:api', [
            'except' => [
                'login',
                'logout'
            ]
        ]);
    }

    public function login(Request $request) {
        ...

        return response()-&gt;json([
            'login_id' =&gt; $request-&gt;login_id,
            'password' =&gt; $request-&gt;password
        ]);
    }
}
```

4. Test and Confirm
After making these changes, check your application to ensure the error is resolved and the custom guard is functioning as expected with the newly configured authentication system. If you encounter any issues or further problems, refer to Laravel's documentation for more guidance on authentication configuration.

Conclusion
In this blog post, we discussed how to resolve an argument error in the Laravel authentication system by correctly configuring your custom guard and ensuring that all relevant configurations match your requirements. By following these steps, you can ensure a smooth and secure authentication process while using Laravel. Remember to always refer to the official documentation for more detailed information on laravel configuration and best practices.
