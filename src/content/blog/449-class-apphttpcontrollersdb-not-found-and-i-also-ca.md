---
title: "Class 'App\\Http\\Controllers\\DB' not found and I also cannot use a new Model"
description: "Title: Diagnosing and Resolving Laravel Class Not Found Issues with Models and Queries Introduction: In this blog post, we'll address two common issues..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Keywords", "PHP"]
featured: false
---

Title: Diagnosing and Resolving Laravel Class Not Found Issues with Models and Queries

Introduction:
In this blog post, we'll address two common issues encountered by developers working on a Laravel 5.0 project: the 'Class 'App\Http\Controllers\DB' not found' issue and the inability to use a newly created Model, specifically the Quotation class. As a senior developer and technical blogger, we'll provide you with solutions and best practices to help you overcome these challenges and ensure the smooth functioning of your Laravel applications.

Problem 1: 'Class 'App\Http\Controllers\DB' not found' when accessing the database.

Solution 1: Ensure correct import paths
Ensure that the correct import path is used for the Database facade in your code. In this case, it should be 'use DB;'. If you import the controller namespace or any other unnecessary imports, you might encounter errors like this one. Make sure to import only necessary namespaces and avoid conflicting definitions.

Solution 2: Check your Laravel version compatibility with the Database facade
Ensure that your Laravel project is using an appropriate version of the Database facade for your current Laravel version. Laravel often releases new versions, and they might contain changes to the database functionality or syntax. Always check the Laravel documentation to see if there are any breaking changes you need to account for. You can also use composer to manage dependencies and ensure compatibility by updating your requirements.

Problem 2: 'Class 'App\Http\Controllers\Quotation' not found when using a newly created Model

Solution 1: Check the namespaces in Model class files
Make sure that the new Model classes are properly declared in their respective namespace. For example, you can use 'namespace App;' at the top of the Quotations.php file and place your Model class underneath that namespace declaration. This ensures that Laravel recognizes the Model as part of its expected structure.

Solution 2: Ensure correct composer autoloading
Composer autoloading is responsible for loading classes based on their respective namespaces. If your project doesn't have a 'composer.json' file or it's outdated, you may not be able to use the new Model effectively. Ensure that you have a valid 'composer.json' file in place and update any dependencies as needed using composer install or update commands.

Solution 3: Check your import path for the Model class
Similar to checking the Database facade, ensure that you're importing the correct Model classes when required. In this case, you should use 'use App\Quotation;' instead of 'use App\Http\Controllers\Quotation;'. Using the controller namespace may result in the issue described above.

Conclusion:
By following these solutions and ensuring proper namespaces, database compatibility, and correct import paths in your code, you can easily resolve the two problems encountered while working on a Laravel 5.0 project. Remember to always check the official documentation for changes, updates, and best practices. In case of any additional difficulties or unclear concepts, consult resources such as our blog https://laravelcompany.com/. Happy coding!
