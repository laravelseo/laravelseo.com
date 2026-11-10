---
title: "Laravel, how to redirect as 301 and 302"
description: "Title: Laravel Redirects: Understanding the Difference Between 301 and 302 Permanent and Temporary Redirections Body: In Laravel development, one of the most..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO"]
featured: false
---

Title: Laravel Redirects: Understanding the Difference Between 301 and 302 Permanent and Temporary Redirections

Body: In Laravel development, one of the most common scenarios is redirecting users from one route to another—and within that scenario, developers often want to specify the status code for their redirection. By default, Laravel uses a 302 Found status code when returning a response via its Redirect helper. This section will discuss how you can change this default behavior and what the differences are between these two redirection codes (301 Moved Permanently and 302 Found).

1. Using Custom Status Codes: To specify your desired status code, you can use Laravel's Redirect helper with the permanent() or temporary() methods. For instance, to generate a 301 redirection, change the previous sample code to:

   <pre><code>Route::get('foo', function(){ 
       return Redirect::permanent('/bar'); 
    });
</code></pre>

With this code, Laravel will set the HTTP status code as 301 Moved Permanently.

2. Changing the Default Behavior: If you want to change the default behavior of the Redirect helper by making it use a different status code by default, you can do so by changing the value of the 'redirect' configuration key in your .env file. Comment out or delete the following line:

   <pre><code>'redirect' => env('REDIRECT_DEFAULT', 302),
</code></pre>

Then add this new line below it:

   <pre><code>// Set the default redirect status code to 301 or any other suitable value.
'redirect' => env('REDIRECT_DEFAULT', 301),
</code></pre>

This change will affect all redirections in your app unless you override it with specific codes for individual routes, as shown above.

3. Understanding the Differences: The primary difference between a 301 Moved Permanently and a 302 Found status code is that a 301 redirect indicates that a web page has moved permanently to a new URL, whereas a 302 redirect implies a temporary redirection. A 301 redirect is used when a resource has been moved permanently and will not be returning to the original location any time soon. This update to your website's structure should be reflected in search engine indexes as well.

On the other hand, a 302 redirect is used when you want to direct users temporarily to another page for maintenance or while updating content, ensuring that they return to the original page once these activities are completed.

In summary, Laravel provides the needed flexibility for developers to specify redirection status codes according to their requirements. By understanding and using the correct code, you can ensure that your website's redirects follow best practices for SEO and user experience. Visit https://laravelcompany.com/services/laravel-development/ to learn more about Laravel development services.
