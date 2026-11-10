---
title: "How does Laravel sanctum expire tokens?"
description: "Title: Understanding Token Expiration in Laravel Sanctum: A Developer's Guide Body: In the world of web application development, security is paramount. The..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Title: Understanding Token Expiration in Laravel Sanctum: A Developer's Guide

Body:
In the world of web application development, security is paramount. The Laravel framework has made it easier for developers to tackle this issue by providing a robust authentication system that leverages tokens. One such system is Laravel Sanctum, which enables us to easily implement API authentication with stateless sessions. Sanctum is built on top of Laravel's default authentication system and provides additional functionalities with API-focused authentication.

One essential aspect of token management in any authentication system is the ability to expire tokens when required. This may be due to security concerns or simply to revoke access for specific users. In Laravel Sanctum, managing token expiration isn't much different from the default Laravel's authentication system. Here are the steps to help you understand how Sanctum handles token expiry:

1. Create a personal access token: Use the `create` method found in the PersonalAccessToken model to create and save a new token for your user. This can be achieved by issuing the following command:

   ```php
   $token = \App\Models\PersonalAccessToken::create([
       'title' => 'My Token',
       'model_type' => User::class,
       ]);
   ```

2. Revoke token explicitly: If you want to manually revoke a user's token or expire it within the Laravel Sanctum system, you can call the `delete` method on the access token. This will essentially prevent further usage and invalidate any current sessions tied to that token. Here's an example of how you could do this:

   ```php
   // Revoke a user's personal access token
   $user->currentAccessToken()->delete();
   ```

3. Token expiry configuration: Laravel Sanctum does not currently have any inbuilt functionality to automatically expire tokens or set an expiration period. However, you can still achieve this through the framework's configuration file. By adjusting the `sanctum` config settings, you could specify how long a token should remain valid. Here's an example:

   ```php
   // Extend the access token lifespan to 15 minutes
   \Config::set('auth.sanctum.expiration_time', '10800');
   
   // Clear the config cache for changes to take effect immediately
   \Artisan::call('config:clear');
   ```

4. Revisiting the token table: Although Laravel Sanctum does not directly handle expired tokens in a dedicated manner, you can still delete the records manually from the `personal_access_tokens` database table using query builder or Eloquent ORM. This is especially useful when performing audits or in the case of security breaches where access should be revoked for multiple users simultaneously.

   ```php
   // Delete expired tokens with a single query
   DB::table('personal_access_tokens')->where('expires_at', '<=', now())->delete();
   
   // Find and delete expired tokens using Eloquent ORM
   $expiredTokens = \App\Models\PersonalAccessToken::where('expires_at', '<=', Carbon::now())->get();
   foreach ($expiredTokens as $token) {
       $token->delete();
    }
   ```

In conclusion, the expiration of tokens in Laravel Sanctum relies on various factors. The system provides a direct mechanism for explicitly revoking a token, while configuring its lifespan is handled through the framework's configuration file. Additionally, you may manually delete records from the database when necessary. A well-structured authentication system with proper validation checks will help ensure that your application remains secure and resilient against various threats.
