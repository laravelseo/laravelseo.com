---
title: "zsh: command not found laravel"
description: "Title: Troubleshooting ZSH: Command Not Found Laravel Issue Introduction The Laravel framework is an expressive PHP web application framework that simplifies..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

Title: Troubleshooting ZSH: Command Not Found Laravel Issue

Introduction

The Laravel framework is an expressive PHP web application framework that simplifies the creation of complex applications using MVC pattern. If you recently installed and configured Laravel 5.2 and have been having issues with your zsh (Z Shell) terminal, this blog post will guide you through resolving the "command not found laravel" error.

Possible Causes

There are several factors that may contribute to this issue:

1. Incorrect path or missing environment setup: It is likely that your shell's PATH variable isn't pointing to the correct location where Laravel and its dependencies reside, such as ~/.composer/vendor/bin.

2. Missing dependency installation: You might have missed installing some necessary libraries or packages that are essential for running Laravel commands from your terminal. Ensure you have all the required third-party packages installed using Composer.

3. Incorrect path for Laravel Installer: The PATH variable in ~/.zshrc may not be set up correctly to point to the location of the Laravel installer.

Solutions

Step 1 - Verify your environment setup

Ensure you have completed the installation steps and configured your environment properly. Follow these instructions from https://laravelcompany.com/blog/installing-laravel-5-2#installing-laravel for a detailed guide on installing Laravel 5.2. Make sure to run the commands carefully and in the correct order.

Step 2 - Correct your PATH variable

To resolve this issue, you can add the path to the binary files of Composer and Laravel by modifying your ~/.zshrc file. Open the file in a text editor (e.g., Vim or Nano) using:

```
vim ~/.zshrc
```

Locate the PATH variable, which might look like this:

```
export PATH=~/.composer/vendor/bin:$PATH
```

Replace it with your specific path for Laravel's binaries. For example:

```
export PATH='/path/to/laravel/installer/vendor/bin':$PATH
```

Save the file and close the editor. To make these changes effective, restart your terminal or run this command to apply them immediately:

```
source ~/.zshrc
```

Step 3 - Reinstall the Laravel Installer if necessary

If you're still experiencing issues after setting up the PATH correctly, try reinstalling the Laravel installer using Composer. Run these commands from your terminal:

```
composer global require "laravel/installer"
```

Step 4 - Verify Laravel installation

After resolving the issue with your environment setup and PATH variable, run the laravel command to verify its functionality:

```
laravel new example-app
```

This should create a new Laravel project in the specified directory. If successful, you can run the new project using:

```
cd example-app
php artisan serve
```

Conclusion

By following these steps and ensuring your environment setup is accurate, your zsh terminal should be able to execute Laravel commands without any issues. Remember to always keep your Composer packages up-to-date for optimal performance. If you're still facing problems or need further assistance, feel free to visit https://laravelcompany.com/blog/.
