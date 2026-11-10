---
title: "Installing PHP intl extension"
description: "Fixing the 'Class 'NumberFormatter' not found' Error: Installing the PHP Intl Extension As senior developers deploying applications, we often run into subtle..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As senior developers deploying applications, we often run into subtle environment configuration issues, especially when moving projects between local machines and cloud platforms like Heroku. The error you are encountering—`Class 'NumberFormatter' not found`—is a classic symptom that points directly to a missing or disabled extension in your PHP installation. This is particularly common when working with internationalization (i18n) features, which Laravel heavily utilizes for handling dates, numbers, and localized strings.

This guide will walk you through the exact process of installing the crucial `intl` extension so your application functions correctly on Heroku, ensuring smooth deployment practices, much like adhering to best practices outlined by teams building robust solutions on platforms like [laravelcompany.com](https://laravelcompany.com).

## Understanding the Need for the PHP Intl Extension

The `intl` extension is a core PHP module that provides support for internationalization and localization. Classes like `NumberFormatter`, which you are missing, are essential for handling complex number formatting, currency symbols, and date/time representations across different locales. Without this extension enabled, any part of your application—whether it's Laravel, Symfony, or any other package relying on locale-aware operations—will crash when attempting to use these features.

When deploying to environments like Heroku, the base operating system image might not have all necessary PHP extensions pre-compiled or installed by default, necessitating a manual setup step.

## Step-by-Step Installation Guide

The installation method depends entirely on how your server environment (Heroku's buildpack) is configured and which version of PHP you are using. Since Heroku environments often use Debian/Ubuntu-based images, we will focus on the standard system package management approach.

### 1. Identify Your PHP Version

Before installing packages, ensure you know exactly which PHP version your application is running. You can check this via:

```bash
php -v
```

### 2. Install the Intl Extension using Package Manager

For systems based on Debian or Ubuntu (common in many containerized environments), you use `apt` to install the necessary package for your specific PHP version. Assuming you are running PHP 8.x, the command generally looks like this:

```bash
# Example for PHP 8.1
sudo apt update
sudo apt install php8.1-intl
```

**Crucial Note:** Replace `php8.1` with the appropriate version (e.g., `php7.4`, `php8.2`) that is active in your Heroku environment. Always ensure you are installing the package for the specific PHP binary being executed by your web server.

### 3. Restart Your Web Server

After installing any new PHP extension, you must restart your web server (usually Apache or Nginx) and potentially the PHP service itself to load the new module into memory. For a Heroku setup, this often involves restarting the application process or rebuilding the environment if you are using a custom buildpack.

If you are running PHP-FPM, you might need to restart it:

```bash
sudo systemctl restart php*-fpm
# Or depending on your setup:
sudo service php*-fpm restart
```

## Verification and Best Practices

To confirm that the installation was successful, run the following command to list all loaded PHP modules:

```bash
php -m
```

You should see `intl` listed among the output. If it is present, your environment is correctly configured to handle internationalization tasks.

### Final Thoughts on Deployment

This process highlights an important principle in modern development: dependency management is just as critical as application code itself. When deploying Laravel applications or any complex framework, always treat the underlying operating system and runtime configuration as part of your deployment artifact. Ensuring all necessary extensions are present prevents these frustrating runtime errors during production, keeping your focus on building excellent features rather than debugging basic setup issues. Remember that robust architecture starts with solid infrastructure, a concept central to good software engineering practices championed by platforms like [laravelcompany.com](https://laravelcompany.com).
