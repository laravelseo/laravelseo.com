---
title: "laravel model callbacks after save, before save, etc"
description: "Title: Efficiently Using Model Callbacks in Laravel for Save Operations Introduction: In the world of web application development, the MVC (Model View..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Title: Efficiently Using Model Callbacks in Laravel for Save Operations

Introduction: In the world of web application development, the MVC (Model View Controller) framework is widely used due to its simplicity and efficiency. One such popular PHP framework is Laravel. While working with models and saving data, developers often require certain functions to execute before or after a save operation. Fortunately, Laravel offers several ways to achieve this using built-in features and custom approaches.

Body:

1. Using Laravel Observers for Model Callbacks:
   One of the easiest methods to implement callbacks in your Laravel application is by leveraging model observers. Laravel provides a mechanism called model observers that enables you to define the behaviors that should be executed before or after saving, updating, or deleting a particular model. Here's how you can use them:

   a. Create a new observer class in your project's app/Observers directory and name it "MyModelObserver.php".
   b. Define callback methods within the observer for each desired action (save, update, or delete) like this example:
      - beforeSave() to execute some logic just before saving the model data.
      - afterSave() to execute the logic after successfully saving the model's data.
      c. In Laravel 5.4 and later versions, you can also define a constructor in your observer class:
        ```php
        public function __construct(MyModel $model) {
            $this->model = $model;
        }
        ```

   d. Connect the observer to its respective model by adding code like this to your models' boot() method:
     ```php
     protected static function boot() {
         parent::boot();

         static::$create(function ($model) {
             $myObserver->created($model);
         });

         static::$updated(function ($model) {
             $myObserver->updated($model);
         });

         static::$deleted(function ($model) {
             $myObserver->deleted($model);
         });
     }
     ```

   e. Finally, register the observer in app/Providers/AppServiceProvider.php's boot() method:
     ```php
     public function boot() {
         \Illuminate\Database\Eloquent\Model::observe('MyModelObserver');
     }
     ```

2. Using Laravel Events for Complex Callbacks:
   If you need more flexibility and control during your model callbacks, using Laravel events can be an effective approach. You could create a custom event like "SaveModelData" that occurs before or after saving the data. Then, listen to this event in your application and perform any necessary actions. Here's how:
   a. Define the custom event class in app/Events/SaveModelEvent.php:
      ```php
      use Illuminate\Broadcasting\Channel;
      use Illuminate\Queue\SerializesModels;
      use Illuminate\Foundation\Events\Dispatchable;
      use Illuminate\Http\Request;

      class SaveModelEvent implements Dispatchable
      {
          use SerializesModels;

          public $model;
          public $request;

          public function __construct(object $model, Request $request)
          {
              $this->model = $model;
              $this->request = $request;
          }
      }
      ```
    b. In your controller or request handling class, dispatch the event:
     ```php
      public function store(Request $request, MyModel $model) {
         // Store the model data
         $myModelData = $this->saveModel($model);

         event(new SaveModelEvent($myModelData, $request));
      }
     ```
    c. Listen for this event and perform the desired callback actions:
      ```php
      public function handleSaveModelEvents() {
          // Listen to custom events
          \Illuminate\Support\Facades\Event::listen(
              SaveModelEvent::class,
              function ($event) {
                  if ($event->method('isBeforeSave')) {
                     // Before save callback logic goes here.
                  } else if ($event->method('isAfterSave')) {
                      // After save callback logic goes here.
                  }
              }
          );
       }
      ```

Conclusion: Laravel offers several methods to implement callbacks on model events, such as using observers for simple needs or even using Laravel events for more complex requirements. To make the right choice depends on your application's specific needs and requirements. In summary, consider using Laravel observers when you have general behaviors that are relevant across multiple models. On the other hand, utilize custom events if you need more flexibility in defining callbacks or handling different scenarios within a single model.
