---
title: "How to validate time in laravel"
description: "Title: Validating Time Inputs in Laravel: Enforce Specific Time Ranges Effortlessly Introduction: Time validation is an essential aspect of online..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Validating Time Inputs in Laravel: Enforce Specific Time Ranges Effortlessly

Introduction: Time validation is an essential aspect of online applications where users might need to enter time information within specific ranges. In this blog post, we will explore how to validate times in a Laravel application and ensure that only the desired time inputs are accepted. We'll discuss different approaches and techniques, as well as code examples for each method.

1. Using Form Request Validation:
   The easiest way to validate time inputs in your Laravel application is by leveraging Form Request Validation. This approach offers a convenient way of validating forms with minimal code. For the given scenario (validating inputs between 8 PM and 10 PM), we can create a custom request class for this form:

   `php artisan make:request TimeFormRequest`

   Next, open the newly created file ('TimeFormRequest.php') and add your validation rules within the 'rules()' method:

   ```php
   class TimeFormRequest extends FormRequest {
       public function rules() {
           return [
               'time' => ['required', 'between:16:00,22:00'],
           ];
       };
   ```

   Here, we have specified the validation rule 'between:16:00,22:00' to ensure that only times between 4 PM (16:00) and 10 PM (22:00) are allowed. This rule accepts the format "H:M" or "HH:MM".

   For further flexibility, consider adding validation for the AM/PM option. Replace 'between' with 'date_format' like below:

   ```php
   class TimeFormRequest extends FormRequest {
       public function rules() {
           return [
               'time' => ['required', 'date_format:H:iP'],
           ];
       };
   ```

   2. Using Laravel Validator:
      If you need more advanced validation or don't want to use Form Request, you can write a custom validator for this specific task. This would help keep your controllers clean and maintainable. Here's an example validator class ('TimeValidator.php'):

   ```php
   <?php
   namespace App\Validators;

   use Illuminate\Validation\Rule;
   use Illuminate\Support\Facades\Validator;

   Validator::extend('time_within', function ($attribute, $value, $parameters) {
       list($startTime, $endTime) = explode(':', $parameters);
       return strtotime($value) >= strtotime("$startTime:00") && strtotime($value) <= strtotime("$endTime:59");
   });

   Validator::validator()->rule(
       'time_within',
       new Rule('array|date_format:H:iP', '', function ($attribute, $value, $fail) {
           if (!is_array($value)) {
               return;
           } else {
               if (count($value) != 2) {
                   $fail('Please provide two valid time ranges separated by comma.');
               } else {
                   list(, $startTime, $endTime) = explode(':', $value);
                   Validator::extend('time_within', function ($attribute, $value, $parameters) use ($startTime, $endTime) {
                       return strtotime($value) >= strtotime("$startTime:00") && strtotime($value) <= strtotime("$endTime:59");
                   });
               }
           }
       })
   );

   App::bind('validator', function ($app) {
       return new Validator($app->make(Validator::class));
   });
   ```

   With this validator, you can validate inputs like:

   `$request->validate([
       'time_ranges' => ['required', 'array|date_format:H:iP|time_within:8:00,10:00'],
   ]);`

   3. Utilizing Custom Validation Rules for Advanced Functionality:
      In some cases, you might need to perform complex validations that are more than just the given example. Laravel offers flexibility with custom validation rules to achieve this. You can create a custom rule called 'checkTimeRange' and use it within your request classes. Here's an example:

   ```php
   Validator::validator()->rule(
       'time_ranges',
       new Rule('array|date_format:H:iP', '', function ($attribute, $value, $fail) {
           if (!is_array($value)) {
               return;
           } else {
               foreach ($value as $range) {
                   list(, $startTime, $endTime) = explode(':', $range);
                   Validator::extend('checkTimeRange', function ($attribute, $value, $parameters) use ($startTime, $endTime) {
                       return strtotime($value) >= strtotime("$startTime:00") && strtotime($value) <= strtotime("$endTime:59");
                   });
               }
           }
       })
   );
   ```

   In conclusion, Laravel provides multiple ways of validating time inputs while ensuring the flexibility to suit your application's needs. Whether you choose Form Request validation or custom validation rules, following best practices and structuring your code will make it easier to maintain. Refer to https://laravelcompany.com for more comprehensive tutorials on Laravel development and troubleshooting guides.
