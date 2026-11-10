---
title: "[Microsoft][ODBC Driver 17 for SQL Server] SSL Provider: [error:0A000102:SSL routines::unsupported protocol] in PHP Laravel on macOS using Brew"
description: "Title: Troubleshooting SSL Provider Error When Connecting PHP Laravel App to SQL Server on macOS via Brew Introduction When connecting your Laravel app with..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

Title: Troubleshooting SSL Provider Error When Connecting PHP Laravel App to SQL Server on macOS via Brew

Introduction
When connecting your Laravel app with Microsoft's ODBC Driver 17 for SQL Server, you may encounter an error message that mentions "SSL routines::unsupported protocol". This issue can be attributed to either a conflict between different OpenSSL versions or compatibility issues with the underlying operating system on macOS. To mitigate this problem and establish a successful connection, we will explore various solutions in this comprehensive blog post.

Solution 1: Checking GitHub Issue and Updating PHP Extensions
The first step to resolving this issue is checking if anyone else has experienced similar problems. Visit the official GitHub repository for microsoft/msphpsql (issue #1462) and look for any updates or solutions that might be relevant to your situation. Keep in mind, however, that this may not always provide a solution for your specific case.

Next, ensure that all required PHP extensions are installed properly. Specifically, the PDO_SQLSRV extension is necessary for establishing connections between PHP and SQL Server using ODBC drivers. You can verify your current PHP extensions by running:

<code>php -m</code>

If PDO_SQLSRV or any other missing required extensions are not listed in this output, you can install them via Brew (Homebrew package manager for macOS) by following these steps:

1. Install the homebrew-php repository with the command below:
   <code>brew tap shivammathur/homebrew-php</code>

2. Update your Homebrew recipe book:
   <code>brew update</code>

3. Run the following commands to install PHP 8.2 and its extensions, including PDO_SQLSRV and sqlsrv:
   <code>brew cask install homebrew/php/php@8.2</code>
    <code>pecl install pdo_sqlsrv</code>
    <code>pecl install sqlsrv</code>

Solution 2: Switching OpenSSL Versions
Switching from the latest OpenSSL version to an older one can sometimes resolve this issue. However, this approach may introduce other unexpected problems. Consider using a virtual environment or isolating your Laravel project into a separate directory if you decide to proceed with this solution. Execute the following commands from a terminal:

1. Uninstall existing OpenSSL versions:
   <code>brew uninstall openssl</code>
    <code>pecl uninstall pdo_sqlsrv</code>
    <code>pecl uninstall php_sqlsrv</code>

2. Install older OpenSSL version (recommended OpenSSL 1.1.1x):
   <code>brew install openssl@1.1.1</code>

3. Reinstall PDO_SQLSRV and sqlsrv extensions with the newly installed OpenSSL:
   <code>pecl install pdo_sqlsrv</code>
    <code>pecl install php_sqlsrv</code>

Conclusion and Further Considerations
Resolving the SSL Provider error while connecting your Laravel application to a SQL Server database on macOS via Brew requires careful troubleshooting. After applying these solutions, you should test if the error has been resolved by running your app and verifying database connections are established successfully.

If you encounter any difficulties or require further assistance, feel free to reach out to the Laravel community for help. Keep in mind that utilizing a virtual environment or separating your Laravel project allows for easier management of dependencies and ensures stable development. By following these guidelines and implementing proper testing, you can enhance the stability and security of your Laravel application.
