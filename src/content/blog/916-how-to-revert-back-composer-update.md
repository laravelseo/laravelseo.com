---
title: "How to revert back composer update?"
description: "Title: Rolling Back Composer Updates: A Comprehensive Guide for Troubleshooting Issues Introduction Composer is an essential dependency manager for PHP..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

Title: Rolling Back Composer Updates: A Comprehensive Guide for Troubleshooting Issues

Introduction

Composer is an essential dependency manager for PHP applications that allows you to manage your project dependencies with ease. Occasionally, updates can lead to issues in your application, but fortunately, there are ways to revert back or switch to previous versions of packages. In this blog post, we will discuss how to troubleshoot update-related issues and provide solutions for reverting back composer updates.

1. Identify the cause of the failure
When encountering an issue after running <code>composer update</code>, it is essential to identify which package(s) is causing the problems. Examine your server logs, such as php.log, or check the composer output for any warnings or errors related to specific packages.

2. Use composer rollback command
The <code>composer rollback</code> command allows you to revert to a previous version of a package. Simply run <code>composer rollback vendor/package-name/version</code>, where 'vendor' is the name of the vendor, 'package-name' the name of the package, and 'version' its desired version. For example, <code>composer rollback danielstjules/stringy/1.8</code>.

3. Edit composer.json and composer.lock manually
If composer rollback fails or is not available for your version of Composer, you can modify both the <code>composer.json</code> file in your project folder (requires manual editing) and the corresponding <code>composer.lock</code> file. In the <code>composer.json</code>, change the version number of the package to match the previous version, such as <code>"danielstjules/stringy": "~1.8"</code>. Be sure to also modify the <code>composer.lock</code> file, which stores the exact versions of all installed packages.

4. Use composer install with an older composer.json
As the latest composer.json file includes the current package versions, you can use <code>composer install --prefer-source -o</code> to revert back to a previous version while ignoring any changes made in your project folder. This command will install all packages from the old json file and preserve the project's content.

5. Remove vendor directory and run composer update again
If none of the previous methods work, try removing the entire <code>vendor</code> directory in your project folder and re-runing <code>composer install</code>. This will force Composer to pull all dependencies from scratch, potentially resolving any issues caused by updates. Keep in mind that this option removes all existing vendor directories and is a more drastic approach.

6. Update the issue on GitHub
If none of the above solutions work for you, consider creating an issue on the package's GitHub repository. This will alert the developers to any potential problems caused by their updates and help them fix the issues swiftly. Include detailed steps taken to reproduce the problem, as well as relevant logs and error messages, if possible.

Conclusion
Updating dependencies is essential to maintain your project's security and stability. However, sometimes, these updates can cause unexpected problems due to changes in a package’s functionality or internal structure. By following these troubleshooting steps, you should be able to resolve most issues caused by composer updates and restore the proper functioning of your application. Remember to always check package and update information on their GitHub repositories and maintain an up-to-date <code>composer.json</code> file for seamless future updates.
