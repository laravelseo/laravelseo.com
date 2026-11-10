---
title: "laravel heroku Vite manifest not found at: /app/public/build/manifest.jso"
description: "Fixing the Laravel/Vite Manifest Error on Heroku: Bridging the Local to Deployment Gap As a senior developer, I’ve seen countless scenarios where an..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "PHP", "Errors"]
featured: false
---

As a senior developer, I’ve seen countless scenarios where an application functions flawlessly on a local machine but throws cryptic errors upon deployment to a platform like Heroku. The specific error you are encountering—`Vite manifest not found at: /app/public/build/manifest.json`—is a classic symptom of a mismatch between the local development environment and the production build process on a containerized platform.

This post will diagnose why this happens and provide a comprehensive, step-by-step solution to ensure your Laravel application with Vite assets deploys correctly to Heroku.

## The Root Cause: Local vs. Production Build Artifacts

The core issue lies in how Vite handles asset compilation and how the deployment environment (Heroku) expects those compiled files to be structured within the application directory.

When you run `npm run dev` or `npm run build` locally, Vite successfully compiles your source files (like CSS and JavaScript), generates the necessary manifest file (`manifest.json`), and places the assets in a local build directory (usually `public/build`). This works perfectly because your local server is configured to serve these files directly from that local structure during development.

However, when deploying to Heroku, the deployment process often skips or misinterprets this asset generation step unless explicitly handled by the buildpack or the deployment script. The error indicates that the PHP/web server environment on Heroku cannot find the expected `manifest.json` file at `/app/public/build/manifest.json`, meaning the crucial compiled assets are missing from the final deployed package.

## Step-by-Step Solution for Heroku Deployment

To resolve this, we need to ensure that the asset compilation step is mandatory and correctly executed *before* the application is packaged for deployment.

### 1. Ensure Correct Build Execution

The most common fix involves ensuring that `npm run build` runs successfully within the Heroku build environment. If you are using a standard Node/PHP setup on Heroku, ensure your `Procfile` or build command correctly executes the necessary steps sequentially.

In your deployment process, make sure the following commands are executed in order:

```bash
# 1. Install dependencies (important for ensuring all node modules are present)
npm install

# 2. Run the production build command
npm run build
```

If you are using a custom `heroku buildpacks` setup, verify that it correctly interprets the `package.json` scripts. If you are running this via a Procfile, ensure your entry point is structured to handle these steps properly.

### 2. Verify Vite Configuration

While less likely to be the direct cause of a *missing* file error, always double-check your `vite.config.js`. Ensure that your base path and output configurations align with standard Laravel conventions. For most modern Laravel setups, the default configuration works well, but if you have customized paths, this could introduce deployment friction.

### 3. Inspect Directory Structure

After running the build locally, inspect the contents of your `public/build` directory to confirm that `manifest.json` and the compiled assets (CSS/JS files) are actually present. If they are missing locally after building, the problem is purely in the build step itself, not the deployment environment.

If you are working with asset bundling in Laravel, remember that modern frameworks emphasize robust asset management. For deep dives into how these tools integrate with Laravel scaffolding and architecture, exploring resources from [laravelcompany.com](https://laravelcompany.com) can provide excellent context on framework best practices.

## Conclusion

The `manifest.json` error on Heroku is almost always an artifact of an incomplete or improperly sequenced build process during deployment. By rigorously enforcing the execution of `npm install` followed by `npm run build` within your Heroku build environment, you ensure that all necessary compiled assets are correctly generated and placed in the public directory before the application is served. Debugging deployment issues often boils down to ensuring parity between development and production environments.
