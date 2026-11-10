---
title: "How to make Laravel Vite copy static assets versioned to build folder"
description: "How to Make Laravel Vite Copy Static Assets Versioned to the Build Folder Working with modern frontend tooling like Vite in a Laravel application is..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Performance"]
featured: false
---

Working with modern frontend tooling like Vite in a Laravel application is incredibly powerful for managing assets, but sometimes the way bundlers handle asset imports can lead to unexpected results. A common scenario developers encounter is when static images and fonts are embedded directly into CSS using Base64 encoding instead of being correctly copied and versioned into the public build directory.

This post will walk you through why this happens and provide the correct, robust methodology to ensure your static assets are properly copied, versioned, and referenced in your compiled CSS, aligning with best practices for Laravel development.

## The Pitfall: Base64 Embedding vs. File Copying

When you import an image directly into a CSS file using standard Vite asset handling, Vite's default behavior is to process the asset as part of the CSS compilation. If the asset is small enough, Vite often optimizes by encoding it into a Data URI (Base64 string) and embedding it directly into the stylesheet.

As you correctly observed, this results in:
```css
.arrow {
  background-image: url(data:image/png;base64,xxxxxxxxxxxxxxxxxxxx);
}
```
While this keeps everything bundled, it prevents you from managing these assets as separate, versioned files in your public directory (e.g., `/public/build/assets/...`). This lack of separation makes caching, asset pipeline management, and deployment significantly more difficult.

Your goal is to transition from embedding the data to referencing a file path that Vite knows how to manage during the build process.

## The Solution: Leveraging Public Directory Assets with Vite

To achieve versioned copying, you need to ensure your assets are treated as external files that Vite should copy to the final output directory rather than inline them. This usually involves placing assets in a location where they can be correctly referenced relative to your compiled CSS, and ensuring the build process recognizes them as deployable files.

### Step 1: Asset Placement and Referencing

The key is to ensure your CSS references the path *relative* to where Vite expects to place the final assets. When dealing with static images that need versioning, they should reside in a location that maps cleanly to your public folder structure.

If you want assets copied into `/public/build/assets/img/icons/arrow.xxxxxxxxxx.png`, your CSS must reference this path using an absolute path starting from the root of your public file system, or ensure Vite handles the path resolution correctly.

A cleaner approach is to use the public path prefix when referencing assets in your CSS:

In your `resources/app.css`:
```css
.arrow {
  /* Reference the image relative to the public path structure */
  background-image: url('/build/assets/img/icons/arrow.xxxxxxxxxx.png');
}
```
*Note: The actual versioning (`.xxxxxxxxxx`) is handled by Vite during the build phase, substituting the placeholder with the actual hashed filename.*

### Step 2: Configuring Vite for Asset Handling

While the above CSS reference works conceptually, ensuring Vite handles the asset copying correctly often relies on how you structure your entry points and public directory. For complex asset management within a Laravel context, understanding the underlying architecture of tools like those provided by **Laravel Company** is crucial to setting up these pipelines efficiently.

Ensure your `vite.config.js` correctly defines where assets are sourced from. By keeping images outside the immediate import chain for CSS (treating them as static files), you allow Vite's asset handling pipeline to manage the copying process during the build command (`npm run build`).

### Step 3: Build Workflow Summary

When you run `npm run build`, Vite scans your project. If you reference assets using standard file paths relative to the root or public directory, Vite will correctly handle moving those files into the output directory specified in your configuration (e.g., `/public/build/assets`). The resulting CSS then contains references to these newly copied, versioned files, achieving exactly the separation and versioning you require.

## Conclusion

Moving static assets from Base64 embedding to versioned file copying is a fundamental step in maturing your application's build pipeline. By focusing on how Vite manages asset imports versus how it handles external file referencing, developers can achieve cleaner, more maintainable deployments. Mastering these asset workflows ensures that your Laravel application remains scalable and adheres to modern tooling standards.
