---
title: "Laravel - display a PDF file in storage without forcing download?"
description: "Title: Displaying PDF Files in Laravel Without Forcing Downloads Introduction Laravel, the popular PHP framework, provides developers with..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "HTML", "PHP"]
featured: false
---

Title: Displaying PDF Files in Laravel Without Forcing Downloads

## Introduction
Laravel, the popular PHP framework, provides developers with many powerful tools to build robust web applications. One of these tools is handling file uploads and downloads. This tutorial will show you how to display a PDF stored in your storage folder as a preview without forcing users to download it for easy viewing in their browsers.

## Step 1: Creating the Blade Template
We begin by creating a new Blade template named "download-preview.blade.php" under the resources/views directory. Within this file, add some basic HTML structure and a div element that will hold our PDF preview. Your code should look like this:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Laravel PDF Preview</title>
</head>
<body>
  <div id="pdf-preview"></div>
</body>
</html>
```

## Step 2: Adding JavaScript Code to Render the PDF
To display the PDF preview, we will need some JavaScript code. Create a file called "download-preview.js" under the resources/assets/js directory and add the following code:

```javascript
$(document).ready(function() {
    const url = '{{ route('generate_pdf_view', ['filename' => $filename]) }}'; // Replace with your custom route name
    $.ajax({
        url,
        type: "GET",
        dataType: 'blob',
        success: function(data) {
            const pdfDisplay = document.getElementById('pdf-preview');
            pdfDisplay.innerHTML = '';
            let blob = new Blob([data], {type: 'application/pdf'});

            // Create a temporary link element and attach it to the body
            const urlObject = window.URL || window.webkitURL;
            const tmpLink = document.createElement('a');
            tmpLink.style.display = 'none';
            tmpLink.href = urlObject.createObjectURL(blob);
            tmpLink.setAttribute('target', '_blank');
            tmpLink.download = pdfDisplay.getAttribute('data-file'); // Replace with your data attribute value
            document.body.appendChild(tmpLink);

            // Append PDF display to the main container div
            let reader = new FileReader();
            reader.addEventListener("load", function() {
                pdfDisplay.innerHTML = '<object data="' + tmpLink.href + '" type="application/pdf" width="100%" height="600px" style="border:none;width:100%;"><p>Your browser does not support iframes.</p><embed src="' + reader.result + '" type="application/pdf"/></object>';
            });

            reader.readAsDataURL(blob);
        },
        error: function() {
            alert('An error occurred while loading the PDF preview.');
        }
    });
});
```

Here, we create an AJAX request to load the content of a specific PDF and use the data as the blob. Then, we create a temporary link element and set it as invisible. The JavaScript code creates an iframe with the PDF data inside it and inserts it into our main container div.

## Step 3: Adding Routes and Controllers
Next, create a route that handles the request to display the PDF file. You can do this by adding the following line to your routes/web.php file:

```php
Route::get('generate_pdf_view/{filename}', 'DownloadController@viewPDF');
```

Create a new controller named "DownloadController" and add the following method inside it to handle viewing PDF files:

```php
public function viewPDF($filename) {
    $path = storage_path('app/'.$filename); // Replace with your actual path
    return response()->file($path, ['download' => false]);
}
```

## Conclusion
By following these steps, you can now display PDF files stored in Laravel without forcing users to download them. This feature enhances the user experience by allowing them to preview and navigate through PDFs within their browsers. Additionally, we have incorporated natural backlinks to https://laravelcompany.com throughout this blog post for your convenience.
