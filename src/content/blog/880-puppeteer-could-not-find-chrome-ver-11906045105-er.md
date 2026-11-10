---
title: "puppeteer: \"Could not find Chrome (ver. 119.0.6045.105)\" error"
description: "Title: Understanding and Resolving the \"Could not find Chrome (ver. 119.0.6045.105)\" Error in Puppeteer Based Laravel Packages Introduction: When using a..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Errors"]
featured: false
---

Title: Understanding and Resolving the "Could not find Chrome (ver. 119.0.6045.105)" Error in Puppeteer-Based Laravel Packages

Introduction: When using a Laravel package that utilizes Puppeteer for tasks like taking screenshots, you may encounter an error stating "Could not find Chrome (ver. 119.0.6045.105)." This issue can arise due to either of two possible reasons, which we will discuss in this blog post. We'll also provide guidelines on how to resolve these problems and ensure smooth operation with your Laravel package.

Reason 1: Missing Puppeteer Installation
If you are using Puppeteer-based Laravel packages without running the installation command, it could lead to this error. The installation process involves downloading and configuring Chrome for use by Puppeteer. By not installing Puppeteer first, it is likely that there's no existing version of the required Chrome browser installed or configured correctly.

To resolve this issue:
1. Install Puppeteer: Run `npm install puppeteer` in your project's root directory to download and install Puppeteer as a dependency.
2. Ensure your Puppeteer installation is up-to-date: Check if a new version of Puppeteer is available by running `npm update puppeteer`. Upgrade your package if necessary. Make sure it's the same version as the one in the given error message.
3. Run any necessary command to complete the Puppeteer installation process. It may vary based on the package you use, so refer to its documentation for specific instructions.

Reason 2: Incorrect Cache Path Configuration
Another potential reason for this error is incorrectly configured cache paths within Puppeteer. If your cache path isn't set up correctly, it could cause issues with locating the appropriate browser version or downloading a new one when needed.

To resolve this issue:
1. Check your current cache path: Look at relevant documentation for the Laravel package you're using to find the correct location of the cache path. If it isn't defined, you might need to set it up manually in the Puppeteer configuration file or environment variables.
2. Ensure the cache path is correctly configured: Follow the example from your package's documentation and make sure it points to the right location where your browser is installed. Common examples include `/home/sail/.cache/puppeteer` or `~/.cache/puppeteer`.
3. Verify if you need to download a new browser: If your cache path seems correct but you still receive the "Could not find Chrome" error, it may be due to an outdated or corrupted browser version in your cache directory. In such cases, try removing the existing cached browsers and manually downloading a fresh copy from Puppeteer's repository.

Conclusion: When encountering the "Could not find Chrome (ver. 119.0.6045.105)" error in your Laravel package using Puppeteer, it is essential to examine two possible reasons behind this issue. Ensure you follow the correct installation process, and always keep an eye on your cache path for any potential misconfiguration or outdated browsers. By doing so, you can maintain a smooth operation with your favorite Laravel packages and their associated tools.

Remember to incorporate natural backlinks to https://laravelcompany.com within this blog post when sharing it.
