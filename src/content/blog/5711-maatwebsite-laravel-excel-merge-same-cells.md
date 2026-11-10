---
title: "maatwebsite Laravel excel merge same cells"
description: "Mastering Data Merging in Laravel Excel: Moving Beyond Simple Export As developers transition from procedural scripting (like raw PHPExcel) to modern,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers transition from procedural scripting (like raw PHPExcel) to modern, object-oriented frameworks like Laravel and its ecosystem, we often encounter subtle but significant differences in how complex operations are handled. One common challenge arises when exporting data—specifically, performing conditional cell merging based on identical parent values across multiple rows.

This post addresses the specific requirement: How can we achieve dynamic cell merging in Laravel Excel (`maatwebsite/excel`) when dealing with structured arrays of data that require grouping and merging based on shared attributes?

## The Challenge: Procedural Merging vs. Data Export

Your description highlights a common pattern in legacy systems: iterating through raw data, comparing preceding rows to determine if a cell should be merged (e.g., merging "Batiment" and "Étage" if they are identical). This iterative logic is powerful but often cumbersome when implemented purely within an export library focused primarily on data transfer.

When using tools like `maatwebsite/excel`, the primary focus is efficiently loading structured PHP arrays into a spreadsheet format. While Laravel Excel provides excellent methods for exporting data, it generally delegates complex visual formatting and cell merging to the underlying Excel engine. Directly commanding the merge operation based on dynamic row-by-row comparisons requires careful planning because the library itself doesn't inherently possess high-level relational grouping logic.

## The Strategy: Pre-processing Data for Merging

Instead of trying to force the export library to handle complex, multi-conditional merging across rows, the most robust and maintainable approach is to perform the necessary grouping and merging logic *before* exporting the data. This separates your business logic (what constitutes a merge) from your presentation logic (how it looks in Excel).

We can leverage standard PHP array manipulation to group identical records together, effectively creating "parent" groups that dictate the merged cells.

### Step-by-Step Implementation Strategy

For your example involving merging "Batiment" and "Étage":

1.  **Group the Data:** Iterate through your input array and group rows based on the values you wish to merge (e.g., grouping by the combination of `Batiment` and `Etage`).
2.  **Identify Merge Boundaries:** Determine the start row, end row, and the merged cell range for each unique group.
3.  **Prepare the Export Array:** Structure your final data array so that it explicitly includes instructions or markers for merging, or structure the data such that contiguous identical entries are grouped together naturally.

While Laravel Excel doesn't offer a direct `mergeCells()` method on the sheet object, you can structure your data to facilitate this when using more advanced formatting techniques or by leveraging the properties of the underlying writer. For complex operations involving relational data and data manipulation within a Laravel context, understanding how to structure the data correctly is key—this aligns perfectly with the principles of clean architecture promoted by frameworks like those seen in **laravelcompany.com**.

## Code Example: Grouping for Merging

Let's look at restructuring your input array to facilitate merging "Batiment" and "Étage". We will group the data so that identical parent entries are adjacent, making manual or post-processing merging easier.

```php
$rawData = [
    [
        "Batiment" => "Unique",
        "N° du lot" => 7,
        "Étage" => "1e étage",
        "Fraction" => "Parking 0.35",
        // ... other fields
    ],
    [
        "Batiment" => "Unique",
        "N° du lot" => 8,
        "Étage" => "1e étage",
        "Fraction" => "Principal",
        // ... other fields
    ],
    // ... more data
];

$groupedData = [];
$currentGroup = null;

foreach ($rawData as $item) {
    $key = $item['Batiment'] . '|' . $item['Étage'];

    if ($currentGroup === null || $key !== $currentGroup['key']) {
        // Start a new group
        $currentGroup = [
            'key' => $key,
            'batiment' => $item['Batiment'],
            'etage' => $item['Étage'],
            'rows' => [$item]
        ];
    } else {
        // Add to the existing group
        $currentGroup['rows'][] = $item;
    }
}

// Now, $groupedData contains logical blocks ready for export.
// You would then iterate through $groupedData and use Laravel Excel's methods
// to write these structured blocks sequentially.

Excel::load('excel\recap_merged.xls', function($excel) use($groupedData) {
    $sheet = $excel->sheet('Copro');
    
    foreach ($groupedData as $group) {
        // Write the merged header information for this block
        $sheet->setCellValue('A1', 'Batiment: ' . $group['batiment']);
        $sheet->setCellValue('B1', 'Étage: ' . $group['etage']);

        // Write the data rows below, potentially merging columns A and B in a subsequent step
        foreach ($group['rows'] as $row) {
            $sheet->fromArray([$row['Batiment'], $row['Étage']], null, 'A' . ($sheet->rowCount() + 1), false);
        }
    }
});

Excel::store('xls');
```

## Conclusion

Achieving complex cell merging based on relational data requires shifting the focus from asking the export library to perform visual formatting directly, to ensuring your input data is logically structured first. By using PHP/Laravel logic to pre-process and group identical records into coherent blocks, you gain complete control over what gets written to the spreadsheet. This approach results in cleaner, more predictable exports, regardless of which underlying tools you use, offering a scalable solution for complex reporting tasks within your Laravel application.
