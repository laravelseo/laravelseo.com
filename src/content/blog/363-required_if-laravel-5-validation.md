---
title: "required_if Laravel 5 validation"
description: "Title: Mastering Laravel 5 Validation with required if Introduction Laravel is a popular PHP framework that provides many useful validations to ensure user..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

Title: Mastering Laravel 5 Validation with required_if

Introduction

Laravel is a popular PHP framework that provides many useful validations to ensure user input is error-free. The required_if validation rule in Laravel 5 is one such feature that helps you specify different conditions for field validations based on other input values. In this article, we will discuss this important concept and understand how to implement it effectively in your Laravel applications.

What is the required_if Validation Rule?

The required_if rule allows you to set validation rules conditionally depending on other inputs. It ensures that a field is only considered as 'required' when certain conditions are met. You can use this rule to avoid unnecessary errors and improve your application's usability.

Example with Your Code

Your code snippet shows an issue where the sale_price input gets considered required even if it's under the "For Rent" section. To fix this, you need to modify the rules() method as follows:

<pre><code>
public function rules()
{
    return [
        'list_type'  => 'required',
        'sale_price' => 'required_if:list_type,For Sale',
        'rent_price' => 'required_if:list_type,For Rent',
    ]
}
</code></pre>

In this example, we set the sale_price as required only if the list_type has a value of "For Sale". Similarly, we make rent_price required for when the list_type is "For Rent".

How to Apply This Rule?

To add more complexity or flexibility to your application's input fields and their validation, you can use nested groups within the rules method:

1. Define a main group with your basic validations:
<pre><code>
public function rules()
{
    return [
        'list_type'  => 'required',
        'sale_price' => '',
        'rent_price' => '',
    ]
}
</code></pre>
2. Within the sale_price and rent_price fields, set more rules based on sub-conditions:
<pre><code>
public function rules()
{
    return [
        'list_type'  => 'required',
        'sale_price' => [
            'required_if:list_type,For Sale|numeric|max:99999999.99', // numeric input with a maximum value of 99999999.99
            'nullable_if:list_type,Not For Sale' // not required if list_type is not "For Sale" or "Not For Sale"
        ],
        'rent_price' => [
            'required_if:list_type,For Rent|numeric|max:99999999.99',
            'nullable_if:list_type,Not For Sale'
        ]
    ]
}
</code></pre>
3. In your HTML form, ensure that you use the appropriate jQuery to show/hide the relevant price fields based on the list_type selection.

Conclusion

The required_if rule in Laravel 5 allows developers to make their forms more user-friendly and efficient by setting validation rules conditionally. By utilizing this powerful tool, you can create a seamless user experience while keeping your application data clean and error-free. Always remember the importance of proper form validation for ensuring high-quality applications.
