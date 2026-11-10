---
title: "How to skip blank rows in maatwebsite-excel 3.1 for model-way import on Laravel"
description: "How to Skip Blank Rows in maatwebsite excel for Model Import on Laravel Importing data from external sources like Excel files is a common task in web..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Importing data from external sources like Excel files is a common task in web applications. When using powerful packages like `maatwebsite-excel` with Eloquent and custom import classes, developers often encounter the issue of extraneous blank rows polluting the database. As you've experienced with your `StudentsImport` class, simply mapping the columns doesn't inherently filter out empty data; it just maps whatever is present in the spreadsheet.

As a senior developer, I can guide you through the most effective ways to handle this problem, ensuring that only valid data makes it into your database. This approach focuses on data validation directly within your import logic, which is a core principle of robust Laravel development.

## Diagnosing the Issue with `maatwebsite-excel`

The issue arises because when `maatwebsite-excel` reads an Excel sheet, if a row contains empty cells, these are typically read as empty strings (`''`) or `null` values in the resulting PHP array passed to your `model()` method. If you proceed directly to create a model with these empty values, the database will store those blanks.

In your example:
```php
public function model(array $row)
{
    return new Student([
        'school_uuid' => Auth::user()->school_uuid,
        'cardid'     => $row[0], // If $row[0] is empty, it gets saved as NULL or ''
        // ... other fields
    ]);
}
```
If `$row[0]` is empty, your code successfully creates a `Student` record where `cardid` is blank. To fix this, we need to implement an explicit check within the mapping function.

## Solution 1: Implementing Conditional Skipping in the Model Method (The Direct Fix)

The most straightforward and recommended way to skip processing for blank rows is to add an initial check inside your `model()` method. This prevents unnecessary database operations on empty data, promoting cleaner data integrity.

You should check if any critical field—like the primary identifier (`cardid` in this case)—is present before attempting model creation.

Here is how you can modify your `StudentsImport` class:

```php
use Illuminate\Support\Facades\Auth; // Ensure necessary facades are imported

class StudentsImport implements FromSheet
{
    public function model(array $row)
    {
        // Check if the first column (cardid) is not empty. 
        // We assume that if cardid is missing, the entire row is invalid for import.
        if (empty($row[0])) {
            // Skip this row entirely if the primary key/identifier is blank
            return null; 
        }

        // If the check passes, proceed with model creation
        return new Student([
            'school_uuid' => Auth::user()->school_uuid,
            'cardid'     => $row[0],
            'prefix'    => $row[1], 
            'name'    => $row[2], 
            'lastname'    => $row[3], 
            'dob'    => $row[4], 
            'address'    => $row[5], 
            'phone'    => $row[6], 
        ]);
    }
}
```

### Best Practice: Using Laravel Validation on Import

While checking within the `model()` method solves the immediate problem, for truly robust data handling, you should also leverage Laravel’s validation system. If you want to handle rows that are *partially* blank (e.g., a name is missing but the ID exists), you can implement custom validation rules directly on your `Student` model or use an intermediate step. This adheres to the principle of separation of concerns, which is fundamental to building scalable applications in Laravel.

## Solution 2: Pre-filtering Data with Excel Reader Options (Advanced Filtering)

For larger files where you want to skip
