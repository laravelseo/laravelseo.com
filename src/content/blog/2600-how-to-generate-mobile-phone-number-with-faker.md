---
title: "How to generate mobile phone number with Faker"
description: "How to Generate Unique Mobile Phone Numbers with Faker in Laravel As senior developers working within the Laravel ecosystem, we frequently rely on the..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Errors"]
featured: false
---

As senior developers working within the Laravel ecosystem, we frequently rely on the `Faker` library to populate our database records with realistic, yet entirely fake, data. When building models and seeding data, ensuring that fields like phone numbers are not only random but also unique and adhere to specific formats is crucial for data integrity.

The challenge you are facing—generating a unique mobile phone number of a specific length (in this case, 11 characters)—is common. While Faker provides excellent tools for names, emails, and addresses, generating structured numerical data often requires combining several functions.

This guide will walk you through the best practices for implementing custom logic using Faker to generate unique, fixed-length mobile phone numbers within your Laravel application structure.

## Understanding the Limitation of Standard Faker

The standard `Faker\Provider` classes are designed to generate human-readable data (names, addresses). While some providers offer basic number generation, they often do not enforce strict length requirements or international formatting rules necessary for a unique mobile number field. Simply calling `$faker->phoneNumber()` might return varied formats that don't meet your specific 11-digit requirement, leading to potential database errors or poor data quality.

To solve this, we need to move beyond simple calls and use Faker’s more granular methods to construct the exact string format we need.

## The Solution: Customizing Faker for Phone Numbers

Since you require exactly 11 digits for your `usr_mobile_phone` field, the most robust approach is to use the `numerify()` method combined with logic to ensure uniqueness. We can generate random strings of digits and then enforce the exact length.

Here is how you can modify your definition method within a Laravel Seeder or Model Factory:

### Step 1: Generating the Unique Mobile Number

Instead of relying on a single Faker call, we will use `numerify()` to specify the pattern for the required length. For an 11-digit number, the pattern is simply eleven digit placeholders (`##digits`). Since you need uniqueness, we must ensure that this generation process runs for each record being created.

In your seeder or factory:

```php
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Faker\Factory as Faker;

// ... inside your definition method

'usr_mobile_phone' => $this->faker->numerify('##########'), // Generates exactly 11 digits
// OR, for a more complex structure (e.g., +XX XXX XXX XXXX):
// 'usr_mobile_phone' => $this->faker->randomDigit() . '-' . $this->faker->numerify('##########'),

// To ensure uniqueness across all records:
// You must call the faker methods within a loop or use unique() directly on the model/seeder.
```

**Best Practice Implementation:**

When dealing with uniqueness in database seeding, it is often safer to generate the data within an Eloquent loop or factory definition where you can check for existing values if necessary (though Faker's inherent randomness usually handles this well for simple numbers).

For guaranteed uniqueness, especially when using a custom structure, generating a random string of 11 digits and ensuring no collision happens across the entire batch is key. A reliable method within Laravel development often involves combining `numerify` with unique identifiers:

```php
public function definition()
{
    return [
        // ... other fields
        'usr_mobile_phone' =>
