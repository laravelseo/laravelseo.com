---
title: "Laravel 11 - Disable CSRF for a route"
description: "Title: Disabling CSRF Protection for Specific Routes in Laravel 11 A Comprehensive Guide Body: Dealing with webhook endpoints can present unique challenges,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

Title: Disabling CSRF Protection for Specific Routes in Laravel 11 - A Comprehensive Guide

Body:
<p>Dealing with webhook endpoints can present unique challenges, especially when it comes to handling Cross-Site Request Forgery (CSRF) protection. In Laravel 11, the default CSRF verification mechanism has changed, making it necessary for developers to adapt their approaches accordingly. This blog post will guide you through disabling CSRF protection for a specific route in Laravel 11 and address potential issues along the way.</p>
<hr/>
<h2>Understanding Cross-Site Request Forgery</h2>
<p>Cross-Site Request Forgery (CSRF) is an attack that exploits legitimate users' sessions to execute unwanted actions on websites. It can be dangerous, especially in scenarios where sensitive information or privileged operations are concerned. By default, Laravel 11 provides strong CSRF protection for all routes using the VerifyCsrfToken middleware.</p>
<hr/>
<h2>The Problem: Enable Webhooks with No CSRF Verification</h2>
<p>In your case, you've identified that a webhook endpoint is failing because HTTP error code 419 is being returned. This error code is specifically used in Laravel to indicate that the request was not able to proceed due to failed CSRF token verification. To ensure successful webhook calls from remote services, we need to disable CSRF protection for a specific route.</p>
<hr/>
<h2>The Solution: Disable CSRF Verification Using Route Groups</h2>
<p>In Laravel 11, the VerifyCsrfToken middleware is no longer present. However, we can still disable CSRF verification for specific routes using route groups. Follow these steps:</p>
<ol>
  <li>Create a new route group for webhook endpoints by running the command: <code>php artisan make:policy WebhookPolicy</code></li>
  <li>Open the newly created policy file and add the <code>@handle</code> method. This method will hold all your route definitions:</li>
    ```php
   <?php

   namespace App\Policies;

   use App\Models\User;
   use Illuminate\Auth\Access\HandlesAuthorization;

   class WebhookPolicy extends HandlesAuthorization
   {
       /**
        * Determine if the user can access the webhook route.
        */
       public function handle(User $user, $routeName)
       {
           // Define your CSRF-less routes here
       }
    ```
  <li>In your application's <code>app/Http/Kernel.php</code> file, modify the <code>$routes</code> property to include the newly created route group:</li>
    ```php
   protected function routes()
   {
       $this->group(['prefix' => 'api', 'middleware' => ['auth','webhook']], function() {
           require_once __DIR__ . '/../Http/routes.php';
           require_once __DIR__ . '/../Api/Routes/WebhooksRoute.php'; // Add your webhook routes here
       });
    ```
  <li>Adjust the auth middleware to allow access without CSRF verification for this route group:</li>
    ```php
   protected $middlewareGroups = [
       'web' => [
           \App\Http\Middleware\CheckForMaintenanceMode::class,
           \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
           \Illuminate\Session\Middleware\StartSession::class,
           \Illuminate\View\Middleware\ShareErrorsFromSession::class,
           \Illuminate\Cookie\Middleware\EncryptCookies::class,
           \Illuminate\Routing\Middleware\SubstituteBindings::class,
       ],
       'api' => [
           'throttle:60,1',
           'bindings',
           \App\Http\Middleware\ConvertEmptyStringsToNulls::class,
           \App\Http\Middleware\VerifyCsrfToken::class, // Disable this line for CSRF-less routes
       ],
   ];
    ```
  <li>Create a webhook route in the new route group:</li>
    ```php
   Route::post('webhook/example', [WebhookController::class, 'handleExampleRequest']); // Define your route as needed
    ```
  <li>Import the newly created policy for use with the webhook controller class and method calls:</li>
    ```php
   namespace App\Http\Controllers;

   use App\Http\Requests\WebhookRequest;
   use Illuminate\Routing\Controller;
   use Illuminate\Support\Facades\Auth;
   use App\Policies\WebhookPolicy as WebhookPolicy;

   class WebhookController extends Controller
   {
       public function handleExampleRequest(WebhookRequest $request)
       {
           if (Auth::user() && Auth::user()->can(WebhookPolicy::class, $routeName)) {
               // Your webhook request logic goes here
           }
       }
    ```
  <li>Test your new CSRF-less route and ensure that the error code 419 no longer appears.</li>
</ol>

In conclusion, by using Laravel's powerful policy feature for customizing application access rules, you can disable CSRF verification for specific routes without affecting other parts of your website. This ensures seamless communication with external services while maintaining a secure web application environment. For further information on implementing policies and middleware, visit the Laravel documentation at https://laravelcompany.com/laravel-9-guide/.
