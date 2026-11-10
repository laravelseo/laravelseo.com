---
title: "How to reload/refresh model from database in Laravel?"
description: "Title: Reloading/Refreshing Models from the Database in Laravel Introduction In some situations within your Laravel applications, you may need to reload or..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content"]
featured: false
---

Title: Reloading/Refreshing Models from the Database in Laravel

Introduction
In some situations within your Laravel applications, you may need to reload or refresh models after making changes to their attributes. In this blog post, we'll discuss how to achieve this with a step-by-step guide on reloading/refreshing models using Laravel's Eloquent ORM.

Why Reload Models?
Reloading models can be useful when updating objects that are related to multiple tables or have various dependencies. It ensures that the model is populated with the most up-to-date data from its associated database tables, thus minimizing inconsistencies in your records.

Understanding Model Refreshing Methods
Laravel provides multiple ways to refresh models and reload their attributes:
1. Using the `refresh` method: This method is available on the model object itself. It simply instructs Eloquent to ignore all changes made before a save operation, which allows us to refresh its data from the database.
2. Using the `withTrashed` method: The `withTrashed` method can be used specifically in cases where the model was marked as deleted previously. You can think of it as temporarily restoring the soft-deleted record with all its attributes before making changes.
3. Using the Eloquent `newModelQuery` method: This approach involves retrieving a new instance of the model and populating it using the existing attributes from the database. This is useful when you want to ensure that the newly created object has a clean state without any residual values from previous changes.
4. Using the `create` or `updateOrCreate` methods: In some cases, you may need to create a new model instance if no record exists for the given input or update an existing one. These methods are useful when you're trying to ensure that your model is fully refreshed and contains the latest data from the database.

Reloading/Refreshing Model Example in Laravel
To demonstrate the process, let's go through a basic example using the above approaches:

1. `refresh` method: 
   ```php
   // Assume we have a User model
   $user = User::find(1);
   $user->email = 'newemail@example.com';
   $user->refresh();
   // This will refresh the user's email attribute from the database upon saving
   $user->save();
   ```
   2. `withTrashed` method:
      ```php
      // Assume we have a User model and deleted it using 'delete()'
      $deletedUser = User::find(1);
      $deletedUser->withTrashed()->restore();
      // This will refresh the user to its original state before deletion (including all attributes)
   ```
   3. `newModelQuery` method: 
      ```php
      // Assume we need a new model instance with the same fields of an existing one
      $user = User::find(1);
      $newUser = (new User)->newModelQuery()->with([
          'relationship' => function ($query) use ($user) {
              $query->where('user_id', $user->id);
          }
      ])->create();
   ```
   4. `create` or `updateOrCreate` methods: 
      ```php
      // Assume we have a User model and want to update its email attribute
      $existUser = User::find(1);
      if (!$existUser) {
          // Create a new user with the given attributes
          $newUser = User::create([
              'name' => 'New Name',
              'email' => 'new_email@example.com',
          ]);
      } else {
          // Update an existing user based on its email address
          $existUser->updateOrCreate(['email' => 'existing_email@example.com'], [
              'name' => 'Updated Name',
          ]);
      }
   ```

Conclusion
By understanding the different ways to reload and refresh models in Laravel, you can maintain the integrity of your database records and ensure that your code always works with the most current data. Incorporating these best practices into your development workflow will help improve the overall performance and stability of your Laravel applications. For more information on Eloquent ORM, feel free to visit our comprehensive documentation at https://laravelcompany.com.
