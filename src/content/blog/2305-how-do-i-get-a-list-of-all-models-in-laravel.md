---
title: "How do I get a list of all models in Laravel?"
description: "Title: Efficiently Retrieve All Models and Database Tables in Laravel for Data Visualization Purposes Laravel is an incredibly powerful PHP framework that..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Efficiently Retrieve All Models and Database Tables in Laravel for Data Visualization Purposes

<p>Laravel is an incredibly powerful PHP framework that makes managing your applications a breeze, but sometimes you may need to extract more information about the project’s structure. In this blog post, we will focus on how to get a list of all models and database tables in Laravel with ease while providing a practical use case for visualizing data changes over time.</p>

<h2>Prerequisites:</h2>
To follow along with this tutorial, you should have a working knowledge of PHP and Laravel. It is also advisable to create or clone an existing Laravel application to experiment with the concepts discussed herein.

<h2>Steps to Retrieve All Models and Database Tables in Laravel</h2>

1. Access Your Application: First, navigate to your Laravel project's root directory within the server or local machine. (e.g., /Users/laraveluser/LaravelProjects/MyApp/)

2. List All Models: Utilize the composer command line interface, Composer, to list all models in your application. Open a terminal window and execute the following command: `composer dump-autoload`

   This process will generate an autoload file in your project's root directory that contains information about your models. You can access this file at /path/to/project/vendor/composer/autoload_classmap.php.

3. Parse the Composer File: Now, open the 'vendor/composer/autoload_namespaced.php' or 'vendor/composer/autoload_classmap.php' and search for "App" (assuming you use a vendor prefix of "App"). This is where Laravel loads your classes, including models.

   The class names in this file should correspond to the model names in your application. For example:
    `App\Models\User`, `App\Models\Post`, etc.

4. List Database Tables: To get a list of database tables in Laravel, you can use the command line tool "php artisan tinker" and execute the following code snippet:

   ```PHP
   <?php
    // php artisan tilex
    Illuminate\Support\Facades\DB::connection();
    $tables = DB::select('SHOW TABLES');

    foreach ($tables as $table) {
       echo $table->fields[0] . "<br>";
    }
   ```

5. Combine Models and Database Tables Data: You can combine the list of models with database tables to create a comprehensive analysis. Once you have both lists, you need to merge them into one array that will be used for your data visualization dashboard.

6. Visualizing Data Changes over Time: To build the dashboard, analyze historical data from your database daily, and store these insights in another table or collection. Then, use a time-based query to fetch changes made each day between specific periods (like 90 days). Finally, use JavaScript libraries like Chart.js or D3.js to visualize this data.

<h2>Conclusion:</h2>
With these steps, you can easily compile all models and database tables in a Laravel project for further analysis. By understanding the structure of your application, you gain valuable insights into how users interact with your system and identify potential areas for improvement. For more information on creating advanced dashboards with Laravel, visit our blog at https://laravelcompany.com/blog/.
