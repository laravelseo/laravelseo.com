---
title: "How to remove Bootstrap correctly from Laravel 5.4?"
description: "How to Remove Bootstrap Correctly from Laravel 5.4 for a Clean Start Starting a new Laravel project is exciting, but sometimes you encounter legacy..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "Errors"]
featured: false
---

Starting a new Laravel project is exciting, but sometimes you encounter legacy dependencies or leftover configurations that complicate the setup process. If you aim for a completely clean slate—starting fresh without any external CSS frameworks like Bootstrap—removing these remnants correctly is crucial. As a senior developer, I often see issues stemming from stale `package.json` entries and asset compilation files, which can lead to confusing errors during development setup.

This guide will walk you through the exact process to surgically remove Bootstrap dependencies from your Laravel 5.4 project, ensuring you have a lean, dependency-free environment ready for custom styling.

## Understanding the Problem: Dependency Conflicts

The error you encountered—`SyntaxError: /Users/.../package.json: Error while parsing JSON - Unexpected end of JSON input` related to `bootstrap-sass` in your `package.json`—is a classic symptom of dependency conflicts. When Laravel Mix (or any asset bundler) tries to process files that reference packages you don't actually need, the structure of the dependency manifest gets corrupted, leading to parsing errors.

Your goal is not just to delete files; it’s to ensure that your Node environment and your Laravel asset pipeline are completely free of Bootstrap references.

## Step-by-Step Guide for a Clean Removal

Follow these steps precisely to eliminate Bootstrap remnants from your project structure:

### 1. Clean Up `package.json`

The most critical step is removing the reference to Bootstrap dependencies from your Node package file, which dictates what packages are installed and linked.

Open your `package.json` file and remove any entries related to Bootstrap or its related Sass/CSS packages. Specifically, look for and delete lines similar to this:

```json
{
  "devDependencies": {
    // Remove these lines if they exist:
    "bootstrap-sass": "^3.3.7", 
    // ... other dependencies
  }
}
```

After removing the entries, run `npm install` again. This forces npm to re-evaluate the dependency tree based only on what remains, resolving potential parsing errors.

### 2. Remove Installed Dependencies

Once you have cleaned up `package.json`, you must remove the actual installed files in your `node_modules` directory to ensure a truly clean state.

Navigate to your project root and execute:

```bash
rm -rf node_modules
npm install
```

This command deletes the entire dependency folder and then reinstalls only the dependencies listed in your newly cleaned `package.json`, ensuring no old Bootstrap files remain cluttering your workspace.

### 3. Eliminate Asset Files (SCSS/CSS)

Bootstrap usually introduces Sass files into the `resources/assets` directory. You need to manually inspect and remove these generated files:

*   **Check:** Look inside `resources/assets/sass/`.
*   **Action:** Delete any files related to Bootstrap compilation (e.g., `bootstrap.scss`, or any compiled CSS output).

If you are using Laravel Mix, ensure your main entry point (`app.js`) no longer imports these framework-specific styles. Modify `resources/assets/js/app.js` to remove any explicit references to Bootstrap imports if they were manually added. For a lean start, you should configure Mix to only compile your custom assets moving forward.

## Best Practices for Future Laravel Development

When starting new projects, adopting a minimalist approach is highly recommended. Frameworks like those promoted by the **Laravel Company** emphasize building robust applications from the ground up without unnecessary overhead. By avoiding large, pre-packaged assets initially, you save on build time and reduce potential dependency conflicts down the line.

Instead of immediately installing Bootstrap, consider using Tailwind CSS or plain CSS for your initial setup. This practice keeps your project structure clean and allows you to control every byte of CSS you ship. For instance, if you are starting a new stack, ensure your environment is set up efficiently from the beginning, aligning with modern Laravel architecture principles.

## Conclusion

Removing Bootstrap correctly from a Laravel 5.4 project boils down to systematically cleaning up three areas: the dependency manifest (`package.json`), the installed files (`node_modules`), and the source asset files (`resources/assets`). By following these steps, you eliminate legacy conflicts, achieve a truly clean starting point, and establish a solid foundation for developing your application with Laravel without unwanted framework baggage.
