---
title: "Create Models from database in Laravel"
description: "Generating Models from Database in Laravel In Laravel, you can create models based on your database tables by utilizing the powerful features provided in..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

<h2>Generating Models from Database in Laravel</h2>

In Laravel, you can create models based on your database tables by utilizing the powerful features provided in this framework. In this comprehensive blog post, we will walk through several methods to generate models from your database using Laravel.

<h3>Using Model Generators Package</h3>

Laravel provides a built-in package called "make:model" that helps you create empty models. To use it, follow these steps:

1. Run the command below to generate an empty model for your database table "users":
   `php artisan make:model User`

2. This will create a new file in the app/Models directory named 'User.php'. It contains all the essential structure for representing data from the users table.

However, this method only generates the basic model skeleton without taking into account your database relationships or attributes. To generate models with complex structures, you can opt for other methods.

<h3>Using Artisan Tinker</h3>

Artisan Tinker is an interactive command line tool that allows you to interact directly with the Laravel application environment. You can use it to explore your database and build your models based on the data. To generate a model using Artisan Tinker, follow these steps:

1. Run the command below to enter the interactive mode:
   `php artisan tinker`

2. Create a new instance of Eloquent Model representing a table called "users":
   `$user = App\Models\User::create([
     'name' => 'John',
     'email' => 'john@example.com',
   ]);`

3. Exit the Tinker session and create a new model in the app/Models folder:
   `php artisan make:model User -e`

4. Open the newly created 'User.php' file, and add the following code to it (assuming you have already initialized the database connection):
   ```PHP
   <?php

   namespace App\Models;

   use Illuminate\Database\Eloquent\Factories\HasFactory;
   use Illuminate\Database\Eloquent\Model;

   class User extends Model
   {
       use HasFactory;
       protected $fillable = [
           'name',
           'email',
       ];
   }
   ```

5. This model will automatically generate the necessary table structure and relationships based on your database schema.

<h3>Using Third-Party Tools</h3>

There are many third-party tools available that can help you create models from your database tables, such as Laravel Nova and Sailor. These tools come with a graphical interface, making it easier to define your data structures and relationships. To use them:

1. Install the appropriate tool (either Laravel Nova or Sailor) using Composer.
2. Run their respective setup wizards from within your Laravel application.
3. Connect your database and create new models with all the necessary attributes and relations.
4. Generate a new model from one of these tools based on your newly created table structures.

<h3>Conclusion</h3>

By following these methods, you can generate highly efficient models from within your Laravel application to accurately represent your database tables. Remember that each approach has its unique benefits and drawbacks, so choose the method that best suits your project's requirements. For more information on working with data structures in Laravel, check out our comprehensive guides at https://laravelcompany.com/blog/.
