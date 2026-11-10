---
title: "How to create multilingual translated routes in Laravel"
description: "Title: Effortlessly Create Multilingual Routes for Translated Pages in Laravel Body: Multilingual websites are becoming increasingly popular due to the..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Effortlessly Create Multilingual Routes for Translated Pages in Laravel

Body:
Multilingual websites are becoming increasingly popular due to the globalization of the internet. They enable users from different countries and regions to access content in their native languages. In this blog post, we will discuss how you can create translated routes in Laravel applications, making it easy for visitors to switch between languages seamlessly.

1. Setting up the default language:
To begin with, we need to define our default language. This will be used when no specific language is specified in the URL. Let's assume that our default language is "pl" for Polish and we have two more languages - "en" (English) and "fr" (French). We'll create a constant called APP_DEFAULT_LANGUAGE in config/app.php as follows:
```php
// config/app.php
const APP_DEFAULT_LANGUAGE = 'pl';
```

2. Creating translated routes:
For the different pages on your website, you can create translated URLs using a prefix for each language. To achieve this, we will create a LanguageRouteServiceProvider in app/Providers folder and register it in config/app.php. This provider will handle all the language-specific routes for our application.
```php
// app/Providers/LanguageRouteServiceProvider.php
<?php
namespace App\Providers;

use Illuminate\Routing\Router;

class LanguageRouteServiceProvider extends RouteServiceProvider {
  public function boot(Router $router) {
    parent::boot($router);

    if (app()->environment() !== 'production') {
      return;
    }

    // Add language prefix to non-default routes for other languages
    foreach (config('app.locales') as $locale => $name) {
      if ($locale === APP_DEFAULT_LANGUAGE) {
        continue;
      }
      $router->group(['prefix' => "{$locale}"], function () use ($router) {
        require base_path('routes/lang/' . $locale . '.php');
      });
    }
  }
}
```
The boot() method in this class checks the application environment and routes the non-default languages with their respective prefixes. We also need to create routes for the default language without any prefix. For example, we might have:
```php
// routes/lang/{locale}.php
Route::get('/', function ($locale) {
  return view('welcome')->with('locale', $locale);
});

Route::get('/about', function () {
  return 'This is the about page';
});

Route::get('/contact', function () {
  return 'This is the contact page';
});
```
Replace these placeholders with your actual route definitions.

3. Handling redirects:
To ensure that users are redirected to the corresponding translations automatically, we need to modify our controller's constructor or any middleware used in the application. This can be done as follows:
```php
// App\Http\Controllers\HomeController
public function __construct() {
  $request_locale = request()->input('locale') ?? (app()->environment() === 'local' ? null : config('app.locale'));
  if (empty($request_locale)) {
    $request_locale = APP_DEFAULT_LANGUAGE;
  }
  app()->setLocale($request_locale);
}
```
This sets the locale based on input from the request or falls back to the configured default language.

4. Redirects for non-default languages:
Create a route group with a matching prefix for each language to redirect users to their preferred content. For instance, we could have:
```php
// routes/redirect_lang.php
Route::get('/{locale}', function ($locale) {
  return redirect()->to(route('home'))->with('locale', $locale);
});
```
This will enable users to enter a specific language prefix in the URL and be redirected to the default home page with that language set.

5. Enhancing user experience:
To provide an enhanced user experience, we can include the current locale in the layout of our application. This allows us to display the selected language name and enable users to switch languages easily. In summary, creating translated routes for multilingual websites using Laravel is quite simple if handled correctly. By following these steps, you can accommodate your website visitors regardless of their native language.
