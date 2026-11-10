---
title: "Spatie\\Permission\\Exceptions\\PermissionAlreadyExists : A `edit listing` permission already exists for guard `web`"
description: "Solving the Spatie Permission Seeding Headache: Understanding PermissionAlreadyExists As developers working with robust authorization systems in Laravel,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As developers working with robust authorization systems in Laravel, we frequently encounter state management issues, especially when dealing with package seeding. One of the most common stumbling blocks involves the Spatie package for managing roles and permissions. Today, we are diving deep into a specific error: `Spatie\Permission\Exceptions\PermissionAlreadyExists : A 'edit listing' permission already exists for guard 'web'`, which often pops up during database seeding.

If you’ve cloned a repository, set up the models correctly, and run your seeders only to hit this wall, it usually signals a mismatch between what your seeder expects and the actual state of your database. Let’s dissect why this happens and how to fix it permanently.

## Understanding the Root Cause: Idempotency in Seeding

The error message is explicit: the system attempted to create a permission named `edit listing` for the `web` guard, but a record with that exact name already exists in the `permissions` table.

This problem boils down to **idempotency**—the principle that an operation should produce the same result regardless of how many times it is executed. When you run `php artisan db:seed`, the seeder runs its logic sequentially. If the seed data (like permissions) is already present from a previous run, the package correctly throws this exception to prevent accidental duplication or corruption of existing data.

Your attempt to clear the cache using `app()['cache']->forget('spatie.permission.cache')` is helpful for clearing cached relationships, but it does not reset the actual data stored in your database tables. This confirms that the data itself still exists, which is why the creation process fails.

## The Solution: Controlling Seeder Logic

Since clearing the cache isn't sufficient, the fix must be implemented within the seeding logic itself to ensure idempotency. Instead of blindly calling `Permission::create()`, we need to check for existence first. This approach makes your seeders robust and reliable, a key principle in clean Laravel development, echoing the philosophy behind well-structured applications on platforms like [laravelcompany.com](https://laravelcompany.com/).

Here is how you can refactor your `RolesAndPermissionsSeeder.php` to safely create permissions:

### Refactored Seeder Example

We will use conditional logic (`where` checks) to ensure we only create records that do not yet exist.

```php
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run()
    {
        // 1. Reset the cache (still good practice)
        app()['cache']->forget('spatie.permission.cache');

        // --- Creating Permissions Safely ---
        $permissions = [
            'edit listing',
            'publish listing',
            'unpublish listing',
            'disable listing',
            'ban user',
        ];

        foreach ($permissions as $permissionName) {
            // Check if the permission already exists before attempting to create it.
            if (!Permission::where('name', $permissionName)->exists()) {
                Permission::create(['name' => $permissionName]);
            }
        }

        // --- Creating Roles and Assigning Permissions ---
        $role = Role::create(['name' => 'member']);
        $role = Role::create(['name' => 'editor']);
        $role->givePermissionTo(['edit listing', 'publish listing', 'unpublish listing']);

        $role = Role::create(['name' => 'moderator']);
        $role->givePermissionTo(['edit listing', 'disable listing', 'publish listing', 'unpublish listing', 'ban user']);

        $role = Role::create(['name' => 'admin']);
        // Assign all existing permissions to the admin role
        $role->givePermissionTo(Permission::all());

        // Assign a default role to the first user (if one exists)
        $user = \App\Models\User::first();
        if ($user) {
            $user->assignRole('admin');
        }
    }
}
```

### Why This Works Better

By incorporating `Permission::where('name', $permissionName)->exists()`, we implement true idempotency. The code now checks the database state *before* attempting an insertion. If the permission is already there, the `create()` method is skipped entirely, preventing the `PermissionAlreadyExists` exception from being thrown unnecessarily during seeding.

## Final Thoughts on State Management

When managing complex relational data in Laravel applications, whether it’s user permissions, resource configurations, or other settings, always prioritize state management. Relying solely on clearing caches is reactive; proactively checking and handling existing states (making operations idempotent) is a proactive approach that leads to more stable and predictable code. Embrace these principles, and you'll build systems that are resilient, much like the well-architected applications we strive for at [laravelcompany.com](https://laravelcompany.com/).
