---
title: "How add Custom Validation Rules when using Form Request Validation in Laravel 5"
description: "Title: Implementing Custom Validation Rules for Form Request Validation in Laravel 5 Body: In this blog post, we will explore how to add custom validation..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Implementing Custom Validation Rules for Form Request Validation in Laravel 5

Body: In this blog post, we will explore how to add custom validation rules when using form request validation in Laravel 5. We'll discuss the importance of creating a request class and extending validation functions, along with specific examples to follow if you require your own validation rule.

1. Creating a Request Class: To begin, let's create a custom request class for our form data. This can be done by running the following Artisan command:

   `php artisan make:request CustomRequest`

This will generate a new file named `CustomRequest.php` within your app/Http/Requests directory. Replace the existing placeholder code with the one shown in the example below. Here, we're specifying our custom rule 'numeric_array' for the 'items' field, along with two other rules:

   <pre><code> <?php namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CustomRequest extends FormRequest {
    protected $rules = [
        'shipping_country' => ['max:60'],
        'items' => ['array|numericarray']
    ];
}
</code></pre>

2. Adding a custom function for validation: Next, we need to create the custom rule function that will validate whether each element in the array is an integer or not. To do this, let's add the following code snippet within your project's main 'Validator.php' file (located at 'app/Http/Validators/Validator.php'):

   <pre><code> <?php namespace App\Http\Validators;

use Illuminate\Support\Facades\Validator;

Validator::extend('numericarray', function($attribute, $value, $parameters) {
    foreach ($value as $v) {
        if (!is_int($v)) {
            return false;
        }
    }
    return true;
});
</code></pre>

3. Using the Custom Validation with Form Request: Finally, we can utilize our custom validation rule within the request class as well as your application code:

   - In the request class (CustomRequest): Add the 'numeric_array' rule to validate the items field:
      <pre><code> <?php namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CustomRequest extends FormRequest {
    protected $rules = [
        'shipping_country' => ['max:60'],
        'items' => ['array|numericarray']
    ];
}
</code></pre>

   - In your application controller or routes file (where you handle form requests): Use the validateWithCustomRules() method to validate your request with custom rules and process accordingly. Here's an example:
      <pre><code> <?php namespace App\Http\Controllers;

use App\Http\Requests\CustomRequest;

class MyController extends Controller {
    public function store(CustomRequest $request) {
        // validate form request and handle accordingly
        if ($request->validateWithCustomRules()) {
            // do something with the validated data
        } else {
            return back()->withErrors($request->errors());
        }
    }
}
</code></pre>

In conclusion, by following these steps and creating a custom validation rule in Laravel 5's form request validation system, you can ensure that your application data is validated according to your requirements. Use this knowledge wisely to maintain clean and efficient code within your Laravel projects!
