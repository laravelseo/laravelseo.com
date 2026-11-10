---
title: "Docker is not running when run curl command to create new laravel project"
description: "Why Docker Doesn't Run When Creating a Laravel Project: A Deep Dive for WSL Users As developers diving into the world of modern application deployment,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Errors"]
featured: false
---

As developers diving into the world of modern application deployment, especially with frameworks like Laravel, Docker has become an indispensable tool. It provides consistency, portability, and isolates dependencies, which is exactly what makes containerization so powerful. However, setting up the initial environment—especially on Windows using WSL2 and Docker Desktop—can often introduce unexpected hurdles.

If you are following a guide to set up a new Laravel project using the `curl ... | bash` method and encounter the dreaded "Docker is not running" warning, you are hitting a common environmental synchronization issue between your host operating system (Windows), the virtualization layer (WSL2), and the Docker daemon itself.

This post will diagnose why this happens and provide the robust solutions necessary to ensure your containerized development workflow runs smoothly.

## The Anatomy of the Problem: Shell vs. Daemon Communication

The command you are running, `curl -s https://laravel.build/example-app | bash`, is a pipeline designed to fetch a script and execute it. Internally, this script relies on Docker commands to pull images, set up volumes, and provision the required environment.

When you run this command in your Windows Terminal or PowerShell, the execution flow attempts to communicate with the Docker daemon running within the WSL2 environment. If the communication path is broken—perhaps because Docker Desktop hasn't fully initialized its services for that specific shell session, or there’s a mismatch in how WSL exposes the necessary system calls—the script fails to find the Docker context and outputs that warning.

The error you saw (`cmdlet Invoke-WebRequest...`) suggests that the pipeline execution defaulted back to a standard PowerShell command instead of correctly invoking the Bash environment where the Docker orchestration is expected to occur. This points to an environmental setup issue rather than a bug in the Laravel installation script itself.

## Solutions: Ensuring Docker Context is Ready

Resolving this requires ensuring that your WSL2 environment and Docker Desktop are fully synchronized and operational before attempting to execute container-related commands.

### 1. Verify Docker Desktop Status

The most immediate step is confirming that the Docker engine is actually running correctly on your system.

*   **Check Windows:** Ensure Docker Desktop is running in the background and its status indicator (usually in the system tray) shows it is healthy.
*   **Check WSL Integration:** Verify that Docker Desktop has successfully integrated with your WSL2 distribution. Go to **Settings > Resources > WSL Integration** within Docker Desktop and ensure the toggle for your specific WSL distribution is enabled.

### 2. Restart Services and Environment

Sometimes, simply restarting the environment forces the necessary services to re-establish communication channels.

1.  **Restart Docker Desktop:** Fully close and restart the Docker Desktop application. Wait until it reports that the Docker engine has started successfully before proceeding.
2.  **Restart WSL:** Open your WSL terminal (e.g., Ubuntu) and run:
    ```bash
    wsl --shutdown
    wsl
    ```
    This forces a complete reset of the WSL environment, often resolving stuck service issues.

### 3. Alternative Setup for Laravel Projects

While troubleshooting the `curl` command is useful, for new developers focusing on Laravel setup, consider using Docker Compose directly rather than relying solely on shell scripts if you encounter persistent environmental issues. This gives you explicit control over the dependencies.

Instead of running the external script, you can set up a standard `docker-compose.yml` file and run your project entirely within that defined environment. This aligns perfectly with best practices for reproducible development environments, as advocated by modern Laravel deployment strategies on platforms like https://laravelcompany.com.

**Example of a Controlled Docker Setup:**

Create a simple `docker-compose.yml`:
```yaml
version: '3.8'
services:
  app:
    build: .
    command: php artisan serve
    volumes:
      - .:/var/www/html
    ports:
      - "8000:8000"
```

Then, run your project using Docker Compose from your terminal:
```bash
docker compose up -d
```
This method bypasses the complex pipeline interaction and directly instructs Docker to build and run your application in a controlled manner, ensuring that the environment is correctly established regardless of shell quirks.

## Conclusion

Encountering errors during initial setup is an unavoidable part of the development journey. The issue you faced—Docker not running when executing external scripts—is almost always related to the synchronization between the host OS, WSL2, and the Docker daemon. By systematically checking your Docker Desktop status, restarting services, and opting for more explicit workflow methods like `docker-compose`, you can move past these environmental hurdles. Mastering this setup is key to unlocking the full power of containerized development with Laravel.
