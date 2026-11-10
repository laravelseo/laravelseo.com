---
title: "Disable Laravel's Eloquent timestamps"
description: "Title: Disable Laravel's Eloquent Timestamps Without Modifying Core Files Introduction: Incorporating timestamps into your database tables is an essential..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Title: Disable Laravel's Eloquent Timestamps Without Modifying Core Files

Introduction: Incorporating timestamps into your database tables is an essential aspect of modern web development, as it helps track the changes and activities performed by users. However, sometimes you might have additional logging mechanisms already in place or do not want to add timestamp columns for various reasons. Laravel's Eloquent offers a simple method to disable timestamps across all models without requiring any core file modification. In this comprehensive guide, we will explore the different approaches that can be used to achieve these results while maintaining the best coding practices and keeping your application up-to-date.

I. Using Model Traits:
The Laravel framework allows you to create custom model traits containing various functionalities related to timestamps. To disable timestamps across all models, simply follow these steps:

1. Create a new trait named 'DisableTimestamps' under the app/Models directory or wherever suits your project structure. Alternatively, you can place this in a shared/common location accessible for other projects if you are using a package manager like Composer.
2. Add the following code to the newly created file:
   ```php
   <?php
   
   namespace App\Models; // Adjust this according to your project structure
   
   use Illuminate\Database\Eloquent\Model;
   trait DisableTimestamps {
       /**
        * Ensure timestamps are not added to the model.
        */
       public function getDateAttributes()
       {
           return [];
       }
   }
   
   Model::unguard(); // This line is optional but recommended if you're using a guard class for your models
   ```
3. Now, in your Laravel application, include this trait in every model that doesn't need timestamps by adding the following code:
   ```php
   
    use App\Models\DisableTimestamps;
    /**
     * ... Other imports and function definitions...
    */
    class MyModel extends Model {
        use DisableTimestamps, OtherTraits; // Include other traits that you require for the model
    }
   ```
   This solution keeps your core files unchanged while still allowing you to disable timestamps as desired. It promotes code reusability and flexibility across all models in your project. However, it requires a little extra work as you need to include this trait for each model that needs timestamps disabled.

II. Using Global Model Hooks:
Alternatively, if you want a more generic solution without requiring any changes in the models themselves, you can use global model hooks. Follow these steps:

1. Create a ServiceProvider (if not existing) under the app/Providers directory and name it 'DisableTimestampsServiceProvider'.
2. Register your provider within the config/app.php file by adding the following line to the 'providers' section:
   ```php
   
    'App\Providers\DisableTimestampsServiceProvider'
   ```
3. Now, in your newly created ServiceProvider, add this code:
   ```php
   
    use Illuminate\Database\Eloquent\Model;
    use Illuminate\Support\Facades\Event;

    class DisableTimestampsServiceProvider extends ServiceProvider {
        /**
         * Bootstrap services.
         *
         * @return void
         */
        public function boot() {
            Model::unguard(); // This line is optional but recommended if you're using a guard class for your models

            Event::listen('eloquent.saving:before', function ($model) {
                if (empty($model->getRawAttributes())) {
                    $model->getDateAttributes() = [];
                }
            });
        }
    }
   ```
4. This code listens for the "eloquent.saving:before" event and ensures that any existing model attributes are empty before setting the timestamps, essentially stopping them from being populated. The code prevents Laravel's default behaviour of adding timestamps when performing a save operation on any model.

Conclusion: Disabling Laravel's Eloquent timestamps across all models can be achieved without modifying core files or requiring every model to include custom traits or traits from external packages. By using global hooks, you maintain the integrity of your application while still having control over your database timestamps as needed. The solution provided here is flexible and easily adaptable for a wide range of projects. Remember always to follow best practices to ensure optimal performance and scalability in your Laravel application.
