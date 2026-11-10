---
title: "How to pass parameters in Laravel Rule?"
description: "How to Pass Parameters in Laravel Validation Rules: A Deep Dive Moving complex validation logic out of service providers and into dedicated Rule classes is a..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Moving complex validation logic out of service providers and into dedicated Rule classes is a fantastic step towards building more maintainable and testable applications. As you’ve discovered, the main hurdle often lies in how to inject necessary external data—parameters—into these custom rules during the validation process.

This post will address the specific challenge you encountered: how to correctly pass contextual parameters into a Laravel Rule, moving beyond simple closures to achieve dynamic validation based on external request data.

## The Challenge with `Validator::extend`

When you use methods like `Validator::extend()`, you are essentially registering a callback function that executes during validation. While this callback receives arguments (`$attribute`, `$value`, `$parameters`, `$validator`), using the `$parameters` array directly to fetch arbitrary external data (like values from the request) can be brittle and often leads to scope issues, especially when dealing with complex setups.

Your attempt:
```php
Validator::extend('empty_if', function ($attribute, $value, $parameters, $validator) {
   return ($value != '' && request($parameters[0]) != '') ? false : true;
});
```
This approach fails because the `$parameters` array provided by the validator context is not guaranteed to hold the specific data you need or provide a clean hook for injection.

## Best Practice: Injecting Context via Rule Instantiation

The most robust and object-oriented way to handle parameters in custom rules is not to rely on magic variables within the `Validator::extend` closure, but rather to ensure your rule class receives all necessary context upon instantiation. This aligns perfectly with Laravel’s philosophy of dependency injection.

Instead of trying to pass data *during* the registration phase, we should design the Rule class to *expect* that data when it is created.

### Step 1: Redesigning the Rule Class

We will refactor your rule into a proper class structure and use its constructor to accept any required parameters. This makes the dependency explicit and testable.

In this example, let's assume we need to check if a field is empty *only if* another specific field (e.g., `status`) has a certain value.

**`app/Rules/EmptyIf.php`**
```php
namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\Rule;

class EmptyIf implements Rule
{
    protected $contextValue;

    /**
     * Create a new rule instance.
     *
     * @param mixed $contextValue The external parameter needed for validation context.
     */
    public function __construct($contextValue = null)
    {
        // Store the injected parameter
        $this->contextValue = $contextValue;
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        // Example logic: If the current value is empty, check against the contextValue.
        if (empty($value)) {
            // We only enforce the rule if the context parameter exists and is not empty.
            return empty($this->contextValue);
        }

        return true;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'The :attribute cannot be empty when the context parameter is set.';
    }
}
```

### Step 2: Applying the Rule with Context

Now, instead of trying to pass parameters through `Validator::extend`, you instantiate your rule and pass the required data directly when validating. This pattern keeps the validation logic clean and decoupled from the service provider.

**In your Controller or Service:**
```php
use App\Rules\EmptyIf;

// ... inside your request handling method

$data = $request->all();

// Pass the necessary context parameter to the rule instance
$rule = new EmptyIf($data['status']); 

$validator = Validator::make($data
