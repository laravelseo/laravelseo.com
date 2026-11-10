---
title: "Check whether password is correct or not in Laravel"
description: "Title: Check Whether Password is Correct or Not in Laravel In Laravel applications, ensuring the security of user accounts is crucial. One key aspect of this..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

Title: Check Whether Password is Correct or Not in Laravel

In Laravel applications, ensuring the security of user accounts is crucial. One key aspect of this is validating that users entering their passwords are authentic. In this comprehensive blog post, we'll explore how to check if a user's current password matches with the one stored in the database using different approaches. We will also discuss best practices and provide code examples for better understanding.

1. Using Laravel's built-in Authentication System:
Laravel provides an extensive authentication system that includes various functionalities, such as password validation. To check a user's current password and compare it with the one stored in the database, you can follow these steps:

a) In your controller function, ensure you have access to the 'user' variable (assuming your model is User). This could be from your Auth::check() method or by specifying which user is being accessed.
b) Use Laravel's hashed password verification method: $hashedPassword = Hash::make($newPassword); and $current_password_in_db = User::findOrFail($user->id)->password;
c) Compare these two hashes, checking if they match. If they do match, continue with your application logic. Otherwise, display an error message or block further processing.
d) Don't forget to include proper validation and handling of input errors in case the entered password is wrong or empty.

2. Using Laravel Validation Rules:
Laravel offers a rich set of powerful validation rules that you can use for various inputs, including passwords. To check if a given password matches with the one in the database, you could follow these steps:

a) Create a custom validation rule called 'matchesCurrentPassword'. This can be achieved by extending Laravel's Validator class and defining your logic within the $rules array:
   <?php
     protected function matchesCurrentPassword($attribute, $value, $parameters, $validator) {
       // Check if the authenticated user exists in your database.
       $user = User::find($this->password_confirmation_column);
       if ($user && Hash::check($value, $user->{$attributes['password']})) {
         return true;
       } else {
         return false;
       }
     }
   ?>
b) Use the created rule in your validation:
   <?php
     // In controller or request
     Validator::extend('matchesCurrentPassword', function ($attribute, $value, $parameters, $validator) {
       // Check whether the authenticated user's current password matches the entered one.
       return App\Rules\CheckPassword::validate($value);
     });
   ?>
c) In your controller function or request validation logic, apply this rule to check if the entered password is correct:
   <?php
     // In controller or request
     if ($validator->passes()) {
       // Password is valid
     } else {
       $this->throwValidationException(
         $request, $validator
       );
     }
     ?>

3. Using Laravel's Request Validation and Middleware:
Another approach to ensure password validation security in your application involves using the built-in Request Validator and middleware. This method provides an additional layer of protection against potential vulnerabilities.

a) Create a custom request class that extends Illuminate\Foundation\Http\Requests\Request like so:
   <?php
     namespace App\Http\Requests;
     use Illuminate\Foundation\Http\Requests\Request;

     class UpdatePasswordRequest extends Request {
       /**
         * Determine if the user is authorized to make this request.
         *
         * @return bool
        */
       public function authorize() {
         // Check if an authenticated user matches the current password with the one in the database.
         $user = User::find($this->id);
         if (!$user || !Hash::check($this->input('current_password'), $user->{$attributes['password']})) {
           return false;
         } else {
           return true;
         }
       }
     }
   ?>
b) In your controller function, use this custom request class for handling the password update:
   <?php
     // In controller
     public function store(UpdatePasswordRequest $request) {
       // Password validation logic goes here.
     }
    ?>

Conclusion:
In conclusion, ensuring the password's correctness is a critical aspect of any Laravel application. The approaches mentioned above provide different ways to achieve this goal and add an extra layer of security to your app. It's always recommended to follow best practices and keep yourself updated with the latest techniques in Laravel development. For more information on this topic, visit https://laravelcompany.com/blog for comprehensive guides and tutorials.
