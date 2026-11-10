---
title: "How to install json extension for PHP 7 on CentOS?"
description: "How to Install the JSON Extension for PHP 7 on CentOS: Solving Dependency Conflicts Upgrading a server environment, especially when juggling different PHP..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Upgrading a server environment, especially when juggling different PHP versions like moving from PHP 5 to PHP 7 on CentOS, often introduces dependency conflicts. It’s incredibly frustrating when you follow tutorials, only to hit cryptic errors about conflicting packages, preventing you from installing essential components like the JSON extension needed for frameworks such as Laravel.

As a senior developer, I’ve encountered similar dependency headaches. The issue you are facing—where the system detects conflicts between `php70u-cli` and older PHP binaries—is a classic symptom of having multiple incompatible package sets installed simultaneously on the system.

This guide will walk you through the correct, robust method to install the JSON extension for PHP 7 on CentOS, resolving those dependency conflicts so you can get back to building applications.

---

## Understanding the Conflict: Why the Error Occurs

The error messages you received—such as `Error: php70u-cli conflicts with php-cli-5.5.38...`—indicate that your system package manager (YUM/DNF) is confused about which PHP installation it should be modifying. When you manually try to install a package like the JSON extension, the system flags this conflict because installing it might break an existing, potentially incompatible, version of the CLI tool or common files.

Simply trying to force-install the extension often fails because the underlying dependency structure is broken. We need a systematic approach to ensure PHP 7 is correctly configured before adding extensions.

## Method 1: The Recommended Approach – Using Official Repositories

The cleanest way to manage PHP installations on CentOS is by relying on well-maintained repositories like Remi, which provide specific, tested versions of PHP. If you followed the DigitalOcean guide, you likely leveraged these tools. We need to ensure we are only interacting with the packages provided by that specific repository.

### Step 1: Verify Repository Setup

First, confirm that your repository configuration is clean and correctly pointing to the desired PHP version stack (e.g., PHP 7.x). Ensure all necessary EPEL packages are also installed, as they often provide dependencies for extensions.

```bash
sudo yum update -y
sudo yum install epel-release -y
# If using Remi repository, ensure it's correctly configured and updated
sudo yum install dnf -y # Or yum if you are on an older CentOS version
```

### Step 2: Install the Extension via Package Manager

If the JSON extension is available in your enabled repositories (which it usually is for standard PHP builds), use the package manager to install it. This forces the system to resolve dependencies correctly based on the repository structure, minimizing manual conflict errors.

```bash
# Attempt to install the json extension directly
sudo yum install php-json
```

If this command succeeds, you have solved the problem! The package manager handles the dependency resolution internally.

## Method 2: The Fallback – Compiling from Source (For Advanced Scenarios)

If the standard repository method fails due to persistent conflicts, it means your specific environment requires a manual compilation. This is often necessary when dealing with highly customized server setups or non-standard PHP builds.

### Step 1: Install Build Dependencies

You need the development tools and libraries required to compile PHP extensions.

```bash
sudo yum groupinstall "Development Tools" -y
sudo yum install php-devel make gcc
```

### Step 2: Compile the Extension

Locate your PHP source code directory (e.g., `/usr/src/php`) and use the `configure` script to compile the extension module against your currently installed PHP headers.

```bash
# Navigate to where you have downloaded or extracted the PHP source, if applicable
cd /usr/src/php

# Configure the build process, ensuring dependency checking is robust
./configure --with-php-config=/usr/bin/php-config --with-pdo-mysql --enable-json

# Compile and install the module
make
sudo make install
```

### Step 3: Reload PHP Modules

After compiling, you must tell the PHP interpreter to load the newly compiled extension. This usually involves restarting the web server or PHP service.

```bash
sudo systemctl restart httpd  # Or php-fpm if using that setup
```

## Conclusion: Building a Stable Environment

Dealing with dependency conflicts is an inevitable part of managing complex server environments, whether you are setting up a basic web host or deploying sophisticated applications like those built on Laravel. The key takeaway here is to **always prioritize using the system's package manager** when possible. By ensuring your repositories are correctly set up and letting `yum` or `dnf` handle the dependency resolution, you avoid manual errors and ensure that extensions like JSON are installed cleanly.

For robust application development, maintaining a stable foundation is crucial. When setting up your environment, always aim for clean package management practices to ensure long-term stability, much like adhering to the principles of modern software architecture seen on platforms like [laravelcompany.com](https://laravelcompany.com).
