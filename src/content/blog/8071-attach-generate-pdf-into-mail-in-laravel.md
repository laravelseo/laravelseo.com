---
title: "Attach generate pdf into mail in Laravel"
description: "Attaching Generated PDFs to Emails in Laravel: A Practical Guide As a senior developer working with Laravel, one of the most common tasks we face is..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content"]
featured: false
---

As a senior developer working with Laravel, one of the most common tasks we face is generating dynamic content—like reports or invoices—and then sending that content as an attachment via email. When dealing with PDF generation and mail attachments, developers often run into hurdles related to file handling and stream management.

If you are encountering issues attaching a dynamically generated PDF in your Laravel application, the problem usually lies not in the Mail class itself, but in how the PDF object is being prepared before it is passed to the mailer.

This post will walk you through the correct, robust method for generating a PDF and successfully attaching it to an outgoing email, ensuring your code is clean, secure, and follows Laravel best practices.

## Understanding the Attachment Challenge

Your provided controller snippet attempts to use `$message->Attach($pdf);` within the mail closure. While this syntax exists in some mailer implementations, standard Laravel Mail handles file attachments by requiring a file path or stream that the underlying mail driver can read from the filesystem.

The core issue is that the `$pdf` variable, while holding the generated PDF content, needs to be physically saved to a location where the mail system can access it. Simply passing an object might not register it as a tangible attachment.

## The Solution: Save the PDF to the Filesystem

The most reliable method for attaching files in Laravel is to save the generated file to the configured storage disk (usually `storage/app/public` or `storage/app/pdfs`) and then attach the resulting path to the mail object. We will leverage the built-in Laravel `Storage` facade for this.

### Step-by-Step Implementation

Here is how you can refactor your controller logic to correctly generate, save, and attach the PDF:

**1. Generate and Save the PDF:**
Instead of just loading the view into a variable, we need to save the output as a file. Since you are likely using a package like Dompdf or similar libraries, you need to direct the output stream to a file.

**2. Use the Storage Facade:**
We will use the `Storage` facade to place the PDF file where it can be easily referenced by the mailer.

```php
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
// ... other necessary imports

public function kirim(Request $request)
{
    $keluhan = keluhan::findOrFail($request->id);
    // ... (your database queries for $tindak and $analisa remain the same) ...

    // 1. Generate the PDF content into a file stream
    $pdfContent = \PDF::loadView('laporan.ptkp', compact('keluhan', 'tindak', 'analisa', 'halaman'));

    // 2. Save the PDF content to the storage disk
    // Store it in the public directory for easy access via URL later, or within the private app directory.
    $fileName = $keluhan->id . '_' . time() . '.pdf';
    Storage::disk('public')->put('reports', $fileName, $pdfContent); // Assuming 'public' disk is set up

    // 3. Prepare mail data
    $data = [
        'email_address' => $request->email_address,
        'cc' => $request->cc,
        'subject' => $request->subject,
        'keterangantambahan' => $request->keterangantambahan
    ];

    // 4. Send the email with attachment
    Mail::send('laporan.kirim', $data, function($message) use ($fileName) {
        $message->from('christian7andrew@gmail.com', 'PuraBox');
        $message->to($data['email_address']);

        if ($data['cc'] != null) {
            $message->cc($data['cc']);
        }
        $message->subject($data['subject']);

        // Attach the file using the saved path
        $message->attach(Storage::disk('public')->path('reports/' . $fileName), [
            'as' => 'Laporan_Keluhan_' . $keluhan->id . '.pdf', // The name the recipient sees
            'mime' => 'application/pdf'
        ]);
    });

    return redirect('/');
}
```

## Best Practices for File Attachments

When dealing with file attachments in Laravel, always adhere to these principles:

1.  **Use the Storage Facade:** Never try to pass raw binary data directly unless you are using a very specific stream-based mail driver. Use `Storage::put()` or `Storage::disk()->putFile()` to manage files on your server.
2.  **Define a Disk:** Ensure you have a configured disk (like `public`, `s3`, or `local`) in your `config/filesystems.php` file before attempting to save files. This is fundamental for robust application design, as emphasized by the principles of scalable architecture found on resources like [laravelcompany.com](https://laravelcompany.com).
3.  **Specify MIME Type:** Always provide the correct MIME type (`'mime' => 'application/pdf'`) when attaching files. This helps the recipient's email client correctly identify and display the file, rather than just showing a generic attachment icon.

## Conclusion

Attaching generated PDFs to emails in Laravel requires bridging the gap between application logic (PDF generation) and file system operations. By saving the PDF content to the configured storage disk using the `Storage` facade and then referencing that file path during the `Mail::attach()` call, you ensure a reliable and professional email delivery experience. This approach keeps your controller clean and adheres to the principles of separation of concerns that define good Laravel development.
