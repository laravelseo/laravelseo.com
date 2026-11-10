---
title: "Attempt to assign property \"status\" on null in laravel"
description: "The Laravel Dilemma: Avoiding Assignment on Null When Updating Eloquent Models As developers, we often encounter frustrating runtime errors, especially when..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As developers, we often encounter frustrating runtime errors, especially when dealing with data persistence and object relationships in frameworks like Laravel. One common pitfall for beginners is attempting to assign properties to an object that doesn't actually exist—specifically attempting to set a property on `null`.

This post will dissect the error you are likely facing when trying to update a model (like your `LeaveAdmin`) in a controller, and I will show you the robust, idiomatic Laravel ways to prevent this issue, ensuring your application remains stable and predictable.

## Understanding the Error: Why is Assigning to Null Dangerous?

The error "Attempt to assign property 'status' on null" occurs because when you execute `$leaves = LeaveAdmin::find($request->id);`, if no record matching that ID exists in the database, the Eloquent `find()` method returns `null`.

When your code then executes `$leaves->status = 'Approved';`, PHP attempts to access a property (`status`) on the value `null`. Since `null` is not an object, this operation fails immediately, resulting in a fatal error or a critical exception.

Your use of a `try...catch` block is a good defensive programming measure for handling database errors (like connection issues), but it doesn't prevent logical errors stemming from querying non-existent data. We need to handle the *data existence* check explicitly first.

## Solution 1: The Explicit Existence Check (The Safest Approach)

Before attempting any update, you must verify that the model object was successfully retrieved from the database. This is the most explicit and safest way to handle missing records.

We will modify your controller logic to check if `$leaves` is null before proceeding with the update.

```php
use Illuminate\Support\Facades\DB;
use App\Models\LeaveAdmin; // Ensure you import your model

public function approved(Request $request)
{
    // 1. Attempt to find the record
    $leaves = LeaveAdmin::find($request->id);

    // 2. CRITICAL CHECK: If the record doesn't exist, stop execution immediately.
    if (is_null($leaves)) {
        DB::rollback(); // Rollback is technically unnecessary if nothing was found, but good habit
        Toastr::error('Leave Request Not Found','Error');
        return redirect()->back();
    }

    // 3. Proceed with the update only if the object exists
    try {
        $leaves->status = 'Approved';
        $leaves->save();

        DB::commit();
        Toastr::success('Leave Request Approved Successfully','Success');
        return redirect()->back();

    } catch (\Exception $e) {
        // Catch potential database save errors
        DB::rollback();
        Toastr::error('Failed to Approve Request','Error');
        return redirect()->back();
    }
}
```

## Solution 2: The Eloquent Shortcut (Using `findOrFail`)

A more elegant, Laravel-specific approach is to leverage Eloquent's methods designed specifically for this scenario. Instead of using `find()`, you can use `findOrFail()`. This method streamlines the process by automatically throwing a `ModelNotFoundException` if the record does not exist. While this throws an exception, it allows you to handle the missing record cleanly via Laravel’s error handling mechanisms (like route model binding or custom exception handlers), keeping your controller logic cleaner and more focused on success paths.

Here is how the controller looks using `findOrFail()`:

```php
use Illuminate\Http\Request;
use App\Models\LeaveAdmin; // Ensure you import your model

public function approved(Request $request)
{
    try {
        // findOrFail will throw a ModelNotFoundException if the record is missing.
        $leaves = LeaveAdmin::findOrFail($request->id); 

        // If we reach this line, the record definitely exists.
        $leaves->status = 'Approved';
        $leaves->save();

        DB::commit();
        Toastr::success('Leave Request Approved Successfully','Success');
        return redirect()->back();
        
    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
        // Handle the specific case where the record was not found.
        DB::rollback();
        Toastr::error('Leave Request Not Found','Error');
        return redirect()->back();
    } catch (\Exception $e) {
        // Catch any other potential database or system errors.
        DB::rollback();
        Toastr::error('Failed to Approve Request','Error');
        return redirect()->back();
    }
}
```

## Conclusion: Choosing the Right Tool

For beginners, **Solution 1 (Explicit Check)** is often the clearest way to understand exactly *why* a variable might be null and how to guard against it. For more advanced applications, **Solution 2 (Using `findOrFail`)** is highly recommended as it pushes the responsibility of finding data into the Eloquent layer, leading to cleaner controller methods.

Remember, when working with Laravel, strive to use the features provided by the framework—like Eloquent methods—rather than raw PHP checks alone. By mastering these patterns, you build applications that are not only functional but also robust and maintainable. For more deep dives into effective data handling in the Laravel ecosystem, always refer back to resources like [https://laravelcompany.com](https://laravelcompany.com).
