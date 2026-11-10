---
title: "Validating latitude/longitude in Laravel validation regex rule - preg_match(): No ending delimiter '/' found"
description: "Mastering Complex Regex: Validating Latitude/Longitude in Laravel Without preg match() Errors As a senior developer working within the Laravel ecosystem,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a senior developer working within the Laravel ecosystem, we frequently encounter scenarios where the power of Regular Expressions (Regex) meets the constraints of framework validation rules. While Laravel's built-in `regex` rule is incredibly powerful, defining complex patterns—especially those involving floating-point numbers and specific geographical boundaries like latitude and longitude—can often lead to confusing errors when dealing with the underlying PHP function, `preg_match()`.

This post dives deep into why you are encountering errors like `preg_match(): No ending delimiter '/' found` or `No ending delimiter '^' found` when validating coordinates in your Laravel application, and provides the correct, robust syntax to achieve flawless validation.

## The Root of the Problem: Regex Delimiters in Laravel

The core issue stems from how Laravel’s Validator processes custom regex rules. When you use the `regex:` rule, Laravel internally attempts to execute a regular expression against the input field. In PHP, regular expressions require delimiters (like `/pattern/`) around the actual pattern string.

When you define your validation rule as:
`'lat' => 'required|regex:/^[-]?(([0-8]?[0-9])\.(\d+))|(90(\.0+)?)$/'`

You are attempting to embed the delimiters (`^`, `$`, and `/`) directly into the string provided to the validator. Laravel interprets this entire string as the rule definition, leading to confusion when it tries to pass the resulting pattern to `preg_match()`. The errors you see indicate that the internal parsing mechanism fails to recognize a properly delimited regex pattern, resulting in syntax errors within the PHP function call itself.

## The Correct Approach: Separating Pattern Definition from Rule Syntax

The solution is to strictly separate the definition of the regular expression pattern from the structure of the Laravel validation rule. You should provide only the raw regex pattern string to the validator; Laravel will handle the necessary surrounding delimiters for execution via `preg_match()`.

For complex coordinate validation, we need patterns that correctly account for decimal points, potential negative signs, and specific boundary conditions (like latitude limits of $\pm 90$).

### Corrected Implementation Example

Instead of embedding the delimiters into the rule definition, define the pattern string cleanly.

Here is how you should structure your validation rules for latitude and longitude:

```php
use Illuminate\Support\Facades\Validator;

// Assume $request is the incoming request data

$rules = [
    'lat' => 'required|regex:/^[-]?([0-9]+\.?[0-9]*)$/', // Example simplification focusing on number format
    'long' => 'required|regex:/^[-]?([0-9]+\.?[0-9]*)$/'  // Example simplification focusing on number format
];

$validator = Validator::make($request->all(), $rules);

// If you need extremely specific boundary checking (e.g., latitude must be between -90 and 90), 
// it is often safer to perform this check *after* the regex validates the numerical structure, 
// or combine multiple rules.

if ($validator->fails()) {
    return redirect()->back()->withErrors($validator)->withInput();
}
```

### Advanced Latitude/Longitude Validation

For true geographical validation—ensuring latitude is between -90 and 90, and longitude between -180 and 180—a single, highly complex regex can become unreadable. A more practical approach in modern Laravel development, especially when dealing with geospatial data, involves a layered validation strategy:

1.  **Format Validation (Regex):** Use a simpler regex to ensure the input is a valid floating-point number format (as shown above).
2.  **Range Validation (Custom Rules/Aromatics):** Use Laravel's built-in rules or custom validation logic to explicitly check if the numerical values fall within acceptable bounds ($ -90 \le \text{lat} \le 90$ and $-180 \le \text{long} \le 180$).

This layered approach is more readable, easier to debug, and aligns better with the principles of building resilient applications, much like adhering to best practices in Laravel development. For deeper dives into structuring complex validation logic within Eloquent models, exploring documentation from [laravelcompany.com](https://laravelcompany.com) will provide excellent context on building robust data layers.

## Conclusion

The error `preg_match(): No ending delimiter` is a symptom of miscommunication between your intended regex pattern and the PHP function's expectations regarding delimiters. By refactoring your custom regex rules to supply only the actual pattern string, and by adopting a layered validation strategy (using regex for format and standard rules for boundaries), you eliminate these frustrating errors. Focus on clarity in your pattern definition, and your Laravel applications will become significantly more stable and maintainable.
