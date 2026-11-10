---
title: "Laravel Validation check array size min and max"
description: "Title: Laravel Validation Check for Array Size Range Introduction: Laravel is an outstanding PHP framework that provides powerful validation features to..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Title: Laravel Validation Check for Array Size Range

Introduction: Laravel is an outstanding PHP framework that provides powerful validation features to ensure the data received on your web application is of good quality. In this post, we'll explore how to check and validate whether an array contains a minimum of 2 values or a maximum of 4 values using Laravel validation rules.

Body:

1. Array Size Validation in Laravel: Laravel comes with several predefined validation rules that you can use for different data types, including arrays. The size rule is specifically designed to check if the array has a certain number of elements, either minimum or maximum. However, while it's useful to ensure there are a specific range of values within an array, it does not allow you to specify a min and max limit simultaneously.

2. Creating Custom Validation Rules: In cases where the predefined Laravel validation rules do not suffice, you can create custom validation logic to handle such complex scenarios. Let's create a function for this purpose.

3. Define Your Requirements: First, we need to determine our requirements. We want an array to contain at least 2 values and no more than 4 values. Here's the code for checking array size according to these rules:

   ```php
    public function validateArraySize($attribute, $values)
    {
        // Check if array is empty
        if (count($values) == 0) {
            return 'Array must not be empty';
        }

        // Check min and max array size requirements
        if (count($values) < 2 || count($values) > 4) {
            return 'The array should contain at least 2 and no more than 4 values.';
        }

        return true;
    }
   ```

4. Use the Custom Rule in Validation: Now that we have our custom validation function, we need to include it in the controller's class and use it for validation. Here's an example:

   ```php
   use Illuminate\Validation\Rule;
   class MyController extends Controller
   {
       // ... your other methods

       public function store(Request $request)
       {
           $validationRules = [
               'arrayField' => 'required|array|validateArraySize',
           ];

           $this->validate($request, $validationRules);

           // Continue with the rest of your logic
       }
   }
   ```

5. Wrapping Up: Laravel provides a versatile validation system that allows you to easily check and validate data coming from user input or backend requests. In this post, we've explored how to create custom validation rules using PHP for specific requirements such as checking the size range of an array while ensuring it is not empty. By combining predefined rules with custom functions, Laravel becomes a powerful tool for crafting robust and secure web applications. Always remember that proper documentation and unit tests can help ensure your code remains maintainable and efficient.
