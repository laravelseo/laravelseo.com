---
title: "Call to undefined method Maatwebsite\\Excel\\Excel::create() in Laravel 5.8"
description: "Resolving the Error: Call to undefined method Maatwebsite\\Excel\\Excel::create() in Laravel 5.8 As a senior developer working with package ecosystems, I..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Errors"]
featured: false
---

As a senior developer working with package ecosystems, I frequently encounter issues where seemingly simple operations result in cryptic errors. The error you are facing—`Call to undefined method Maatwebsite\Excel\Excel::create()`—is a classic symptom of using an outdated or incorrect API pattern within the `maatwebsite/excel` package, especially when transitioning between older Laravel versions (like 5.8) and newer library expectations.

This post will diagnose why you are seeing this error and provide the correct, modern approach to exporting data to Excel using Maatwebsite/Excel in a Laravel application. We will focus on best practices to ensure your exports are robust and compliant with modern Laravel standards.

---

## The Root Cause: API Misunderstanding

The error indicates that the static method `create()` does not exist directly on the main `Maatwebsite\Excel\Excel` class in the way you are attempting to call it. While the package provides various ways to interact with Excel files (using Facades, custom classes, or specific export methods), the direct invocation of a generic `create()` method for file generation is likely deprecated or incorrect for your installed version (`3.1`).

In modern implementations of Maatwebsite/Excel, we typically use dedicated classes or facade methods designed specifically for reading data and writing it to an Excel file. Trying to force a custom creation flow often leads to these kinds of undefined method errors.

## The Correct Approach: Using `FromCollection` and `download()`

Instead of attempting to manually create the spreadsheet object via a generic `create()` call, the package provides highly efficient methods designed to handle data mapping directly from Eloquent collections or arrays. For exporting data gathered in your Controller, the recommended approach involves using the `FromCollection` or `FromQuery` classes to manage the data formatting before downloading the file.

Here is how you should refactor your export logic in your Controller:

### Refactored Controller Logic

We will leverage the package's intent: fetch the data, prepare it into a format Excel can understand (a collection), and then use the facade method `download()` to handle the file generation.

```php
use App\Models\User; // Assuming you are using an Eloquent model
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Http\Request;

class ExportController extends Controller
{
    public function msisdnExport(Request $request)
    {
        // 1. Fetch the data directly from the database
        $msisdns = User::select("phone")->get();

        // 2. Prepare the data structure for export
        // Convert the collection into an array suitable for writing to Excel
        $dataToExport = $msisdns->map(function ($user) {
            return [
                'MSISDN' => $user->phone,
            ];
        })->toArray();

        // 3. Use the correct facade method to download the file
        Excel::download(
            new \Illuminate\Support\Collection($dataToExport), // Pass the data collection
            'msisdn_report_' . now()->format('Ymd') . '.xlsx' // The filename
        );

        return redirect()->back()->with('success', 'MSISDN report generated successfully.');
    }
}
```

### Why This Works Better

By using `Excel::download()`, you are instructing the package to handle the entire file creation lifecycle. You provide it with a proper data source (a Collection or Array), and the library takes over, handling the sheet creation, header mapping, and writing process internally. This avoids the need for manual method calls like an undefined `create()`.

## Integrating with Laravel Best Practices

When building robust features in Laravel, especially when dealing with external libraries, always strive for clarity and adherence to the framework's conventions. As you build complex applications, remember that focusing on clean code is paramount. For comprehensive guidance on structuring your services and utilizing powerful packages like those found on **[laravelcompany.com](https://laravelcompany.com)**, understanding dependency management is key.

The process demonstrated above—fetching data, transforming it into a simple collection, and using the appropriate facade method—is the most robust pattern for exporting data. It keeps your controller lean and delegates the heavy lifting to the specialized package.

## Conclusion

The error `Call to undefined method Maatwebsite\Excel\Excel::create()` was caused by attempting to use an incorrect or deprecated method signature within the Maatwebsite/Excel library. By shifting from manual object creation attempts to using dedicated data-to-Excel mapping methods like `Excel::download()` combined with Eloquent collections, you resolve the issue and implement a cleaner, more maintainable export feature. Happy coding!
