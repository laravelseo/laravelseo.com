---
title: "Adding Custom Footer and Header with Laravel Excel Package"
description: "Mastering Custom Exports: Adding Headers and Footers with Laravel Excel As developers working with data reporting, exporting complex datasets into clean,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers working with data reporting, exporting complex datasets into clean, readable formats like CSV or XLSX is a daily task. The Laravel Excel package provides an incredibly powerful abstraction layer for this, but sometimes you need more control than the default settings offer—specifically, adding custom headers or footers that span across your exported columns.

If you are using Laravel Excel (version 3.1 or later) and need to achieve a specific visual layout, like the header/footer shown in your expected output, you need to look beyond simple data mapping and delve into how the package handles metadata and array structuring.

This guide will walk you through the correct approach to customizing headers and solving file storage issues when exporting with Laravel Excel.

## The Challenge: Customizing Export Structure

The core difficulty lies in the fact that standard export methods focus primarily on mapping data columns. To introduce custom lines *above* or *below* the main data, we must ensure this information is included within the data structure that Laravel Excel processes. Simply returning an array of results isn't enough; you need to return a composite structure that includes your desired static text alongside the dynamic data.

Your current implementation uses `FromArray` and `WithHeadings`, which are excellent starting points for setting column names, but they don't inherently handle complex row-spanning metadata.

## Solution 1: Implementing Custom Headers and Footers

To achieve the effect of a header or footer spanning all columns, you need to strategically inject these lines into your data array *before* the actual data rows. This allows the Excel writer to treat those lines as special, full-row entries.

Here is how you can modify your `ReportExport` class to incorporate custom headers and footers:

```php
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ReportExport implements FromArray, WithHeadings
{
    protected $results;
    protected $headings;
    protected $fileAttributes;

    public function __construct(array $results, array $headings, array $fileAttributes)
    {
        $this->results = $results;
        $this->headings = $headings;
        $this->file_attributes = $fileAttributes;
    }

    /**
     * @return array
     */
    public function array(): array
    {
        // 1. Define the custom header row
        $customHeaderRow = [
            'Report Title' => 'Monthly Sales Data', // Example static text
            'Date' => '2023-10-01',
            'Amount' => 'USD',
        ];

        // 2. Define the custom footer row (spans all columns)
        $customFooterRow = [
            'Total Sales' => 'Calculated Sum',
            'Status' => 'Complete',
        ];

        // 3. Combine the custom rows with the actual data
        $allData = [$customHeaderRow, $customFooterRow];

        // Add the actual results below the headers/footers
        $allData = array_merge($allData, $this->results);

        return $allData;
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        // This remains for setting column names if needed, though our custom rows define the structure.
        return $this->headings;
    }

    public function registerEvents(): array
    {
        return [
            BeforeExport::class => function (BeforeExport $event) {
                $event->writer->getProperties()->setTitle('Patrick');
            },
        ];
    }
}
```

By structuring your `array()` method to first output the static header data, then the dynamic results, and finally the footer data, you instruct Laravel Excel to write these rows directly into the sheet, achieving the desired spanning effect. This approach gives you complete control over the final file structure.

## Solution 2: Handling File Storage

Regarding your inability to store the exported file to a specific location, this is usually a matter of configuring the disk or ensuring the file path provided to `Excel::store()` is valid and accessible by your application's storage configuration.

If you are running into issues with custom storage locations, ensure that your Laravel environment (specifically the `config/filesystems.php` setup) correctly defines the disk where you intend to save the file (e.g., using `local`, `public`, or a custom mounted drive). For robust file management in large applications, leveraging Laravel's built-in storage abstraction is highly recommended, as it aligns with modern architectural patterns, similar to how services are managed within the larger ecosystem of **laravelcompany.com**.

When calling the export:

```php
// Assuming you have set up a custom disk named 'reports' in config/filesystems.php
use Maatwebsite\Excel\Facades\Excel;

try {
    Excel::store(new ReportExport($data, $headers, $attributes), 'reports/my_custom_report_' . time() . '.xlsx');
} catch (\Exception $e) {
    // Handle file writing errors gracefully
    throw new \Exception("File export failed: " . $e->getMessage());
}
```

By explicitly defining the path when calling `store()`, you ensure that the file operation respects your defined storage rules. Always verify permissions and disk configurations when dealing with file I/O in Laravel.

## Conclusion

Customizing exports in Laravel Excel requires shifting focus from just mapping data to structuring the entire output array. By strategically placing custom header and footer rows within the data returned by your `array()` method, you gain the necessary control to achieve complex formatting. Coupled with proper configuration of your file system storage, you can confidently generate highly customized reports for your users.
