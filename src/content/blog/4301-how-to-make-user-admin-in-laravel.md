---
title: "How to make user admin in laravel"
description: "How to Securely Implement User Admin Roles in Laravel Dealing with user roles and permissions is a fundamental aspect of building any secure application...."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Dealing with user roles and permissions is a fundamental aspect of building any secure application. When you have a single `users` table, the temptation is to dump all admin logic directly into the migration file. However, as you rightly pointed out, this approach introduces significant risk, especially concerning data integrity and race conditions when dealing with database refreshes or new registrations.

As a senior developer, I can tell you that the solution lies not just in the database structure, but in how you manage application logic, seeding, and authorization within the Laravel framework.

## The Pitfall of Direct Migration Logic

You are correct to be wary of setting `is_admin = 1` directly within the primary user migration based on an ID check (e.g., `if ($id == 1) { is_admin = 1; }`). This approach tightly couples your database structure with application state, making maintenance difficult and introducing potential race conditions you described: if a new user registers simultaneously or during a refresh operation, the intended admin status can be inadvertently overwritten or incorrectly applied.

The best practice in Laravel is to separate *data definition* (migrations) from *data manipulation* (seeding and application logic).

## Best Practice: Implementing Roles Through Eloquent and Seeding

Instead of relying solely on raw migration logic for setting roles, we should leverage the power of Eloquent models and structured seeding.

### Step 1: Refine Your Migration Structure

Your initial `users` migration should focus purely on defining the necessary fields. If you anticipate more complex role management (like multiple roles or permissions), consider normalizing your structure slightly. For a simple admin/user split, a single boolean flag is fine, but we must control *how* it gets set.

```php
// database/migrations/..._create_users_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\SchemaBuilder;

class CreateUsersTable extends Migration
{
    public function up()
    {
        SchemaBuilder::create('users', function (SchemaBuilder $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->boolean('is_admin')->default(false); // Define the role field here
            $table->rememberToken();
            $table->timestamps();
        });
    }
}
```

### Step 2: The Safe Way to Set Initial Roles (Seeding)

The most robust way to establish an initial administrator is by using **Database Seeders**. Seeders run *after* the schema is established and allow you to execute complex, conditional logic in a controlled environment. This avoids race conditions during standard application traffic or simple migrations.

Create a Seeder file (e.g., `DatabaseSeeder.php`):

```php
// database/seeders/AdminSeeder.php

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run()
    {
        // Find the user you want to designate as admin, or create them if they don't exist.
        $admin = User::firstOrCreate(['email' => 'admin@example.com']);

        // Safely update the role status within a controlled seeding operation.
        $admin->is_admin = true;
        $admin->save();

        $this->command->info('Default administrator set successfully.');
    }
}
```

Then, run this seeder via `php artisan db:seed --class=AdminSeeder`. This process is executed once during setup and is completely decoupled from live user registration traffic.

## Step 3: Implementing Authorization Logic

Once the data is safely in place, you must secure access using Laravel’s built-in authorization tools. Do not rely on checking a boolean flag directly in controller methods; use Policies or Gates for layered security, which is highly recommended when building complex systems like those found in enterprise applications, similar to what you might explore with custom package integrations from the wider Laravel ecosystem.

**Example using Gates:**

In your `AuthServiceProvider`, define a Gate:

```php
use Illuminate\Support\Facades\Gate;

public function boot()
{
    $this->registerPolicies();

    // Define the admin gate
    Gate::define('manage-users', function ($user) {
        return $user->is_admin;
    });
}
```

Now, in your controller or route, you can protect endpoints:

```php
public function index()
{
    $this->authorize('manage-users'); // Checks if the authenticated user has the 'manage-users' gate permission
    // ... proceed to fetch admin data
}
```

## Conclusion

To summarize, avoid embedding complex relational logic directly into base migrations. For setting initial roles, delegate that responsibility to dedicated **Seeders**. This separates your setup process from runtime operations, eliminating the risk of race conditions during traffic spikes or database refreshes. By combining careful database design with Laravel’s robust authorization features (Gates and Policies), you ensure your application remains secure, scalable, and maintainable. Remember, building solid foundations is key to successful development in any framework like Laravel.
