---
title: "How to validate that a field must be true if another field is false"
description: "Mastering Conditional Validation in Laravel: How to Validate Dependencies Between Fields As developers working with web applications, one of the most..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers working with web applications, one of the most common—and often trickiest—problems we face is conditional validation. We frequently need rules that depend on the values of other fields. For instance, ensuring that if a user selects "No" for one option, they must also complete a corresponding secondary step.

The scenario you are facing—validating that if `independent_financial_advisor` is false, then four other fields *must* be true—is a perfect example of complex business logic validation. While standard Laravel validation rules like `required_if` handle simple one-to-one dependencies, handling multi-field, inverse conditional logic often requires stepping outside the built-in rules and crafting custom logic.

Let's dive into the best ways to solve this, focusing on creating robust and maintainable code.

## The Challenge with Simple Rules

Your current setup relies on simple field-level validation:

```php
'independent_financial_advisor' => 'required|boolean',
// ... other fields
```

This setup validates each field in isolation. There is no built-in Laravel rule that intrinsically understands the relationship: "If Field A = false, then Fields B, C, D, and E must all be true." This demonstrates why custom logic is often necessary for complex scenarios.

## Solution 1: Implementing a Custom Validation Rule (The Developer Approach)

Since standard rules fall short, creating a custom validation rule is the most powerful and flexible solution. This allows you to encapsulate your specific business logic into a reusable component. You can then reference all related fields within this rule's context.

To achieve this, we will create a rule that inspects the entire input data when a specific field changes its state. This requires registering the rule and ensuring it has access to the validation context.

### Step 1: Create the Custom Rule

We'll create a rule that checks for the inverse condition you described. For demonstration, let’s assume we want to enforce the following: If `independent_financial_advisor` is `false`, then all other fields must be `true`.

```php
// app/Rules/ConditionalDependencyRule.php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\Rule;

class ConditionalDependencyRule implements Rule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Commenting\RuleComment $fail
     * @param  string  $attribute
     * @param  mixed  $value
     * @return void
     */
    public function passes($attribute, $value, Closure $fail)
    {
        // 1. Check the trigger condition: If the financial advisor is FALSE...
        if ($value === false) {
            // 2. Check the required dependencies (assuming these are the other fields):
            $fieldsToCheck = [
                'understand_objective',
                'confirm_objective',
                'understand_term_held',
                'tax_relief'
            ];

            foreach ($fieldsToCheck as $field) {
                // We need to access the data being validated. In a typical Request scenario, 
                // this data is available via the request object passed into the validator context.
                // For simplicity in a standalone rule, we assume the overall input array is accessible or passed contextually.
                // In a FormRequest context, you usually check $this->input() or rely on the parent validation structure.

                // *** Note: The actual implementation detail depends heavily on where this rule is applied (FormRequest vs. Validator). 
                // For a custom rule used inside a FormRequest, access to other fields is often done via the Request object itself.
                
                // For this example structure, we simulate checking context data:
                if (!in_array($this->attributes['independent_financial_advisor'], [true])) { // This part needs context adjustment based on implementation location
                    $fail("When 'independent_financial_advisor' is false
