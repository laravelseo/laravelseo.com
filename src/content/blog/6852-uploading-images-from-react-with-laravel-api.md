---
title: "Uploading images from react with laravel api"
description: "Uploading Images from React with Laravel API: Solving the Multipart Mystery Uploading files between a modern frontend framework like React and a backend API..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "HTML"]
featured: false
---

Uploading files between a modern frontend framework like React and a backend API built with Laravel often presents unique challenges, primarily concerning how the HTTP request is structured. It’s a very common sticking point: why does Postman work perfectly for file uploads, but your React application fails to send the data correctly?

As a senior developer, I can tell you that this discrepancy almost always boils down to the difference between sending JSON data and sending `multipart/form-data`. Let's dive into diagnosing and fixing this common integration issue.

## The Root Cause: Understanding `multipart/form-data`

When you upload files using an HTML `<form>` element with `enctype="multipart/form-data"`, the browser packages the data in a specific format that separates the file binary data from other form fields. This is fundamentally different from sending a plain JSON payload, where all data is serialized into a single string.

When you use Postman to test your Laravel endpoint, Postman handles the construction of this complex `multipart/form-data` request automatically. However, when you use Axios directly from React, you need to explicitly construct this exact structure using the JavaScript `FormData` API. Simply passing a standard JavaScript object (like `{ picture: fileObject }`) to Axios will result in the files being lost or improperly encoded on the server side.

## The React Solution: Mastering `FormData`

The key to success lies in correctly preparing your data in React before sending it. You must gather all your form fields and file objects into a single `FormData` instance. This object is specifically designed to handle the complex boundaries required for file uploads.

Here is how you should refactor your `onSave` function and your form structure to ensure files are transmitted correctly.

### Corrected React Implementation Example

Instead of trying to manipulate an intermediate state, we will construct the `FormData` object directly from the input element values.

```javascript
const onSave = data => {
    // 1. Create a new FormData object
    const formData = new FormData();

    // 2. Append all necessary text fields (e.g., name, brand)
    formData.append('name', data.name);
    formData.append('brand', data.brand);
    // ... append other non-file fields

    // 3. Append the files using the correct key names
    // Since your HTML input was name="picture[]", we use that format here.
    for (let i = 0; i < data.picture.length; i++) {
        formData.append('picture[]', data.picture[i]);
    }

    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    
    // 4. Send the FormData object directly
    axios.post(`/api/products/store`, formData)
        .then(res => {
            console.log('Upload successful:', res);
        })
        .catch(err => console.error('Upload error:', err));
};

return (
    // IMPORTANT: Remove encType="multipart/form-data" from the form tag itself 
    // when using FormData, as Axios handles the content type header automatically.
    <form onSubmit={handleSubmit(onSave)}>
        <input
            type="file"
            name="picture[]" // Ensure this name matches what Laravel expects (or use array notation)
            label="Product Picture"
            onChange={handlePicInput}
            className={classes.inputFile}
            multiple
        />
        {/* Other inputs */}
        <button type="submit">Save Product</button>
    </form>
);
```

## Backend Validation: Laravel File Handling

Your Laravel controller logic seems generally correct for handling multiple files submitted via `multipart/form-data`. The use of `$request->file('picture')` and iterating through the resulting collection is the standard approach.

```php
public function store(Request $request)
{
    $imageNames = '';
    
    // When receiving multipart data, $request->file() returns a collection 
    // or a single file object depending on how it's named.
    if ($request->hasFile('picture')) {
        // Use the specific array notation if you sent multiple files as 'picture[]'
        $pictures = $request->file('picture'); 

        foreach ($pictures as $picture) {
            // Ensure you are storing the path correctly for storage in the 'public' disk.
            $imageNames .= $picture->store('product_pictures', 'public') . ',';
        }
    }

    $product = Product::create([
        'name' => $request->name,
        // ... other fields
        'imageurls' => $imageNames
    ]);
    $product->save();

    return response()->json(['message' => 'Product created successfully', 'urls' => $imageNames], 201);
}
```

The key takeaway here is that the frontend must use `FormData` to mimic the behavior Postman performs automatically. Proper handling of request bodies is crucial when dealing with file uploads in any framework, including Laravel. For more advanced file management and storage strategies within a Laravel application, exploring packages like those available on [laravelcompany.com](https://laravelcompany.com) can provide excellent structure for your service layer.

## Conclusion

The issue you faced was not with the Laravel side, but with how React constructs the HTTP request. By switching from trying to pass raw objects to correctly utilizing the `FormData` API in React, you ensure that the browser packages the file data exactly as the server expects it—as `multipart/form-data`. This simple adjustment bridges the gap between your frontend state and your backend API, allowing seamless file uploads.
