---
title: "Creating Token with Sanctum in Laravel 9 with no 'expires_at' column"
description: "Title: Creating Tokens with Sanctum in Laravel 9 without an 'expires at' Column: A Comprehensive Guide Introduction Creating tokens using the Laravel 9..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "HTML", "Errors"]
featured: false
---

Title: Creating Tokens with Sanctum in Laravel 9 without an 'expires_at' Column: A Comprehensive Guide

Introduction
Creating tokens using the Laravel 9 framework and its authentication packages, such as Sanctum, can be a straightforward process. However, you may encounter errors when working with 'createToken' method from the User class if there is no 'expires_at' column in your database table. In this blog post, we will discuss why this error occurs, how to solve it, and offer best practices for token generation without using the default 'expires_at' column.

Issue Explanation
The Laravel framework typically creates tokens with an 'expires_at' column in the database table, which represents a timestamp for when the token will expire. This feature is particularly useful for managing and ensuring security of tokens. By default, the 'createToken' method tries to insert data into this column even if it does not exist, causing the error message you have seen.

Solution
To solve this issue, you can modify your migration file and remove the 'expires_at' column from the table or simply comment out the column creation line in case you want to keep it for future use. After updating the database structure, your migration should look similar to this:

<pre><code>public function up() {
  Schema::create('personal_access_tokens', function (Blueprint $table) {
    $table->string('name');
    $table->string('token');
    $table->json('abilities')->nullable();
    // Comment out the following line to remove 'expires_at' column
    //$table->timestampTz('expires_at')->nullable();
  });
}
</code></pre>

Modifying the User Model
While the migration fixes the database issue, you still need to modify your User model to use a different method for creating tokens without the 'expires_at' column. You can use Laravel's built-in methods like 'setToken()' or create your own custom function:

<pre><code>public function createTokenWithoutExpiry($name, $abilities = null) {
  return $this->createToken($name, $abilities)->plainTextToken;
}
</code></pre>

Using the Custom Function in Controllers or Views
Finally, call this new method when creating a token in your controller or view to generate tokens without an 'expires_at' column:

<pre><code>$user = App\Models\User::find(1);
// Create token without expiry
$tokenWithoutExpiry = $user->createTokenWithoutExpiry('secrettoken', ['*']);

return response()->json(['access_token' => $tokenWithoutExpiry]);
</code></pre>

Conclusion
Creating tokens with Sanctum in Laravel 9 can be an efficient way to manage user authentication. By addressing the issue of the 'expires_at' column and using a custom token creation function, you can ensure smooth token generation without any errors or confusion. Remember that the best practices for security should always be followed when handling sensitive information such as tokens, and regularly updating your Laravel installation will help maintain the latest security features.
