---
title: "How to attach a PDF using barryvdh/laravel-dompdf into an email in Laravel"
description: "How to Attach a PDF using barryvdh/laravel dompdf into an Email in Laravel Dealing with file attachments within email systems can often be a sticking point,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

Dealing with file attachments within email systems can often be a sticking point, especially when integrating external tools like `barryvdh/laravel-dompdf` into the streamlined environment of Laravel. You've hit a common roadblock: moving from standalone PHP solutions (like PHPMailer) to using Laravel's built-in Mail facade and encountering file stream errors.

This post will diagnose why you are seeing the `Unable to open file for reading [%PDF-1.3` error and provide the correct, robust "Laravel way" to attach a dynamically generated PDF to an email.

## Diagnosing the Attachment Error

The error message `Swift_IoException in FileByteStream.php line 144: Unable to open file for reading [%PDF-1.3` strongly indicates that when the Mailer attempts to read the file you specified using the `attach()` method, the underlying operating system or PHP streams cannot locate or access the file at that path.

In your provided code snippet, the issue lies in how you are attempting to pass the output of `PDF::loadView('pdf.invoice')` directly to the attachment method within the Mail closure. While DomPDF generates the PDF content, it often needs to be explicitly saved to a location accessible by the mailer so that the email client can process it as an actual attachment.

When working within Laravel, we must ensure that any generated file is properly persisted before being referenced by the Mail facade.

## The Correct Laravel Approach: Saving and Attaching Files

The most reliable method for attaching dynamically generated PDFs involves saving the PDF output to a temporary location on your server (like the `storage` disk) and then referencing that saved path when sending the email. This adheres to good file handling practices within the Laravel ecosystem, which is central to effective application architecture, much like the principles discussed at [laravelcompany.com](https://laravelcompany.com).

Here is a step-by-step guide on how to correctly handle this process:

### Step 1: Generate and Save the PDF

Instead of relying solely on the return value from `PDF::loadView()`, you should instruct DomPDF to save the generated output to a file on your disk.

```php
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

public function sendInvoiceEmail($invoiceId)
{
    $info = \App\Models\Invoice::find($invoiceId);

    // 1. Generate the PDF content and save it to storage
    $pdfPath = 'pdfs/invoice_' . $invoiceId . '.pdf';
    
    // Load the view and save the output directly to a file
    $pdf = PDF::loadView('pdf.invoice');
    $pdf->save(storage_path('app/pdfs/' . $pdfPath));

    // ... proceed to send email using the saved path
}
```

### Step 2: Attach the File via Mail Facade

Now that the file exists in a known, accessible location on your server, you can use the `attach()` method to reference this file path. When attaching files in Laravel, it is best practice to attach them by their public disk path.

```php
use Illuminate\Support\Facades\Mail;

public function sendInvoiceEmail($invoiceId)
{
    // ... (Step 1: PDF generation and saving as above) ...

    Mail::send('mail', $info, function ($message) use ($pdfPath) {
        $message->to('example@gmail.com')
                 ->subject('Send Invoice ' . $invoiceId)
                 ->from('from@gmail.com', 'The Sender');

        // 2. Attach the file using the saved path
        $message->attach(storage_path('app/pdfs/' . $pdfPath), [
            'as' => 'Invoice ' . $invoiceId, // The filename to display in the email client
            'mime' => 'application/pdf'    // Specify the MIME type
        ]);
    });

    echo 'Email sent successfully!';
}
```

## Conclusion: Consistency is Key

The error you encountered stems from a mismatch between what DomPDF outputs and what the Mailer expects as an attachment source. By explicitly saving the PDF to a file path on your server using Laravel's `storage` abstraction before invoking the mail process, you ensure that the file stream is correctly handled by PHP and the underlying mail library.

Always prioritize saving generated assets to disk when dealing with external libraries in a framework environment. This approach makes your code predictable, scalable, and robust, ensuring that your application adheres to the principles of clean architecture seen across [laravelcompany.com](https://laravelcompany.com).
