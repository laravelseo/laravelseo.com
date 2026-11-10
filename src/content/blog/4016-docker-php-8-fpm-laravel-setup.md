---
title: "Docker & PHP 8 FPM & Laravel Setup"
description: "Mastering the Build: Fixing PHP Extension Compilation Errors in Docker Setting up a robust development environment using Docker and PHP is the gold standard..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Setting up a robust development environment using Docker and PHP is the gold standard for modern application deployment, especially when working with frameworks like Laravel. However, the process of compiling custom PHP extensions inside a container often introduces tricky dependency management issues. As a senior developer, I've seen countless setups stumble over these exact compilation errors.

Today, we’ll dissect a common stumbling block: debugging why `docker-php-ext-install` fails when building PHP extensions on an Alpine-based Docker image, focusing specifically on the dependency conflicts you encountered with `mbstring` and regex libraries like `oniguruma`.

## Decoding the Docker Build Failure

You provided a detailed error log stemming from your attempt to build custom PHP extensions. The core issue lies not in the extension itself, but in the prerequisite system packages required by those extensions during the compilation phase.

The sequence of errors clearly points to a missing development package:

```
configure: error: Package requirements (oniguruma) were not met:
Package 'oniguruma', required by 'virtual:world', not found
```

This tells us that while you installed necessary tools (`build-base`, `git`, etc.), the specific header files and libraries needed by the PHP compiler to link against the regex engine (`oniguruma`) were either missing or improperly linked during the `docker-php-ext-install` command execution.

When working with Alpine Linux (which uses the `apk` package manager), ensuring that all required development headers (`-dev` packages) are present *before* running the compilation steps is critical. The attempt to install `libonig-dev` failed because, in that specific environment or version combination, the dependency chain was broken, leading to a circular dependency error with `apk`.

## The Solution: Correct Dependency Layering

The fix involves restructuring your `RUN` commands in the `Dockerfile` to ensure all necessary build dependencies are installed as a single, cohesive step. We need to make sure that packages required for compiling modules (like `libonig-dev` for regex support) are explicitly included alongside general build tools.

For building PHP extensions on Alpine, the key is grouping related dependencies and ensuring the system has everything needed to compile against the C libraries.

Here is the corrected approach, focusing on robust dependency installation:

### Revised Dockerfile Strategy

Instead of trying to fix missing packages piecemeal, we integrate the necessary development headers directly into the main build layer. We ensure that `libonig-dev` (or its equivalent) is handled correctly within the initial package setup.

```dockerfile
FROM php:8.0.5-fpm-alpine

WORKDIR /var/www

# Install all necessary build tools and PHP extensions dependencies in one go
RUN apk update && \
    apk add --no-cache \
    build-base \
    freetype-dev \
    libjpeg-turbo-dev \
    libpng-dev \
    libzip-dev \
    zip \
    jpegoptim \
    optipng \
    pngquant \
    gifsicle \
    vim \
    unzip \
    git \
    curl \
    # Crucially add the required regex development headers for mbstring/GD compilation
    libonig-dev

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring zip exif pcntl gd

# Install Redis Extension (keeping this separate for clarity)
RUN apk add autoconf && \
    pecl install -o -f redis && \
    rm -rf /tmp/pear && \
    docker-php-ext-enable redis && \
    apk del autoconf

# Copy config and setup user (rest of the file remains the same)
COPY ./config/php/local.ini /usr/local/etc/php/conf.d/local.ini

RUN addgroup -g 1000 -S www && \
    adduser -u 1000 -S www -G www

USER www

COPY --chown=www:www . /var/www

RUN chmod +x ./start_script.sh

EXPOSE 9000

CMD ./start_script.sh
```

### Why This Works

By combining all required build packages—including `libonig-dev`—into a single `apk add` command, you ensure that the package manager resolves all dependencies simultaneously. This prevents the scenario where one dependency is installed but its necessary development headers are not available to the subsequent compilation step (`docker-php-ext-install`).

## Conclusion: Dockerizing for Success

This experience reinforces a fundamental principle of containerization: **Build environments must be self-contained and fully specified.** When building software, especially complex binaries like PHP extensions, treat your `Dockerfile` as a precise recipe. Don't rely on sequential fixes; instead, define the entire required environment upfront. This practice is vital for maintaining consistency across development, staging, and production environments—a core philosophy behind modern Laravel deployment strategies.

By thoroughly understanding how Alpine’s package management interacts with PHP compilation, you move from debugging errors to architecting resilient build pipelines. Happy coding!
