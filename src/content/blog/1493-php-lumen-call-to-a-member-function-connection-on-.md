---
title: "PHP Lumen Call to a member function connection() on null"
description: "Title: Solving PHP Lumen Call to a member function connection() on null Issues with Eloquent Models Body: Encountering the \"Call to a member function..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

Title: Solving PHP Lumen Call to a member function connection() on null Issues with Eloquent Models

Body: <p>Encountering the "Call to a member function connection() on null" error in your Lumen project while using an Eloquent Model can be confusing, especially if you're new to Lumen or API development. This problem may arise due to various reasons, some of which are easy to fix. In this blog post, we will explore the cause and solution for this issue and help you avoid further complications in your project.</p>

<h2>Common Causes</h2>
<ol>
  <li>Not injecting database service in controller constructor: Ensure that you're properly using app('db') to access the database connection within your Lumen application. This will help prevent issues with null values.</li>
  <li>Using Eloquent models from different namespaces: If your model and controller are not placed in the same namespace, a null value may be returned when attempting to call functions on an Employee object, as it might think the connection is empty. Ensure that both files reside within the same namespace or update the autoloading configuration accordingly.</li>
  <li>Using Eloquent models without registering them: For using Eloquent classes, you must register them in your Lumen's service provider or bootstrap file (app/Providers/AppServiceProvider.php) to make sure the application can locate them when needed.</li>
</ol>

<h2>Solutions and Best Practices</h2>
<ol>
  <li>Inject database service in controller constructor: In your Lumen project, include app('db') within the construct method of all controllers that require access to the database connection, as shown below:</li>
<pre><code>public function __construct(Database $database) {
    $this->database = $database;
}
</code></pre>
  <li>Ensure both model and controller belong in the same namespace: Make sure your Eloquent models and controllers are placed within the same namespace, or update your autoloading configuration to allow Lumen to locate them properly. Using namespaces prevents name conflicts that may result in null values.</li>
  <li>Register Eloquent models with Lumen: In your application's bootstrap file (app/Providers/AppServiceProvider.php), add the following code to register your Eloquent models:</li>
<pre><code>class AppServiceProvider extends ServiceProvider {
    protected $models = [
        Employee::class,
        // Other model classes
    ];

    public function boot() {
        foreach ($this->models as $model) {
            $this->app->register(\Illuminate\Foundation\Providers\ModelServiceProvider::class);
        }
    }
}
</code></pre>
  <li>Use app('db')->select() for more complex queries: If you have to perform multiple database operations or need more advanced querying capabilities, use the app('db')->select() method. This will ensure that your Lumen application is using its database connection and avoiding issues with null values.</li>
</ol>

<h2>Conclusion</h2>
The "Call to a member function connection() on null" error in PHP Lumen can be caused by various factors, such as not injecting the database service or registering Eloquent models. By understanding the cause and implementing best practices to fix these issues, you can ensure the smooth running of your Lumen API project without any potential complications related to database connections.
