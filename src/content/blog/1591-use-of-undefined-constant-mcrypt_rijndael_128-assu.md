---
title: "Use of undefined constant MCRYPT_RIJNDAEL_128 - assumed 'MCRYPT_RIJNDAEL_128'"
description: "Title: Troubleshooting \"Use of undefined constant MCRYPT RIJNDAEL 128 assumed 'MCRYPT RIJNDAEL 128'\" Error in Laravel Applications Body: Introduction..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

Title: Troubleshooting "Use of undefined constant MCRYPT_RIJNDAEL_128 - assumed 'MCRYPT_RIJNDAEL_128'" Error in Laravel Applications
Body:

## Introduction
You have successfully installed Laravel, but you encounter a strange error when running the artisan command or accessing your application. While your PHP info shows that mcrypt is properly installed on another server, you need to understand why it causes an undefined constant issue in your local environment and how to fix this problem. This blog post will guide you through the steps required to address these errors consistently across various localhost configurations.

## Understanding the Issue
The error message "Use of undefined constant MCRYPT_RIJNDAEL_128 - assumed 'MCRYPT_RIJNDAEL_128'" indicates that Laravel is looking for a specific constant from mcrypt library, but it cannot be found due to either missing path settings or lack of the proper library installation.

## Possible Causes and Solutions
1. Incorrect Path Settings:
   a. Check if you've installed multiple versions of PHP on your system. Laravel might be pointing to an older version where mcrypt is not available, while PHPInfo shows the correct path for another version. To fix this issue, ensure that you are using the latest PHP installation for Laravel and update the PATH environment variable accordingly.
   b. Ensure that your PATH environment variable includes all necessary directories required by Laravel. For Mac users with multiple versions of PHP installed, make sure to add these directories:
      <pre><code>export PATH="/usr/local/opt/php@7.4/bin:$PATH"
export PATH="/usr/local/opt/php@8.0/bin:$PATH"
</code></pre>

2. Missing Library Installation:
   a. If the above solution does not resolve your issue, it's possible that the mcrypt library is missing or improperly installed in the PHP installation you are using for Laravel. To install it on a Mac, follow these steps:
      <pre><code>brew install php@7.4-mcrypt
</code></pre>
    - For other platforms, consult your preferred package manager or the official PHP documentation to find the appropriate instructions. Make sure you are using the same version of mcrypt as the one required by Laravel.
   b. If your current Laravel application needs support for this library, ensure that it is listed in the require section of your composer.json file:
      <pre><code>
"require": {
    "laravel/framework": "5.4",
    // Add mcrypt extension here
},
</code></pre>
   c. After updating your composer.json file, run the following commands in the application root directory to install the missing dependencies:
      <pre><code>composer install
composer update
</code></pre>

3. Use Laravel Mix for Encryption
   a. If you are using Laravel Mix with Webpack and your application requires encryption, it's recommended to use a dedicated library specifically designed for this task. Some popular alternatives include:
      - CryptoJS: https://cryptojs.gitbook.io/crypto-js/
      - EncryptJS: https://encryptjs.org/
   b. Integrate the chosen library into your Laravel project by adding it as a dependency in package.json and installing, then import and use its functions for encryption tasks.

## Conclusion
Following these steps should resolve any issues you encounter related to the "Use of undefined constant MCRYPT_RIJNDAEL_128 - assumed 'MCRYPT_RIJNDAEL_128'" error while using Laravel. By ensuring correct path settings, installing missing libraries, and updating your composer.json file, you'll be able to consistently use your preferred localhost addresses without running into these errors. Remember that if needed, refer back to the official Laravel documentation for further assistance on handling encryption in applications.
