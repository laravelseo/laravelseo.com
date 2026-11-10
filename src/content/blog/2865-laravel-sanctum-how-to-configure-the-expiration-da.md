---
title: "Laravel Sanctum: How to configure the expiration date of the token?"
description: "Laravel Sanctum: How to Configure the Expiration Date of the Token Context and Need In my api routes file, I've written the following code following the..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

## Context and Need

In my `api` routes file, I've written the following code following the documentation:

```php
Route::post('/tokens/create', function (Request $request) {
    $token = $request->user()->createToken($request->token_name);
    return ['token' => $token->plainTextToken];
});
```

I would want to set an expiration delay that would be used to compare the date of the creation of the token with the date of the current check of the token expiration: the token had a creation date of `x`, the current date is `y`, and the delay is `d`, so the token would expire if `y > x + d`.

## What I've Done

So I've read some code in the directory `vendor/laravel/sanctum`, and I've found the class `Guard.php`.

The class `Guard.php` contains an object attribute named `$expiration`, a constructor that sets it (among other things), and the `__invoke` method that contains the following expiration check:

```php
if (! $accessToken ||
            ($this->expiration &&
             $accessToken->created_at->lte(now() - >subMinutes($this->expiration))) ||
            ! $this->hasValidProvider($accessToken->tokenable)) {
    return;
}
```

As you can see, it does exactly what I want. However, I can't figure out how to set my own value for the attribute `$expiration`.

In this same file, there are some allusions to an existing configuration file, like this one: `config('sanctum.guard', 'web')`. Also, the class `SanctumServiceProvider` instantiates `Guard` and passes to its constructor the following value: `config
