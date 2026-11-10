---
title: "Laravel: Validate min and max value based on input fields"
description: "Laravel: Validating Min and Max Values Based on Input Fields As developers building complex applications with Laravel, we frequently encounter validation..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

As developers building complex applications with Laravel, we frequently encounter validation scenarios that go beyond checking a single field in isolation. One common requirement is ensuring that interdependent fields adhere to logical constraints—for instance, making sure a maximum value is always greater than a minimum value.

The specific challenge you are facing—validating that `max_price` is strictly greater than `min_price`—requires a slightly more advanced approach than standard single-field rules like `min` or `max`. While Laravel's built-in validator is powerful, cross-field comparisons often necessitate custom logic.

This post will explore the best ways to handle these dependent validations in Laravel, focusing on practical solutions for your scenario in Laravel 5.7 and beyond.

## The Limitation of Standard Validation Rules

When you use rules like `'max_price' => 'required|numeric|min:min_price'`, you are telling Laravel to check:
1. Is `max_price` present?
2. Is `max_price` numeric?
3. Is `max_price` greater than the value provided for `min_price`?

While this *seems* like a direct solution, standard validation rules generally operate on the data of the field being validated against defined parameters or other fields via specific extensions. For complex relational checks like "Field A must be greater than Field B," relying solely on nested rule syntax can become cumbersome and less readable.

A more robust, scalable approach involves leveraging custom validation rules or performing the comparison logic at a higher level in your controller.

## Solution 1: Implementing a Custom Validation Rule (The Laravel Way)

For truly complex dependencies, creating a dedicated custom validation rule is the most elegant and reusable solution. This keeps your controller clean and centralizes the business logic within the validation layer.

We can create a rule that checks the relationship between two fields simultaneously.

### Step 1: Create the Custom Rule

First, define a rule class (e.g., `GreaterThanMinPrice`) in your `app/Rules` directory. This rule will inspect the entire request data.

```php
// app/Rules/GreaterThanMinPrice.php
namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class GreaterThanMinPrice implements Rule
{
    /**
     * Determine if the validation passes.
     *
     * @param  array  $data
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        // Access both 'min_price' and 'max_price' from the request data
        $minPrice = $this->input('min_price');
        $maxPrice = $this->input('max_price');

        // Check if max is greater than min
        return $maxPrice > $minPrice;
    }

    /**
     * Get the failed message.
     *
     * @return string
     */
    public function message()
    {
        return 'The maximum price must be greater than the minimum price.';
    }
}
```

### Step 2: Apply the Custom Rule in the Request

Now, you apply this rule directly to your request validation. In Laravel, when dealing with multi-field dependencies during form submission, it is often more efficient to validate the entire payload together.

If you are using a `FormRequest`, you can define the rules there:

```php
// app/Http/Requests/PriceUpdateRequest.php
public function rules()
{
    return [
        'min_price' => ['required', 'numeric'],
        'max_price' => ['required', 'numeric'],
        // Apply the custom rule to ensure the dependency holds true
