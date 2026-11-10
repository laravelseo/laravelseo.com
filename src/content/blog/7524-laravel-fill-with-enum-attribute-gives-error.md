---
title: "Laravel fill with enum attribute gives error"
description: "Solving the Laravel Enum Casting Error: Why fill() Fails with Enums As a senior developer working with modern PHP frameworks like Laravel, we frequently..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a senior developer working with modern PHP frameworks like Laravel, we frequently encounter subtle yet frustrating errors when integrating new features. Recently, I encountered a specific issue involving Eloquent and PHP enums, which often trips up developers trying to leverage strong type systems in their models. This post dives deep into the error you are facing—`ErrorException: Attempt to read property "value" on string`—and provides a robust solution.

If you are using string-backed enums with Eloquent casting and mass assignment (`fill()`), understanding the interaction between PHP's type system and Laravel’s attribute handling is crucial.

## The Problem: Enum Casting Meets Mass Assignment

Let's review the setup that leads to the error. You have defined a PHP enum:

```php
namespace App\Models\helpers\Enums;

enum ComissionamentoVendedor: string
{
    case Faturamento = 'No faturamento';
    case Pagamento = 'Após o pagamento pelo cliente';
}
```

And you are casting this in your model:

```php
// In your Eloquent Model
public $casts = [
    'comissionamento_momento' => ComissionamentoVendedor::class,
];
```

When you attempt to save the data using mass assignment:

```php
$vendedor = new Vendedor;
$vendedor->fill($atributos); // $atributos contains the string values like 'No faturamento'
$vendedor->save();
```

The error occurs because when Eloquent tries to map the input string into the Enum object structure, it expects a valid Enum instance or a value that it can correctly resolve, but instead receives a raw string. The internal logic within Laravel attempts to read a property like `value` from this string, resulting in the fatal error.

## Diagnosis: The Root Cause of the Conflict

The core issue lies in a mismatch between what mass assignment expects and what the Enum system provides during the hydration process. When you use `$model->fill()`, Eloquent iterates through the input array and tries to set attributes directly. While casting helps Eloquent understand the *type* of the attribute, it doesn't automatically handle the conversion from a raw string input back into the specific Enum case object required by the model.

This happens because the data coming from the request (the `$atributos` array) is pure strings, and while you cast the *model property* to the Enum class, the assignment mechanism needs guidance on how to instantiate that enum from the incoming string values.

## The Solution: Implementing Mutators for Safe Assignment

The most robust and idiomatic Laravel solution for handling complex type conversions during mass assignment is to use **Mutators**. Mutators allow you to intercept the assignment process and ensure that the data being written to the database (and subsequently, the model attributes) conforms to the expected type.

Instead of relying solely on `$casts`, we will enforce the conversion logic directly within the model. This approach ensures that any time an attribute is set, it passes through a controlled conversion layer.

Here is how you can implement this fix in your Eloquent Model:

```php
namespace App\Models;

use App\Models\helpers\Enums\ComissionamentoVendedor;
use Illuminate\Database\Eloquent\Model;

class Vendedor extends Model
{
    /**
     * Get the comissionamento_momento attribute from the model.
     */
    public function getComissionamentoMomentoAttribute($value)
    {
        // Ensure $value is a string before attempting to cast it to the Enum case
        if (is_string($value)) {
            return ComissionamentoVendedor::tryFrom($value);
        }
        return null;
    }

    /**
     * Set the comissionamento_momento attribute on the model.
     */
    public function setComissionamentoMomentoAttribute($value)
    {
        // This setter handles incoming data, ensuring we store the string value
        // or handle the enum object if it's already present.
        $this->attributes['comissionamento_momento'] = $value;
    }

    // ... other model methods
}
```

By defining these custom accessor (getter) and mutator methods, you control exactly how the string values provided by the frontend are transformed into proper Enum objects when accessed or saved. This pattern ensures data integrity regardless of how the data enters your application, which aligns perfectly with the principles of clean architecture emphasized by organizations like [Laravel Company](https://laravelcompany.com).

## Conclusion

The error you encountered is a classic example of framework interaction complexity. While Eloquent's casting system is powerful, it sometimes requires explicit intervention, especially when dealing with complex PHP types like enums passed via mass assignment. By leveraging Mutators and Accessors, we move the conversion logic from an implicit assumption to an explicit, controlled step. This results in cleaner, more predictable code and significantly improves data validation within your application. Always prioritize explicit control over framework defaults when dealing with custom type integrations!
