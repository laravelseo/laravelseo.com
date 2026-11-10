---
title: "Laravel CLI 'sail artisan' returns 'no such service' after updating 'service name' in docker-compose.yml"
description: "Fixing the Ghost Service: Troubleshooting 'No such service' in Laravel Sail As developers working with containerized environments like Laravel Sail, we often..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Errors"]
featured: false
---

As developers working with containerized environments like Laravel Sail, we often rely on the seamless integration between our application code and the underlying Docker infrastructure. While this setup offers incredible portability and consistency, sometimes changes made to configuration files—like renaming a service in `docker-compose.yml`—can lead to frustrating runtime errors when using the associated CLI tools.

This post addresses a specific, yet common, scenario: encountering the error `ERROR: No such service: [Service Name]` after modifying your Docker Compose file and attempting to use Laravel Sail commands like `sail artisan`.

## The Scenario: Why Does This Happen?

You start with a standard Laravel setup using Laravel Sail. You update your `docker-compose.yml` file, perhaps renaming a service from something generic (like `laravel.test`) to something more descriptive, and then you run `sail build --no-cache`. Subsequently, running `sail artisan` results in an error pointing to the old or incorrect service name.

The root cause of this issue lies in how Laravel Sail abstracts the underlying Docker Compose commands. When you run `sail`, it executes the necessary `docker-compose` commands within the context of your project. If a service has been renamed, but the internal references or cached state used by the Sail environment haven't fully synchronized with the new definition, the CLI tool continues to look for the deprecated name, leading to the "No such service" error.

This often happens because the build process successfully creates the containers based on the *new* configuration, but the subsequent command execution context hasn't fully re-evaluated the network definitions established by that build in a way that the Sail wrapper understands immediately.

## The Solution: Forcing a Clean Rebuild and Re-evaluation

The solution is almost always to force Docker Compose (and thus Sail) to completely tear down and recreate the environment based on the latest configuration, ensuring all internal references are correctly mapped. Simply running `build` might not be enough if the state is stale.

Here is the comprehensive sequence of steps to resolve this issue:

### Step 1: Verify `docker-compose.yml` Integrity

Before proceeding, double-check your `docker-compose.yml`. Ensure the service name you are trying to access via `sail` matches exactly what is defined in the file, paying close attention to casing and separators.

**Example of a corrected structure:**

```yaml
version: '3.8'
services:
  # Note the correct new name here
  app:
    build: .
    volumes:
      - .:/var/www/html
    # ... other configurations
  nginx:
    image: nginx:latest
    # ...
```

### Step 2: Execute a Full Down and Up Cycle

Instead of relying solely on `sail build`, which focuses primarily on image building, use the full lifecycle commands to ensure the network, volumes, and service definitions are completely reset based on the updated file.

Run the following command from your project root:

```bash
sail down -v  # Stops and removes containers and associated volumes
sail up -d   # Recreates the services with the new configuration
```

The `-v` flag is crucial as it ensures that any lingering volume data related to the old service names is also cleaned up, providing a truly fresh start for Docker Compose.

### Step 3: Test the Artisan Command

After the containers have successfully been rebuilt and restarted according to the new `docker-compose.yml`, attempt to run your command again:

```bash
sail artisan
```

This sequence forces Laravel Sail to recognize the newly defined services within its environment, resolving the "No such service" error. This practice is fundamental when managing complex containerized applications, aligning with best practices for infrastructure management discussed by organizations like [laravelcompany.com](https://laravelcompany.com).

## Conclusion

Troubleshooting discrepancies between configuration files and runtime commands in a Docker setup requires understanding the statefulness of the environment. When working with tools like Laravel Sail, remember that the CLI layer is an abstraction over `docker-compose`. If the underlying definition changes, you must force a complete cycle—down, then up—to ensure the live environment accurately reflects the static configuration file. By adopting this rigorous approach, you can avoid these frustrating service errors and maintain smooth development workflows.
