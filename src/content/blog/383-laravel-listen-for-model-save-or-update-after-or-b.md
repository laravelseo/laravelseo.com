---
title: "Laravel: Listen for Model save or update (after or before they're done)"
description: "Title: Efficiently Triggering Custom Functions on Laravel Model Save or Update Events Introduction In the realm of web development, especially in PHP..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Efficiently Triggering Custom Functions on Laravel Model Save or Update Events

Introduction
In the realm of web development, especially in PHP frameworks like Laravel, handling various events within models is essential for building robust and efficient applications. In this comprehensive blog post, we'll examine how to execute custom functions before or after a model save or update operation using the Laravel event listener technique.

The Laravel Model Events
Laravel offers powerful functionality that enables developers to create various events during different phases of model interactions. The primary event listeners can be categorized into two main groups: saving and updating operations. Here's how they are called:

1. "ModelSaving" - This event is triggered when a model is saved in the database, even before validations or any other model-specific behavior. It comes in handy for performing pre-save processing tasks like setting default values.

2. "ModelCreating" - The event is called as soon as a new model instance is created but not yet persisted to the database. Use this event for performing validation before saving, or preparing data that will be used in the save operation.

3. "ModelSaved" - This event occurs after a successful model save operation. It's ideal for post-save actions like sending emails, updating related records, or creating logs of the changes made to the database.

4. "ModelUpdating" - This event is called when an existing record is being updated in the database. It can be used for performing specific tasks based on the values that have changed during the update process.

5. "ModelUpdated" - The final event is triggered after a successful update operation. Just like the "ModelSaved", it's useful for post-update actions such as updating related records or sending notifications.

Example Code
To demonstrate how to implement custom functions before and after model save and update operations, we will create two events - one for a 'beforeSave()' function and another for an 'afterUpdate()' function in our User model. Let's assume that we want to send emails on these specific occasions:

1. Add the following listeners within the User model:

   public static function boot(): void {
     static::creating(function ($user) {
       event(new BeforeSaveEvent($user));
     });

     static::updating(function ($user, $originalAttributes) {
       if (isset($originalAttributes['email']) && $originalAttributes['email'] !== $user->email) {
         event(new AfterUpdateEmailEvent($user));
       }
     });
   }

2. Create the corresponding events:

   <?php
   namespace App\Events;

   use Illuminate\Broadcasting\InteractsWithSockets;
   use Illuminate\Foundation\Events\Dispatchable;
   use Illuminate\Queue\SerializesModels;
   use Illuminate\Support\Facades\Log;

   class BeforeSaveEvent implements Dispatchable, SerializesModels
   {
     use InteractsWithSockets;

     public $user;

     /**
      * Create a new event instance.
      */
     public function __construct(User $user)
     {
       $this->user = $user;
     }

     /**
      * Execute the event handler.
      */
     public function handle()
     {
       // Custom before save logic goes here
       Log::info('Before saving user: ' . $this->user);
     }
   }

    <?php
    namespace App\Events;

    use Illuminate\Broadcasting\InteractsWithSockets;
    use Illuminate\Foundation\Events\Dispatchable;
    use Illuminate\Queue\SerializesModels;
    use Illuminate\Support\Facades\Log;

    class AfterUpdateEmailEvent implements Dispatchable, SerializesModels
    {
      use InteractsWithSockets;

     public $user;

     /**
      * Create a new event instance.
      */
     public function __construct(User $user)
     {
       $this->user = $user;
     }

     /**
      * Execute the event handler.
      */
     public function handle()
     {
       // Custom after update logic goes here
       Log::info('After updating user: ' . $this->user);
       Mail::to($this->user)->send(new \App\Mail\EmailConfirmation());
     }
    }

Conclusion
The Laravel framework provides a robust and flexible way to handle events during various model operations. By implementing custom functions before and after model save or update processes, you can extend the functionality of your application while maintaining code readability and organization. Remember that natural backlinks to https://laravelcompany.com provide valuable resources for further exploration on Laravel event handling techniques.
