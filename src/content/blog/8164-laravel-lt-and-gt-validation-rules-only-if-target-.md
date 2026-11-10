---
title: "Laravel `lt` and 'gt' validation rules only if target fields are present"
description: "Laravel Validation: Enforcing Conditional Relationships with lt and gt Rules As developers working with Laravel, we often deal with scenarios where input..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As developers working with Laravel, we often deal with scenarios where input fields are optional or nullable. While built-in validation rules like `lt` (less than) and `gt` (greater than) are incredibly useful for single-field checks, they present a significant challenge when trying to enforce relational constraints between *multiple* optional fields.

This post dives into the specific problem of how to apply these cross-field validations—like ensuring that `min_height` is less than `max_height` only when both values are present—without resorting to overly complex custom rules or breaking the flow of our request validation.

## The Problem with Direct Cross-Field Validation

Let's establish the scenario: we have two integer fields, `min_height` and `max_height`, which are both optional (`nullable`). We want the rule: if both exist, then `min_height < max_height`.

If we try to set up the rules as follows:

```php
'min_height' => ['nullable', 'integer', 'lt:max_height'],
'max_height' => ['nullable', 'integer', 'gt:min_height'],
```

As you correctly pointed out, this setup fails. When a request only contains `min_height` (and `max_height` is null), the validator attempts to perform `min_height < null`, which often results in an error or unexpected behavior because the comparison involves a null value, not a valid integer range check. The built-in rules are designed for single-field comparisons; they don't inherently understand the conditional dependency on the presence of sibling fields.

## Solution: Moving Beyond Built-in Rules to Custom Logic

Since standard Laravel validation rules cannot natively handle this kind of dynamic, state-dependent cross-field comparison based on nullability, we must implement a solution that checks the relationship *after* the individual fields have been validated, or by implementing a custom rule.

For complex relational logic like this, there are two primary robust approaches:

### Approach 1: Post-Validation Logic (The Pragmatic Way)

For many applications, the cleanest approach is to let the initial request validation handle the basic constraints (is it an integer? is it present?) and then perform the complex cross-field validation in your controller or service layer. This keeps the validator focused on field integrity and the business logic separated from the input parsing.

**Example Implementation:**

```php
use Illuminate\Http\Request;

class HeightUpdateRequest extends Controller
{
    public function update(Request $request)
    {
        // 1. Validate individual fields first
        $validated = $request->validate([
            'min_height' => ['nullable', 'integer'],
            'max_height' => ['nullable', 'integer'],
        ]);

        $minHeight = $validated['min_height'] ?? null;
        $maxHeight = $validated['max_height'] ?? null;

        // 2. Apply the conditional relational rule manually
        if ($minHeight !== null && $maxHeight !== null) {
            if (!($minHeight < $maxHeight)) {
                throw new \Illuminate\Validation\ValidationException(
                    'The minimum height must be less than the maximum height.'
                );
            }
        }

        // Proceed with model update...
    }
}
```

This approach is highly recommended for simple comparisons because it separates concerns: validation handles type checking, and the controller handles complex business rules.

### Approach 2: Implementing a Custom Validation Rule (The Pure Laravel Way)

If you absolutely need the validation error to be returned directly by the validator (e.g., in an API context where you want immediate feedback), you must implement a custom rule. This involves creating a class that implements `Illuminate\Contracts\Validation\Rule`.

This approach is more verbose but offers centralized, reusable logic. You would create a rule that inspects the entire array of validated input data before flagging an error. While powerful, for this specific scenario, the complexity often outweighs the benefit compared to Approach 1.

## Conclusion

When tackling conditional validation rules in Laravel, remember that built-in rules are optimized for single-field integrity. For complex relational checks involving multiple nullable fields, the most practical and maintainable solution is often to leverage **post-validation logic** within your controller or service layer. It keeps your validation layer clean while allowing you to implement sophisticated business rules where they make the most sense.

By separating the concerns—using validation for structure and application logic for relationships—you build more resilient, readable, and debuggable Laravel applications. For deeper insights into structuring complex data interactions within the framework, always refer back to the official documentation at [https://laravelcompany.com](https://laravelcompany.com).
