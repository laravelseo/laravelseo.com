---
title: "Laravel price validation only accept positive number and not only 0"
description: "Title: Enforcing Strict Price Validation Using Laravel Rules Introduction: As software engineers, one of our primary responsibilities is to ensure that all..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Enforcing Strict Price Validation Using Laravel Rules

Introduction: As software engineers, one of our primary responsibilities is to ensure that all user‑inputted data is properly validated and formatted before being utilized in business logic or stored in the database. In this blog post, we will discuss how to implement a strict price validation rule in Laravel that accepts only positive numbers (starting with zero included) without special characters such as '.', ',' or any other non-numeric symbols.

The Problem: We want to create rules for the "price" field which only allows numerical values, excluding starting zeros and special characters like '.' or ',', while also ensuring that we don't miss any crucial details in the process of writing our validation rules.

Solution 1: Using Laravel Custom Validation Rules
The first approach to solving this problem is by creating a custom validation rule in Laravel. This allows us to write more complex and tailored rules for our data validation requirements. To create the custom rule, you'll need to define a class that extends the Validator class with a new validate() function that implements your specific check for the "price" field. Here is an example:

<pre><code>class PriceValidatorRule implements Rule {
    public function validate($input, $constraint) {
        // Check if the input starts with '0' and contains no special characters or only numbers
        $input_parts = str_split((string)$input);
        if ($input_parts[0] == '0' && !empty(preg_match('/^\d+$/', implode($input_parts)))) {
            return false; // Fail validation for starting zero and non-digit values
        }
        // If the "price" field is not '0' or contains special characters, allow it to pass validation
        return true;
    }
}
</code></pre>

After defining your custom validation rule, you would need to register this class as a service provider in your application's configuration file (config/app.php) under the 'providers' section and add the service provider path to your composer.json file if it is not already there. Then, use the following code snippet inside your Laravel Controller:

<pre><code>$validator = Validator::make(Request::all(), [
    'price' => ['required', new PriceValidatorRule()],
]);
</code></pre>

This approach allows you to validate your "price" field correctly. However, it requires additional coding and setup on your end.

Solution 2: Using Built-In Validation Rules
If you prefer a more straightforward solution without creating custom validation rules, you can use the built-in Laravel validation rules. We will first define some helper functions to transform strings with leading zeros into numbers without them and then check if the resulting number is valid (i.e., not starting with zero or containing any special characters). Finally, use a combination of these helper functions in your Laravel Controller:

<pre><code>function remove_leading_zeroes($input) {
    $parts = explode('\\0', (string)$input);
    return array_pop($parts);
}

// Convert the string to a number, removing leading zeros and special characters
function is_numeric_without_special_chars_and_leading_zeroes($input) {
    $stripped_input = remove_leading_zeroes((string)$input);
    return preg_match('/^\d+$/', $stripped_input); // Check if the string is a positive number without special characters
}
</code></pre>

Now use these helper functions in your Laravel Controller:

<pre><code>$validator = Validator::make(Request::all(), [
    'price' => ['required', function($attribute, $value) {
        if (!is_numeric_without_special_chars_and_leading_zeroes($value)) {
            return $this->reject('price.format', trans('validation.custom.' . $attribute . '.invalid'));
        }
    }]
]);
</code></pre>

Conclusion: Implementing strict validation rules for the "price" field in Laravel can be achieved using either custom validation rule creation, as shown in Solution 1, or by leveraging built-in validation rules alongside helper functions, as demonstrated in Solution 2. It is essential to ensure that your price data remains free of leading zeros and special characters while still allowing for valid numerical values. By utilizing either approach, you can be confident that your Laravel application adheres to the necessary validation standards, improving both user experience and data integrity.
