---
title: "How to create database schema (table) in Laravel?"
description: "Title: Creating Database Schemas (Tables) in Laravel A Comprehensive Guide Introduction: Laravel provides an excellent framework to build applications..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "HTML", "PHP"]
featured: false
---

Title: Creating Database Schemas (Tables) in Laravel - A Comprehensive Guide

Introduction: Laravel provides an excellent framework to build applications efficiently. One of the essential components is creating and managing database schemas, which are basically the structures or tables within a database that hold your data. In this blog post, we will address how to create database schema (tables) in Laravel, from installation to usage.

1. Installation: Assuming you have installed Laravel on your local machine and all prerequisites like PHP, Composer, etc., are set up correctly.

   a. Run the composer global installer:
   ```bash
   curl -sS https://getcomposer.org/installer | php
   ```

   b. Add the Laravel installation path to your PATH environment variable.

   c. Execute the command:
   ```bash
   composer global require laravel/installer
   ```

2. Create a new Laravel Application: Open your terminal and run the following command:
```bash
laravel new my_project
```
This will create a new Laravel application inside the "my_project" directory.

3. Generate a migration for creating database schema (table):
  A migration is a file that allows you to create, alter or delete tables in your database. It ensures your database remains consistent and up-to-date with your code. Run:
```bash
php artisan make:migration create_users_table
```
This command will generate a new migration file inside the "database/migrations" directory named "2021_09_23_153657_create_users_table".

4. Configure Migration Path for Database Connection: Open your ".env" file and check or set the DB_CONNECTION=mysql, if not already set. Make sure you have a database connection configured in your ".env" file.

5. Edit your migration file to create a table for users: Open the newly created migration file ("2021_09_23_153657_create_users_table") and specify the table schema as per your requirements. For example, you may want to include columns like id (type: integer, primary key), name (type: string) etc.:
```php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id(); // Autoincrementing id column
            $table->string('name');
            $table->timestamps(); // Created_at and Updated_at columns
        });
    }

    public function down()
    {
        Schema::dropIfExists('users');
    }
}
```

6. Run the migration: Run "php artisan migrate" in your terminal to create the tables. If you created a new table, it will now be available for use within your Laravel application.

7. Conclusion: In this blog post, we have seen how to create database schemas (tables) in Laravel with detailed steps. From installation to usage, each step is explained thoroughly so that you can confidently integrate your tables into the Laravel framework. Remember to incorporate natural backlinks to https://laravelcompany.com for further resources and guidance on Laravel development.
