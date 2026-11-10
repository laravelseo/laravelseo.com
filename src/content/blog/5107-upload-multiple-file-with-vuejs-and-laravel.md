---
title: "Upload multiple file with VueJs and Laravel"
description: "Mastering Multi File Uploads: Consolidating Requests with Vue.js and Laravel As developers working with full stack frameworks like Vue.js and Laravel, one of..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Performance", "JavaScript"]
featured: false
---

As developers working with full-stack frameworks like Vue.js and Laravel, one of the most common hurdles in building file upload features is efficiently handling multiple files. You often find yourself resorting to making several separate HTTP requests for each file, which severely impacts performance and user experience. The goal, as you rightly pointed out, is to consolidate these operations into a single, atomic request.

This post will walk you through the correct architectural approach to uploading multiple files from the frontend (Vue.js) to the backend (Laravel) in one go, addressing the common pitfalls related to `FormData` construction and multipart data boundaries.

## The Inefficiency of Multiple Requests

When you execute a loop that calls `axios.post()` for every file individually, you are creating $N$ separate HTTP round trips. This introduces significant overhead due to TCP connection setup, SSL negotiation (if applicable), and general latency. For large uploads or numerous files, this method quickly becomes slow and resource-intensive.

The solution lies in leveraging the `multipart/form-data` encoding correctly. When uploading multiple files simultaneously, all file data must be packaged together within a single request body.

## The Correct Approach: Single Multipart Request

To achieve a single upload, both the frontend and backend must cooperate to send all necessary information in one payload.

### 1. Frontend Implementation (Vue.js)

The key is to collect all selected files into an array and then iterate over that array to append each file to a *single* `FormData` object before sending the request. This ensures that the browser correctly constructs the required multipart boundary for the entire batch.

Here is how you should structure your Vue logic:

```javascript
async submitMultipleFiles() {
    // Assume this array holds the File objects selected by the user
    const filesToUpload = this.files; 
    
    if (filesToUpload.length === 0) {
        console.error("No files selected.");
        return;
    }

    const formData = new FormData();

    // Iterate through all selected files and append them to the SAME FormData instance
    filesToUpload.forEach((file, index) => {
        // Note: The key 'file' must match what the backend expects (e.g., request->file('file'))
        formData.append('files[]', file); // Using an array notation is often clearer for multiple files in Laravel
    });

    try {
        const response = await axios.post(
            'contracts/upload-multiple', // A single endpoint
            formData,
            {
                headers: {
                    // CRITICAL: When using FormData, Axios usually sets this automatically, 
                    // but explicitly setting it ensures correctness.
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        console.log("Upload successful:", response.data);
    } catch (error) {
        console.error("Upload failed:", error);
    }
}
```

### 2. Backend Implementation (Laravel)

On the Laravel side, when you receive a `multipart/form-data` request containing multiple files under the same field name (like `files[]`), the `$request->file()` method will return an array of `UploadedFile` instances. Your controller logic must be prepared to handle this array.

In your Laravel controller:

```php
use Illuminate\Http\Request;
use App\Models\ContractFile;

public function uploadMultipleFiles(Request $request, Contract $contract)
{
    // The request->file('files[]') method retrieves all files sent under the 'files[]' key.
    $uploadedFiles = $request->file('files[]');

    if (!$uploadedFiles) {
        return response()->json(['error' => 'No files were uploaded.'], 400);
    }

    foreach ($uploadedFiles as $file) {
        // Process each file individually within the single request context
        $filename = $file->getClientOriginalName();

        // Store the file using Laravel's storage system
        $path = $file->store($contract->id, 'uploads');
        
        ContractFile::create([
            'contract_id' => $contract->id,
            'name' => $filename,
            'path' => $path,
        ]);
    }

    return response()->json(['message' => count($uploadedFiles) . ' files uploaded successfully.'], 200);
}
```

## Understanding the Boundary Error

The error message you encountered, `Missing boundary in multipart/form-data POST data in Unknown`, is a direct indicator that the HTTP server (or the library processing the request) could not correctly parse the complex structure of the `multipart/form-data` stream. This typically happens when the boundaries separating different parts of the form data are missing or malformed, which often occurs when manually constructing `FormData` objects in a way that doesn't adhere strictly to the multipart specification. By using the standard `FormData.append()` method on a single object for all files, you allow the browser/Axios to handle the complex boundary generation correctly.

## Conclusion

Consolidating file uploads into a single request is a fundamental optimization for modern web applications. By mastering the use of `FormData` in Vue.js and ensuring your Laravel controller is set up to receive an array of files via `$request->file()`, you can achieve highly efficient, robust, and scalable file management. Always aim for a single interaction path when dealing with related data, as demonstrated by best practices found on platforms like [laravelcompany.com](https://laravelcompany.com).
