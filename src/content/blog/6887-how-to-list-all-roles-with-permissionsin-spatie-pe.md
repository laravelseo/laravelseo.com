---
title: "How to list all roles with Permissions,in spatie permission Package?"
description: "Unlocking Roles and Permissions: Listing Them Together with Spatie As developers working with Laravel, managing access control is a critical aspect of any..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers working with Laravel, managing access control is a critical aspect of any application. The spatie package for Laravel permissions is incredibly powerful, providing a robust system for defining roles and permissions. However, sometimes the requirement isn't just checking *if* a user has a permission, but rather listing the complete hierarchy—seeing exactly which permissions are bundled within each role.

If you are looking to display all roles alongside their respective permissions in a clean, nested structure, you need to leverage Eloquent relationships effectively. This guide will walk you through the best practices for querying and structuring this data using the Spatie package.

## The Foundation: Understanding the Relationship

The spatie permission system relies on pivot tables to define the many-to-many relationship between roles and permissions. To achieve your goal, we need to define proper Eloquent relationships on our `Role` model so that Laravel can automatically handle the data retrieval efficiently.

Assuming you have correctly set up your models (e.g., `Role` and `Permission`), the key is defining these relationships:

1.  **Roles have many Permissions:** A single role can have multiple permissions.
2.  **Permissions belong to many Roles:** A single permission can be assigned to multiple roles.

By defining these relationships correctly, we transform a simple database structure into an intuitive object-oriented model that Eloquent can query seamlessly.

## Querying for Nested Role and Permission Data

The most effective way to fetch this nested data is by using Eloquent’s relationship loading features, specifically eager loading, which prevents the dreaded N+1 query problem when dealing with complex relationships.

Here is a practical example of how you would retrieve all roles along with their associated permissions:

```php
use App\Models\Role;

class RoleController extends Controller
{
    public function index()
    {
        // Eager load the 'permissions' relationship for all roles.
        $roles = Role::with('permissions')->get();

        // Example of how you might structure the data for an API response:
        $formattedRoles = $roles->map(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions->map(function ($permission) {
                    return [
                        'id' => $permission->id,
                        'name' => $permission->name,
                    ];
                })->toArray(),
            ];
        });

        return response()->json($formattedRoles);
    }
}
```

### Explanation of the Approach

In the example above, we use `Role::with('permissions')->get()`. This single query tells Eloquent to fetch all necessary role records and then separately fetch all related permission records, minimizing database calls.

The subsequent `.map()` function is crucial for transforming the raw Eloquent objects into the exact nested JSON structure you desire—an array of roles, where each role contains an array of its permissions. This technique demonstrates how powerful Laravel’s object-relational mapping capabilities are when paired with well-defined package structures like spatie permission.

## Performance and Best Practices

While the above method is highly readable, if you were dealing with thousands of roles and permissions, performance can become a concern. For extremely large datasets, consider using database joins directly if you need raw speed, although for most applications, Eloquent's eager loading provides an excellent balance of readability and efficiency.

Remember that understanding how to structure your data is key to building scalable systems. Just as efficient data modeling is vital in Laravel development, leveraging the power of robust packages like spatie permission ensures your application remains clean and maintainable. For deeper insights into structuring effective database relationships within the Laravel ecosystem, exploring resources from Laravel itself can be very beneficial.

## Conclusion

Listing roles with their associated permissions is an essential task for any application that manages access control. By correctly defining Eloquent relationships in your models and utilizing eager loading techniques, you can efficiently retrieve this complex, nested data structure. This approach ensures your code remains clean, readable, and performant, allowing you to focus on building feature-rich applications.
