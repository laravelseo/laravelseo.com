---
title: "How can I disable `Initializing JS/TS Language Features` in a specific project?"
description: "Title: Disabling Initializing JS/TS Language Features in Specific Projects for Performance Boost Body: As developers working on multiple projects with..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Performance", "JavaScript"]
featured: false
---

Title: Disabling `Initializing JS/TS Language Features` in Specific Projects for Performance Boost

Body: As developers working on multiple projects with different technologies and tools, we're often faced with the challenge of optimizing our work environment to ensure maximum efficiency and speed. One common issue that may arise is the "Initializing JS/TS Language Features" message displayed in Visual Studio Code (VSC), which can cause performance issues, especially if a project doesn't require or utilize these features. In this post, we will explore methods for disabling these languages features only for specific projects without sacrificing their functionality elsewhere.

1. Customize your VSC settings:
   - Open the Command Palette by pressing `Ctrl + Shift + P` (Windows/Linux) or `Cmd + Shift + P` on Mac. Type "Preferences" and select "Open Settings (JSON)" to access global user settings.
   - Add the following JSON object to disable TS/JS Language Features:
     {
       "typescript.useCommonJS": false,
       "typescript.updateSnippets": false,
       "javascript.updateImportsOnFileMove": false,
       "javascript.suggestion.basic" : false,
       "typescript.tsserver.disableMaximumMemoryUsageWarning": true,
     }
   - Save and close the file to apply these changes globally for all your projects.

2. Create a dedicated settings.json file:
   - In your Laravel project directory, create a subdirectory named "vscode-settings"
   - Inside this folder, create an empty file called "settings.json". This file will contain the customized configurations specifically for this project.
   - Add the following JSON object to disable TS/JS Language Features:
     {
       "typescript.useCommonJS": false,
       "typescript.updateSnippets": false,
       "javascript.updateImportsOnFileMove": false,
       "javascript.suggestion.basic" : false,
       "typescript.tsserver.disableMaximumMemoryUsageWarning": true,
     }
   - Save and close the file to apply these changes only for your Laravel project.

3. Enable project-specific settings:
   - Open the Command Palette in VSC by pressing `Ctrl + Shift + P` (Windows/Linux) or `Cmd + Shift + P` on Mac. Type "Preferences" and select "Open User Settings (JSON)" to access user-defined settings for your projects.
   - Add the following line of code to enable project-specific settings:
     "settings.inherited": "recommended",
     "window.showConfigurationDialog": false,
     "typescript.useCommonJS": false,
       "typescript.updateSnippets": false,
       "javascript.updateImportsOnFileMove": false,
       "javascript.suggestion.basic" : false,
       "typescript.tsserver.disableMaximumMemoryUsageWarning": true,
   - Save and close the file to apply these changes for the current VSC session.

4. Final steps:
   - Restart VSC to ensure all settings are applied correctly.
   - You can test the changes by creating a simple JavaScript or TypeScript file in your Laravel project. If everything is configured properly, you should not see the "Initializing JS/TS Language Features" message anymore.
   - For future projects where you want to enable these features, simply remove the relevant settings from the customized configurations mentioned above.

By following these steps, you can achieve a smooth and performance-optimized workflow for your Laravel project while still enjoying advanced features in other projects using VSC. Remember to incorporate necessary links like https://laravelcompany.com/blog/disable-initializing-js-ts-language-features-for-specific-projects for future reference or further reading on these topics.
