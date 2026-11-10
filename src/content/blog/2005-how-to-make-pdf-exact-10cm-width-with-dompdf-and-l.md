---
title: "How to make pdf exact 10CM width with DOMPDF and Laravel?"
description: "Title: Precisely Configuring PDF Width with DOMPDF and Laravel for a Special Printer Body: In this blog post, we will discuss how to make a perfectly sized..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "HTML", "PHP"]
featured: false
---

Title: Precisely Configuring PDF Width with DOMPDF and Laravel for a Special Printer

Body:

In this blog post, we will discuss how to make a perfectly sized PDF that fits the 10CM width requirement specified by your special printer using DOMPDF and Laravel. This is essential for ensuring your output looks exactly as you intended without any distortion of images or text content.

DOMPDF is an open-source PHP class that can be used to convert HTML or XML documents to PDF files. It provides a simple API for generating PDFs from a given view template, which makes it a popular choice for developers who need to generate PDF-based documents dynamically in their applications. However, setting the custom size of a PDF is not straightforward and requires some attention to detail.

To create an exact 10CM wide PDF using DOMPDF:

1. Set the correct paper size dimensions:
   - In laravel-dompdf (https://github.com/barryvdh/laravel-dompdf), use the $paperSizeConstant variable for setting the paper size.
   - For a 10x20 inches paper, you can set it as $customPaper = array(0,0,792,1224); (792 is close to 841.67 mm for 10 inches while 1224 is close to 1169.3 mm for 20 inches).
   - For a 10x20 cm paper: $customPaper = array(0,0,297,420); (297 is 21cm and 420 is 30cm).
   - It's essential to ensure that the width matches what your printer accepts. Otherwise, you might not get the desired output on your special printer.

2. Use the setPaper method:
   - After defining the custom paper size, use the $pdf->setPaper($customPaper) method to apply the specified dimensions to the PDF content.
   - This ensures that all content will be rendered according to your desired width during the printing process.

3. Load and compile the view:
   - To load the view you want converted into a PDF, use the $pdf->loadView('viewName') method.
   - Then, call the render() method to compile the generated PDF file with the defined paper size.

Example Code:
<pre><code>$customPaper = array(0,0,297,420);
$pdf = \PDF::loadView('viewName', [
   'model' => $yourModelData,
])->setPaper($customPaper);
\PDF::render($pdf, storage_path().'/app/pdf-files/generated.pdf');
</code></pre>

Final Thoughts:
Now that we have successfully set up the custom paper size for your PDF document using DOMPDF in Laravel, you can rest assured knowing that your special printer will accept and print the generated PDF files as expected. Always remember to double-check both your width and height settings before creating any PDF documents for a special printer. And don't forget to follow best practices when handling sensitive data or confidential information that might be part of your PDF content.
