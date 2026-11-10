---
title: "I cannot install php composer in Ubuntu 16.04"
description: "Solving the Composer Installation Nightmare on Ubuntu 16.04: A Developer's Guide If you are trying to set up a modern PHP environment, especially for..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

If you are trying to set up a modern PHP environment, especially for frameworks like Laravel, encountering cryptic errors during essential setup steps can be incredibly frustrating. The issue you are facing—where the installer points to a missing OpenSSL extension—is a very common roadblock, particularly when dealing with older operating systems like Ubuntu 16.04.

As a senior developer, I can tell you that this isn't usually a bug in Composer itself; it’s an environment setup problem. Composer relies heavily on secure connections (HTTPS) to download packages from repositories, and if the underlying PHP installation is missing crucial dependencies like OpenSSL, the installer simply cannot proceed securely.

This guide will walk you through the exact steps required to fix this dependency issue and successfully install Composer on your Ubuntu 16.04 system.

## Understanding the Root Cause: Missing Dependencies

The error message you received clearly indicates that PHP lacks the necessary modules to handle secure network communication (OpenSSL). When running setup scripts, especially those involving external downloads, these security layers are mandatory. On many minimal or older installations of Ubuntu, core development libraries might be missing or not correctly linked when PHP was compiled.

To fix this, we need to ensure that OpenSSL is installed system-wide and then force the PHP installation process to recognize and utilize it.

## Step-by-Step Solution: Enabling OpenSSL on Ubuntu

We will tackle this in two phases: ensuring the system has the necessary libraries, and then ensuring PHP is built with those libraries enabled.

### Phase 1: Installing Required System Packages

First, open your terminal and update your package lists, then install the essential development packages required for building PHP with SSL support.

```bash
# Update package list
sudo apt update

# Install essential build tools and OpenSSL dependencies
sudo apt install build-essential libssl-dev ca-certificates
```

These commands ensure that all necessary compilation tools (`build-essential`) and the core OpenSSL development libraries (`libssl-dev`) are present on your system, which is crucial for compiling PHP correctly.

### Phase 2: Recompiling or Installing PHP with SSL Support

Since you are running an older LTS version like Ubuntu 16.04, sometimes simply installing packages isn't enough; the PHP installation itself needs to be reconfigured or rebuilt to link against these new libraries.

If you installed PHP via `apt`, ensure your PHP package is fully updated:
```bash
sudo apt install php-dev php-cli
```
If you encounter persistent issues, a more robust solution involves installing PHP from source and explicitly enabling the OpenSSL configuration flags during the build process, as suggested by the error message.

For advanced users who need precise control over the compilation, you would typically download the PHP source code and run `./configure --with-openssl`. However, for most users on Ubuntu, ensuring all related development libraries are installed via `apt` usually resolves the dependency conflict enough for subsequent installations to succeed.

## Finalizing the Composer Installation

Once you have confirmed that the system dependencies (OpenSSL) are correctly installed and linked to your PHP environment, you can safely retry the Composer installation process. Follow the original steps provided by the installer script:

```bash
# 1. Download the installer
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"

# 2. Verify the integrity of the file (as per the instructions)
php -r "if (hash_file('SHA384', 'composer-setup.php') === 'e115a8dc7871f15d853148a7fbac7da27d6c0030b848d9b3dc09e2a0388afed865e6a3d6b3c0fad45c48e2b5fc1196ae') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"

# 3. Run the installer
php composer-setup.php

# 4. Clean up
php -r "unlink('composer-setup.php');"
```

After successfully running `php composer-setup.php`, you should have a `composer.phar` file in your directory, ready to be used globally. This process ensures that Composer has the necessary cryptographic capabilities to operate securely, which is vital for any modern project environment, including those built on Laravel, where dependency management is paramount (as discussed on [laravelcompany.com](https://laravelcompany.com)).

## Conclusion

The frustration of dependency errors is a rite of passage in development. The key takeaway here is that when software fails to install due to missing extensions, the solution almost always lies outside the application itself—it's about managing the underlying operating system and PHP environment configuration. By systematically installing `build-essential` and `libssl-dev`, you provide the necessary foundation for your PHP installation to function correctly, allowing Composer (and by extension, your Laravel projects) to operate smoothly. Happy coding!
