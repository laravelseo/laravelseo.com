---
title: "How to change all cell's height and width in laravel excel"
description: "Mastering Bulk Formatting in Laravel Excel: How to Set All Row Heights and Widths Efficiently As a senior developer working with data export solutions, we..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Content", "PHP"]
featured: false
---

As a senior developer working with data export solutions, we often encounter the challenge of moving beyond simple data dumping to achieving polished, professional reports. Laravel Excel is an incredibly powerful package that simplifies CSV and Excel generation, but when dealing with large datasets—thousands of rows—applying consistent row heights and column widths requires a strategic approach.

The initial method you employed, setting properties for single cells (like `setSize('A1', 25, 18)`), works perfectly for specific header formatting. However, scaling this logic to manage the dimensions for thousands of subsequent rows becomes cumbersome if you try to manually define each row's properties.

This post will walk you through the correct, scalable way to manage cell heights and widths across an entire spreadsheet using Laravel Excel, leveraging PHP iteration techniques for maximum efficiency.

---

## The Challenge: Scaling Formatting Beyond the Header

You correctly noted that setting dimensions for a single row is straightforward. The difficulty arises when you have thousands of rows. If you attempt to manually loop through every single row and set its height and width individually within the Excel writer, the process becomes slow and error-prone, especially for large files.

The goal is to move from static formatting (setting header dimensions) to dynamic, bulk formatting (setting all data row dimensions).

## The Solution: Iterating Over Data for Bulk Formatting

Since Laravel Excel operates on underlying libraries like PhpSpreadsheet, the most efficient way to apply consistent formatting across thousands of rows is by iterating over your data array *after* it has been written to the sheet. This allows you to programmatically control the dimensions based on the row index or data content.

### Step-by-Step Implementation

Instead of setting static values for Row 1, we need to iterate through the actual data set. Let's assume your `$arrUsers` contains all the data you wish to format.

Here is a conceptual example demonstrating how you can iterate and apply row dimensions:

```php
use Maatwebsite\Excel\Facades\Excel;

class ReportExporter
{
    public function exportData(array $arrUsers)
    {
        Excel::create('Users Report', '2024-01-01')
            ->withQuery(function ($sheet) use ($arrUsers) {

                // 1. Write the data first, which sets the structure
                $sheet->fromArray($arrUsers, null, 'A1', true);

                // 2. Define Header Row (Row 1) separately for clarity
                $sheet->row(1, array('Name', 'Username', 'Contact', 'Email', 'Verified', 'Inactivity'));
                $sheet->freezeFirstRow();
                
                // Apply header styling (as you already did)
                $sheet->cell('A1:F1', function($cell) {
                    $cell->setFont(array('family' => 'Calibri', 'size' => '12', 'bold' => true));
                });

                // 3. BULK ROW DIMENSIONING (The solution for thousands of rows)
                // Determine the number of data rows (starting from row 2)
                $rowCount = count($arrUsers);
                
                for ($i = 2; $i <= $rowCount + 1; $i++) {
                    // Set the height for all subsequent rows dynamically
                    $sheet->getRowDimension($i)->setRowHeight(20); // Example: Set a consistent height of 20
                }

                // Optional: Set Column Widths for better readability
                $sheet->getColumnDimension('A')->setWidth(30);
                $sheet->getColumnDimension('B')->setWidth(40);
                // ... continue setting widths for all columns
            })
            ->store('xls')
            ->download('users_report.xls');
    }
}
```

### Best Practices for Scalability

1.  **Set Column Widths First:** For large datasets, controlling column width (`getColumnDimension()->setWidth()`) is often more predictable than row height because it scales consistently across all rows simultaneously.
2.  **Use `setRowHeight()` on the Row Object:** When iterating, use methods like `$sheet->getRowDimension($rowNumber)->setRowHeight($value)`. This directly manipulates the underlying PhpSpreadsheet object for that specific row, ensuring correctness.
3.  **Consistency is Key:** Manually setting every row height can lead to inconsistencies if your data contains mixed content. Define a standard height (e.g., 20 pixels) and apply it universally for a clean look.

## Conclusion

Managing complex formatting in large-scale Excel exports requires shifting from single-cell operations to iterative, bulk operations. By understanding how Laravel Excel interacts with the underlying library, you can leverage standard PHP loops to programmatically control row dimensions efficiently. This approach ensures that your data exports are not only functional but also professionally formatted, aligning perfectly with the robust framework philosophy promoted by companies like [Laravel Company](https://laravelcompany.com). Embrace iteration for scalable data manipulation in your Laravel projects!
