---
title: "How to insert data into table during migration in Laravel 8?"
description: "How to Insert Bulk Data into Tables During a Laravel Migration: The Efficient Way As developers working with relational databases in Laravel, one common..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "HTML", "Errors"]
featured: false
---

As developers working with relational databases in Laravel, one common challenge arises when dealing with reference data—lists of countries, categories, or configuration settings. Manually writing 194 `INSERT` statements directly into a migration file is tedious, error-prone, and completely defeats the purpose of using an ORM like Eloquent.

This post will explore the most efficient and scalable methods for inserting bulk data into your database when working with Laravel migrations, focusing on best practices that align with how robust applications are built using frameworks like Laravel.

## The Pitfall of Manual Insertion in Migrations

When you define a table structure in a migration, the primary goal is to define *schema*, not populate it with application-specific data. While you *can* use the `DB::table()->insert()` method inside a migration file, this approach becomes cumbersome and brittle when dealing with large datasets. It mixes schema definition (the migration) with data seeding (the actual content), which violates the Single Responsibility Principle.

For static reference data like a list of countries, we need a cleaner, more maintainable approach. The best practice in the Laravel ecosystem involves separating data population from schema definition, utilizing **Seeders**.

## Best Practice: Populating Data via Seeders

Laravel provides an elegant mechanism for populating your database with test data and initial configuration: Seeders. A Seeder is essentially a dedicated class that handles the logic for inserting specific sets of data into your models. This keeps your migrations clean and makes your database state reproducible across different environments (development, staging, production).

For your requirement—inserting 194 countries—a Seeder is the ideal solution. We will use Eloquent to create a model and then loop through an array of data to perform bulk insertions.

### Step-by-Step Implementation

Here is how you can structure this process efficiently:

**1. Define the Model and Migration:**
First, ensure you have a `Country` model and a corresponding migration to define the table structure.

```php
// database/migrations/..._create_countries_table.php
Schema::create('countries', function (Blueprint $table) {
    $table->id();
    $table->string('name')->unique(); // The column for the country name
    $table->timestamps();
});
```

**2. Create the Seeder Class:**
Next, create a new seeder class. This is where the bulk insertion logic will reside.

```bash
php artisan make:seeder CountriesTableSeeder
```

**3. Implement Bulk Insertion Logic:**
Inside the `run()` method of your seeder, you can define your array of data and use Eloquent's `insert()` method for high-performance bulk operations.

```php
// database/seeders/CountriesTableSeeder.php
use App\Models\Country;
use Illuminate\Database\Seeder;

class CountriesTableSeeder extends Seeder
{
    public function run()
    {
        // The array containing all 194 countries
        $countriesData = [
            ['name' => 'Afghanistan'],
            ['name' => 'Albania'],
            ['name' => 'Algeria'],
            // ... continue for all 194 countries
            ['name' => 'Zimbabwe'],
        ];

        // Use the insert method for fast, bulk insertion
        Country::insert($countriesData);
    }
}
```

**4. Register the Seeder:**
Finally, ensure this seeder is called from your main `DatabaseSeeder` file.

## Why This Approach is Superior

This methodology offers significant advantages over manual migration insertions:

1.  **Readability and Maintainability:** The seeding logic is separated from the structural definition (migration). If you need to update or re-insert data, you only touch the seeder, not the core migration file.
2.  **Performance:** Using Eloquent's `insert()` method for bulk operations typically results in a single, optimized SQL query executed by the database, which is far faster than running 194 separate `INSERT` statements via application code.
3.  **Framework Alignment:** This follows the established patterns of Laravel development, making it easier for new team members to understand and maintain your codebase. As you build complex applications on the Laravel framework, understanding these concepts is crucial for leveraging the full power of the system, much like how well-designed services are built using principles from https://laravelcompany.com.

## Conclusion

For inserting large volumes of reference data during development or seeding, always favor dedicated **Seeders** utilizing Eloquent's bulk insertion capabilities over manually writing SQL within migrations. This practice ensures your Laravel application remains clean, performant, and adheres to the architectural standards expected of a senior-level developer.
