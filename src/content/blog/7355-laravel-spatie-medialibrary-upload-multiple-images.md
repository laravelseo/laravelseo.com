---
title: "Laravel Spatie Medialibrary: upload multiple images through REST API"
description: "Mastering Multiple File Uploads with Laravel Spatie MediaLibrary via REST API As developers building robust applications with Laravel, integrating file..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As developers building robust applications with Laravel, integrating file uploads into a clean RESTful API is a common requirement. When leveraging powerful packages like the **Spatie MediaLibrary**, we aim for efficiency and scalability. However, handling multiple files in a single request—especially when dealing with multipart form data—often introduces subtle pitfalls.

I've seen many developers run into issues when trying to extend simple file handling logic to manage arrays of uploaded files. This post dives deep into the specific problem you encountered with uploading multiple photos via a REST API using Spatie MediaLibrary and provides the definitive, robust solution.

## The Challenge: Handling Multiple Files in MediaLibrary Uploads

You are attempting to use `addMediaFromRequest` to attach several files from an incoming request to your database records. Your initial attempt failed because of how Laravel parses file inputs when multiple files are present in a multipart request.

Your original code snippet looked like this:

```php
if ($request->hasFile('photo')) {
    foreach ($request->input('photo', []) as $photo) {
        $listing->addMediaFromRequest('photo')->toMediaCollection('photos');
    }
}
```

While checking `hasFile()` works for a single file, when you upload multiple files using the convention `name[]` (e.g., `photos[]`), Laravel handles these as an array of files within the request object, which often bypasses simple existence checks like `hasFile()`. The structure of the input data needs to be explicitly handled to iterate correctly over the uploaded file objects.

## The Solution: Iterating Over File Arrays Correctly

The key to solving this lies in recognizing that when multiple files are sent under the same input name (like `photos[]`), they arrive as an array of file objects. We need to check if this array exists and then iterate directly over it, rather than relying on singular checks.

Here is the corrected and robust way to handle multiple media uploads:

```php
use Illuminate\Http\Request;
use App\Models\Listing; // Assuming your model structure

public function store(Request $request)
{
    $request->validate([
        'name'          => 'required',
        'slug'          => 'required',
        'description'   => 'required',
        'price'         => 'required|integer',
        // Ensure the input is an array, allowing zero files if none are sent
        'photos'        => 'nullable|array' 
    ]);

    $listing = Listing::create([
        'user_id'       => auth('api')->user()->id,
        'name'          => $request->input('name'),
        'slug'          => $request->input('slug'),
        'description'   => $request->input('description'),
        'price'         => $request->input('price'),
    ]);

    // Correctly handle multiple files from the 'photos' array
    if ($request->hasFile('photos')) {
        // Iterate over the array of files provided under the 'photos' input name
        foreach ($request->file('photos') as $file) {
            $listing->addMediaFromRequest('photos')->toMediaCollection('photos');
        }
    }

    return new ListingResource($listing);
}
```

### Explanation of Changes and Best Practices

1.  **Validation Update:** I updated the validation to expect `'photos' => 'nullable|array'`. This ensures that if the client sends no files, the request is still valid, and we explicitly expect an array structure.
2.  **Using `request()->file('photos')`:** Instead of using `$request->input('photo', [])`, which can sometimes yield unexpected results with file arrays, we use `request()->file('photos')`. This method specifically retrieves the collection of uploaded files associated with that input name.
3.  **Direct Iteration:** We directly loop through the resulting collection (`foreach ($request->file('photos') as $file)`). Inside the loop, we call `addMediaFromRequest()`, passing the media folder name (which should match your setup) and the specific file you are processing.

When building APIs, especially when dealing with complex operations like media management, adhering to clean data handling principles is paramount. This focus on correct request parsing aligns perfectly with the structured approach advocated by Laravel principles found on resources like [laravelcompany.com](https://laravelcompany.com).

## Conclusion

Handling multiple file uploads via a REST API requires moving beyond simple single-file checks. By correctly understanding how Laravel structures multipart form data—as arrays of files when using bracket notation (`photos[]`)—we can write resilient code. The solution is to explicitly check for the existence of the file array and then iterate over it using `request()->file()`.

By implementing this change, your application will reliably handle zero, one, or many photos uploaded simultaneously, making your endpoint much more flexible and scalable. Happy coding!
