---
title: "How to get last inserted id in Laravel?"
description: "Title: Easily Retrieving the Last Inserted ID in Laravel Applications Introduction: In any data driven application, managing database records is essential to..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Title: Easily Retrieving the Last Inserted ID in Laravel Applications

Introduction: In any data-driven application, managing database records is essential to maintaining efficient operations and providing an optimal user experience. Laravel, a popular PHP web application framework, offers several tools to simplify working with databases. One of these resources is the ability to efficiently retrieve the last inserted ID after a database operation.

Body:

1. Understand Database Transactions
As you work on inserting new records into the database, it's essential to understand how transactions influence your code. If a transaction fails or encounters an error, Laravel automatically rolls back any changes made during that process. In such cases, the last inserted ID will not be available since no record was successfully created.

2. Use Eloquent ORM
Laravel provides extensive support for working with relational databases through its ActiveRecord implementation known as Eloquent. When using Eloquent to create new records, you can access the last inserted ID by following these steps:

   a. Define your Model: Create a User model class and define the table name and related fields:

      ```php
      // app/Models/User.php
      class User extends Model {
          protected $table = 'users';

          public function setAttributes($attributes) {
              parent::setAttributes($attributes);

              $this->email_id = $email_id;
              $this->name = $name;
          }
      ```
   b. Use the Model's Insert Function: Create new records using your model class and its insert function with any required attributes as parameters:

      ```php
      // app/Http/Controllers/UserController.php
      public function store(Request $request) {
          $newUser = User::create($request->all());
      }
   c. Fetch the Last Inserted ID: Access the lastInsertId() method of the created model instance to get the last inserted ID:

      ```php
      public function store(Request $request) {
          $users = User::insert([
              'email_id' => $email_id,
              'name' => $name,
          ]);

          $lastInsertedID = $users->lastInsertId();

          return $lastInsertedID;
      }

3. Use Direct Database Queries with Fluent Query Builder
In case you prefer working directly with the query builder, here's how you can obtain the last inserted ID:

   a. Define Your Table and Required Fields:

      ```php
      // app/Models/User.php
      class User {
          public static function create($email_id, $name) {
              return DB::table('users')->insert([
                  'email_id' => $email_id,
                  'name' => $name
              ]);
          }
      }
   b. Perform the Insertion: Use your defined function to create new records with the relevant values:

      ```php
      public function store(Request $request) {
          User::create($email_id, $name);
      }
   c. Retrieve the Last Inserted ID: Use the DB connection's lastInsertId() method to get the last inserted ID:

      ```php
      public function store(Request $request) {
          // Get the last inserted record ID after executing the insertion query
          $lastInsertedID = DB::getPdo()->lastInsertId();

          return $lastInsertedID;
      }

Conclusion: Retrieving the last inserted ID allows you to efficiently manage your database records and maintain data integrity. By understanding how transactions work and utilizing Eloquent ORM or direct queries, you can easily determine the last inserted ID in Laravel applications. Remember to always use proper error handling techniques and optimize your code according to your project's needs for a seamless user experience.
