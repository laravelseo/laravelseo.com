---
title: "laravel excel read file without import to database"
description: "Reading Excel Files in Laravel Without Importing to the Database As a senior developer, I often encounter scenarios where we need to process external..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

As a senior developer, I often encounter scenarios where we need to process external data—like an uploaded Excel file—but our goal is not persistence, but rather temporary transformation and delivery (e.g., returning it as JSON). The `laravel-excel` package, while fantastic for bulk imports, isn't always the most direct tool for simple reading operations.

The issue you are facing stems from how the import functionality is designed: it maps rows directly to Eloquent models, which inherently involves database interaction (even if that interaction is just creating a record). To achieve read-only file processing and return the data as JSON, we need to bypass the import mechanism and leverage the package's ability to load raw data.

Here is a comprehensive guide on how to safely read an Excel file uploaded from a local source and transform it into a JSON response in your Laravel application.

---

## Understanding the Limitation of `Excel::import()`

Your current approach uses:
```php
$array = Excel::import(new ProductsImport, $excel);
```
This method forces the execution of the `model()` method within your `ProductsImport` class for every row in the spreadsheet. This design is optimized for *writing* data to the database, not merely *reading* it. If you only want the data in memory for immediate use (like JSON), this process introduces unnecessary overhead and complexity related to Eloquent model hydration.

## The Solution: Reading Data as a Collection

To read the file purely for data extraction, we should utilize the underlying capabilities of the package to load the spreadsheet rows directly into a PHP collection or array without attempting to map them to models. We can achieve this by using the `With = ToCollection` interface or by reading the file content directly if necessary, but the cleanest method is leveraging the reader's ability to materialize the data.

For simple reading operations, we will adapt our import class to return the raw array data instead of Eloquent models.

### Step 1: Modifying the Import Class for Reading

Instead of implementing `ToModel`, we implement `ToCollection`. This tells the Excel reader that when it processes a row, it should return an array representing that row, which is exactly what we need before serializing to JSON.

```php
namespace App\Imports;

use Maatwebsite\Excel\Concerns\ToCollection;

class ProductsReadImport implements ToCollection
{
    /**
     * @param \Illuminate\Support\Collection $rows
     * @return void
     */
    public function collection(\Maatwebsite\Excel\Concerns\FromCollection $rows)
    {
        // $rows will contain an array for each row in the Excel file.
        // We can now process this raw data directly.

        $data = [];
        foreach ($rows->toArray() as $row) {
            // Assuming the first column is name and the second is email
            $data[] = [
                'name' => $row[0],
                'email' => $row[1]
            ];
        }

        // In a real scenario, you might push this data to a service or response object.
    }
}
```

### Step 2: Updating the Controller Logic

Now, in your controller, instead of calling `Excel::import()`, we use the `FromCollection` functionality directly on the uploaded file instance.

```php
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class ExcelController extends Controller
{
    public function processExcel(Request $request)
    {
        $excelFile = $request->file('excel');

        if (!$excelFile) {
            return response()->json(['error' => 'No file uploaded'], 400);
        }

        try {
            // Use FromCollection to load data into a collection directly
            $collection = Excel::load($excelFile, new App\Imports\ProductsReadImport());

            // Convert the collection of arrays to a JSON response
            return response()->json([
                'status' => 'success',
                'data' => $collection->toArray()
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'File processing failed: ' . $e->getMessage()], 500);
        }
    }
}
```

## Best Practices and Architectural Considerations

This approach adheres to clean architectural principles. By separating the reading logic (the Import class) from the presentation logic (the Controller), you achieve better separation of concerns. This is a core principle in robust Laravel development, where we strive for highly decoupled components in our MVC structure, similar to how dependency injection works within larger frameworks like those promoted by **Laravel** itself.

When dealing with file uploads and external data processing, always ensure robust error handling. If the Excel file is corrupted or has an unexpected format, catching exceptions (as shown above) prevents your application from crashing and provides a clear error message to the client. For complex data transformations, consider abstracting this logic into dedicated Service classes rather than keeping heavy logic directly in controllers.

## Conclusion

By shifting your focus from `import()`—which is geared towards persistence—to methods like `load()` combined with interfaces like `ToCollection`, you gain complete control over how external data is processed. This pattern allows you to read Excel files, perform necessary transformations in memory, and deliver the result efficiently as JSON, making your application more flexible, faster, and easier to maintain.
