---
title: "can't find mcrypt => Call to undefined function Laravel\\mcrypt_create_iv()"
description: "Title: Solving the Laravel Mcrypt Issue on MacOS Mountain Lion With Native Web Server Body: Introduction Laravel is one of the most popular PHP frameworks..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

Title: Solving the Laravel Mcrypt Issue on MacOS Mountain Lion With Native Web Server

Body:

<h2>Introduction</h2>
Laravel is one of the most popular PHP frameworks, and its extensive features make it a powerful tool for developers. However, occasionally you may encounter some issues while setting up your environment, such as the one mentioned above. This blog post aims to provide a comprehensive solution to this problem on MacOS Mountain Lion with the native web server.

<h2>The Issue - undefined function Laravel\mcrypt_create_iv()</h2>
This error occurs because you have installed mcrypt, but it's not visible in terminal command php -m or not showing up in your system's path. This could be due to a few reasons:

1. The installation might not have completed successfully.
2. The system's PATH variable is incorrectly configured.
3. Your version of PHP doesn't support mcrypt, or it's disabled.
4. You are using an older version of MacOS Mountain Lion with the native web server.

<h2>Solving the Problem</h2>
Follow these steps to resolve the issue:

<h3>Step 1: Reinstall mcrypt</h3>
First, ensure that you have uninstalled any existing versions of mcrypt. Run the following commands in your terminal window:

```bash
brew remove --force mcrypt
brew cleanup --force
```

Now, reinstall mcrypt using brew with the flag "--with-openssl". This will install both libssl and libcrypto libraries in addition to mcrypt.

```bash
brew install --with-openssl mcrypt
```

<h3>Step 2: Update PATH variables</h3>
In your terminal window, type the below command to check your PHP extensions. If you don't see "mcrypt", follow the instructions below.

```bash
php -m | grep mcrypt
```

If you don't find it, execute the following commands to update the PATH variables for the current session:

```bash
export PHP_MCACHE=/usr/local/Cellar/mcrypt/7.7.0/lib/php5/modules
export PHPRC=$PHP_MCACHE
export LDFLAGS="-L$PHP_MCACHE -lmcrypt"
export CFLAGS=""
```

Alternatively, you can add these lines to your .bashrc file in your home directory. This will ensure that the PATH variables are set every time you start a new terminal session.

<h3>Step 3: Verify and Configure PHP.ini</h3>
In order for the changes to take effect, you need to uncomment or enable the following lines in your php.ini file:

```php
extension=mcrypt.so
mcrypt_module_list()
```

Restart Apache if it's running on your system. Alternatively, you can use this command to restart PHP-FPM on MacOS Mountain Lion with a native web server:

```bash
launchctl unload /Library/LaunchAgents/com.apple.httpd.plist
launchctl load -w /System/Library/LaunchAgents/org.php.fpm.plist
```

<h2>Conclusion</h2>
By following these steps, you should now have a working Laravel installation with mcrypt support on MacOS Mountain Lion using the native web server. If you encounter any issues or need further guidance, feel free to visit our website (https://laravelcompany.com/blog/) for more resources and tutorials related to PHP frameworks and development. Happy coding!
