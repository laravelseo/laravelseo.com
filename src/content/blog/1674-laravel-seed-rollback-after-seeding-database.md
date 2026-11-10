---
title: "laravel seed rollback after seeding database"
description: "Title: Rolling Back Laravel Seed Data After Database Seeding Introduction The Laravel framework provides an easy way for developers to generate their..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "HTML", "PHP"]
featured: false
---

Title: Rolling Back Laravel Seed Data After Database Seeding

Introduction

The Laravel framework provides an easy way for developers to generate their applications by providing predefined migrations and seeders. However, sometimes you may need to roll back the data that has been inserted into your database through seeding processes. This blog post aims at exploring ways of achieving this task in Laravel.

Understanding Database Seeds & Migrations

Laravel uses seeds to populate your database with sample data during development, allowing you to work on an actual structure and not just on empty tables. You can run seeders using the `php artisan db:seed` command, which executes all the provided seed classes. On the other hand, migrations help you manage the database schema of your application by creating and modifying table structures as needed.

Rolling Back Database Seed Data

As the Laravel documentation states, there is no direct command to roll back Laravel seeds like a "php artisan db:seed rollback" command. However, you still have options available to achieve this task manually or through custom seeders.

Manual Rollback Process

In the case of a manual process, you will need to follow these steps:

1. Stop your application's server if running locally.
2. Run `composer dumpautoload` from your terminal to update the autoloaded classes after changes.
3. Locate the seed files under `database/seeds`.
4. Comment out or remove the code responsible for creating data in your desired seeder class.
5. Migrate all your tables using `php artisan migrate:refresh` command to reset table structures and remove existing records. This will empty the database completely.
6. Run your migrations again by using the `php artisan migrate` command, which will generate new tables and recreate their structure without any existing data.
7. Rerun the seeders as normal with the `php artisan db:seed` command to repopulate the database with fresh data.
8. Restart your application's server if needed.

This process is effective but time-consuming and requires you to run through each seeder one by one. Therefore, it may not be the most efficient way in a large and complex project with multiple seeders involved.

Automated Rollback Process Using Custom Seeders

An alternative method for rolling back seed data is to create custom seeders that provide the rollback functionality. You can do this by creating two seeders: one responsible for deleting the records inserted by the original seed and another for restoring the default state of your tables.

1. Create a new seeder class called `RollbackSeeder` or choose an appropriate name in the "database/seeds" directory.
2. Within this seeder, write code to delete all data from the desired tables. For example:

```php
public function run()
{
    // Delete all records from the users table
    DB::table('users')->delete();
}
```

3. Create another seeder class called `ResetSeeder` or a similar name in your "database/seeds" directory and populate this with code to regenerate your database using migrations. For example:

```php
public function run()
{
    // Migrate all tables and reset their structure and data
    Artisan::call('migrate:refresh');
}
```

4. Finally, change the order of your seeders in the "database/seeds" directory to ensure that the `RollbackSeeder` is run before any other seeder. For example, if you had a "UsersTableSeeder" responsible for inserting records into the users table:

- Original Seeders Order: UsersTableSeeder, PostsTableSeeder, CommentsTableSeeder
- After Adding Rollback and Reset Seeders: RollbackSeeder, ResetSeeder, UsersTableSeeder, PostsTableSeeder, CommentsTableSeeder

Conclusion

Though Laravel provides no direct command for rolling back seed data, you can perform this manually or through custom-built seeders. The manual process allows you complete control over each seeder but might be time-consuming in complex projects. Creating custom seeders offers a more efficient alternative, allowing you to easily roll back and reset your database to its default state with just a few commands. In either case, remember to always have a backup of your database before performing any significant changes.
