---
title: "Disk [videos] does not have a configured driver"
description: "Title: Solving \"Disk [videos] does not have a configured driver\" Error While Creating Thumbnails Using Laravel and FFMpeg Body: The error \"Disk [videos] does..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Title: Solving "Disk [videos] does not have a configured driver" Error While Creating Thumbnails Using Laravel and FFMpeg

Body:

<p>The error "Disk [videos] does not have a configured driver" can be frustrating, especially when attempting to use Laravel and FFMpeg to generate thumbnail images. This issue typically occurs due to improper configuration or incorrect file paths within the code. To resolve this problem, it is important to follow proper setup and best practices in your application.</p>

<h2>Prerequisites</h2>

Before troubleshooting the error, ensure that you have completed the following steps:

1. Install FFMpeg using Composer: `composer require cviebrock/ffmpeg`
2. Configure your Laravel application to use FFMpeg by adding the package to the `config/app.php` file under 'providers' and 'aliases' sections.

<h2>Troubleshooting Steps</h2>

To diagnose the issue, follow these steps:

1. Check your code for any typos in the disk name or path. Ensure you have specified 'videos' as the disk name and that the filepath is correct. For example, if the video files are stored within the 'public/uploads/videos' directory, the disk configuration should be `FFMpeg::fromDisk('videos');`
2. Verify your Laravel project's structure and ensure that the videos folder is accessible from within the public directory. If required, create a symbolic link to the actual video files in the public/uploads/videos folder.
3. Confirm that you have added the appropriate routes to access the thumbnails. For instance, add a route for displaying the list of all videos and another for generating the thumbnails. Use `FFMpeg::fromDisk('videos')` in your controller method to open the video file.
4. Check your disk configuration file (typically located at '/config/filesystems.php'). Ensure that you have defined a suitable driver for the 'videos' disk, such as local, s3, or another appropriate storage system.
5. Re-run the command `composer dump-autoload` to reload the autoloader files and ensure all your required libraries are loaded.

<h2>Best Practices</h2>

For future reference, follow these best practices to avoid such errors:

1. Use a consistent naming convention for your disk configuration variables. Ensure that you use the same name throughout the codebase whenever referring to the 'videos' disk.
2. Keep your route file organized and easy to read by separating routes based on their functionality, such as video management, thumbnail generation, etc.
3. Create a separate method or class responsible for handling image manipulation tasks like generating thumbnails. This will allow you to keep your controller code cleaner and more focused on business logic.
4. Always have proper unit tests in place for any code that interacts with external systems such as FFMpeg. This can help catch configuration issues and ensure the smooth functioning of your application.
5. Maintain a well-structured project directory to improve readability, accessibility, and maintainability. Ensure that all your media files are organized in meaningful folders with appropriate naming conventions.

<h2>Conclusion</h2>

By carefully following the best practices, you can effectively troubleshoot and prevent issues related to disk configuration errors when working with Laravel and FFMpeg. It is essential to maintain a structured codebase, consistently use correct file paths, and keep your code well-documented for future reference. Always ensure that your project's file structure is organized, and you have the right driver configured for each of your disks, which will help minimize errors like "Disk [videos] does not have a configured driver" in the future.
