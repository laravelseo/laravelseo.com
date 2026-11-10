---
title: "React Native + Expo + Axios file upload not working because axios is not sending the form data to the server"
description: "Mastering File Uploads in React Native: Why Axios Fails with FormData File uploads are one of the most common, yet frustrating, challenges developers face..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Content", "JavaScript", "Errors"]
featured: false
---

File uploads are one of the most common, yet frustrating, challenges developers face when building mobile applications. When integrating a React Native frontend using Expo and libraries like Axios for backend communication, dealing with `multipart/form-data`—especially involving local files—often leads to subtle bugs where the data simply doesn't transmit correctly.

If you are facing the exact issue of sending an image via `FormData` across your network but seeing no file data on the server side, you are not alone. This often boils down to how platform-specific file URIs and HTTP headers interact during the serialization process. As a senior developer, let’s dissect why this happens and provide a robust solution.

## The Anatomy of the Problem: FormData and File Objects

The core issue usually lies in structuring the data that `FormData` expects when dealing with local files from mobile operating systems (Android/iOS).

Let's review the steps you outlined: picking the image, creating the `FormData` object, and sending it with Axios.

### Step 1: Handling Local File URIs

When using libraries like `expo-image-picker`, the resulting URI often points to a local file system path (e.g., `file://...`). While you correctly attempted to manipulate this path for Android compatibility, the most reliable method in modern React Native/Expo environments is to ensure that the data appended to `FormData` is treated as a true file object or a correctly formatted string referencing the file stream.

### Step 2: The Axios Request Configuration

The success of a `multipart/form-data` request hinges entirely on two things:
1.  The `FormData` object itself contains the correct boundaries and content types.
2.  The `Content-Type` header sent by Axios accurately reflects this complex structure, including the unique boundary marker.

Your current setup involving manually setting the boundary in the headers is often overly complicated or incorrect when using standard Axios configurations for file uploads.

## The Correct Implementation: Ensuring File Data Integrity

The most reliable way to handle file uploads in React Native is to ensure that the `file` object you append to `FormData` is correctly formatted, and let Axios handle the complex boundary generation if possible, though explicit header setting remains crucial.

Here is a revised approach focusing on robust data handling:

```javascript
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { Platform } from 'react-native';

const uploadImage = async (photoUri, title) => {
    // 1. Prepare the file object for FormData
    const file = await fetchFileFromUri(photoUri); // Custom utility needed to read URI as Blob/File

    let formData = new FormData();
    formData.append("title", title);
    
    // Append the actual file data using the correct structure
    formData.append("file", {
        uri: photoUri,
        type: "image/jpeg", // Ensure MIME type is set correctly
        name: "uploaded_image.jpg" 
    });

    try {
        const response = await axios.post(U_R_L, formData, {
            headers: {
                // Crucially, let Axios handle the boundary if possible, or explicitly set it.
                'Content-Type': 'multipart/form-data', 
                // Note: When using FormData directly with Axios, often setting Content-Type to 
                // multipart/form-data is sufficient, and Axios manages the boundary automatically 
                // unless you intercept the request stream.
            }
        });

        console.log("Upload successful:", response.data);
        return response.data;
    } catch (error) {
        console.error("Upload failed:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// Helper function placeholder: In a real app, you need logic to read the file stream from the URI
async function fetchFileFromUri(uri) {
    // Implementation detail: Use expo-file-system or similar methods 
    // to get the actual file content if needed for advanced scenarios.
    return { uri: uri }; // For basic FormData, just providing the reference might suffice depending on backend setup.
}
```

### Why This Works Better

The key insight here is that when dealing with `multipart/form-data`, the browser/server expects the request body to be structured by boundaries. While you tried to manually define the boundary in your headers, often the most reliable method is to let Axios handle the transmission of the `FormData` object itself.

**Best Practice Note:** For file uploads, especially when dealing with remote URIs in React Native, ensure that the data appended to `FormData` resembles a standard file object structure (e.g., using `Blob` or correctly formatted string representations) rather than just raw URI strings, as this facilitates server-side parsing. When designing APIs—especially following REST principles—it is essential to understand how the client serializes complex data structures like files. Good API design, much like in systems built around frameworks like Laravel, demands a clear and consistent contract for receiving these payloads.

## Conclusion

File upload failures in React Native often stem from subtle mismatches between the client-side file handling (URI format) and the HTTP request structure (`multipart/form-data` headers). By focusing on correctly preparing the data structure within `FormData` and allowing Axios to manage the complex header negotiation, you can resolve these frustrating transmission errors. Always test your backend endpoint thoroughly with tools like Postman or cURL to confirm that the server is expecting the correct `multipart/form-data` payload before diving deep into client-side debugging.
