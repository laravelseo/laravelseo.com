---
title: "Displaying laravel stored images on shared hosting"
description: "Displaying Laravel Stored Images on Shared Hosting: A Complete Guide It is a very common hurdle when deploying a new Laravel application, especially on..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "PHP", "Errors"]
featured: false
---

It is a very common hurdle when deploying a new Laravel application, especially on shared hosting environments, to successfully display uploaded assets. You have the files in your storage directory, but the web server cannot find them, leading to broken image links. As a senior developer, I can assure you that this issue is rarely about the code itself, but rather about how Laravel's file system interacts with the web server’s public access points.

This guide will walk you through the exact steps required to correctly configure your application so that images stored in `storage/app/public` are accessible via a standard HTML `<img>` tag on shared hosting environments like HostGator.

---

## Understanding the Laravel Storage Structure

When you use the `Storage` facade in Laravel, files are physically written into the `storage` directory. By default, these files are not directly accessible via the web root (the `/public` folder) for security reasons. To make them publicly accessible, we must create a symbolic link between the storage location and the public document root.

Your setup described—storing the path as `public/myfolder1/...` in your database—is correct for tracking the file metadata, but the actual display requires a mechanism to bridge the gap between the internal system and the external web view.

## The Essential Step: Creating the Public Link

The key to solving this problem lies in running a single Artisan command that establishes the necessary symbolic link. This tells the operating system (and thus the web server) that the contents of your `storage/app/public` directory should be treated as publicly accessible files.

Execute the following command in your terminal:

```bash
php artisan storage:link
```

This command creates a symbolic link from `storage/app/public` to `public/storage`. This action ensures that any file placed within the `storage/app/public` directory is immediately accessible via the web root, specifically under the `/storage` subdirectory.

**Why this works:** The web server (Apache or Nginx) can now read the files located in the public folder, allowing your Blade templates to correctly reference them. This principle of separating application logic from public assets is fundamental to robust Laravel development, aligning perfectly with the principles advocated by the [Laravel Company](https://laravelcompany.com).

## Correctly Displaying Images in Blade

Once the symbolic link is established, you must use the correct helper function within your Blade view files to generate the URL for the image. Since we linked the storage directory to `public/storage`, all paths start from there.

If your file path stored in the database (e.g., `public/myfolder1/filename.png`) correctly points to where the link is established, you should use the `asset()` helper combined with the `storage()` function:

```html
<img src="{{ asset('storage/' . $filePath) }}" alt="Uploaded Image">
```

Or, if you are using a full relative path structure within your application context (which is often cleaner):

```html
{{-- Assuming $imagePath holds the filename portion --}}
<img src="{{ Storage::url($folderName . '/' . $fileName) }}" alt="Image">
```

For example, if `$folderName` is `myfolder1` and `$fileName` is `FxEj1V1neYrc7CVUYjlcYZCUf4YnC84Z3cwaMjVX.png`, the resulting path for the `src` attribute would correctly resolve to: `http://yourdomain.com/storage/myfolder1/FxEj1V1neYrc7CVUYjlcYZCUf4YnC84Z3cwaMjVX.png`.

## Conclusion

The failure to display images on shared hosting is almost always a configuration issue related to file permissions and symbolic linking, not an error in the Laravel code itself. By successfully running `php artisan storage:link`, you resolve the connection between your application's internal storage and the public web directory. Always remember to use the appropriate Laravel helpers like `Storage::url()` or `asset()` when generating paths for publicly accessible files. Following these steps ensures your Laravel application functions robustly and securely, providing a clean experience for all your users.
