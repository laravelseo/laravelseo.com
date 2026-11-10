---
title: "How can I add title and sum value of column in laravel excel version 3?"
description: "Mastering Data Presentation: How to Add Titles and Sums in Laravel Excel v3 As developers working with data export, one of the most common requirements is..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Errors"]
featured: false
---

As developers working with data export, one of the most common requirements is moving beyond a simple table dump. You don't just want raw data; you want a professional report, complete with clear titles, summaries, and formatting. When using powerful libraries like Maatwebsite\Excel for Laravel, achieving this level of detail requires understanding how the library interfaces with the underlying spreadsheet engine (PhpSpreadsheet).

This guide will walk you through the practical steps to add custom titles and calculate summary values directly into your Excel exports using Laravel Excel version 3.

## Understanding the Laravel Excel Extension Points

You correctly identified the path for extending functionality: using `WithEvents`. However, when methods like `styleCells` or `setOrientation` result in errors, it often means that these specific methods are not directly exposed on the base `Worksheet` object within the context of the event trigger alone. The events allow you to hook into specific lifecycle moments (like before/after writing), but the actual manipulation must target the underlying library objects correctly.

The key takeaway here is that while custom events are powerful for complex logic, for simple header additions and sums, we can often leverage the data preparation phase or specialized concerns provided by the package.

## Strategy 1: Adding Titles and Summaries via Data Preparation

For adding descriptive titles *above* your main data table, the most reliable approach is to structure your data collection itself. Instead of trying to manipulate the worksheet directly through events, we can preprocess the data and include these summary rows within the collection being exported. This keeps your export logic clean and decoupled from direct spreadsheet manipulation.

To achieve this, you need to calculate your totals *before* passing the data to the exporter.

### Step-by-Step Implementation

1.  **Calculate Totals in the Repository/Service:** Ensure your repository layer calculates the necessary sums (e.g., total sold quantity and total profit) for the entire dataset.
2.  **Prepare the Data Structure:** Instead of returning just the array of items, return a structure that includes these summary rows at the beginning.

Here is an example conceptual flow:

```php
namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class SummaryExport implements FromCollection, WithHeadings
{
    public function collection()
    {
        // 1. Fetch the main data
        $items = app(ItemRepository::class)->getSummaryData();
        
        // 2. Calculate totals
        $totalQuantity = array_sum(array_column($items, 'sold_quantity'));
        $totalProfit = array_sum(array_column($items, 'profit'));

        // 3. Prepare the data to include summary rows (Header/Summary Rows)
        $summaryRows = [
            ['Total Sold Quantity', $totalQuantity],
            ['Total Profit', $totalProfit],
        ];

        // Combine summaries and actual items for export
        return array_merge($summaryRows, $items);
    }

    public function headings(): array
    {
        // Headings must now account for the summary rows
        return [
            'Total Sold Quantity', // New Title Row 1
            'Total Profit',         // New Title Row 2
            'No',
            'Item Number',
            'Sold Quantity',
            'Profit'
        ];
    }
}
```

By structuring the data this way, you instruct Laravel Excel exactly what rows to write. The `WithHeadings` method then defines the header row that corresponds to these newly added summary values. This approach is highly robust and avoids the pitfalls of trying to force direct manipulation via complex events.

## Strategy 2: Advanced Formatting using Concerns

If your goal is purely visual styling (like bolding totals or applying specific colors), it is often more effective to use Laravel Excel's dedicated concerns rather than raw event hooks, as this ensures compatibility across library versions and better adherence to the package’s intended usage. For detailed column formatting and conditional styling, look into extending `WithColumnFormatting` alongside your data structure.

## Conclusion

Adding titles and sums in a Laravel Excel export is less about forcing low-level spreadsheet commands via events and more about intelligent data preparation *before* export. By calculating your metrics within the collection returned by `collection()` and structuring that collection to include summary rows, you gain a clean, maintainable, and platform-independent solution. This principle of separating business logic (data calculation) from presentation logic (export formatting) is fundamental to building scalable applications, aligning perfectly with best practices promoted by organizations like [laravelcompany.com](https://laravelcompany.com).
