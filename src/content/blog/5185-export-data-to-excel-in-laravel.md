---
title: "Export data to Excel in Laravel"
description: "Mastering Data Export in Laravel: Fixing Formatting Issues with Maatwebsite/Excel As a senior developer working with Laravel, exporting data into formats..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

As a senior developer working with Laravel, exporting data into formats like Excel is a fundamental task. While packages like `maatwebsite/excel` make this process remarkably easy, achieving the *exact* formatting you desire—especially when dealing with headers and data types—often requires a nuanced approach to how you structure your data before it hits the spreadsheet.

Many developers encounter issues where the resulting Excel file looks technically correct but doesn't match the desired presentation, particularly when attempting to format numbers or create distinct header rows. This post will dive into your specific problem, analyze why your current export is failing to produce the desired title table, and provide a robust solution using best practices from the Laravel ecosystem.

## The Challenge: Formatting Headers in Excel Exports

You are using `maatwebsite/excel` to generate an export, and you are running into trouble getting the header row (title table) to display exactly as you want it. Specifically, you mentioned the need to change numbers into text within the header. This is a very common hurdle because spreadsheets treat data types differently, often forcing numeric values into a format that looks like a number rather than plain text, or requiring explicit formatting rules.

Your current approach aggregates the data and then uses `fromArray()`, which works well for simple data dumps, but it doesn't inherently handle complex header separation or type casting needed for professional reporting.

## The Solution: Structuring Data for Perfect Excel Output

The key to solving this lies in separating your header definitions from your actual data rows. Instead of dumping a single array into the sheet, we need to explicitly define the headers first and then iterate through the data to populate the subsequent rows.

Here is how you can refactor your controller method to achieve the desired result where your headers are clearly defined as text:

```php
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\DB;

public function getExport()
{
    Excel::create('Export data', function ($excel) {
        $sheet = $excel->spreadsheet()->getActiveSheet();

        // 1. Define the desired header row explicitly as text
        $headers = [
            'Start Date',
            'End Date',
            'Status',
            'Security Name',
            'Company Name',
        ];
        
        // Write the headers to the first row (Row 1)
        $sheet->fromArray($headers, null, 1); // Start writing from Row 1

        // 2. Fetch and prepare the data
        $products = DB::table('log_patrols')
            ->join('cms_companies', 'cms_companies.id', '=', 'log_patrols.id_cms_companies')
            ->join('securities', 'securities.id', '=', 'log_patrols.id_securities')
            ->select(
                'log_patrols.date_start',
                'log_patrols.date_end',
                'log_patrols.condition_status',
                'securities.name as nama_security',
                'cms_companies.name as nama_companies'
            )
            ->get();

        // 3. Prepare the data for writing (ensure all values are strings)
        $data = [];
        foreach ($products as $product) {
            $data[] = [
                $product->date_start,
                $product->date_end,
                $product->condition_status,
                $product->nama_security,
                $product->nama_companies,
            ];
        }

        // 4. Write the data starting from the second row (Row 2)
        if (!empty($data)) {
            $sheet->fromArray($data, null, 2); // Start writing data from Row 2
        }

    })->download('export.xls');
}
```

### Explanation of Improvements

1.  **Explicit Header Definition:** We now explicitly define the `$headers` array containing exactly what you want in the title row. By using `fromArray($headers, null, 1)`, we ensure these strings are written directly to the first row of the sheet.
2.  **Data Segregation:** The data fetching and preparation steps (`$products` and `$data`) are separated from the writing process. This separation makes debugging much easier and ensures that the structure you define for the header is completely independent of the raw data types.
3.  **Type Handling (String Casting):** By ensuring all values being written to the spreadsheet are explicitly cast or treated as strings (especially when dealing with dates, IDs, or status fields), you prevent Excel from misinterpreting numeric IDs or dates as pure numerical formats that break your header alignment.

## Conclusion

Exporting data is more than just running a database query; it’s about presentation. By shifting your focus from simply dumping an array to actively structuring the output—defining headers first and then writing data rows separately—you gain complete control over the final Excel result. Always remember that robust data handling, whether on the backend or in front of the user, is crucial for building reliable applications. For deeper insights into structuring powerful APIs and services within Laravel, exploring resources from [laravelcompany.com](https://laravelcompany.com) is highly recommended. Happy coding!
