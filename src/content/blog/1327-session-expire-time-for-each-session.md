---
title: "Session expire time for each session"
description: "Title: Managing Session Expiration Time in Laravel Applications Can we set an expire time for each session in Laravel ? Yes, you can control the expiration..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Managing Session Expiration Time in Laravel Applications

<p>Can we set an expire time for each session in <strong><a href="https://laravelcompany.com/blog/how-to-use-laravel-session">Laravel</a>?</p>
<p>Yes, you can control the expiration time of each individual session in Laravel by leveraging its built-in support for session handling and management.</p>

<h3>Session Lifetime Configuration</h3>
To start with, you should first define the default session lifetime globally for your application. You can do this through configuration files or environment variables. In the config/session.php file for Laravel 5 and above, look for the 'lifetime' setting:

```php
'lifetime' => $this->app->environment('local') ? 120 * 60 // 2 hours for local development
             : 14 * 24 * 60 // 2 weeks for production environment
```

This sets the default session lifetime to two hours in your local environment and two weeks on production. This global configuration will apply to every new session unless explicitly modified. However, you can set a custom expiration time for each individual session as needed.

<h3>Setting Custom Session Expiration Time</h3>
To set an expire time for a specific session, you should store the desired lifetime in your session or request storage. You may use either the request object's 'session()' method or the session facade:

```php
use Illuminate\Support\Facades\Session;

// Set custom expiration time directly using the Session facade
$newLifetime = 30 * 60; // 30 minutes
Session::put('custom_lifetime', $newLifetime);

// In a controller, use the request object's session() method to access and modify the custom expiration time
Request::$instance->session()->put('custom_lifetime', $newLifetime);
```

By adding this code to your application, you've created an individual session with an expiry time of 30 minutes. But remember that once a new session is started, the global lifetime configuration will take precedence over any custom settings unless explicitly modified.

<h3>Managing Session Expiration</h3>
In addition to setting up custom timestamps for individual sessions, you can also control when the application invalidates expired sessions. To do this, utilize the 'expireNow' method from the session facade or the request object:

```php
// Example 1: Expiring an individual session by its ID on a specific date/time
$sessionId = '34df87e9-b75a-4c06-9d32-0b166fef5f5d'; // Assuming this is your session ID
Session::expireNow($sessionId, new DateTimeImmutable('2021-01-01 12:00:00'));

// Example 2: Expiring all sessions created before a specific date/time
Session::expireAllBefore(new DateTimeImmutable('2021-01-01 12:00:00'));
```

By utilizing the session expiration methods, you can ensure that your users' sessions are managed in accordance with your application's security and business requirements. In conclusion, while Laravel provides a default lifetime for all sessions, it also gives you the option to set custom expiry times on an individual basis through configuration or code modifications.
