---
title: "How can I install mcrypt under PHP7? Laravel needs it"
description: "Title: Installing mcrypt Extension for Laravel on PHP7 A Developer's Guide Laravel is an extremely popular open source framework with numerous features and..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Installing mcrypt Extension for Laravel on PHP7 - A Developer's Guide

<p>Laravel is an extremely popular open-source framework with numerous features and functionalities that make web application development more efficient. Its popularity, however, brings along challenges due to certain missing dependencies or extensions. One such issue is the absence of <code>mcrypt</code> extension in PHP7 - a vital requirement for Laravel4. In this blog post, we'll explore solutions to overcome this obstacle and ensure a smooth Laravel experience on your PHP7 environment.</p>

<h2>What is mcrypt?</h2>

The <code>mcrypt</code> extension provides encryption capabilities for programming languages like PHP. Its primary purpose is to encrypt or decrypt data using various algorithms, ensuring sensitive information remains secure. The absence of this crucial module in PHP7 could create issues while working on Laravel4 applications that require such functionalities.

<h2>Install mcrypt extension on Linux systems:</h2>

For Linux-based operating systems like Ubuntu, Debian, or CentOS, the process is relatively straightforward. You can install <code>php7.2-mcrypt</code> for PHP7.2 by following these steps:

1. Update the package database: `sudo apt-get update` (for Debian/Ubuntu) or `yum update` (for CentOS).

2. Install the required libs: `sudo apt-get install -y php7.2 libmcrypt-dev` (Debian/Ubuntu) or `sudo yum install -y php72-libmcrypt libmcrypt-devel` (CentOS).

3. Enable the extension in PHP: Run `php -i | grep "Loaded Configuration File" to find out your current configuration file and add the following line: 'extension=mcrypt.so' without quotes. Save the changes.

4. Restart Apache/Nginx server: `sudo service apache2 restart` or `sudo nginx -s reload`.

<h2>Install mcrypt extension on Windows systems:</h2>

To install the <code>mcrypt</code> extension for PHP7 on Windows, you can follow these steps:

1. Download the required files: Go to https://pecl.php.net/package/mcrypt and download the latest version of the `mcrypt.zip`. Unpack the zip file in your preferred location. Next, go to https://www.christian-albrecht.de/blog/php-mcrypt-extension-windows-7-64bit-support and download the precompiled binary for mcrypt for PHP 7 on Windows 64-bit and unpack it in the same location as the unpacked `mcrypt.zip`.

2. Enable the extension: Open the php.ini file (usually found in C:\xampp\php\php.ini), and add the following line: 'extension=mcrypt.so' without quotes. Save the file.

3. Restart Apache server: Run `httpd -k restart` to ensure new changes are applied.

<h2>Conclusion:</h2>

With these installations, you should now be able to leverage the <code>mcrypt</code> extension on both Linux and Windows systems, ensuring that your Laravel4 applications can use essential encryption functionalities. Remember to test your application thoroughly after these changes, and always ensure that your PHP version is up-to-date. Happy coding!

<p><a href="https://laravelcompany.com/blog/how-can-i-install-mcrypt-under-php7-laravel-needs-it">Read the full article on LaravelCompany.com.</a></p>
