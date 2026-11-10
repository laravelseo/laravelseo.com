---
title: "Laravel validation allow image or pdf"
description: "Laravel File Validation: Ensuring Only Images or PDFs are Uploaded Dealing with file uploads is a fundamental task in web development, but ensuring security..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "JavaScript", "HTML"]
featured: false
---

Dealing with file uploads is a fundamental task in web development, but ensuring security and data integrity—specifically restricting files to only allowed types like images or PDFs—is crucial. When working with file inputs in a Laravel application, you need robust validation mechanisms. As a senior developer, I often encounter scenarios where simple checks fall short, requiring a deeper dive into how Laravel handles file requests.

This post will guide you through the most effective ways to validate file uploads in your Laravel controller, ensuring that users can only submit images (`.jpg`, `.png`, etc.) or PDF documents.

## The Challenge of File Validation

When a user uploads a file via an HTML form, the server receives the data as a stream. Simply checking the file extension provided by the client-side JavaScript is insufficient, as malicious users can easily bypass this check. The true validation must occur on the server side, analyzing the actual content of the uploaded file to guarantee its type.

The core problem is: How do we reliably determine if an uploaded file is an image or a PDF within Laravel's validation framework?

## Method 1: Using Laravel's Built-in `mimes` Rule (Basic Approach)

For simple scenarios where you only care about the file extension, Laravel provides a straightforward way to handle this using the built-in `mimes` rule. This is the quickest approach, but it relies on the client sending correct information and can be bypassed if not properly secured.

You would apply this directly within your Form Request or Controller validation:

```php
use Illuminate\Support\Facades\Validator;

// Assuming $request is the incoming HTTP request
$validator = Validator::make($request->all(), [
    'document' => [
        'required',
        'file',
        'mimes:jpg,jpeg,png,pdf', // Only allow these extensions
        'max:10240'          // Optional: Set a maximum file size
    ],
]);

if ($validator->fails()) {
    // Handle validation errors
    return redirect()->back()->withErrors($validator)->withInput();
}

// If validation passes, the file is considered valid for further processing.
```

While this method works for basic filtering, it doesn't verify the *actual* content of the file; it only checks the name provided by the client. For high-security applications, we need a more robust solution.

## Method 2: Robust Validation via File Content Inspection (Best Practice)

The most secure and reliable method involves checking the actual MIME type or content signature of the uploaded file. This ensures that even if someone tries to rename an executable file to `.jpg`, the server rejects it because its internal structure does not match the expected image format.

To achieve this, we must inspect the file using PHP functions, such as `finfo_file` or by reading the file content stream. We integrate this custom logic into our validation process.

### Implementing Content Validation

Since standard Laravel rules don't natively handle complex MIME type checks across all file types, we often perform this check within a custom rule or directly in the controller after initial file upload.

Here is how you can implement a custom check to ensure the file is either an image or a PDF:

```php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FileUploadController extends Controller
{
    public function store(Request $request)
    {
        $allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

        // 1. Basic file presence check (Laravel handles this well)
        if (!$request->hasFile('document')) {
            return redirect()->back()->withErrors('No file was uploaded.');
        }

        $file = $request->file('document');

        // 2. Robust Content Validation using finfo_file for MIME type checking
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file->getRealPath());
        finfo_close($finfo);

        if (!in_array($mimeType, $allowedTypes)) {
            return redirect()->back()->withErrors([
                'document' => 'Invalid file type. Only images and PDFs are allowed.'
            ]);
        }

        // If validation passes, proceed with saving the file (e.g., to storage)
        // ... save logic here ...

        return redirect()->route('dashboard')->with('success', 'File uploaded successfully!');
    }
}
```

### Why This Approach is Superior

By using `finfo_file` to inspect the file's true MIME type, you are performing server-side verification. This practice aligns perfectly with Laravel's philosophy of keeping business logic secure and centralized. When dealing with complex data manipulation or security checks within a Laravel project, leveraging these underlying PHP capabilities is essential for building resilient applications, much like adhering to the principles outlined on the [Laravel documentation](https://laravelcompany.com).

## Conclusion

In summary, while using the `mimes` rule provides a simple first layer of defense, true file validation requires deeper inspection. For ensuring that uploaded files are strictly images or PDFs in your Laravel application, integrate custom logic using PHP functions like `finfo_file` to verify the actual content type. This layered approach guarantees both user experience and robust security for your data management processes.
