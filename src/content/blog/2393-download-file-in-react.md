---
title: "download file in react"
description: "Mastering File Downloads in React: Bridging the Gap Between Laravel APIs and Frontend Experience As developers, we often encounter a frustrating scenario: an..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "JavaScript", "PHP"]
featured: false
---

As developers, we often encounter a frustrating scenario: an API endpoint works perfectly when tested with tools like Postman or directly in a browser, but implementing the download functionality within a modern frontend framework like React proves tricky. This is especially true when dealing with file downloads served from backend systems like Laravel.

This post will dive deep into why your standard `fetch` request might fail to trigger a download in React and provide you with the correct, robust method to handle binary file streams. We will bridge the gap between your Laravel backend and your React frontend effectively.

## The Core Problem: JSON vs. Binary Responses

The issue you are facing stems from how the server responds versus how the frontend is interpreting that response.

In your Laravel controller:
```php
public function pdfDownload($id){
    $pdf = Cv::findOrfail($id);
    return Storage::download('public/pdf/' . $pdf->pdf); // This returns a file stream
}
```
When you call `Storage::download()`, Laravel sets the appropriate HTTP headers (like `Content-Type` and `Content-Disposition`) to instruct the browser to download the file. The response body is raw binary data, not JSON.

In your initial React attempt:
```javascript
fetch(' http://127.0.0.1:8000/api/file/pdf/' + id, {
    method: 'get',
    headers: { /* ... */ }
}).then((res) => res.json()); // <-- Problem here!
```
By calling `res.json()`, you are telling the browser to parse the response body as a JSON string. Since the response is raw file data, this parsing fails, and the download mechanism is never triggered because React doesn't receive the necessary stream information to initiate a file save dialogue.

## The Solution: Handling Binary Streams with `fetch` and Blobs

To successfully download a file in React, you must treat the response as a stream of raw data (a `Blob`) rather than trying to parse it as JSON. We need to read the response body as an array buffer and then create a temporary URL that the browser can use to initiate the download.

Here is the complete, corrected approach for downloading files in React:

```javascript
const downloadPdf = async (id) => {
    try {
        // 1. Fetch the file response, expecting a Blob
        const response = await fetch(`http://127.0.0.1:8000/api/file/pdf/${id}`, {
            method: 'GET',
            headers: {
                Accept: 'application/octet-stream' // Request binary data
            }
        });

        // 2. Check if the request was successful
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // 3. Read the response body as a Blob (Binary Large Object)
        const blob = await response.blob();

        // 4. Create a temporary URL for the Blob
        const url = window.URL.createObjectURL(blob);

        // 5. Create a temporary link element to trigger the download
        const a = document.createElement('a');
        a.href = url;
        
        // Set the filename (optional, but good practice)
        // Assumes you know the file name or can derive it from your ID logic
        a.download =
