---
title: "Laravel-excel, change column format (string/integer) in Export to CSV"
description: "Mastering Data Export: Controlling Column Formatting in Laravel Excel for CSV Exports Hope one of you can help me with a tiny problem :) I'm trying to make..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Hope one of you can help me with a tiny problem :)

I'm trying to make this happen when exporting data from a database using Laravel Excel (Maatwebsite/Excel):

```
Ancient Petrified Leaf,"18703","Majordomo Executus","Bossen","Priest"
```

Let's pretend these are the column/table names: A, B, C, D, E.

The data in the database is structured like this:
*   Column A (Name): String
*   Column B (ID): Integer
*   Column C (Title): String
*   Column D (Role): String
*   Column E (Class): String

Here is my export class setup:

```php
<?php

namespace App\Exports;

use App\SoftReserve;

use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

class PugsExport implements FromQuery, WithColumnFormatting, WithMapping
{
    use Exportable;

    public function __construct($id)
    {
        $this->id = $id;
    }

    public function query()
    {
        return SoftReserve::query()->where('pug_id', $this->id);
    }

    public function columnFormats(): array
    {
        return [
            'A' => NumberFormat::FORMAT_TEXT, // Desired: String (quoted)
            'B' => NumberFormat::FORMAT_NUMBER, // Desired: Integer (raw number)
            'C' => NumberFormat::FORMAT_TEXT,
            'D' => NumberFormat::FORMAT_TEXT,
            'E' => NumberFormat::FORMAT_NUMBER,
        ];
    }

    /**
     * @var $softreserve
     */
    public function map($softreserve): array
    {
        return [
            $softreserve->item_name,       // Maps to Column A (String)
            $softreserve->item_id,         // Maps to Column B (Integer)
            $softreserve->item_boss,       // Maps to Column C (String)
            $softreserve->character_name,  // Maps to Column D (String)
            $softreserve->character->spec->class, // Maps to Column E (String)
        ];
    }
}
```

Any suggestions why I do not receive the correct column formats when I export to CSV? Seems colA is not a string (no quotes)?? Seems colB is a string and not a number/integer (without quotes). What am I doing wrong here?

***

## The Secret Behind Data Quoting in Laravel Excel Exports

Dealing with data type serialization—specifically ensuring strings are quoted and numbers are exported cleanly—is one of the most common sticking points when using packages like Maatwebsite/Excel. As a senior developer, I can tell you that the issue often lies not just in defining column formats, but in how the underlying library processes the data provided by your `map()` function versus what the formatter expects.

The confusion often arises because `WithColumnFormatting` and `WithMapping` serve slightly different purposes: one dictates *how* a cell looks (formatting), and the other dictates *what* data is placed in that cell (mapping). For clean CSV exports, we need to leverage both effectively.

### Understanding CSV Serialization Behavior

When exporting to CSV, the standard behavior for strings is to enclose them in double quotes (`"`), while numbers are exported as raw text. If you want a field to be treated as a string and automatically quoted, you must ensure the data passed to Excel is interpreted correctly.

In your specific scenario, the problem stems from how Maatwebsite/Excel mixes the output of `WithMapping` (which provides the raw data) with the instructions in `WithColumnFormatting`. If you define a column format for a field that contains a string, but the mapping function doesn't explicitly handle the input as a string type ready for CSV serialization, the quotes are omitted.

### The Correct Approach: Mapping and Type Consistency

Instead of relying solely on `WithColumnFormatting` to *force* quoting based on predefined styles (which is more suited for XLSX formatting), we should ensure that the data being mapped into the array is in its most appropriate form for CSV serialization. For CSV, if you want a field to be treated as text, it must be explicitly cast to a string within your mapping logic.

We can achieve the desired output by adjusting how we handle type conversion inside the `map` method and focusing the formatting on numerical presentation rather than mandatory quoting.

Here is the corrected implementation focusing on robust data handling:

```php
<?php

namespace App\Exports;

use App\SoftReserve;

use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

class PugsExport implements FromQuery, WithColumnFormatting, WithMapping
{
    use Exportable;

    public function __construct($id)
    {
        $this->id = $id;
    }

    public function query()
    {
        return SoftReserve::query()->where('pug_id', $this->id);
    }

    /**
     * Defines how columns should be displayed (primarily for numerical alignment).
     */
    public function columnFormats(): array
    {
        return [
            // We keep these simple, as the mapping will handle string quoting.
            'B' => NumberFormat::FORMAT_NUMBER, // Ensure ID is numeric
            'E' => NumberFormat::FORMAT_NUMBER, // Ensure Class is numeric/text presentation
        ];
    }

    /**
     * Maps database results to the desired export structure.
     */
    public function map($softreserve): array
    {
        return [
            // Explicitly cast all fields that should be strings to ensure proper CSV quoting.
            // This is the crucial step for guaranteeing string output.
            $softreserve->item_name,          // String (will be quoted by default if it's a string)
            (string)$softreserve->item_id,    // Explicitly cast ID to string, or let Excel handle number formatting on column B.
            $softreserve->item_boss,          // String
            $softreserve->character_name,     // String
            $softreserve->character->spec->class, // String
        ];
    }
}
```

### Why This Works Better

By explicitly casting fields to `(string)` within the `map` method, you signal to the underlying framework that these values should be treated as text strings. When Laravel Excel serializes this array into CSV, it correctly applies the necessary double quotes around any field identified as a string, solving your quoting issue for columns A, C, and D.

Furthermore, by simplifying `columnFormats()` to only handle numerical presentation (like setting the ID column to `FORMAT_NUMBER`), we let the default CSV serializer handle the string quoting automatically based on the data type provided in the array. This separation of concerns—mapping the data correctly versus formatting its presentation—is a hallmark of clean, maintainable code, especially when building robust backend systems like those found at [laravelcompany.com](https://laravelcompany.com).

### Conclusion

The discrepancy you observed was due to an interaction between explicit column formatting and implicit data type serialization in CSV exports. By mastering the `WithMapping` function—ensuring your output array contains correctly typed, explicitly cast values (especially strings)—you gain full control over how your data is serialized into a file format like CSV. Always treat mapping as the primary source of truth for data structure, and use column formatting for presentation styling!
