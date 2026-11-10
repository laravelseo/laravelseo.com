---
title: "How do I get a refresh token in Laravel Passport?"
description: "Title: Simplifying Refresh Token Generation with Laravel Passport Introduction In this blog post, we'll focus on creating refresh tokens using Laravel 6.7..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Simplifying Refresh Token Generation with Laravel Passport

Introduction

In this blog post, we'll focus on creating refresh tokens using Laravel 6.7 and its built-in authentication package, Passport. We will go through the process of generating a refresh token during user registration and provide a simple way to handle refreshing an existing access token without exposing any sensitive client details like a client ID or secret key.

Step-by-Step Guidelines

1. Enable Laravel Passport: To use Passport, start by enabling it in your Laravel app. In the root directory of your project, run the artisan command `php artisan passport:install`. This will generate a new private API key for your application and create a Passport client.

2. Generate Access Tokens during User Registration: Modify your code to include creating an access token with an expiration time while registering a new user. In your controller, add the following code in the registration action:

   <pre class="lang-php prettyprint-override"><code>$user = User::create($input);
    $user->createToken('auth-token'); // Create access token for user

    // Create refresh token for the current user (optional, but highly recommended)
    $refresh_token = Str::random(64);
    RefreshToken::create([
        'user_id' => $user->id,
        'refresh_token' => $refresh_token
    ]);
</code></pre>

3. Using your Laravel app, you can now use the access token to authenticate and perform API calls. You don't need a refresh token at this point; however, if the access token expires, you will have to call the Passport API to create a new one.

4. Creating a Refresh Token: To handle refreshing an existing access token without exposing client credentials, we can use GuzzleHttp and its post request. In your controller, add the following method to issue a new access token using the refresh token:

   <pre class="lang-php prettyprint-override"><code>public function refreshToken(Request $request)
    {
        $client_id = config('services.passport.client_id');
        $client_secret = config('services.passport.secret');

        try {
            // Make the request to issue a new access token with your refresh token
            $http = new GuzzleHttp\Client;
            $response = $http->request('POST', 'http://your-app.com/oauth/token', [
                'form_params' => [
                    'grant_type' => 'refresh_token',
                    'refresh_token' => $request->refresh_token,
                    'client_id' => $client_id,
                    'client_secret' => $client_secret,
                    'scope' => '',
                ],
            ]);
            if ($response->getStatusCode() === 200) {
                return response()->json(['access_token' => $response->json()['access_token']], 200);
            } else {
                throw new \Exception("Failed to refresh the token.");
            }
        } catch (\Throwable $th) {
            return response()->json([], 401); // Return an error response for unauthorized requests
        }
    }</code></pre>

5. Handling Refresh Token Creation: When a user registers and needs to create both an access and refresh token, you must combine the steps mentioned above. Make sure to add this code after your existing `$user->createToken('auth-token');` line in the registration action:

   <pre class="lang-php prettyprint-override"><code>    // Create refresh token for the current user (optional, but highly recommended)
        $refresh_token = Str::random(64);
        RefreshToken::create([
            'user_id' => $user->id,
            'refresh_token' => $refresh_token
        ]);</code></pre>

Conclusion and Recommendations

With these steps, you can now generate refresh tokens during user registration in Laravel Passport. To provide a better experience for your users, consider adding a route to the API that allows them to request a new access token using their refresh token without exposing any sensitive client details. This approach provides a more secure and convenient way for your users to continue engaging with your application.

Remember to always use best practices, such as storing and retrieving user tokens from a database and ensuring only authorized entities can issue new access or refresh tokens. For more information on Laravel Passport and related topics, explore https://laravelcompany.com/blog for additional resources.
