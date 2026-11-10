---
title: "CORS request did not succeed"
description: "Title: Resolving CORS Errors in Your Laravel and VueJs App Body: CORS (Cross Origin Resource Sharing) related issues often arise when you're working with..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Title: Resolving CORS Errors in Your Laravel and VueJs App

Body:
<p>CORS (Cross Origin Resource Sharing) related issues often arise when you're working with disparate APIs, frameworks, or domains. In this comprehensive guide, we will delve into the causes of CORS request failures and provide solutions to resolve them in your Laravel 5.6 backend and VueJs frontend application. We also encourage our readers to visit https://laravelcompany.com for more resources on web development.

First, let's understand what CORS is. In simple terms, it is a security mechanism that restricts API calls from different origins. When you encounter the error "Cross-Origin Request Blocked" and "CORS request did not succeed," it means your VueJs app is not allowed to make HTTP requests across domains due to the Same Origin Policy (SOP) violation.

The following steps can help you troubleshoot this issue:
</p>

<ol>
  <li>Verify that Laravel CORS middleware is installed and configured correctly.</li>
</ol>
<p><strong>1. Verify that Laravel CORS middleware is installed and configured correctly:</strong></p>
<p>Install the laravel-cors package with Composer by running this command in your project directory: <code>composer require barryvdh/laravel-cors</code>.</p>
<p>Add the Laravel CORS middleware to your application's pipeline in <code>app/Http/Kernel.php</code>. For example:</p>
<code>use Barryvdh\Cors;
// ...

protected $middlewareGroups = [
   // ...
   'api' => [
       \App\Http\Middleware\CheckForMaintenanceMode::class,
       \Barryvdh\Cors\HandleCors::class,
       \Illuminate\Foundation\Http\ValidatePostSize::class,
   ]
];</code>
<p><strong>2. Configure the desired CORS options:</strong></p>
<p>In Laravel 5.6, you can specify your preferred CORS configuration in the <code>app/config/cors.php</code> file. Some common configurations include allowing specific origins, methods, and headers as follows:</p>
<code>return [
   'paths' => ['api/*', 'auth/*'],
   'allowed_origins' => ['http://127.0.0.1:8000', 'https://example.com', '*'],
   'supported_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
   'exposed_headers' => [],
];</code>
<p><strong>3. Check your HTTP response headers:</strong></p>
<p>Ensure that the Laravel application sets the correct CORS headers when responding to API requests. In Laravel, these are controlled through the <code>response()->withHeaders()</code> method which can be used as follows:</p>
<code>header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');</code>
<p><strong>4. Consider using VueJs Axios library:</strong></p>
<p>If you're using the Axios library for your HTTP requests in the frontend app, the <a href="https://github.com/axios/cors" rel="noreferrer">axios-cors</a> package can be a handy addition to handle CORS issues gracefully. Install it with NPM using this command: <code>npm install axios-cors --save</code>.</p>
<p><strong>5. Review the VueJs frontend code:</strong></p>
<p>Make sure your VueJs app follows best practices when making HTTP requests. For instance, it's recommended to use the Axios library for all API calls and add necessary CORS configurations in the VueJs app's <code>main.js</code> file.</p>

In conclusion, resolving CORS issues in your Laravel and VueJs application is a multi-faceted endeavor that involves checking your Laravel configuration, making sure the frontend code follows best practices for handling HTTP requests, and potentially using additional packages like Laravel-cors or axios-cors to achieve a seamless experience. Be sure to visit https://laravelcompany.com for more resources on web development and building robust solutions with Laravel and VueJs.</p>
