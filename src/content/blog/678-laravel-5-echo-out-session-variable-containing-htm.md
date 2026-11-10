---
title: "Laravel 5 echo out session variable containing html in blade"
description: "Title: Displaying Session Variables Containing HTML in Blade Templates Effortlessly Body: Laravel is a popular PHP framework that offers a rich set of..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Content", "HTML"]
featured: false
---

Title: Displaying Session Variables Containing HTML in Blade Templates Effortlessly

Body:

Laravel is a popular PHP framework that offers a rich set of features for developers. One such feature involves handling session variables, including those containing HTML content. In your case, you're trying to display the contents of a session variable with HTML code in your Laravel view file (Blade template). At first glance, it might seem simple, but there are some best practices that can help you achieve this without compromising on the elegance of your code.

To begin with, let us break down the issue you're facing:
1. Your controller returns a redirect along with data to be passed into the session.
2. You use `@if(!empty(Session::get('error'))) {{ Session::get('error')}} @endif` in your Blade template to check if you have an error session variable and display its content. However, this does not render the HTML properly.
3. Switching to a traditional PHP code block, such as `<?php if(!empty(Session::get('error'))) { echo Session::get('error'); } ?>`, makes the HTML code work as expected.

Now, let us explore how you can display session variables containing HTML within your Laravel 5 Blade template while adhering to best practices and making use of Laravel's powerful features:

1. Create a custom helper method in your application's `helpers` directory for convenient access later. For example:
   ```php
   /**
    * Render HTML from session variable inside a Blade template
    */
   function renderSessionHTML($key) {
       return Session::get($key, null) ? (string) view('layouts._' . $key) : '';
   }
   ```

2. In your controller's redirect method:
   ```php
   return redirect('admin')-&gt;with($returnData);
   ```

3. Utilize the helper function in your Blade template:

   ```html+blade
   @if(!empty(renderSessionHTML('error')))
       {{ renderSessionHTML('error') }}
   @endif
   ```

This approach has several advantages and follows Laravel best practices:
- The HTML is separated from the controller code and placed in its own view file.
- It allows easy management of your session variables, as you can pass them as a key to the helper function instead of hardcoding it.
- It eliminates the need for explicitly checking for an empty variable, since the helper will return an empty string if no view exists for that specific key.

In conclusion, by utilizing Laravel's powerful features and following best practices, you can display session variables containing HTML in your Blade templates with relative ease. This method not only provides a cleaner code but also allows better management of your application's session variables. Remember to always keep your code well-structured, adhering to the Laravel philosophy and enhancing its flexibility and maintainability.
