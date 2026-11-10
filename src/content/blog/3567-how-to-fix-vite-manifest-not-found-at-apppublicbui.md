---
title: "How to fix Vite manifest not found at: /app/public/build/manifest.json?"
description: "How to Fix \"Vite Manifest Not Found\" on Deployment: A Deep Dive for Developers As a senior developer, I've seen countless scenarios where an application..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["JavaScript", "Errors"]
featured: false
---

As a senior developer, I've seen countless scenarios where an application works flawlessly on a local machine but throws cryptic errors upon deployment. The error message you are encountering—`Vite manifest not found at: /app/public/build/manifest.json`—is a very common pain point when deploying modern frontend applications built with Vite.

The core issue is almost never about the code itself, but rather about how the build artifacts are structured and served by the hosting environment (like Nginx, Apache, or a CI/CD pipeline). Let’s break down why this happens and provide concrete steps to fix it.

## Understanding the Role of `manifest.json`

To understand the fix, we must first understand what Vite is doing. When you run `vite build`, Vite compiles your source code (JavaScript, CSS, assets) into optimized production files. Crucially, it generates a `manifest.json` file in the output directory (usually `/public/build/`).

This manifest file is essential for modern frontends using module bundlers like Vite. It maps the original, often hashed, asset names used in your source code to their final, deployed file paths. This prevents runtime errors when the application tries to load CSS or JS files.

When you deploy, your web server needs to correctly serve these generated files. If the path defined in your application code (or a framework layer) expects this manifest file at `/app/public/build/manifest.json` and it cannot find it, the request fails immediately.

## Diagnosing Deployment Failures

The problem is typically not that Vite failed to build, but that the *deployment structure* doesn't align with what the application expects. Here are the three most common culprits:

### 1. Incorrect Build Output Location

Vite defaults to building output into a directory named `dist` or `build`, depending on your configuration (`vite.config.js`). If your deployment script assumes a specific path that doesn't match the actual structure created by Vite, the file will be missing.

**Action:** Verify the contents of your build folder *after* the build command has executed successfully on the production server. Ensure that `manifest.json` exists exactly where your web server is looking for it.

### 2. Server Pathing Misconfiguration (The Most Common Issue)

If you are using a framework like Laravel, which relies on asset bundling and public directory conventions, the issue often lies in how the web server maps the root path to the physical file system path. The server might be expecting the build files to reside in a different location than what Vite outputs by default.

**Action:** Review your web server configuration (e.g., Nginx `try_files` directive or Apache `DocumentRoot`). Ensure that the static assets folder is correctly configured to serve content from the directory where Vite placed the manifest.

### 3. CI/CD Environment Variables

If you are using a containerized deployment (Docker), ensure that the build step and the serve step operate within the same volume or context. Sometimes, intermediate build steps fail silently in the container environment, resulting in an empty public folder on the final image.

## Practical Solution Steps

Here is the recommended workflow to resolve this issue:

**Step 1: Ensure a Clean Build**
Always perform a fresh build directly on the target server or within your deployment pipeline *before* deploying assets.

```bash
# On the production server, run the build command again
npm install
npm run build
```

**Step 2: Verify File Presence**
Use SSH to manually navigate to the expected path and confirm the file exists:

```bash
ls -l /app/public/build/manifest.json
```
If this command returns "No such file or directory," you have confirmed the physical absence of the file, pointing directly to a server configuration issue rather than a build issue.

**Step 3: Adjust Web Server Configuration**
If the file *does* exist but is still inaccessible, adjust your web server configuration to correctly map the public directory. For example, in Nginx, ensure your `try_files` directive correctly points to the location containing the built assets. This attention to detail regarding asset serving is vital for robust application deployment, much like the principles of clean dependency management discussed on sites like [laravelcompany.com](https://laravelcompany.com).

## Conclusion

The "Vite manifest not found" error during deployment is almost always a symptom of a mismatch between the build output structure and the web server's expectation. By focusing your debugging efforts on three areas—the build command, the physical file system path, and the web server configuration—you can resolve this frustrating deployment hurdle. Remember, in full-stack development, the infrastructure surrounding the code is just as important as the code itself.
