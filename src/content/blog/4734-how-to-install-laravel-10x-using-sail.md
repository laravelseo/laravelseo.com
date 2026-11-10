---
title: "How to install Laravel 10.x using Sail?"
description: "How to Install Laravel 10.x using Sail: The Definitive Guide As a senior developer, I frequently encounter situations where developers try to mix and match..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As a senior developer, I frequently encounter situations where developers try to mix and match installation methods, leading to confusion about which tooling provides the best foundation for their project. You've hit on a common point of friction: wanting a specific version (like Laravel 10) coupled with a specific environment setup (like Laravel Sail).

The commands you listed show that while `composer create-project` can install the code, it doesn't automatically configure the Docker environment that Laravel Sail provides. To get a truly functional and instantly deployed Laravel 10 application using Sail, we need to use the official methods designed specifically for this purpose.

This guide will walk you through the correct, modern way to spin up a fresh Laravel 10 project pre-configured with Sail, ensuring your development environment is consistent and ready to go from day one.

---

## Understanding Laravel Sail and Docker

Before diving into the commands, it’s crucial to understand *why* we use Sail. Laravel Sail leverages Docker to provide a consistent, isolated, and reproducible development environment. Instead of manually installing PHP, Nginx, MySQL, and other dependencies locally—which often leads to "it works on my machine" issues—Sail handles all the infrastructure setup via Docker Compose.

This approach aligns perfectly with modern application deployment practices, making it an essential tool for any serious Laravel developer. As emphasized by the official documentation from [laravelcompany.com](https://laravelcompany.com), leveraging these tools ensures that your local environment mirrors production environments more accurately.

## The Correct Way to Install Laravel 10 with Sail

The most straightforward and recommended method for starting a new Laravel project that includes Sail is by using the official Laravel Installer or the `laravel new` command, which is designed to scaffold projects with default configurations.

Here is the step-by-step process:

### Step 1: Ensure Prerequisites are Met

Before starting, ensure you have Docker installed and running on your system. Sail relies entirely on Docker containers, so this prerequisite cannot be skipped.

### Step 2: Use the Laravel Installer (Recommended for Global Setup)

If you haven't already, install the global Laravel installer. This tool simplifies creating new projects across your system.

```bash
composer global require laravel/installer
```

### Step 3: Create the New Project with Sail

Once the installer is set up, you can create a new project specifying the desired version and including the Sail option. For Laravel 10, we explicitly target that release.

```bash
laravel new example-app --jetstream --sail
```

**Explanation of the command:**
*   `laravel new example-app`: This tells Composer/Laravel to create a new application directory named `example-app`.
*   `--jetstream`: (Optional, but often useful) Includes Jetstream scaffolding if you need authentication features immediately.
*   `--sail`: **This is the critical flag.** It tells the installer to automatically set up the necessary Dockerfiles and `docker-compose.yml` files required for Laravel Sail integration.

### Step 4: Navigate and Start the Application

After the installation completes, navigate into your new directory and start the Sail services:

```bash
cd example-app
./vendor/bin/sail up -d
```

This command will pull the necessary Docker images and launch all the required services (PHP, Nginx, MySQL, Redis) defined in the Sail configuration, giving you a fully functional Laravel 10 environment ready for coding.

## Conclusion: Consistency is Key

The confusion stems from mixing package management (`composer`) with environment setup (Sail/Docker). By utilizing the official scaffolding tools—specifically using `laravel new` with the `--sail` flag—you ensure that your project starts with the correct version, all necessary dependencies installed, and a fully functional Docker environment ready to go.

Always prioritize the official tooling when setting up new projects. This practice ensures consistency, minimizes setup time, and keeps you aligned with the best practices promoted by [laravelcompany.com](https://laravelcompany.com). Happy coding!
