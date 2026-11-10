---
title: "Laravel String To Lower"
description: "Title: Laravel String To Lower: A Comprehensive Guide on Using Str Class and Handling Views Body: In this blog post, we will delve into using Laravel's..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "HTML", "PHP"]
featured: false
---

Title: Laravel String To Lower: A Comprehensive Guide on Using Str Class and Handling Views

Body: In this blog post, we will delve into using Laravel's built-in string manipulation class to convert a string to lowercase in your views. We understand the importance of having a well-structured approach when working with Laravel applications and how essential it is for developers to know about this specific functionality. So let's begin, shall we?

The first step in converting a given string in your view to lowercase is importing the class required to handle these operations, which is `Illuminate\Support\Str`. Here's an example:

```php
use Illuminate\Support\Str;
```

Now that you have imported the necessary class, let us look at how it works with your code snippet. As a developer, you might encounter situations where you need to convert the text within an image src attribute to lowercase. In this case, the following code:

```html
<img src="images/{{ Str::lower($matchup->visitorTeam) }}sml.jpg" alt="" />
```

Can be used to achieve the desired result. Let's take a closer look at how it works. First, the `Str::lower()` method is called. This method takes a string as its parameter and returns the lowercase version of that string. In your code snippet, `$matchup->visitorTeam` holds the name of a team which you have stored in the database, and we are calling the method on it to convert it to lowercase.

However, you received an error indicating that the class `Str` was not found. This error is due to the fact that Laravel's built-in functionality is not automatically loaded for views. In order to use the Str class in your view, you will need to explicitly load and register it. You can achieve this in two ways:

1. Using a service provider: Create a service provider (e.g., AppServiceProvider) and then register your custom class using the `$this->app` object inside its `register()` method.

   ```php
    public function register() {
      $this->app->bind(Str::class, static fn ($matchup) => new Str($matchup));
   }
   ```

2. Using the Facade: Alternatively, you can use the facade `Str` by including it in your view with the statement `use Illuminate\Support\Facades\Str;`. Then simply call its methods as normal functions without importing the class explicitly.

```php
<img src="images/{{ Str::lower($matchup->visitorTeam) }}sml.jpg" alt="" />
```

Following either of these approaches will ensure that you can use Laravel's built-in string manipulation functionality in your views, including the `Str::lower()` method on any string you desire.

In conclusion, learning how to properly include the necessary class and handle the Str methods in Laravel is essential for developers working with this framework. By using a service provider or a facade, you can seamlessly incorporate powerful functionality into your views, leading to more efficient and effective applications.
