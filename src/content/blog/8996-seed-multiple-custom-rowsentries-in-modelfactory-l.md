---
title: "Seed multiple custom rows/entries in ModelFactory Laravel"
description: "Seed Multiple Custom Rows Using Laravel ModelFactory As a senior developer working with Laravel, we often face the challenge of populating our database with..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As a senior developer working with Laravel, we often face the challenge of populating our database with complex, varied data during testing or development setup. The Eloquent Model Factory system, introduced by Laravel, is designed precisely to solve this problem: generating fake but realistic model instances efficiently.

When you start defining factories, like the one for your `User` model, you are setting up blueprints for creating records. However, simply defining a single set of attributes within a factory doesn't inherently allow you to define multiple distinct scenarios (like an 'Admin' user and a 'Standard User') without resorting to messy raw expressions.

This post will walk you through the most robust and elegant ways to seed multiple custom rows using ModelFactory, ensuring your data setup is scalable and clean.

---

## Understanding the Limitation of a Single Factory Definition

Your current setup within `ModelFactory.php` defines one specific outcome:

```php
$factory->define(App\User::class, function (Faker $faker) {
    return [
        'name' => 'Admin',
        'description' => 'Administrators have full access to everything.'
    ];
});
```

This tells the factory *how* to build a user, but it only defines one specific configuration. To generate two completely different users—one admin and one standard user—you need mechanisms that allow for named, reusable data sets.

## Method 1: Seeding Multiple Instances Directly in a Seeder (The Simple Approach)

For simple scenarios where you just need to create a few records quickly, the most straightforward approach is to call the factory multiple times within your database seeder. This avoids complex factory definitions but requires manual repetition.

In your `DatabaseSeeder.php`:

```php
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Seed the Admin user
        User::factory()->create([
            'name' => 'Admin',
            'description' => 'Administrators have full access to everything.'
        ]);

        // Seed the Standard User
        User::factory()->create([
            'name' => 'User',
            'description' => 'User have normal access.'
        ]);
    }
}
```

While effective, this method becomes cumbersome if you need to create dozens of variations. It is best suited for one-off seeding tasks rather than complex factory definitions.

## Method 2: Defining Named Factories (The Best Practice)

For scalable applications, the superior approach is to leverage the power of named factories. By defining separate factory methods or using state definitions within your factory file, you create reusable blueprints that can be called easily. This aligns perfectly with the principles of modular design promoted by frameworks like Laravel, which emphasizes clean separation of concerns.

To achieve this cleanly, instead of defining static data inside the `define()` block, you should define separate factory methods or use state definitions within your factory file.

### Example: Using Factory States

If you want to reuse the base structure but change specific attributes for different roles, you can define states within your factory. This keeps your factory clean and allows you to generate complex data sets without cluttering the main definition.

In `UserFactory.php`:

```php
use Illuminate\Database\Eloquent\Factories\Factory;

class UserFactory extends Factory
{
    protected static function newFactory()
    {
        return new \Illuminate\Database\Eloquent\Factories\Model(static::class);
    }

    // Define a named state for the Admin user
    public function admin()
    {
        return $this->state(fullname: 'Admin', description: 'Administrators have full access to everything.');
    }

    // Define a named state for the Standard User
    public function standard()
    {
        return $this->state(fullname: 'User', description: 'User have normal access.');
    }
}
```

Now, in your seeder or tests, you can generate these entries with a single, readable call:

```php
// In DatabaseSeeder.php
User::factory()->admin()->create();
User::factory()->standard()->create();
```

This method is significantly cleaner, more readable, and adheres to the principle of DRY (Don't Repeat Yourself). This pattern is crucial when building complex data structures in Laravel; it allows your factories to act as true data generators rather than just static definitions.

## Conclusion

To seed multiple custom rows using ModelFactory effectively, move beyond defining monolithic data sets inside the factory definition. Instead, adopt a strategy that prioritizes modularity. Defining named factory methods or states allows you to create reusable blueprints for different entity types, making your seeding process cleaner, more maintainable, and perfectly aligned with modern Laravel development practices. Remember, mastering these tools is key to building robust applications on **laravelcompany.com**.
