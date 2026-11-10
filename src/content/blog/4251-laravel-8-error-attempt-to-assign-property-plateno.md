---
title: "Laravel 8 Error Attempt to assign property \"plateno\" on null"
description: "Building a Vehicle Record System in Laravel: A Developer's Deep Dive This repository provides a solid foundation for managing vehicle registration data..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "PHP", "Errors"]
featured: false
---

## Building a Vehicle Record System in Laravel: A Developer's Deep Dive

This repository provides a solid foundation for managing vehicle registration data within a Laravel application. By examining the provided Blade view, routing setup, controller logic, and model definition, we can analyze how Model-View-Controller (MVC) principles are applied to handle form submissions and data persistence. As developers, our focus should not just be on making the code *work*, but ensuring it is robust, secure, and adheres to modern Laravel best practices, which you can explore further on the official [Laravel documentation](https://laravel.com/).

### 1. The Data Structure: Eloquent Model

The foundation of this application lies in the `app/Models/Vehicle.php` file. Defining the `$fillable` properties is a crucial step for security and efficiency.

```php
protected $fillable = [
    'plateno',
    'type',
    'colour',
    'brand',
    'model',
];
```

**Developer Insight:** Using `$fillable` explicitly tells Eloquent which attributes are allowed to be mass-assigned. This is a vital security measure, preventing malicious users from accidentally or intentionally updating sensitive fields (like an admin flag) when only submitting data via a form. Furthermore, since you have set `$timestamps=false;`, you are opting for a simpler record structure, which is fine if your application logic does not require tracking `created_at` and `updated_at` timestamps.

### 2. The Data Input: Form Handling and State Management

The Blade view handles the data collection via an HTML form. Notice the use of `:value="old('field_name')"` for populating the input fields, which is excellent for user experience (UX) when a submission fails validation or requires correction.

```html
<input id="plateno" ... :value="old('plateno')" required autofocus>
```

**Best Practice:** While using `old()` provides a good UX flow, the true strength of Laravel lies in server-side validation. Although the form structure is present, for production systems, **you must always enforce validation checks on the server side**. Relying solely on client-side checks (which are easily bypassed) is insufficient for data integrity.

### 3. The Logic: Controller and Route Flow

The routing setup (`routes/web.php`) correctly separates concerns by defining distinct routes for user applications, status, and admin records, utilizing middleware like `auth` and custom role checks (`role:user`, `role:admin`).

The core action happens in the `UpdateDatabaseController@update` method:

```php
public function update(Request $request)
{
    $data = Vehicle::find($request->id);
    $data->plateno = $request->plateno;
    // ... other data assignments
    $data->save();
    return redirect(RouteServiceProvider::HOME);
}
```

**Code Review:** This logic successfully fetches the specific vehicle record using the ID provided in the request and updates the relevant fields. This demonstrates correct use of Eloquent methods (`find`, assignment, `save`).

### 4. Enhancing Robustness: Implementing Validation

The most significant area for improvement is integrating robust validation into the `UpdateDatabaseController`. Before attempting to save data, you must validate that the incoming request meets all necessary criteria.

**Recommended Implementation:**

```php
// app/Http/Controllers/UpdateDatabaseController.php (Revised)
public function update(Request $request)
{
    // 1. Validation Check
    $request->validate([
        'plateno' => 'required|string|unique:vehicles', // Ensure uniqueness if applicable
        'type' => 'required',
        'colour' => 'required',
        'brand' => 'required',
        'model' => 'required',
    ]);

    // 2. Find and Update
    $vehicle = Vehicle::findOrFail($request->id); // Use findOrFail for better error handling
    
    $vehicle->plateno = $request->plateno;
    $vehicle->type = $request->type;
    $vehicle->colour = $request->colour;
    $vehicle->brand = $request->brand;
    $vehicle->model = $request->model;

    $vehicle->save();

    return redirect(RouteServiceProvider::HOME)->with('success', 'Vehicle details updated successfully.');
}
```

### Conclusion

The provided code establishes a functional MVC pattern for data management. The separation between the Model, Controller, and View is clear. To elevate this project to production quality, the next crucial step is to heavily invest in **server-side validation** and error handling within your controllers. By adhering to Laravel's philosophy—leveraging Eloquent relationships, robust routing, and comprehensive validation—you will build applications that are not only functional but also secure and maintainable. Keep building with Laravel!
