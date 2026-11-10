---
title: "Passing a quantity or other arguments to a Laravel seeder"
description: "Mastering Seeding: Passing Dynamic Arguments to Your Laravel Seeders As developers working within the Laravel ecosystem, one of the most common tasks we face..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers working within the Laravel ecosystem, one of the most common tasks we face during application setup is database seeding. We need to populate our development or testing databases with realistic data. Often, this involves using Model Factories to generate large sets of records quickly. However, a frequent requirement arises: how do we dynamically control *how many* records are created without manually editing the factory definitions every time?

You’ve hit upon a very common architectural challenge. While Laravel provides powerful tools through Eloquent and its Factories, passing arbitrary runtime arguments directly into the seeding process requires a bit of custom logic. Let’s dive deep into how you can achieve this cleanly and effectively within your seeders.

## The Challenge with Standard Seeding

When you run a standard seeder, like `php artisan db:seed --class=UsersTableSeeder`, Laravel executes the entire class method. If your factory is set up to create 10 records by default, running the seeder will always create 10 records unless you manually intervene in the code.

The difficulty often lies not in passing arguments to the command line (which typically passes flags or paths), but in controlling the *generation* logic inside the Seeder itself based on external input.

## The Developer Solution: Injecting Logic into Seeders

While there isn't a single built-in command flag like `--count=500` that magically applies to every factory, the most robust and idiomatic Laravel solution is to leverage dependency injection within your Seeder class to receive these parameters and then use them to control the Eloquent factory calls. This keeps the seeding logic encapsulated and testable, which aligns perfectly with good architectural principles found in tools like those at [laravelcompany.com](https://laravelcompany.com).

Instead of trying to force command-line arguments onto the Seeder class (which can get messy), we focus on making the Seeder itself flexible.

### Implementing Dynamic Record Limits

Your instinct to use a constructor is correct, but the key is ensuring that the `run()` method utilizes this injected value to control the factory calls. Here is how you can refactor your approach:

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User; // Assuming you are seeding the Users table

class UsersTableSeeder extends Seeder
{
    protected int $recordLimit;

    /**
     * The constructor receives the desired limit when the seeder is instantiated.
     * We set a sensible default if no argument is provided.
     *
     * @param int $limit The number of records to create. Defaults to 10 if not specified.
     */
    public function __construct(int $limit = 10)
    {
        $this->recordLimit = $limit;
    }

    /**
     * Run the seeder logic.
     */
    public function run(): void
    {
        echo "Starting user seeding. Target limit: " . $this->recordLimit . "\n";

        // Use the injected limit to control the factory creation
        User::factory()->count($this->recordLimit)->create();

        echo "Successfully created " . $this->recordLimit . " users.\n";
    }
}
```

### How to Execute This Dynamically

Since you cannot easily pass command-line arguments directly into a constructor when running `artisan db:seed` from the shell, the best practice for dynamic control is to execute this seeder programmatically within another script or command.

For instance, if you were running migrations and seeding via a custom Artisan command, you could easily define an input argument:

```bash
# Example of how a custom command might handle execution:
php artisan db:seed --class=UsersTableSeeder --limit=50
```

In this scenario, your Seeder would need to be modified slightly to read the arguments passed during execution, typically by checking `argv` or using an argument parsing library. However, for simple use cases, injecting the value via the constructor (as shown above) is the cleanest way to structure the *logic* of the seeder itself. This approach ensures that your seeding logic remains decoupled from the command-line specifics.

## Conclusion

Passing arguments to Laravel seeders requires moving beyond simple command-line flags and embracing object-oriented principles within your Seeder classes. By utilizing constructor injection, you create flexible, reusable, and highly controllable seeding logic. This method allows you to define exactly how many records are created based on the context in which the seeder is executed, making your data setup process significantly more robust and manageable. Always strive for clean separation of concerns when building complex database interactions in Laravel!
