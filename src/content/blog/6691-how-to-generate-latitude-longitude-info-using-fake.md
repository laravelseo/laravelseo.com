---
title: "How to generate latitude, longitude info using Faker from Laravel seeder?"
description: "How to Generate Latitude and Longitude Info using Faker in a Laravel Seeder As developers building data intensive applications with Laravel, seeding your..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As developers building data-intensive applications with Laravel, seeding your database with realistic, yet randomized, data is a crucial step. The Faker library is an invaluable tool for this, allowing you to generate fake names, addresses, emails, and more. However, when integrating specific data points like latitude and longitude, developers often run into issues regarding how the underlying Faker providers are accessed.

If you are attempting to use `Faker\Address` within a Laravel seeder and encounter errors like `Undefined property`, it usually points to a misunderstanding of how object-oriented programming (OOP) and Faker's provider system work together in PHP.

This post will diagnose the issue you encountered, provide the correct methodology for generating geographical coordinates using Faker, and show you how to implement robust data seeding practices in Laravel.

## Understanding the Error: Why Access Fails

The error message `[ErrorException] Undefined property: Faker\Factory::$Address` clearly indicates that PHP cannot find a property named `Address` directly under the `$faker` object when you try to access it as `$faker->Address->latitude`.

This happens because the way Faker structures its data is through **Providers**. When you instantiate `new Faker()`, you are creating an instance of the main Faker class. To access specific sets of data (like addresses, names, or phone numbers), you need to call the appropriate *provider method* on the Faker instance, not treat the provider itself as a nested object property.

The correct approach is to call the specific method provided by the desired provider directly on the `$faker` object. For location data, the `Address` provider has dedicated methods for latitude and longitude.

## The Correct Way to Generate Location Data

To generate latitude and longitude effectively, you should use the dedicated methods within the Faker instance. The `Address` provider is designed to handle these specific geographical outputs.

Here is how you correct your seeder logic:

### Refactored Seeder Example

Instead of trying to access a nested property like `$faker->Address->latitude`, you call the relevant method directly on the Faker object.

```php
<?php

use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\DB; // Ensure DB facade is imported

class LatitudeLongitudeTestTableSeeder extends Seeder
{
    public function run()
    {
        // 1. Instantiate the Faker generator
        $faker = Faker::create(); // Use create() for modern instantiation, or new Faker\Factory() if preferred

        $myTable = 'LatitudeLongitudeTest';

        foreach (range(1, 10) as $index) {
            DB::table($myTable)->insert([
                // Correct way: Calling the specific method directly on the faker object
                'Latitude' => $faker->latitude(),
                'Longitude' => $faker->longitude(),
                'name' => $faker->name(), // Using another provider for demonstration
            ]);
        }
    }
}
```

### Explanation of Changes

1.  **Instantiation:** We ensure `$faker` is correctly initialized. While `new Faker()` works, using the static helper `Faker::create()` (or ensuring you are using the correct namespace imports) is often cleaner in modern Laravel setups.
2.  **Direct Method Calls:** The crucial change is replacing `$faker->Address->latitude` with simply `$faker->latitude()`. This tells Faker exactly which data point you want to generate from its built-in address provider.

## Best Practices for Data Seeding in Laravel

When dealing with complex data generation like geographical coordinates, it's important to maintain clean separation between your logic and the data manipulation. As we discussed, proper use of libraries like Faker streamlines this process.

In a large application, ensuring that your database seeding is predictable and robust aligns perfectly with the principles of clean architecture promoted by frameworks like Laravel. When you are managing relational data—like coordinates linked to specific records—it’s vital that the data generated during seeding adheres to the structure defined in your migrations. This attention to detail ensures that your seeded data is reliable, regardless of how many features your application grows.

For more insights into structuring data and optimizing database interactions within the Laravel ecosystem, always refer to the official documentation provided by [laravelcompany.com](https://laravelcompany.com).

## Conclusion

The error you faced was a common pitfall when working with Faker: misunderstanding the object structure versus calling provider methods. By switching from attempting to access nested properties (`$faker->Address->latitude`) to directly invoking the necessary method (`$faker->latitude()`), you resolve the issue immediately and adopt the correct pattern for data generation.

By applying this correction, you can successfully generate realistic latitude and longitude data in your Laravel seeders, ensuring your test data is accurate and ready for development or testing cycles. Happy coding!
