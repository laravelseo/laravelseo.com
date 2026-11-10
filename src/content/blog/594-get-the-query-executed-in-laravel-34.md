---
title: "Get the Query Executed in Laravel 3/4"
description: "Title: Retrieve Executed SQL Queries in Laravel 3/4 using Query Builder or Eloquent ORM Body: Retrieving the Raw Executed SQL Query Using Laravel Query..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Keywords", "PHP"]
featured: false
---

Title: Retrieve Executed SQL Queries in Laravel 3/4 using Query Builder or Eloquent ORM
Body:

<h2>Retrieving the Raw Executed SQL Query Using Laravel Query Builder</h2>

Laravel's query builder offers various methods to execute queries and retrieve data efficiently. However, if you need access to the raw executed SQL query, it is possible to achieve this with minimal effort. Here are two methods for doing so:

1. Create a custom method in your model to retrieve the raw executed query:
   <pre><code>class User extends Eloquent {

    public function getRawQuery() {
        return DB::getQueryLog()[-1]['query'];
    }
}
</code></pre>

In this example, we assume that you have an 'User' model. First, create a new method called 'getRawQuery()' within the model. Inside this function, use Laravel's DB facade to access and return the last query from the DB::getQueryLog(). The DB::getQueryLog() returns an array of executed queries which you can index by the array key [-1].

2. Leverage the Laravel debugger for better visibility:
   If you are using Homestead as your development environment, you can enable Xdebug to capture database queries. Simply add the following lines to your '.env' file:
   <pre><code>APP_DEBUG=true
APP_ENV=local
</code></pre>

Replace 'laravelproject' with the name of your Laravel project if it differs. Also, ensure you have the Xdebug extension installed on your local machine. After that, set breakpoints in all your queries to capture the executed SQL queries and their results:
<pre><code>DB::table('users')-&gt;where_status(1)-&gt;get();
//Breakpoint here
</code></pre>

For other IDEs like PhpStorm, you can use the 'xdebug_start_trace()' and 'xdebug_stop_trace()' functions. This will output your queries into a file named 'xdebug.log'.

<h2>Alternatively, Saving All Queries to Laravel Log File</h2>

You can save every executed query in the Laravel log by creating a custom logger method:

1. Create a new class called 'CustomLogger'. In this class, create a private property 'queries' that will store all executed queries. Then, add a public method to log executions:
   <pre><code>class Custom_Log extends Log {
    /**
     * @var array
     */
    protected $queries;

    public function log(string $message, array $context = array())
    {
        $this->queries[] = $message;

        parent::log($message, $context);
    }
}
</code></pre>

2. Next, replace the default Laravel logger with your custom class by updating the 'app/bootstrap/start.php':
   <pre><code>$app->configureMonologUsing(function ($logger) use ($env) {
    $logger->pushProcessor(new LogFormatter(new Custom_Log()));
});
</code></pre>

This example replaces the default processor (default log formatter) with a new one using your custom class. To make use of this logged queries, you can view them in the laravel.log file or retrieve it from anywhere within your application. Finally, remember to clear the cache and restart the server for any changes to take effect.

In Conclusion:
This blog post has walked through two methods for obtaining raw executed SQL queries in Laravel 3/4 using either Laravel Query Builder or Eloquent ORM. Furthermore, it provided an alternative approach of recording all database queries into your laravel log file. By following these steps and practices, you'll be able to optimize your application's performance and debugging capabilities.
