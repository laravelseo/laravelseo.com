---
title: "Run Xdebug on laravel sail docker Windows PhpStorm"
description: "Run Xdebug on Laravel Sail Docker Windows PhpStorm: A Complete Guide So, you’ve hit a common roadblock in modern PHP development: trying to bridge the gap..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

So, you’ve hit a common roadblock in modern PHP development: trying to bridge the gap between a local IDE like PhpStorm and a remote debugging session running inside a Docker container managed by Laravel Sail. It's frustrating when simple setup guides fail to address this specific cross-environment challenge. As a senior developer, I can tell you that while the initial installation of Sail is straightforward, integrating complex tools like Xdebug requires understanding how Docker networking and PHP configuration interact with IDE remote debugging protocols.

This guide will walk you through the complete process of setting up Xdebug for your Laravel Sail environment on Windows, allowing seamless debugging within PhpStorm.

## Understanding the Challenge: Docker and Remote Debugging

When you run an application inside a Docker container, the PHP execution environment is isolated from your Windows host machine. For an IDE running on Windows (like PhpStorm) to debug that code, Xdebug must be configured not just in the container, but also exposed over the Docker network so the external debugger can reach it.

The key steps involve ensuring Xdebug is installed within the PHP image, configuring `php.ini` for remote debugging, and correctly mapping the necessary ports via `docker-compose.yml`. We want to treat the container as a fully functional remote server.

## Step 1: Enabling Xdebug within the Docker Image

Since your project uses a custom Dockerfile within `vendor/laravel/sail/runtimes/8.0`, this is the perfect place to inject the necessary debugging tools. You need to modify that `Dockerfile` to install and configure Xdebug for PHP 8.0.

In your `Dockerfile` (located at `vendor/laravel/sail/runtimes/8.0/Dockerfile`), you will add commands to install the Xdebug extension. Since you are using an Ubuntu base image, use `apt-get`.

**Example Dockerfile Modification:**

```dockerfile
FROM ubuntu:20.04

# ... (existing setup commands)

RUN apt-get update \
    && apt-get install -y php8.0-cli php8.0-dev \
       php8.0-pgsql php8.0-sqlite3 php8.0-gd \
       # Add Xdebug here
       php8.0-xdebug \ 
       php8.0-curl php8.0-memcached \
       php8.0-imap php8.0-mysql php8.0-mbstring \
       php8.0-xml php8.0-zip php8.0-bcmath php8.0-soap \
       php8.0-intl php8.0-readline \
       php8.0-msgpack php8.0-igbinary php8.0-ldap \
       php8.0-redis \
    # ... (rest of your commands)
```

After adding `php8.0-xdebug`, you must ensure the PHP configuration file (`php.ini`) is set up to allow remote debugging connections, typically by setting the `xdebug.mode` and defining a listening port.

## Step 2: Configuring `php.ini` for Remote Debugging

The actual communication setup happens in your PHP configuration file. You need to tell Xdebug which port to listen on and ensure it's accessible externally. Locate your `php.ini` (which you are already copying into the container via your Sail setup) and configure it.

You must set the following directives:

```ini
; Enable debugging mode
xdebug.mode = debug

; Define the port Xdebug will listen on for remote connections
xdebug.client_port = 9003

; Tell Xdebug to listen on all interfaces (important for Docker networking)
xdebug.remote_host = host.docker.internal

; Ensure it can handle remote connections
xdebug.remote_autostart = 1
```

The use of `host.docker.internal` is crucial here, as it allows the container to correctly resolve the IP address of the host machine (your Windows machine) when attempting to connect back. This method works seamlessly within Docker networking setups like Sail.

## Step 3: Adjusting `docker-compose.yml` for Port Exposure

While Xdebug often communicates over a TCP port, for most IDE integrations, you primarily need to ensure your web application ports are exposed, as the debugging connection will leverage the existing network setup. Review your `docker-compose.yml`. Since Sail handles much of the networking, ensuring your application container is running correctly should suffice, but keep in mind that if you were using a dedicated Xdebug proxy service, you would map its port here (e.g., mapping port 9003).

## Step 4: Configuring PhpStorm for Remote Debugging

Finally, switch over to PhpStorm on your Windows machine. You will use the Run/Debug configuration feature to connect to the running PHP process inside the container.

1.  Go to **Run > Edit Configurations...**.
2.  Add a new PHP Remote Debug configuration.
3.  **Host:** Use `localhost` (or `127.0.0.1`) if you are debugging directly on the host, or use the specific Docker networking setup if configured for advanced scenarios. For standard Sail setups, connecting to `localhost` often works because the bridge is established via Docker's internal networking.
4.  **Port:** Set this to the port defined in your `php.ini` (e.g., 9003).
5.  Ensure your code is set up with breakpoints. When you run your Laravel application and trigger an Xdebug-enabled function, PhpStorm should pause execution, allowing you to inspect variables, exactly as intended for powerful development workflows supported by the ecosystem around **Laravel** and Dockerization principles.

## Conclusion

Integrating Xdebug into a Laravel Sail Docker environment on Windows might seem daunting, but by treating the container as a remote server—configuring PHP correctly inside the image, setting up network awareness with `host.docker.internal`, and mapping the ports—you create a robust debugging pipeline. This approach ensures that your development environment remains consistent, fast, and highly productive, allowing you to leverage the power of both Docker and PhpStorm effectively.
