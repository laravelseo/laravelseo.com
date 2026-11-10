---
title: "How can I solve \"laravel/horizon v1.1.0 requires ext-pcntl * -> the requested PHP extension pcntl is missing from your system\"?"
description: "Title: Solving \"laravel/horizon v1.1.0 requires ext pcntl the requested PHP extension pcntl is missing from your system\" Error Introduction When working..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

Title: Solving "laravel/horizon v1.1.0 requires ext-pcntl * - the requested PHP extension pcntl is missing from your system" Error

Introduction

When working with Laravel applications, you may encounter issues related to missing or disabled PHP extensions. In this blog post, we will provide a comprehensive guide on how to resolve an error that involves laravel/horizon v1.1.0 and pcntl extension. We will be discussing the error message itself, its cause, and the steps needed to enable the pcntl extension to ensure smooth application installation.

The Error Message

Here's a typical error message displayed when running `composer install`:
<pre><code>  Problem 1
    - Installation request for laravel/horizon v1.1.0 -&gt; satisfiable by laravel/horizon[v1.1.0].
    - laravel/horizon v1.1.0 requires ext-pcntl * -&gt; the requested PHP extension pcntl is missing from your system.

  To enable extensions, verify that they are enabled in your .ini files:
    - C:\xampp-7.1\php\php.ini
  You can also run `php --ini` inside terminal to see which files are used by PHP in CLI mode.
</code></pre>

Cause of the Error

The error is caused due to the absence or disabling of pcntl, an essential PHP extension required for the Laravel/Horizon package. This package is responsible for managing the queue jobs that run on your server and optimizes job processing. The missing pcntl extension causes problems during the installation process, leading to this error message.

Solution: Enabling the PCNTL Extension

Enabling the PHP pcntl extension requires following these steps:

1. Determine the location of your php configuration file (php.ini). In most cases, it is in the xampp folder alongside the PHP installation: `C:\xampp-7.1\php\php.ini`.

2. Open the php.ini file using a text editor like Notepad or Sublime Text. You can use any code editor but make sure to save it as UTF-8 without BOM encoding to avoid any issues later on.

3. Find the section with pcntl configuration and uncomment or add the following line: `extension=pcntl`. This tells PHP to load and enable the extension when the script is executed.

4. Save the file and close your text editor.

5. To apply the changes, restart Apache by navigating to the XAMPP control panel and clicking on 'Restart' under the Apache section. In some cases, you may also need to stop and restart all services.

6. Run `php --ini` from the terminal to verify that your php.ini file is being used in CLI mode. The output should provide information about your PHP installation, including the loaded extensions.

7. Now try running `composer install` again. If everything goes well, you should no longer see the error related to pcntl extension missing from your system.

Conclusion

Enabling the pcntl extension is crucial for a smooth Laravel/Horizon package installation process. By following these steps, you can easily resolve this common issue and continue working on your Laravel applications without any hassle. If you experience further difficulties with PHP extensions or Laravel packages installation, don't hesitate to seek professional assistance from experts who can guide you through the entire process.
