---
title: "Class 'MongoDB\\Driver\\Manager' not found"
description: "Title: Understanding and Resolving \"Class 'MongoDB\\Driver\\Manager' not found\" Error When Integrating MongoDB with Laravel Body: When integrating MongoDB with..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "PHP", "Errors"]
featured: false
---

Title: Understanding and Resolving "Class 'MongoDB\Driver\Manager' not found" Error When Integrating MongoDB with Laravel

Body:
When integrating MongoDB with your Laravel application using the jenssegers/laravel-mongodb package, you might encounter the error "FatalErrorException in Client.php line 56: Class 'MongoDB\Driver\Manager' not found" while running your code. This error typically occurs when the required classes for interacting with MongoDB are missing from your project.

To resolve this problem, follow these steps.

1. Ensure that you have installed and configured the jenssegers/laravel-mongodb package correctly. You can check out their installation guide on GitHub: https://github.com/jenssegers/laravel-mongodb#installation.

2. Confirm that your Laravel project is using composer autoloading to register the required namespaces. The autoloader can be found in the root of your project. For example, assume you have installed laravel-mongodb via Composer:

   ```php
   require __DIR__.'/autoload.php';

   $loader = require 'vendor/autoload.php';

   // ... (existing code)
   ```

3. Ensure that the jenssegers/laravel-mongodb package is registered in your composer.json file:

   ```json
   "require": {
       "jenssegers/laravel-mongodb": "*"
   }
   ```

4. Verify your PHP configuration to ensure that the mongo extension is enabled and that MongoDB client libraries are being loaded in the correct location. This can be found in your phpinfo() output in the "Mongodb" section:

    - Ensure that mongo.so is listed under Loaded Extensions.
    - Check if mongo support is set to On.

5. Double-check your code and confirm you are using the correct namespaces for MongoDB classes. In this case, the code you provided should be:

   ```php
   <?php

   namespace App\Http\Controllers;

   use Illuminate\Http\Request;

   use App\User;

   class NewController extends Controller
   {
       //
       public function index(){
           $var = User::all();
           var_dump($var);
       }
   }

   And here follows the default user.php file provided by Laravel:

   <?php

   namespace App;

   use Illuminate\Foundation\Auth\User as Authenticatable;
   use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

   class User  extends Eloquent 
   {
       /**
        * The attributes that are mass assignable.
        *
        * @var array
        */
       protected $collection = 'users_collection';
       protected $fillable = [
           'name', 'email', 'password',
       ];

       /**
        * The attributes excluded from the model's JSON form.
        *
        * @var array
        */
       protected $hidden = [
           'password', 'remember_token',
       ];
   }
    ```

6. If all of these steps have been followed and you still receive the error, ensure that your code is using the correct file path for autoloading. The default composer autoloader usually locates all classes in the vendor/autoload.php file within the project directory. If you've moved this file or altered its contents, update the required namespace paths accordingly to include the MongoDB\Driver class.

By following these steps, you should be able to resolve the "Class 'MongoDB\Driver\Manager' not found" error and successfully integrate MongoDB with your Laravel application.
