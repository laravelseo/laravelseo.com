---
title: "How to restrict input only as numbers in laravel?"
description: "How to Restrict Input Only as Numbers in Laravel: A Developer's Guide When building web applications, especially those handling numerical data like prices,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "Errors"]
featured: false
---

When building web applications, especially those handling numerical data like prices, quantities, or dimensions, data integrity is paramount. Allowing users to input arbitrary text into fields expecting only numbers can lead to serious bugs, failed calculations, and potential security vulnerabilities. As senior developers, we need robust methods to ensure that the data entering our Laravel application is strictly numeric.

This guide will walk you through the most effective, layered approach to restricting user input to numbers in a Laravel environment, covering frontend experience, backend validation, and best practices.

## Layer 1: Frontend Control (User Experience)

The first line of defense should always be on the client side. By leveraging native HTML features, we can provide immediate feedback to the user and prevent unnecessary data submission. For input fields intended only for numbers, the `type="number"` attribute is essential.

When using `type="number"`, modern browsers automatically restrict input to digits (and optionally a decimal point). You can further enhance this by adding `step` attributes to define the allowed increments or decimal places.

**Example HTML Implementation:**

```html
<label for="advertisement_height">Advertisment Height (Only Numbers)</label>
<input type="number" id="advertisement_height" name="advertisement_height" class="form-control" step="1">
```

While this improves the user experience, **it is crucial to remember that frontend validation can be bypassed.** Therefore, we must always implement stricter checks on the server side.

## Layer 2: Backend Validation (The Laravel Core)

The true enforcement mechanism resides in your Laravel application. When data hits your controller, you must validate it before processing it. Laravel's powerful validation system is the perfect tool for this job. We use the `numeric` rule to ensure that the incoming string can be successfully cast into a floating-point or integer type.

### Implementing Validation Rules

In your Request class (or directly in your Controller), define validation rules to strictly enforce numeric input.

**Example using a Form Request:**

If you are using a dedicated Form Request class, your `rules()` method would look like this:

```php
public function rules()
{
    return [
        'advertisement_height' => [
            'required',
            'integer', // Ensures the input is a whole number
            'min:1',    // Optional: Ensure height is at least 1
            'numeric'  // A general check for numeric value
        ],
    ];
}
```

Using rules like `integer` or `numeric` ensures that if the user tries to submit "123a", the validation will fail immediately, preventing bad data from reaching your business logic. This approach aligns perfectly with the principles of secure development championed by frameworks like **Laravel**.

## Layer 3: Data Casting and Sanitization

Even after successful validation, it is best practice to handle the data type explicitly upon retrieval. Laravel allows you to use Eloquent Model Casting to automatically convert incoming string values into their appropriate PHP types (like `int` or `float`). This provides a clean interface for your application logic.

In your Eloquent Model:

```php
class Advertisement extends Model
{
    protected $casts = [
        'advertisement_height' => 'integer', // Casts the database value to an integer
    ];
}
```

By casting the attribute, you ensure that when you interact with `$advertisement->advertisement_height` in your controller or views, you are dealing with a clean integer, not a potentially messy string. This "defense in depth" strategy—frontend hints, strict backend validation, and type casting—is what makes applications robust.

## Conclusion

Restricting input to numbers effectively requires a multi-layered approach. Start with helpful frontend controls using `type="number"`, enforce strict rules on the server using Laravel's validation system (`integer` or `numeric`), and finalize the process by ensuring proper data type handling through Eloquent casting. By adopting these best practices, you ensure that your application remains secure, reliable, and free from unexpected data corruption. Embrace the power of structured development when building with **Laravel**.
