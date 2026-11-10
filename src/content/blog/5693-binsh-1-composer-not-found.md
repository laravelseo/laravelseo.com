---
title: "/bin/sh: 1: composer: not found"
description: "Fixing the Dreaded /bin/sh: 1: composer: not found in Docker Builds As a senior developer working with containerization, you've likely encountered this..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a senior developer working with containerization, you've likely encountered this frustrating error: `docker build` failing with `/bin/sh: 1: composer: not found`. This issue is incredibly common when trying to set up PHP and framework projects—especially those based on Laravel or Symfony—within a Docker environment.

This post will diagnose exactly why this happens, explain the underlying principles of Docker layering, and provide the robust solution for installing Composer correctly within your Dockerfile.

## The Root Cause: Context and Layering in Docker

The error you are seeing stems from how Docker builds images layer by layer. When you execute a command like `RUN composer install`, that command runs inside a new shell context based on the current image layer. If the necessary executable (`composer`) is not present in that specific environment's `$PATH`, the build fails, even if you can run `composer` interactively outside of the Docker context (e.g., via `docker exec`).

The core problem is that the base image, while providing PHP, does not automatically include Composer as an installed binary accessible directly at `/usr/bin/composer` in a way that standard shell commands immediately recognize when executing a new command sequence like `RUN`. You are telling Docker to run a command inside an environment where that tool simply doesn't exist yet.

## The Solution: Installing Dependencies via the OS Package Manager

The correct approach is to treat the installation of Composer as part of the image building process itself. Instead of relying on external installations or assuming the base image has it, you must explicitly install the required package using the operating system’s native package manager (in this case, `apt-get` for Debian/Ubuntu-based images).

This ensures that the dependency is baked into the final image layer, making your build reproducible and portable.

### Step-by-Step Dockerfile Correction

For a robust Laravel application setup, you need to ensure Composer is installed *before* you attempt to run `composer install`.

Here is how you should modify your Dockerfile:

```dockerfile
FROM php:7

# 1. Update package lists and install necessary prerequisites (like git and apt-get tools)
RUN apt-get update && \
    apt-get install -y \
        git \
        unzip \
        wget \
        libzip-dev \
        libpng-dev \
        && rm -rf /var/lib/apt/lists/*

# 2. Install Composer globally using apt
# We use the official installation script to ensure we get the latest stable version
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /home/winpc/test/laravelApp/app

COPY composer.json /home/winpc/test/laravelApp/app

# 3. Now, running composer install will succeed because the binary is installed
RUN composer install

COPY . /home/winpc/test/laravelApp/app

CMD php artisan serve --host=0.0.0.0 --port=8181
EXPOSE 8181
```

### Explanation of the Fix

1.  **Prerequisites:** We start by running `apt-get update` and installing essential tools (`git`, etc.). This is a best practice to ensure the system is ready for package management.
2.  **Composer Installation:** Instead of relying on an external installation, we use a method that downloads the official installer script and executes it using PHP to install Composer into a standard location (`/usr/local/bin`). This ensures the binary is available in the container's `$PATH`.
3.  **Execution Context:** Now, when Docker hits `RUN composer install`, the shell environment has successfully found the `composer` executable because we explicitly installed it within that same build context.

## Best Practices for Laravel Dockerization

When building applications like those managed by **Laravel**, dependency management is paramount. Relying on explicit package installation inside the Dockerfile, rather than assuming pre-installed binaries, adheres to the principle of immutability in container images. This practice ensures that your deployment environment is exactly what you intend it to be, preventing "it works on my machine" syndrome when deploying to production.

Always strive for minimal layers and explicit instructions. When dealing with complex dependency setups, using multi-stage builds can further enhance security and efficiency by separating the build dependencies from the final runtime image.

## Conclusion

The error `/bin/sh: 1: composer: not found` is a classic symptom of missing installation steps within your Docker context. By shifting the responsibility for installing tools into explicit `RUN` commands using the host OS package manager (`apt-get`), you ensure that every layer of your Dockerfile builds upon a solid, self-contained foundation. Implement this pattern, and you will build reliable, reproducible container images every time.
