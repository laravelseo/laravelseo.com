---
title: "PHP7 : install ext-dom issue"
description: "Title: PHP7 Installation Issues with Ext Dom Dependencies in Laravel Apps Introduction: When building your Laravel applications on PHP7, you may encounter..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Title: PHP7 Installation Issues with Ext-Dom Dependencies in Laravel Apps

Introduction:
When building your Laravel applications on PHP7, you may encounter issues related to missing or unsupported extensions. In this post, we'll explore common problems faced during installation and provide solutions for troubleshooting these issues. Our focus will be on the ext-dom extension, which is necessary for a smooth installation of several packages, including cviebrock/eloquent-sluggable.

Issue Description:
In order to install cviebrock/eloquent-sluggable with Composer, you might encounter an error message indicating the absence of the requested PHP extension DOM. This problem can be a result of several factors such as missing or unsupported extensions, misconfigured INI files, or incorrect composer configuration. To resolve these issues and successfully install your desired packages, we'll discuss how to identify and address each possible cause.

Solution 1: Enabling Ext-Dom Extension
To verify if the ext-dom extension is enabled, you can follow some of these methods:

1. Run `php -m` in the terminal to display all loaded extensions on your PHP installation. If DOM (as dom) is listed here, it is already enabled. If not, proceed to the next solution.

2. Check the PHP configuration file (either php.ini or .user.ini) for enabled extension directives: `extension=dom.so` should be present. Make sure the path `/usr/lib/php5/extensions` is accessible if you're using a shared hosting environment.

3. If your PHP installation doesn't include ext-dom, follow these steps to install it:
   - Download dom extension from http://pecl.php.net/package/dom.
   - Install the extension using `sudo pecl install [extension name]` in the terminal.
   - Add the path where you downloaded the installation file to your PHP include_path in php.ini or .user.ini: `include_path="/somepath/[path-to-dom-installation]/"`
   - Repeat steps 1 and 2 to ensure the extension is loaded and enabled properly.

Solution 2: Updating Composer Configuration
If your ext-dom extension is not listed in the `php -m` output, it's possible that a conflict between various PHP versions or extensions is causing this issue. To resolve this problem, you can edit your composer configuration file (composer.json) and add 'minimum-stability': 'stable', to force Composer to use stable PHP versions with working ext-dom support. Alternatively, you may need to reinstall Composer after upgrading your server's PHP version or removing the conflicting extensions.

Solution 3: Troubleshooting INI Files
If the previous solutions fail to resolve your issue, it might be due to misconfigured INI files. Ensure that all the necessary directives for required PHP extensions are present in the appropriate configuration files (as mentioned earlier):
- /etc/php/7.0/cli/php.ini
- /etc/php/7.0/cli/conf.d/*.ini
- /etc/php/7.0/fpm/php.ini
- /etc/php/7.0/fpm/conf.d/*.ini

Additionally, run `php --ini` in the terminal to see which files are used by PHP in CLI mode and make sure all required extensions are enabled correctly. If you wish to manually configure your server, refer to the documentation for each INI file for guidance on how to enable necessary extensions.

Conclusion:
Installing packages using Composer may seem complex at first, but understanding the importance of configuration files and extension dependencies can help resolve potential issues encountered in Laravel applications with PHP7. By following these guidelines, you'll be able to address the ext-dom issue and ensure a smooth installation process for your project. Remember that it is crucial to double-check that your environment and configuration are error-free before moving forward. If you need assistance or further guidance, our team at Laravel Company can help you optimize your PHP setup.

Additional Resources:
1. https://getcomposer.org/root
2. https://laravelcompany.com/services/
3. https://pecl.php.net/package/dom
