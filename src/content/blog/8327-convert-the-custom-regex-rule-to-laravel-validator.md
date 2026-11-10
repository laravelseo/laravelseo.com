---
title: "Convert the Custom Regex rule to Laravel validator"
description: "Mastering Custom Validation: Converting Complex Regex into Reusable Laravel Rules As developers working with large applications, one common challenge arises:..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

As developers working with large applications, one common challenge arises: managing complex, repetitive validation logic across numerous forms. When you find yourself manually typing intricate Regular Expressions for phone numbers, usernames, or specific string formats in every controller method, you are violating the DRY (Don't Repeat Yourself) principle. The solution is to abstract this logic into reusable components—specifically, custom validation rules in Laravel.

This guide will walk you through the exact process of creating a custom rule to handle your complex regex patterns, allowing you to validate form inputs cleanly and centrally.

## Why Custom Validation Rules?

Laravel provides a powerful system for input validation, primarily through the `Validator` class. While built-in rules like `string`, `required`, or `email` handle common scenarios, when your requirements involve highly specific pattern matching (like complex phone number formats or custom alphanumeric constraints), you need to extend Laravel’s capabilities.

Creating a custom rule allows you to encapsulate that complex logic into a single, named rule. This offers several major benefits:

1.  **Reusability:** You define the pattern once and use it anywhere in your application.
2.  **Readability:** Your validation calls become much cleaner (`'phone_number' => 'required|mobileNo'`) instead of containing massive regex strings.
3.  **Maintainability:** If you need to update a specific phone number format, you only change the logic in one place, not across dozens of files.

This approach aligns perfectly with good architectural principles, which is why frameworks like Laravel emphasize building robust systems (as seen in the philosophy behind tools like [Laravel Company](https://laravelcompany.com)).

## Step-by-Step: Creating a Custom Regex Rule

Let's take your request and implement it by creating a custom rule for phone numbers and another for titles using the Artisan command.

### Step 1: Generating the Custom Rule

First, use the Artisan command to scaffold your new validation rule. You correctly started this process:

```bash
php artisan make:rule MobileNo
```

This command creates a new class file in `app/Rules/MobileNo.php`. This class must implement the `Illuminate\Contracts\Validation\Rule` interface.

### Step 2: Implementing the Validation Logic

Open the newly created file (`app/Rules/MobileNo.php`) and define the validation logic using your desired regex patterns. For clarity, we will put the rules inside the `passes()` method.

For phone number validation, you need a rule that checks if the input matches your pattern: `/(^[0-9]+$)+/`.

```php
// app/Rules/MobileNo.php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class MobileNo implements Rule
{
    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        // Your regex for phone numbers (allowing sequences of digits)
        $pattern = '/(^[0-9]+$)+/';

        return (bool) preg_match($pattern, $value);
    }

    /**
     * Get the failed message when validation fails.
     *
     * @return string
     */
    public function message()
    {
        return trans('validation.mobile_no_invalid'); // Define this in your language files
    }
}
```

You would repeat this process for your title validation rule, perhaps creating a `TitleRule` to handle the complex alphanumeric check: `/(^[A-Za-z0-9@ ()%,:&lt;&gt;?*&amp;-]+$)+/`.

### Step 3: Using the Custom Rule in Your Request

Once the rule is defined, using it becomes incredibly simple. Instead of embedding the regex string into your controller, you reference the rule directly in your Form Request or Controller validation method.

If you are using a Form Request (the recommended practice), you define your rules like this:

```php
// app/Http/Requests/StoreFormRequest.php

public function rules()
{
    return [
        'phone_number' => ['required', new MobileNo], // Using the custom rule
        'title' => ['required', new TitleRule],     // Using another custom rule
        // other fields...
    ];
}
```

Notice how clean and declarative this is. The actual complexity of the Regular Expression is hidden inside the `MobileNo` class, making your business logic much easier to manage. This separation of concerns is a core tenet of well-designed software architecture.

## Conclusion

By embracing custom validation rules, you transform static, repetitive code into dynamic, reusable components. This practice keeps your controllers lean, your validation logic centralized, and your entire application more maintainable—a key goal in building scalable solutions with Laravel. Start small by abstracting your most tedious regex patterns first, and watch how much cleaner your development workflow becomes!
