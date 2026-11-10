---
title: "Get all the users except current logged in user in laravel eloquent"
description: "Title: Retrieving All Users Except the Current Logged In User in Laravel Eloquent Introduction: Working with users is a crucial task in many applications,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Content", "PHP"]
featured: false
---

Title: Retrieving All Users Except the Current Logged In User in Laravel Eloquent

Introduction: Working with users is a crucial task in many applications, especially when dealing with privileges and roles. In this blog post, we'll discuss how to retrieve all users from your database except the current logged-in user using Laravel Eloquent ORM. This way, you can ensure that you don't accidentally select or manipulate your own data.

Step 1: Understand Controllers and Routes
Controllers are responsible for handling requests and returning responses based on the given parameters. In this case, we will create a controller to handle the process of retrieving all users except the current logged-in user. This is usually done in the "show" or "index" methods, depending on your web application structure.

Step 2: Add the Controller Method
Below is an example implementation of a show method that will return all users from the database without the currently logged-in user. Keep in mind that you can modify this controller to fit your specific needs and requirements.

<pre><code>    <?php
     // UserController.php
     namespace App\Http\Controllers;

     use Illuminate\Support\Facades\Auth;
     use App\Models\User;

     public function show() {
         $current_user = Auth::user();
         if ($current_user) {
             $users = User::where('id', '!=', $current_user->id)->get();
             return response()->json($users);
         } else {
             return response(['error' => 'Unauthorized'], 401);
         }
     }
    ?>
</code></pre>

In this example, we first fetch the currently logged-in user. We then use Laravel Eloquent to query the database for all users except the one with the given ID. If no user is found, an error response will be returned instead (optional logic added). The data is returned as JSON, which is a common format used in web applications.

Step 3: Call the Route from Your Front-End Code
Once you have created your controller and route, you can call it from your front-end code to retrieve users except the current logged-in user. Here's an example of how this would look using JavaScript AJAX:

<pre><code>    $.ajax({
         url: '{{route('show')}}',
         type: 'GET',
         success: function (data) {
             console.log(data); // All users except your own
         }
     });
</code></pre>

In this example, we're using jQuery to perform an AJAX request to the show route and logging the returned data in JavaScript. The data will include all users from the database minus the one you are currently authenticated as.

Conclusion: By following these steps carefully, you can retrieve all users except your current logged-in user using Laravel Eloquent ORM. This technique is essential when ensuring no conflict occurs within your web application or when working with sensitive data that shouldn't belong to the current user. Incorporate this knowledge into your projects and ensure a secure and well-managed database system for all users.
