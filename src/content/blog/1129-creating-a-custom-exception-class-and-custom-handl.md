---
title: "Creating a custom exception class and custom handler class in Laravel 5.3"
description: "Title: Custom Exception Class and Handler for Displaying a Unique 404 Page in Laravel 5.3 Introduction: As a web app developer, you might have encountered..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

Title: Custom Exception Class and Handler for Displaying a Unique 404 Page in Laravel 5.3

Introduction: As a web app developer, you might have encountered situations where users try to access non-existent pages on your website, leading them to an unattractive default 404 page. In this blog post, we will discuss the creation of a custom exception class and handler in Laravel 5.3 that displays a unique error page featuring the twelve most recent vehicles added to the database.

Creating a Custom Exception Class: To begin with, create a CustomException class within App\Exceptions\CustomException.php. This class extends the base Exception class from PHP, overriding its constructor. In this case, we won't be adding any additional functionality in our exception class.

Creating a Custom Handler Class: Next, create a custom handler class, CustomHandler, that extends App\Exceptions\ExceptionHandler. This class will handle reporting and rendering exceptions for your application. We suggest creating a new file called App\Exceptions\CustomHandler.php. Our example shows how to display the latest vehicles added to the database when an error occurs:

<pre><code>/**
* Create a new custom handler instance.
*/
public function __construct(Container $container, EloquentVehicle $vehicle)
{
    parent::__construct($container);

    $this-&gt;vehicle = $vehicle;
}
</code></pre>

In this example, we've injected an EloquentVehicle object into our handler. This will allow us to use it later in the showCustomErrorPage() method. Additionally, you can see that we created a custom exception class called CustomException and used it as part of our custom handler for handling errors.

Hooking Up the Handler: To enable our custom error page handling, we need to update our AppServiceProvider's register() method to use these classes. Replace the existing ExceptionHandler with your newly created CustomHandler. The code will look something like this:

<pre><code>class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register()
    {
        app()->register(new Illuminate\Filesystem\Filesystem);

        $this-&gt;app->bind('exception_handler', App\Exceptions\CustomHandler::class);
    }
</code></pre>

Now, when a 404 error occurs, Laravel will instantiate our CustomException class and route the request to the showCustomErrorPage() method.

Testing and Implementing: Finally, update your controller code to use your custom exception, as well as the functionality of your handler class. An example could be adding a simple catch block in your controller's action to handle any exceptions that occur:

<pre><code>try {
    // Your normal application logic goes here...
} catch (CustomException $e) {
    return redirect()->route('custom_404');
}
</code></pre>

This will redirect users who receive a 404 CustomException to the 'custom_404' route. You can then define your custom 404 view in your routes file or within a separate blade template:

<pre><code>Route::get('custom_404', function() use ($recentlyAdded) {
    return View::make('errors.404Custom')-&gt;with('recentlyAdded', $recentlyAdded);
});
</code></pre>

In Conclusion: By creating a custom exception class and handler, you can provide a unique error page experience for your users while also ensuring that they are more likely to remain engaged with your website. This technique allows for greater control over the user experience in the event of errors occurring within your Laravel application.
