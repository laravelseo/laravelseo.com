---
title: "Passing variable from DOMPDF controller to view"
description: "Passing Variables from Laravel Controller to DOMPDF: The Definitive Guide Creating PDF documents directly from web applications using libraries like DOMPDF..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Creating PDF documents directly from web applications using libraries like DOMPDF is a powerful feature for generating invoices, reports, and statements. However, bridging the gap between your server-side data (Laravel Controller) and the presentation layer (the View rendered by DOMPDF) often presents tricky variable passing issues. As a senior developer, I’ve seen many developers run into exactly this problem: correct data is available in the controller, but it seems lost when rendering a PDF.

This guide will walk you through the exact solution for passing complex variables from your Laravel Controller to your DOMPDF view successfully, ensuring your generated PDFs are accurate and complete.

## Understanding the Problem: Why Variables Disappear

You are attempting to pass an array of Eloquent models to `PDF::loadView()`. While this method is designed to load a view, the way you structure the data often needs refinement for nested or complex objects when using external PDF generation libraries.

Your attempt:
```php
$data = [$salesorder, $detailemployee, $detailservice];
$pdf = PDF::loadView('summary.invoice', $data);
```
The error `Undefined variable: salesorder` occurs because the way DOMPDF processes the data passed to `loadView()` expects variables to be directly accessible within the view context, or it struggles with deeply nested array structures when iterating over them implicitly. The reason `dd($data)` works is that PHP can see the variables in the controller scope; however, the rendering engine (DOMPDF) needs a clear mapping of what to display.

## The Solution: Structuring Data for DOMPDF

The most robust way to pass data to a view intended for PDF generation is to structure the data as a single, cohesive array or object that contains all necessary information in a predictable format. Instead of passing loosely grouped models, you should prepare exactly what the view expects.

Here is the corrected and recommended approach:

### Step 1: Prepare the Data in the Controller

Instead of passing an array of model objects, structure your data into a single payload that is easy for the view to consume. You can format this data by accessing the necessary attributes directly or ensuring the models are correctly serialized if needed (though generally, passing Eloquent models works best).

In your controller method, consolidate all required information into one array:

```php
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceController extends Controller
{
    public function pdf(Request $request, $id)
    {
        // Fetch the necessary data
        $salesorder = $this->show($id)->salesorder;
        $detailservice = $this->show($id)->detailservice;
        $detailemployee = $this->show($id)->detailemployee;

        // Structure the data into a single, flat array for easy access in the view
        $pdfData = [
            'salesorder_details' => $salesorder,
            'employee_details' => $detailemployee,
            'service_details' => $detailservice,
        ];

        // Pass the structured data to loadView
        $pdf = Pdf::loadView('summary.invoice', $pdfData);
        return $pdf->download('invoice.pdf');
    }
}
```

### Step 2: Accessing Variables in the View

Now, inside your `summary.invoice` Blade file, you access these variables directly using the keys you defined in the controller. This explicitly tells the view where to find the data, eliminating ambiguity for DOMPDF.

**`resources/views/summary/invoice.blade.php`**

```html
<!DOCTYPE html>
<html>
<head>
    <title>Invoice PDF</title>
</head>
<body>
    <h2>Sales Order Invoice</h2>

    {{-- Accessing the data using the keys defined in the controller --}}
    <h2>Sales Order Information</h2>
    <p>Order Number: {{ $salesorder_details->order_number ?? 'N/A' }}</p>

    <h2>Employee Details</h2>
    <p>Name: {{ $employee_details->name ?? 'N/A' }}</p>

    <h2>Service Items</h2>
    <ul>
        @foreach ($service_details->items as $item)
            <li>{{ $item->description }} - ${{ $item->amount }}</li>
        @endforeach
    </ul>

</body>
</html>
```

## Best Practices for PDF Generation with Laravel

When working with PDF generation in Laravel, especially when using packages like [barryvdh/laravel-dompdf](https://laravelcompany.com), follow these principles:

1.  **Flatten the Structure:** Avoid passing deeply nested arrays of Eloquent models directly if you need specific fields displayed. Instead, process your data in the controller to extract only the necessary attributes and place them into a flat array keyed by descriptive names (as shown above).
2.  **Use Explicit Keys:** Always pass a single associative array (`$data`) rather than a list of separate variables. This gives DOMPDF a clear object to map onto the final HTML output.
3.  **Leverage Eloquent Relationships:** If your data involves relationships, ensure those relationships are loaded *before* you pass the data to the PDF generation step. Loading relations in the controller (e.g., using `with()`) is crucial for performance and data integrity before rendering anything.

By structuring your data explicitly, you move from relying on implicit variable passing—which often fails in rendering environments—to explicit data mapping, resulting in reliable and clean PDF exports every time.
