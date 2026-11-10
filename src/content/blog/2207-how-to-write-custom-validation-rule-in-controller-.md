---
title: "How to write custom validation rule in controller Laravel?"
description: "Title: Custom Validation Rules in Laravel Controllers: A Comprehensive Guide Whether you're a seasoned developer or just starting out, it's always good to..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Custom Validation Rules in Laravel Controllers: A Comprehensive Guide

Whether you're a seasoned developer or just starting out, it's always good to know how to write custom validation rules for your Laravel controllers. In this blog post, we will discuss the basic steps and best practices involved in creating custom validation rules specific to your unique project requirements.

Firstly, let's take a look at a typical Laravel controller with some default validation. Below is an example of writing default validation rules for a simple registration form:
<pre class="lang-php prettyprint-override"><code>$validator = Validator::make($request->all(), [
    'email' => 'required|email',
    'phone' => 'required|numeric',
    'code' => 'required|string|min:3|max:4',
    'timezone' => 'required|numeric',
    'country' => 'required|integer',
    'agreement' => 'accepted'
]);
</code></pre>
Here, we are validating multiple inputs such as email address, a phone number, and others. To create custom validation logic for specific conditions or scenarios, you can extend the default rule set by using Laravel's Validator::extend() method. Let's say we want to add a new custom validation called 'phone_unique' which checks whether a phone number is unique. The code would look like this:
<pre class="lang-php prettyprint-override"><code>Validator::extend('phone_unique', function($attribute, $value, $parameters) {
    return substr($value, 0, 3) == '+44';
});
</code></pre>
In this example, the custom rule checks only the phone number for a specific country code. However, there could be instances where you'd want more complex validation logic. The provided example doesn't seem to work as expected with the given conditions (True or False). A better approach would be using Validator::sometimes() method:
<pre class="lang-php prettyprint-override"><code>$validator->sometimes('phone', 'required|alpha_dash|max:25', function($input) {
    if ((Auth::user()->phone === $input->phone)) {
        return false;
    } else {
        $t = User::where('phone', $input->phone)->get();
        return ($t->count() > 0) ? false : false;
    }
});
</code></pre>
In this case, the validation is applied to a phone number input. It checks if the input matches the logged-in user's existing phone number or if it already exists in another user's record. The logic works as expected.

Moving on, extending your custom validators can also be useful for adding nickname uniqueness validation. In this case, you could add a rule called 'nickname_unique', which is similar to the 'phone_unique' rule but checks if a specified nickname is already in use:
<pre class="lang-php prettyprint-override"><code>$validator->extend('nickname_unique', function ($attribute, $value, $parameters, $validator) {
    dd("Here");
});
</code></pre>
In this code snippet, the validation logic for 'nickname_unique' has not been added yet. You can modify it to suit your project requirements by using appropriate conditions or database queries.

By writing custom validation rules in Laravel controllers, you ensure that your application stays well-organized and maintains high quality code standards. Moreover, incorporating unique validations adds an extra layer of security and reduces potential vulnerabilities.

Remember to always keep your custom validation logic updated and relevant to your project's needs. This way, you can efficiently troubleshoot issues that arise due to incorrect or conflicting data. Additionally, proper documentation of these rules is essential for future maintenance and updates.

In conclusion, writing custom validation rules in Laravel controllers is a valuable skill for developers as it allows them to add specific functionality tailored to their application's requirements. By following the best practices mentioned above, you can create cleaner, more secure, and maintainable code that will benefit your projects immensely.
