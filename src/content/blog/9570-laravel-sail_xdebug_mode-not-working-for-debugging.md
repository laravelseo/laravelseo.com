---
title: "Laravel SAIL_XDEBUG_MODE not working for debugging web calls"
description: "Decoding Laravel Sail Xdebug Failures: Why Debugging Web Calls Fails in Docker Setting up a modern development environment using Docker and Laravel Sail is..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Setting up a modern development environment using Docker and Laravel Sail is fantastic for consistency, but when you introduce deep debugging tools like Xdebug, things can quickly become frustrating. As a senior developer, I often see similar confusion when dealing with environment-dependent configurations within containerized setups.

You are running into a very common hurdle: the discrepancy between how PHP runs via the command line (`php -i`) and how it processes an incoming web request (via `phpinfo()` or Xdebug tracing). Let’s break down why setting `SAIL_XDEBUG_MODE` might not be translating correctly to your PhpStorm debugging session, and how we can fix this configuration mismatch.

## The Configuration Conundrum: CLI vs. Web

The core of your issue lies in the separation between environment variables passed during the build/runtime (like those in `docker-compose.yml`) and the actual PHP configuration files (`php.ini`).

When you run `php -i` inside the container, you are inspecting the default compiled configuration of that specific PHP installation. When a web request comes in, it uses the settings defined in the active `php.ini`. If Xdebug is enabled but not configured to listen for remote debugging correctly (often related to `xdebug.mode`, `xdebug.start_with_request`, and port binding), the connection fails regardless of the environment variable you set externally.

The difference you see between the CLI output and browser output often stems from:
1. **Environment Variable Overrides:** Some variables are read only at runtime, while others are baked into the compiled configuration.
2. **Xdebug Version/Installation:** Ensuring the Xdebug extension is correctly installed and loaded by the specific PHP image used in Sail is critical.

## Diagnosing the Laravel Sail Setup

Your provided Dockerfile and `docker-compose.yml` look generally correct for setting up a basic Sail environment. The key to solving this lies not just in the environment variables, but in ensuring Xdebug is correctly configured *within* the PHP image itself.

### Step 1: Verify Xdebug Installation within the Container

First, confirm that the Xdebug extension was successfully installed during the Docker build process. In your `Dockerfile`, you correctly install `php8.0-xdebug`. Ensure this package installation did not result in any errors. As a best practice, always verify the state of the extensions directly inside the running container:

```bash
docker exec -it <your_sail_container_name> php -m | grep xdebug
```

If Xdebug is missing here, no amount of environment variables will fix the debugging connection.

### Step 2: Aligning Environment Variables and PHP Configuration

The `SAIL_XDEBUG_MODE` variable is designed to signal Sail/Laravel what configuration to apply. However, for deep debugging, you often need explicit control over Xdebug settings that are defined in the actual `php.ini`.

Instead of relying solely on environment variables for complex setup, ensure your custom `php.ini` (which you copied via `COPY php.ini /etc/php/8.0/cli/conf.d/99-sail.ini`) is correctly modifying the Xdebug settings to allow remote debugging protocols.

For many Docker setups, explicitly defining the listening configuration in the environment variables might be necessary if the defaults are overridden:

```yaml
# In docker-compose.yml for the laravel.test service
environment:
    # Ensure these align with your IDE's expectations
    XDEBUG_MODE: "debug"
    XDEBUG_CONFIG: "client_host=host.docker.internal;port=9003" # Example configuration

    # If you need to ensure Xdebug is loaded correctly, sometimes setting specific paths helps:
    XDEBUG_SESSION_START: "file" 
```

## Practical Debugging Checklist for PhpStorm

If the environment variables are set and the container confirms Xdebug is installed, the issue often shifts to the IDE side. Follow this checklist when debugging Laravel web calls:

1. **Check Port Mapping:** Ensure the port you configured in `XDEBUG_CONFIG` (e.g., 9003) is correctly mapped and accessible *outside* the container. In your `docker-compose.yml`, ensure any necessary ports are exposed or reachable, though for Xdebug, internal Docker networking usually suffices if using `host.docker.internal`.
2. **IDE Listener Configuration:** In PhpStorm, verify that the remote debugging configuration points exactly to the correct IP address and port you expect (e.g., `localhost:9003` or `host.docker.internal:90
