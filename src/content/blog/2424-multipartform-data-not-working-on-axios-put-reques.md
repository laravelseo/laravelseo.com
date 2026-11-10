---
title: "Multipart/form-data not working on axios put request"
description: "Solving Multipart/form data Issues with Axios PUT Requests: A Deep Dive for Next.js & Laravel Developers File uploads are a cornerstone of modern web..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "JavaScript", "Errors"]
featured: false
---

File uploads are a cornerstone of modern web applications, and integrating them seamlessly between a frontend framework like Next.js and a robust backend like Laravel often presents tricky HTTP handling issues. Many developers encounter the exact problem you described: attempting to send `FormData` via Axios with specific headers leads to unexpected empty bodies or data loss.

As a senior developer, I can tell you that this is rarely an issue with the file itself, but rather a subtle misunderstanding of how HTTP requests handle the boundary markers inherent in `multipart/form-data`. Let's break down why this happens and establish the correct pattern for handling file uploads.

## The Misconception: Content-Type and FormData

The core of your issue lies in how you are managing the `Content-Type` header when sending a `FormData` object.

When you use `new FormData()`, you are creating a structure designed to package form fields, including files, into a single request body formatted with a unique boundary string (the essence of `multipart/form-data`).

### Why Manual Header Setting Fails

In your example, setting the header manually as:
`{ headers: {'Content-Type': 'multipart/form-data'} }`

While conceptually correct for file uploads, when using Axios with a `FormData` object, **Axios (and the underlying HTTP stack) is designed to automatically set the correct `Content-Type` header, including the necessary boundary information**, if you pass the actual `FormData` instance as the data payload. Manually overriding this setting can confuse the request parser, leading it to believe the body content is empty or malformed, resulting in an empty response (`[]`).

If you remove the header entirely, Axios might default to sending a JSON body (if it expects JSON), which explains why you get the full object data but no file—it’s not sending the multipart structure at all.

## The Correct Implementation Pattern

The most reliable way to handle file uploads is to let the HTTP client manage the content type based on the payload type, rather than trying to manually specify the complex `multipart/form-data` header yourself. This aligns perfectly with best practices for building APIs, whether you are consuming or creating endpoints in a framework like Laravel.

Here is the corrected approach:

```javascript
      const formData = new FormData();
      formData.append('first_name', values.first_name);
      formData.append('last_name', values.last_name);
      formData.append('phone_no', values.phone_no);
      // Append the file data correctly
      formData.append('profile_picture', values.profile_picture, 'bermuda.png'); 
      formData.append('password', values.password);

      await axios.put(`/api/v1/users/${user.member_no}`, formData, {
        // *** REMOVE THE MANUAL CONTENT-TYPE HEADER ***
        // Let Axios handle the multipart boundary automatically!
      })
      .then((res
