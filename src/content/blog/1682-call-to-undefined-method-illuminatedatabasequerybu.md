---
title: "Call to undefined method Illuminate\\Database\\Query\\Builder::lists() when seeding after updating to Laravel 5.3"
description: "Title: Understanding Call to undefined method issue when seeding after updating to Laravel 5.3 Body: Updating to Laravel 5.3 can sometimes bring unexpected..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Errors"]
featured: false
---

Title: Understanding Call to undefined method issue when seeding after updating to Laravel 5.3
Body:

Updating to Laravel 5.3 can sometimes bring unexpected issues, such as the "Call to undefined method" error in your application. In this blog post, we will take a look at a common case where you get an error message when seeding after updating to Laravel 5.3 and some possible solutions to fix it.

The issue occurs due to a change in Laravel's default behavior from earlier versions. Before Laravel 5.3, the 'lists()' method was available for the Database Query Builder. However, with the update, this method has been removed as it was considered deprecated and replaced by other methods that provide more functionality.

The original problem code sample looks like this:
<pre><code>        User::create([
        'name' =&gt; 'No User',
        'email' =&gt; 'nouser@nouser.com',
        'password' =&gt; bcrypt('0'),
        'provider' =&gt; '0',
    ]);
</code></pre>

Here, you are using the 'lists()' method within your User model:
<pre><code>        $users = User::lists('name');
</code></pre>

In Laravel 5.3, this line would cause an exception because there is no more 'lists()' method in Illuminate\Database\Query\Builder class. To fix it, you could replace the usage of 'lists()' with an alternative method, such as 'get()', which returns a collection object instead of a comma-separated list:
<pre><code>        $users = User::get();
</code></pre>

In this case, we will use the 'pluck()' method that was introduced in Laravel 5.3 to return only the specified column as an array. So your code would look like this:
<pre><code>        $userNames = User::select('name')->pluck('name');
</code></pre>

In another file where the issue occurs with a similar problem (using 'lists()' method in Tournament model):

<pre><code>        Tournament::create([
        'user_id' =&gt; 1,
        'name' =&gt; "name",
        'dateIni' =&gt;  $dateIni,
        'dateFin' =&gt;  $dateIni,
    ]);
</code></pre>

The fix is similar, you should replace the usage of 'lists()' with an alternative method. For example, using 'get()' in this case:
<pre><code>        Tournament::create([
        'user_id' =&gt; 1,
        'name' =&gt; "name",
        'dateIni' =&gt;  $dateIni,
        'dateFin' =&gt;  $dateIni,
    ]);
</code></pre>

Alternatively, you can change the code to use built-in methods like 'groupBy()' or other customized functions that will fit your application. With the help of these alternative methods, you should be able to resolve the issue and have a smooth transition to Laravel 5.3.

In conclusion, understanding the changes in database functionality between Laravel versions can save you from unexpected problems like this one. Replacing 'lists()' with more efficient methods such as 'get()', 'pluck()', or custom functions will ensure your application runs smoothly after updating to newer versions of Laravel framework.
