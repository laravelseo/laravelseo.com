---
title: "Check user's age with laravel validation rules"
description: "Checking User Age with Laravel Validation Rules: A Developer's Guide When building any application that involves user data, ensuring the integrity and..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Errors"]
featured: false
---

When building any application that involves user data, ensuring the integrity and validity of that data is paramount. One common requirement during registration is verifying that the user meets a certain legal age, such as being 13 years old or older. This often involves validating a Date of Birth (DOB). While Laravel provides powerful validation tools, calculating complex conditions like age requires moving beyond simple date comparisons and diving into custom logic.

This guide will walk you through the most robust way to check a user's age during registration in Laravel, ensuring that only eligible users can register.

## The Challenge with Simple Validation Rules

You correctly noted that basic validation rules like `before:yyy-mm-dd` are useful for enforcing specific date formats or ranges (e.g., ensuring the date is not in the future). However, they cannot inherently perform complex mathematical calculations like determining an age difference against the current date. To check if a user is 13 or older, we need to calculate the difference between their stored date of birth and today's date *at the time of validation*.

We need a method that bridges the gap between raw input data and derived business logic.

## Solution: Calculating Age Using Custom Validation Rules

The most professional approach in Laravel is to create a custom validation rule or utilize a closure within your Request or Controller to perform this calculation before the data hits the database. This keeps the validation logic tightly coupled with the input process.

Here is how we can implement a custom check to ensure the user is at least 13 years old:

### Step 1: Setting up the Validation Logic

Instead of relying on a simple `before` rule, we will use a closure within the `rules()` method of your Form Request or Controller validation. This allows us to access the submitted date and perform the required mathematical check.

Imagine you are using a Form Request class (which is highly recommended for complex input handling):

```php
// app/Http/Requests/RegisterUserRequest.php

public function rules()
{
    return [
        'name' => 'required|alpha|min:1',
        'email' => 'required|email|unique:users',
        'dob' => [
            'required',
            'date',
            function ($attribute, $value, $fail) {
                // 1. Check if the date is valid (already handled by 'date' rule)
                if (!$value) {
                    $fail('A valid Date of Birth is required.');
                    return;
                }

                // 2. Calculate the minimum acceptable birth date (13 years ago)
                $minAgeDate = now()->subYears(13)->toDateString();

                // 3. Check if the submitted DOB is before or equal to that calculated date
                if ($value->greaterThan($minAgeDate)) {
                    $fail('You must be at least 13 years old to register.');
                }
            },
        ],
    ];
}
```

### Explanation of the Logic

1.  **`now()->subYears(13)->toDateString()`**: This is the crucial part. We calculate the date exactly 13 years ago from the current moment and format it as a string. This represents the absolute latest date a person could have been born to be exactly 13.
2.  **`$value->greaterThan($minAgeDate)`**: We compare the submitted Date of Birth (`$value`) against this calculated minimum date. If the user's DOB is *later* than the calculated minimum date (meaning they were born too recently), we fail the validation and return an error message.

This approach ensures that the age check is dynamic, based on the current date, and is executed strictly during the input phase, preventing invalid data from being persisted in your database. For more advanced scenarios involving model relationships or complex data transformations, leveraging Laravel's Eloquent capabilities—as you see with powerful features on the [Laravel company website](https://laravelcompany.com)—is always the preferred path for maintaining clean and scalable code.

## Conclusion

Checking user age based on a date of birth is a perfect example of where custom validation logic shines. By moving beyond simple, static rules and implementing closure-based validation checks, you give yourself full control over the business rules applied to your application data. Always prioritize robust input validation; it is the first line of defense against bad data, ensuring that every user interaction adheres to the necessary constraints before any operation is executed.
