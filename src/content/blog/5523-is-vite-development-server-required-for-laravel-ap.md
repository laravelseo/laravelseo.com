---
title: "Is Vite development server required for Laravel apps in production"
description: "Is Vite Development Server Required for Laravel Apps in Production? The Truth About npm run dev vs. npm run build As developers building modern..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "Errors"]
featured: false
---

As developers building modern applications with Laravel, the integration of frontend tooling like Vite has become standard practice. When you start using a stack involving Laravel, Vite, and Tailwind CSS, it’s common to encounter confusion about the difference between running the development server (`npm run dev`) and executing the production build command (`npm run build`).

This post dives into why this distinction matters, addresses the specific error you encountered, and clarifies the role of the Vite development server in a production deployment scenario.

## The Development vs. Production Divide

The core issue lies in understanding the function of each command. In essence, they serve two completely different purposes: live iteration versus static compilation.

### Understanding `npm run dev` (The Development Server)

When you run `npm run dev`, Vite launches a local development server. This server is designed for **live reloading** and **Hot Module Replacement (HMR)**. It watches your source files (`.js`, `.css`), compiles them on the fly, and serves them to your browser. This process requires an active, running environment where code changes are instantly reflected without a full recompilation of all assets.

The development server generates temporary manifest files that allow the `@vite` Blade directive in Laravel to correctly locate the dynamically served assets during local testing.

### Understanding `npm run build` (The Production Build)

When you execute `npm run build`, Vite shifts its focus entirely. It stops serving assets and instead performs a full, optimized **compilation** of all your source files into production-ready static assets. This process compiles the raw CSS (using Tailwind directives), bundles JavaScript, minifies code, and generates the final output files—including the necessary manifest—into your public directory (usually `public/build`).

## Why the Error Occurs in Production

The error you encountered:
> "Unable to locate file in Vite manifest: resources/css/app.css."

This error happens because when you run `npm run build` directly without ensuring the necessary context, Vite might not be generating or placing the required manifest files in the exact location expected by the Laravel Blade template, especially if the environment isn't fully initialized as a build target.

**The critical takeaway is this:** You do not need the *running development server* on your production host to deploy your application. You only need the **build output**.

## The Correct Workflow for Deployment

For deploying a Laravel application that uses Vite, the correct procedure is to use the build command to generate static assets, which are then served directly by the web server (like Nginx or Apache).

### Step-by-Step Production Setup

1.  **Development (Local Iteration):** Use `npm run dev` while you are actively coding and testing locally to benefit from HMR.
2.  **Production Build:** Execute `npm run build`. This command compiles your CSS, JavaScript, and generates the necessary manifest files inside your public directory.
3.  **Deployment:** Ensure that your deployment pipeline copies the contents of the newly generated `/public/build` directory to your production server.

The structure you followed is correct for compiling assets:

```bash
# 1. Setup environment (as you did)
laravel new vite-test --git
cd ./vite-test/
npm i
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 2. Run the build command to generate production assets
npm run build
```

When Laravel renders your view using `@vite(['resources/css/app.css', 'resources/js/app.js'])`, it expects those compiled files to exist in the expected location. The `npm run build` process handles generating these final, accessible files that the web server can read directly, bypassing the need for a constantly running Vite server during deployment.

## Conclusion: Focus on Artifacts, Not Processes

To summarize, the development server (`npm run dev`) is an invaluable tool for *development iteration*, providing a fast feedback loop. However, it is **not required** for production deployment.

For production, you must focus entirely on the **build artifacts**. The `npm run build` command is what generates the optimized CSS and JS files that are ready to be served by any standard web server in your Laravel application. By understanding this separation—development for watching, build for compiling—you ensure a robust and efficient deployment pipeline, aligning perfectly with modern best practices for building scalable applications on platforms like those supported by **Laravel** ecosystem tools.
