---
title: "How can use Spatie add assign role to all users using seeder in laravel?"
description: "Title: Efficiently Assign Roles to Users with Spatie Addon using Seeder in Laravel Apps Body: When working on an application that utilizes user roles, you..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Title: Efficiently Assign Roles to Users with Spatie Addon using Seeder in Laravel Apps

Body: When working on an application that utilizes user roles, you might find yourself wanting to adjust the assigned roles of multiple users, such as making all previously created users subscribers except for one designated admin. By leveraging the power of seeder and Spatie's addon, you can streamline this process while maintaining a clean and organized code base.

Firstly, you need to ensure that your current application uses Laravel 5.6 or later, as Spatie's library works best with these versions. To make use of factory methods for generating users, you can create a custom user factory:

```php
<?php

namespace Database\Factories;

use App\User;
use Faker\Factory;
use Illuminate\Database\Eloquent\Factory\Factory as BaseFactory;

class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        // Set user role to subscriber by default
        return [
            'name_first' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'password' => '$2y$10$TKRNvY5CQpWXN4jtq76Zi.lFk3fW/IHuCnSzVaLrZDwCx', // Sample hashed password
        ];
    }
}
```

Next, we need to create a seeder to assign roles to the generated users. In your `Database\Seeders` directory, create a new file named `RolesSeeder.php` and add the following code:

```php
<?php

namespace Database\Seeders;

use App\User;
use Spatie\Permission\Models\Role;

class RolesSeeder extends Seeder
{
    public function run()
    {
        // Create admin role and assign to specific user
        $role = Role::create(['name' => 'super-admin']);
        $user = User::create([
            'name_first' => 'Admin',
            'email' => 'admins@admins.com',
            'password' => '$2y$10$TKRNvY5CQpWXN4jtq76Zi.lFk3fW/IHuCnSzVaLrZDwCx',
        ]);
        $user->assignRole($role);
    }
}
```

Once all your changes are in place, run the seeder and migrate the database. The existing users will retain their roles since no explicit action is taken to change them. If you want a more comprehensive solution that updates each user's role, consider using a loop within your seeder:

```php
<?php

namespace Database\Seeders;

use App\User;
use Spatie\Permission\Models\Role;

class RolesSeeder extends Seeder
{
    public function run()
    {
        // Assign roles to all users, making them subscribers except admin user
        $adminId = User::where('email', 'admins@admins.com')->first()->id;
        // Get remaining users without the specific admin ID
        $remainingUsers = User::all()->diff(User::find($adminId))->get();
        // Assign role 'subscriber' to all users except the admin user
        foreach ($remainingUsers as $user) {
            $role = Role::create(['name' => 'subscriber']);
            $user->assignRole($role);
        }
    }
}
```

This code ensures that only the specified admin user has an assigned role, while all other users are updated to have the subscriber role. This method simplifies the process and provides a cleaner solution than directly editing each user's model or manually assigning roles.

In conclusion, by implementing Spatie's addon for handling user roles alongside Laravel factories and seeders, you can efficiently manage user roles within your application. Remember to always test your code thoroughly before pushing changes live. Happy coding!
