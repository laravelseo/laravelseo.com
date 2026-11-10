---
title: "Laravel Mail Attachment"
description: "Mastering Email Attachments in Laravel: A Developer's Guide As a fellow developer, I completely understand that diving into file handling, validation, and..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As a fellow developer, I completely understand that diving into file handling, validation, and email integrations can feel overwhelming at first. Dealing with file uploads, security, and asynchronous tasks like sending emails often requires careful planning. This post will walk you through exactly how to handle PDF attachments in Laravel, focusing on best practices for validation, storage, and generating secure download links.

We will take the code snippet you provided and expand it into a robust, professional solution that adheres to modern Laravel standards.

---

## The Foundation: Secure File Upload and Storage

Before we can send an email with an attachment, we must ensure the file is safely stored on the server and validated correctly. Directly attaching very large files to emails is inefficient and often blocked by mail servers. The best practice for documents like CVs (PDFs) is to store them in your application's storage and provide a secure link.

### Setting up File Storage and Validation

In your controller method, you need stricter validation rules and proper file manipulation. We will use Laravel’s built-in validation features combined with logical checks on the file itself.

Here is how you can enhance your upload logic:

```php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage; // Import Storage facade

public function store_applier(Request $request)
{
    // 1. Stricter Validation (Ensuring required fields are present)
    $validated = $request->validate([
        'nama' => 'required|string|max:255',
        'email' => 'required|email',
        'kontak' => 'required|string',
        'kategori' => 'required|string',
        'posisi' => 'required|string',
        'alamat' => 'required|string',
        'upload_cv' => 'required|file|mimes:pdf|max:2048', // Validates file type (PDF) and size (max 2MB = 2048 KB)
    ]);

    // 2. Handling File Upload and Storage
    $file = $request->file('upload_cv');
    
    // Store the file in the 'cvs' directory on your disk (e.g., local storage or S3)
    // The 'public' disk makes it accessible via URL::asset() later.
    $path = $file->store('cvs', 'public'); 

    // 3. Saving Data to Database (Assuming you have an Applier model)
    $tambah = new appliers(); 
    $tambah->nama = $validated['nama'];
    $tambah->email = $validated['email'];
    // ... save other fields

    // Store the file path in the database for easy retrieval later
    $tambah->cv_path = $path; 

    // ... proceed to mail sending below
}
```

**Key Takeaway:** Notice how we used `mimes:pdf` and `max:2048`. This is critical. By validating the file *before* you store it, you prevent malicious uploads and ensure only valid PDF files are processed. For more advanced file system management in Laravel, exploring packages that interface with cloud storage like Amazon S3 (which Laravel supports natively) is highly recommended.

## Sending the Email with a Download Link

Since we are storing the file on the server, we will not attach the large PDF directly to the email. Instead, we will use the stored path to generate a publicly accessible link, which is much more reliable for large attachments.

### Implementing the Mail Logic

In your mail function, you construct the download URL using Laravel’s `Storage` facade and pass that link in the view.

```php
// Inside store_applier method, after saving data:

$cv_url = Storage::disk('public')->url($tambah->cv_path); // Generates the public URL for the file

Mail::send('emails.welcome', [
    'email' => $request['email'],
    'HP' => $request['kontak'],
    'nama' => $tambah->nama, 
    'posisi' => $tambah->posisi, 
    'CV_LINK' => $cv_url // Pass the secure link to the view
], function ($message) use ($request, $tambah) {

    $message->from('stevanajja@gmail.com', $tambah->posisi);   

    $message->to('stevantinusl47@gmail.com')
            ->subject('Lamaran Baru');

    // Note: We don't need to use Mail::attach() for the file itself now.
});
```

### Updating the View

Finally, in your Blade view, you replace the static path with the dynamic URL we generated. This ensures that the link is secure and points directly to the stored file.

```html
<h2>Lamaran Baru</h2>
From : {{ $email }}

NO.HP : {{ $HP }}

=========================

Nama saya {{ $nama }},

Saya ingin melamar pekerjaan di PT.Halcom dengan posisi sebagai 
<h2>{{$posisi}}</h2>

Berikut saya lampirkan CV saya

<br><br><br>

*Klik link dibawah untuk melihat CV Anda:*

<a href="{{ $CV_LINK }}">Download CV (PDF)</a> 
```

## Conclusion

Handling file attachments in Laravel is a layered process involving validation, secure storage, and smart presentation. By prioritizing storing files on the server and linking to them via a public URL—rather than attaching the binary data directly—you create a more robust, scalable, and secure system. Remember, always leverage Laravel’s built-in features, like the `Storage` facade and validation rules, as demonstrated here. Keep practicing, and you will master these concepts quickly!

For more in-depth resources on building powerful applications with PHP and Laravel, be sure to explore the official documentation at [laravelcompany.com](https://laravelcompany.com).
