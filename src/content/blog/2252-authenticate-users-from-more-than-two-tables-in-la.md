---
title: "Authenticate users from more than two tables in laravel 5"
description: "Title: Tackling Multiple User Authentication Sources in Laravel 5: A Comprehensive Guide Body: In many web applications, the need for multiple tables..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Tackling Multiple User Authentication Sources in Laravel 5: A Comprehensive Guide

Body:
<p>In many web applications, the need for multiple tables containing user information may arise. This can include managers from a 'managers' table and administrators from an 'admins' table. While Laravel provides a built-in <code>Auth</code> system to authenticate users from the standard 'users' table, we are often tasked with customizing existing functionality or creating our own <code>AuthServiceProvider</code> for handling multiple user authentication sources. In this blog post, we'll break down the process of implementing multi-table user authentication in a Laravel 5 application.</p>
<h2>Prerequisites</h2>
<ol>
	<li>Familiarity with Laravel 5 framework and its concepts such as Eloquent ORM, Blade templates, etc.</li>
	<li>Basic understanding of Laravel's authentication system and <code>AuthServiceProvider</code></li>
	<li>Knowledge of working with multiple database tables or models in Laravel</li>
</ol>
<h2>Creating the Models for Multiple Tables</h2>
Let’s first create database models for each table. You can do this using <code>php artisan make:model ModelName -migration</code>, where <code>ModelName</code> is replaced with your model name. For example, you may have:
<ul>
	<li><code>php artisan make:model Manager -migration</code></li>
	<li><code>php artisan make:model Admin -migration</code></li>
</ul>
Next, create the migrations for these tables using <code>php artisan migrate:install</code>. Then define their respective migration files in your database. You can also add relationships between these related models if necessary.
<h2>Defining Custom Login Controllers and Routes</h2>
Since we are creating multiple AuthServiceProviders, we need to create custom login controllers for each table:
1. Create a new folder <code>App/Http/Controllers/Auth</code>.
2. Inside this folder, add the ManagerLoginController file with the following content:
<pre><code class="language-php">namespace App\Http\Controllers\Auth;
use Illuminate\Foundation\Application;
use Laravel\Passport\Clients\AbstractClient as OauthClient;
use Auth;
class ManagerLoginController extends \Illuminate\Foundation\Unauthenticated\{
	public function authenticate($request) {
		$credentials = $request->only('email', 'password');
		if (Auth::attempt(['email' => $credentials['email'], 'password' => $credentials['password']], true)) return redirect()->intended('/manager-dashboard');
		return back()->withInput()->withErrors([
			'message' => 'Invalid credentials',
		]);
	}
}
</code></pre>
3. Create another LoginController for Administrators:
<pre><code class="language-php">namespace App\Http\Controllers\Auth;
use Illuminate\Foundation\Application;
use Laravel\Passport\Clients\AbstractClient as OauthClient;
use Auth;
class AdminLoginController extends \Illuminate\Foundation\Unauthenticated\{
	public function authenticate($request) {
		$credentials = $request->only('email', 'password');
		if (Auth::attempt(['email' => $credentials['email'], 'password' => $credentials['password']], true)) return redirect()->intended('/admin-dashboard');
		return back()->withInput()->withErrors([
			'message' => 'Invalid credentials',
		]);
	}
}
</code></pre>
4. Add the following routes in your route file:
<pre><code class="language-php">Route::group(['prefix' => 'auth'], function() {
	// Manager Login Route
	Route::post('/managerLogin',['as' => 'managerLogin', 'uses' => 'App\Http\Controllers\Auth\ManagerLoginController@authenticate']);

	// Admin Login Route
	Route::post('/adminLogin', ['as' => 'adminLogin', 'uses' => 'App\Http\Controllers\Auth\AdminLoginController@authenticate']);
});
</code></pre>
<h2>Creating Custom AuthServiceProvider</h2>
With the controllers, models and routes set up, we need to create custom <code>AuthServiceProviders</code> for each table. We can use the base class <code>Illuminate\Auth\AuthManager</code>.
<ul>
	<li>Create a new folder named <code>App/Providers</code>.</li>
	<li>Inside this folder, create another subfolder called <code>Authenticators</code>.</li>
	<li>Within the <code>Authenticators</code> folder, create a file for each table authentication. Let's say <code>ManagerAuthenticator.php</code> and <code>AdminAuthenticator.php</code>. Each file will contain these contents:</li>
		<pre><code class="language-php">namespace App\Providers\Authenticators;
use Illuminate\Auth\Events\Login as LoginEvent;
use Illuminate\Foundation\Application;
class ManagerAuthenticator extends Illuminate\Auth\DatabaseManagerAuthenticator implements \Illuminate\Contracts\Auth\AuthenticatableProvider {
	public function validateCredentials(Request $request, Application $app) {
	    return [
	        'email' => $request->get('email'),
	        'password' => $request->get('password')
	    ];
	}

	public function registerLoginAttemptEvent(Application $app) {
	    $app['events']->listen(LoginEvent::class, function($event){
	    	if ($event->user instanceof \App\Manager) {
	            $this->fireSuccessfulLogin($event);
	        }
	    });
	}

	public function handleLoginRequest(Application $app, Request $request) {
		$credentials = $this->validateCredentials($request, $app);
		if ($credentials) {
			return Auth::guard('manager')->attempt($credentials);
		} else {
			throw new \Illuminate\Validation\ValidationException(
				response()->json(['message' => 'Invalid credentials'], 422)
			);
		}
	}
}</code></pre>
<li>Create another <code>AdminAuthenticator.php</code> file with nearly the same content as above, but changing 'Manager' to 'Admin' and adjusting routes accordingly.</li>
</ul>
<h2>Register Custom Providers in Laravel Configuration File</h2>
To use these custom authentication providers, add them to your Laravel configuration file (usually found at <code>/config/auth.php</code>) within the 'guards' section, like so:
<pre><code class="language-php">'guards' => [
	// ... existing entries
	'manager' => [
	    'driver' => 'app.authenticator.manager',
	    'provider' => 'managers',
	],
	'admin' => [
	    'driver' => 'app.authenticator.admin',
	    'provider' => 'admins',
	]
	// ... other entries
],</code></pre>
<h2>Conclusion</h2>
By leveraging Laravel's flexibility, you can create custom <code>AuthServiceProvider</code> classes for multiple authentication sources. This approach provides a reliable solution when working with large or complex web applications that involve different user roles and permissions. Always remember to ensure your code is secure, maintainable, and well-documented for future maintenance and expansion.
