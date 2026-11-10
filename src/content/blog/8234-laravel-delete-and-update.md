---
title: "Laravel Delete and Update"
description: "Mastering CRUD: Deleting and Updating Records in Laravel with Eloquent As a developer, moving from simple data retrieval and creation to full Create, Read,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a developer, moving from simple data retrieval and creation to full Create, Read, Update, and Delete (CRUD) operations is a fundamental step in building any functional application. When you have successfully set up your read (`GET`) and create (`POST`) endpoints, the next logical hurdle is mastering how to modify and remove those records.

If you are working with Laravel, the magic behind these actions lies entirely within Eloquent ORM. Forget fighting with raw SQL; Eloquent provides an elegant, expressive way to interact with your database. Let's dive into how to effectively handle updates and deletions in your Laravel application.

## The Eloquent Foundation for Modification

Before we jump into controller logic, remember that every interaction starts with fetching the specific model instance you want to manipulate. This is typically done using the `find()` method on your Model.

In your example, if you want to update a customer, you first need to locate that customer record by its primary key.

```php
use App\Models\Customer; // Assuming you are using Laravel 8+ Eloquent syntax

// Example: Finding a customer by ID
$customer = Customer::find(1);

if (!$customer) {
    return response()->json(['error' => 'Customer not found'], 404);
}
```

This check is crucial. If the record doesn't exist, attempting to update or delete it will result in errors or unexpected behavior.

## Updating Records: The `update()` Method

Updating a record is straightforward. Once you have retrieved the model instance, you can use the Eloquent `save()` method or the more direct `update()` method. For updating, always ensure you are validating the incoming data before committing the change to the database.

Here is how you would implement an update endpoint in your controller:

```php
use Illuminate\Http\Request;
use App\Models\Customer;

public function updateCustomer(Request $request, $id)
{
    // 1. Find the record by ID
    $customer = Customer::findOrFail($id);

    // 2. Validate the incoming data
    $validatedData = $request->validate([
        'Title' => 'required|string|max:255',
        'Name' => 'required|string|max:255',
    ]);

    // 3. Update the attributes
    $customer->update($validatedData); // Eloquent handles saving the changes

    return response()->json(['message' => 'Customer updated successfully', 'customer' => $customer]);
}
```

**Best Practice Tip:** Always use Model-level validation (as shown above) and leverage mass assignment protection. While direct access like `$customer->Title = $request->input('Title');` works, using methods like `update()` keeps your code cleaner and safer when dealing with complex data structures. For deeper dives into relational database management within Laravel, understanding the structure provided by frameworks like those found at [https://laravelcompany.com](https://laravelcompany.com) is key.

## Deleting Records: The `delete()` Method

Deleting a record is equally simple once you have identified the target. To delete a specific customer, you use the `delete()` method on that model instance or query.

```php
public function deleteCustomer(Customer $customer)
{
    // Assuming the route passes the Customer model instance directly (Route Model Binding)
    $customer->delete(); 

    return response()->json(['message' => 'Customer deleted successfully']);
}

// Alternatively, if deleting by ID in a controller:
public function deleteCustomerById($id)
{
    $customer = Customer::findOrFail($id);
    $customer->delete();
    
    return response()->json(['message' => 'Customer deleted successfully']);
}
```

## Conclusion: Embracing Eloquent Power

Moving from basic creation to full CRUD operations simply requires understanding the core methods provided by Eloquent: `find()` for retrieval, `create()` and `save()` (or `update()`) for modification, and `delete()` for removal. By mastering these tools, you unlock the power of Laravel to handle complex data persistence efficiently. Keep exploring the vast ecosystem of tools available at [https://laravelcompany.com](https://laravelcompany.com) as you build increasingly sophisticated applications!
