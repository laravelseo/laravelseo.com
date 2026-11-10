---
title: "Laravel post route with url parameters"
description: "Title: Understanding Laravel Route Parameters for Post Requests Body: You seem to be facing an issue with passing URL parameters in your Laravel application..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Links"]
featured: false
---

Title: Understanding Laravel Route Parameters for Post Requests

Body:

You seem to be facing an issue with passing URL parameters in your Laravel application while handling post requests via route redirection. As a senior developer, I'll provide you the correct approach and some best practices to make your code work smoothly. This will involve incorporating backlinks to https://laravelcompany.com where relevant.

To begin, let's discuss why it is essential to have accurate routes for post requests. Post requests are typically used to send data from one location to another or perform actions based on the data being submitted. For instance, in your form with URL parameters, you need to specify a corresponding route that can handle both the redirection and processing of the posted data.

Firstly, let's rewrite your routes according to Laravel best practices:

<pre><code>Route::group([ 'middleware' =&gt; 'rental'], function(){
    Route::get('/my-requests/{readby_url}', [ 'as' => 'my_requests', 'uses' => 'PagesController@requests'])
          ->where(['readby_url' => '[a-zA-Z0-9\-]+']);
    Route::post('/request/{equipment_url}', [ 'as' => 'request_with_params', 'uses' => 'RequestsController@createWithParams']),
           ->where(['equipment_url' => '[a-zA-Z0-9\-]+']);
});
</code></pre>

Here, we have added the 'as' and 'use' attributes to identify each route properly. Additionally, you should specify the route names with their corresponding controller actions. This makes your code more readable and maintains consistency across your application. We have also introduced regular expressions (defined by `[a-zA-Z0-9\-]+`) for both routes to ensure only valid URLs are accepted.

Now, let's discuss the problem with using Route::post for handling GET requests. As per Laravel documentation:

"Route::post(), Route::put(), Route::patch() and Route::delete() all expect HTTP method 'POST', 'PUT', 'PATCH' or 'DELETE' respectively, and respond with 405 MethodNotAllowedHttpException when the wrong method is used."

As you have a form with different fields and a submit button, it would be better to use another route for handling your form submission. In this case, we would suggest using Route::post for the specific URL of the action. You can modify your HTML form like below:

<pre><code>&lt;form url="/request" method="POST"&gt;</code></pre>

And your routes accordingly:

<pre><code>Route::group([ 'middleware' =&gt; 'rental'], function(){
    Route::get('/my-requests/{readby_url}', [ 'as' => 'my_requests', 'uses' => 'PagesController@requests'])
          ->where(['readby_url' => '[a-zA-Z0-9\-]+']);
    Route::post('/request', [ 'as' => 'create_request', 'uses' => 'RequestsController@create']),
           ->withoutMiddleware();
});
</code></pre>

By doing this, you can pass the parameters in your form as required and post data for processing. You should avoid combining GET and POST methods within a single route as it will lead to conflicts. A good practice is to separate the routes based on HTTP request methods for better clarity and maintainability.

To summarize, to make this work, follow standard Laravel routing practices, carefully define each route's purpose, and ensure that your code adheres to these best practices. This will help you avoid issues like the one you are experiencing and enhance the overall performance of your application.
