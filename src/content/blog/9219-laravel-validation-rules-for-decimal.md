---
title: "Laravel validation rules for decimal"
description: "Laravel Validation Rules for Decimals: Moving Beyond Integers Wondering if it's possible to set rules for validating decimals with a format like XX,XX?..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Wondering if it's possible to set rules for validating decimals with a format like `XX,XX`? Many developers encounter this challenge when dealing with financial data, prices, or measurements. Often, the initial thought leads one toward integer validation, as you noted in your query. While using `'integer'` works perfectly for whole numbers, it completely fails when you need to capture fractional values, which is essential for currency and precise calculations.

As a senior developer working with Laravel, I can tell you that while the framework provides powerful tools for validation, handling decimals requires choosing the correct rule and understanding how data flows between the frontend, the database, and your application logic. Simply forcing an input into an integer field leads to data loss and incorrect business logic. Let’s dive into the correct way to handle decimal validation in Laravel.

## The Pitfall of Integer Validation

When you use a rule like `'integer'`, Laravel ensures that the submitted value consists only of whole numbers (e.g., `100`, `25`). If a user enters `$19.99` or `19,99` and tries to validate it against an integer rule, the validation will fail immediately because it contains non-integer characters (the decimal point or comma).

```php
// Example of incorrect handling for decimals
public static $rules = array(
    'price' => 'integer' // This will reject inputs like 19.99
);
```

This approach is fundamentally flawed for any scenario where precision matters. If you are dealing with monetary values, you need a mechanism that explicitly allows and validates the presence of decimal places.

## The Correct Approach: Using `numeric` and `decimal` Rules

To correctly validate decimal inputs in Laravel, you should leverage rules designed specifically for floating-point or currency values. The most appropriate rules depend on whether you are validating input before saving it (validation) or ensuring data integrity within your Eloquent model (casting).

### 1. Using the `numeric` Rule

The `'numeric'` rule is a good starting point. It allows validation of numbers that can contain decimal points, but it doesn't enforce specific precision limits as strictly as dedicated decimal rules do.

```php
// Example using numeric rule for basic float validation
public static $rules = array(
    'price' => 'numeric',
);
```

### 2. Utilizing the `decimal` Rule (Best Practice)

For financial applications, relying solely on generic `numeric` can still lead to floating-point arithmetic errors in PHP. The most robust method is to use the `'decimal'` rule or, even better, handle the input as a string and perform careful casting, especially when dealing with currency. Many developers find that using database-level decimal types (like `DECIMAL` or `NUMERIC`) combined with Laravel’s Eloquent casting provides the greatest safety net.

When setting up your validation within a Form Request, ensure you are checking the input format correctly:

```php
use Illuminate\Http\Request;

class PriceUpdateRequest extends Request
{
    public function rules()
    {
        return [
            'amount' => ['required', 'numeric', 'min:0.01'], // Ensures it's a number and greater than zero
        ];
    }
}
```

## Handling Formatting (The Frontend Consideration)

A common stumbling block is the formatting difference between regions (e.g., using a period `.` vs. a comma `,` as a decimal separator). When receiving data from a form, it often arrives as a string. Before validation, you must standardize this format.

If your input comes in with a comma (e.g., "19,99"), you should preprocess the string to use the standard PHP/Laravel decimal format (using a period):

```php
$userInput = '19,99';
$standardizedInput = str_replace(',', '.', $userInput); // Result: "19.99"

// Now validate $standardizedInput against your rules
```

## Conclusion: Precision Matters

To summarize, stop trying to force decimal data into an integer container. For validating decimals in Laravel, always use the appropriate validation rules like `'numeric'` or `'decimal'`. Furthermore, establish a strict pipeline where input is standardized (e.g., converting regional comma notation to dot notation) *before* it hits your validation layer. By adhering to these principles, you ensure that your data is not only validated correctly but also mathematically sound, which is crucial for any application built on the robust foundation of [Laravel](https://laravelcompany.com).
