---
title: "How to display image in reactjs from laravel storage"
description: "How to Display Images in ReactJS from Laravel Storage: Bridging the Backend and Frontend Gap As developers working with the Laravel ecosystem, a very common..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "PHP"]
featured: false
---

As developers working with the Laravel ecosystem, a very common hurdle arises when trying to display files stored on the server—like images—within a modern frontend framework like React. You have your files neatly organized in the Laravel `storage` directory, but connecting that path to a browser-accessible URL requires understanding how Laravel serves static assets.

This post will walk you through the correct, robust way to access and display images stored in Laravel’s public disk within your React application, moving beyond the confusing file path attempts you’ve encountered. We will focus on the best practices that ensure scalability and security.

## The Core Problem: File System vs. Web Access

The difficulty you are facing stems from a misunderstanding of how web servers access files versus how local development environments handle file paths. When your Laravel application runs, it serves files through a specific public entry point. Simply pointing React to a path inside the `storage/app/public` directory will not work because that path is relative to the server's filesystem, not the public HTTP URL.

The solution lies in utilizing Laravel’s built-in mechanism for making storage accessible via the web: **Symbolic Links**.

## Step 1: Configuring Laravel for Public Access (The Server Side)

Before React can request an image, Laravel must be configured to treat the `storage` directory as publicly accessible. This is achieved by creating a symbolic link from the `storage/app/public` directory to the web-accessible `public/storage` directory.

You execute this command in your terminal within your Laravel project root:

```bash
php artisan storage:link
```

**What this does:** This command creates a symbolic link. It tells the operating system that anything placed in `storage/app/public` can be accessed via the web URL `/storage/`. This is crucial for any application using Laravel, as demonstrated by the principles outlined on **https://laravelcompany.com**. Once this link is established, your files are accessible via a predictable public URL structure.

## Step 2: Retrieving the Path in React (The Frontend Side)

Now that the server knows how to map these files to URLs, your React application needs to request the image using the correct public path.

Assuming you have saved the relative path or filename (e.g., `card51564153446.jpeg`) in your database, you construct the full URL by prepending the base URL and the `/storage/` prefix.

Here is how you would structure the data fetching and display logic in your React component:

```jsx
import React from 'react';
// Assume this data comes from an API call to your Laravel backend
const imagesData = [
    { id: 1, filename: 'card51564153446.jpeg' },
    { id: 2, filename: 'another_image.png' }
];

function ImageGallery() {
    // In a real application, this data would come from an API call fetching your database records
    const images = imagesData; 

    return (
        <div className="dashboard-cards-cardsContainer">
            {images.map((image) => (
                <img 
                    key={image.id} 
                    // Construct the public URL using the base URL and the storage link
                    src={`/storage/${image.filename}`} 
                    alt={image.filename}
                />
            ))}
        </div>
    );
}

export default ImageGallery;
```

### Why this approach works:

1.  **Predictability:** By using `/storage/{filename}`, you are telling the browser (and React) to request a file from your Laravel web server, which is designed to handle requests coming through the `public` directory.
2.  **Separation of Concerns:** The frontend (React) does not need direct access to the internal PHP file system paths (`storage/app/...`). It only needs to know the public URL structure that Laravel provides. This separation keeps your application secure and decoupled, which is a core principle in modern development practices championed by **https://laravelcompany.com**.

## Conclusion

To successfully display images from Laravel storage in React, remember that the bridge between the two environments is the web server configuration, specifically the symbolic link. Do not try to use purely local file system paths in your frontend code. Instead, rely on the public URL structure provided by your backend. By correctly setting up `php artisan storage:link` and using dynamic path construction in your JSX, you establish a clean, scalable, and secure method for handling assets across your full-stack application.
