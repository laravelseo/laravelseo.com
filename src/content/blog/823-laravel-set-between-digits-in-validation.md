---
title: "Laravel set between digits in validation"
description: "Title: Laravel Validator: Ensuring Digits Between 1 and 10 are Input Using Custom Rules Body: Introduction The Laravel framework provides robust validation..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content"]
featured: false
---

Title: Laravel Validator: Ensuring Digits Between 1 and 10 are Input Using Custom Rules
Body:

<h2>Introduction</h2>
The Laravel framework provides robust validation functionality for handling user inputs. However, sometimes the built-in rules may not serve your specific requirements. In this blog post, we will discuss how to implement custom validation rules using Laravel 5.x when checking for input between digits (integers) between 1 and 10.

<h2>Leveraging Built-In Validation Rules</h2>
Before we dive into creating our own validation rule, let us first examine the given example code.

<pre><code>'required|integer|digits_between:1,10'
</code></pre>

This line uses three built-in rules as part of Laravel's validator. The required rule ensures that the input is not empty and is set to be mandatory. The integer rule checks if the value is an integer type. Finally, the digits_between ensures that the input contains between 1 and 10 digits only.

However, it appears that the current code accepts values of zero as well, which doesn't fit our desired requirement of a range between 1 and 10. Let us now understand how to create our own custom rule to fix this issue.

<h2>Creating Custom Validation Rules</h2>
In Laravel, we can create custom validation rules by extending the 'Validator' class in the AppServiceProvider or in a separate service provider file. Below is an example of creating a new validator for checking digits between 1 and 10:

<pre><code>class DigitBetweenOneAndTenValidator extends Validator
{
   /**
    * Create a new custom validation rule instance.
    *
    * @param mixed $value The value to validate.
    * @return bool|string
    */
   public function __construct($value)
   {
      parent::__construct();

      // Assign the given value and range values.
      $this->value = $value;
      $this->min = 1;
      $this->max = 10;
   }

   /**
    * Define the rule validation logic.
    *
    * @param string $attribute
    * @return bool|string
    */
   public function validate($attribute, $value)
   {
      // Check if the value is an integer and falls within the range of 1 to 10.
      if (!is_int($this->value) || $this->min > $this->value || $this->max < $this->value) {
         return "The input must be a digit between 1 and 10.";
      }

      // If the validation passes, return an empty string.
      return '';
   }
}
</code></pre>

This code creates the new custom rule by extending Laravel's Validator class, adding two additional variables for minimum and maximum values. The constructor assigns the given value to the 'value' variable while setting the default min and max values. Lastly, we define the validation logic within the 'validate' function, which checks if the input is an integer and falls between 1 and 10. If that's the case, it returns an empty string; otherwise, a custom error message is returned.

<h2>Implementing the Custom Rule</h2>
To use our newly created custom rule, we can now modify the original code example to call the appropriate validator method.

<pre><code>'display_post_count' =&gt; 'required|min:1|max:10',
</code></pre>

This line initially sets a value and attaches three rules for validation, including requiring the input, ensuring it is a minimum of 1 (as per your requirement), and limiting it to a maximum of 10. To implement our custom rule instead, we would use the following code:

<pre><code>'display_post_count' =&gt; 'required|digitBetweenOneAndTen',
</code></pre>

This line calls the newly created custom rule by passing its name ('DigitBetweenOneAndTenValidator') to the Rule constructor. This will ensure that the input only accepts values between 1 and 10 when it is a digit.

<h2>Conclusion</h2>
Custom validation rules are an important tool to have in your Laravel development arsenal, as they enable you to create unique validation scenarios for various types of inputs. In this blog post, we discussed how to leverage custom rules for checking an input with digits between 1 and 10 while ensuring that it only contains digits (integers) within the specified range. This approach ensures that your Laravel applications have robust validation functions, increasing their reliability and security.
