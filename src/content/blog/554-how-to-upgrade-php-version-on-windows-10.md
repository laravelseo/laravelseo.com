---
title: "How to upgrade php version on Windows 10"
description: "Title: Upgrading PHP Version on Windows 10 for Smooth Laravel Development Body: Upgrading your PHP version is essential when working on Laravel projects to..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Upgrading PHP Version on Windows 10 for Smooth Laravel Development
Body:

Upgrading your PHP version is essential when working on Laravel projects to ensure that all dependencies and requirements are met. This blog post will guide you through the process of upgrading PHP version on Windows 10 while using WAMP, which runs PHP 7.x, but has a conflict with the CLI interpreter. We'll cover how to fix this inconsistency and optimize your development environment for Laravel.

Step 1: Update your Windows Path
As you can see from the image provided, the PATH variable contains multiple paths pointing to various PHP versions. This is one of the reasons why your CLI interpreter shows an older version (5.5.12) while WAMP runs a newer version (7.0.4). To resolve this issue, you should update your Windows Path so that it points exclusively to the PHP folder within your WAMP installation.

1. Right-click on "This PC" and select Properties > Advanced System Settings > Environment Variables.
2. In the environment variables window, click "Edit" to edit the PATH variable.
3. Use your preferred text editor to open a new file named php_path.txt with contents like:
   `C:\wamp64\bin\php\php7.0.3` (Replace this path according to your WAMP installation)
4. Add the following lines to the top of this newly created file:
   `SET PATH=%PATH%;%cd%\PATH_FILE%` (Replacing %cd% with your current directory and %PATH_FILE% with php_path.txt's path)
5. Save the file and close it.
6. In a command prompt window, run this command: `SETX PATH "%PATH%;%USERPROFILE%\Documents\%PATH_FILE%"` (Replacing %PATH_FILE% with your newly created php_path.txt's path)
7. Open the environment variables window again and delete the old values of PATH, leaving only the new value from the file we just modified.

Step 2: Update the PHP CLI Interpreter
Since your Laravel project uses the console with the "php -v" command to fetch the PHP version, it's essential to ensure that this command shows the correct version. To do so:

1. Download and install the latest PHP version for Windows from php.net or a reputable source like https://laravelcompany.com/resources/download-phpspecial/.
2. Replace your existing PHP CLI interpreter by replacing "php" with the newly installed one in your PATH_FILE file and updating the environment variables as needed.
3. Close and reopen CMD to ensure the changes take effect.

Step 3: Verify the Upgrades
To confirm that your upgrades were successful, try running the following commands:
- `php -v` (CLI interpreter version)
- `wampserver64.exe phpinfo()` (WAMP web server PHP version)

Your Laravel project should now show the correct PHP version as required by your dependencies. If you face issues, consider reaching out to the Laravel Company at https://laravelcompany.com for assistance.

In conclusion, upgrading your PHP version on Windows 10 can be a straightforward process if done correctly. By updating your Windows Path variable and ensuring that the CLI interpreter reports the correct PHP version, you'll be better prepared to work with Laravel projects and their dependencies.
