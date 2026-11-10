---
title: "Using Composer to install npm and bower packages on production (i.e. no devDependencies)"
description: "Mastering Production Deployments: Installing NPM and Bower Packages Without Development Dependencies As senior developers managing large scale applications,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "PHP"]
featured: false
---

As senior developers managing large-scale applications, we constantly strive for efficiency, security, and clean deployment pipelines. One frequent sticking point when deploying PHP projects, especially those utilizing frontend asset management via Node Package Manager (NPM) and Bower, is ensuring that only necessary production dependencies are installed during the final rollout.

This post addresses a common friction point: how to conditionally execute `npm install` and `bower install` within Composer's `post-install-cmd` without installing unnecessary `devDependencies` when running commands like `composer install --no-dev`.

## The Challenge with Post-Install Scripts

You are absolutely right in identifying the limitation. When you define scripts within `composer.json`, such as the `post-install-cmd`, these commands execute unconditionally once Composer finishes its primary installation phase. There is no native mechanism within the Composer execution flow to inspect command-line flags (like `--no-dev`) and conditionally alter which subsequent system commands (`npm install` or `bower install`) are executed based on those flags.

If we simply run:
```json
"post-install-cmd": [
    "npm install",
    "bower install"
]
```
Then running `composer install --no-dev` still triggers both commands, which inevitably pull in development dependencies unless the underlying package manager itself is configured to respect that flag (which is often not guaranteed across all toolchains).

The desire for a cleaner separation—where production installs are lean and fast—is entirely valid. We want Laravel applications, for instance, to be deployed with minimal overhead, ensuring that only runtime necessities are present.

## The Solution: Externalizing Control via Custom Scripts

Since Composer itself lacks this specific conditional logic for external package managers, the most robust and maintainable solution is to externalize the dependency management flow into a custom script or wrapper. Instead of relying solely on `post-install-cmd` for this complex orchestration, we introduce a dedicated deployment script that handles the environment context explicitly.

### Step 1: Refactor Composer Scripts

We should simplify the `post-install-cmd` to handle only PHP-specific optimizations and remove the external package management calls entirely from this hook. This keeps Composer focused on PHP dependencies.

**Refactored `composer.json` Example:**

```json
{
    "scripts": {
        "post-install-cmd": [
            "php artisan clear-compiled",
            "php artisan optimize"
            // Removed npm/bower calls from here
        ]
    },
    // ... rest of composer.json
}
```

### Step 2: Implement a Deployment Wrapper Script

We create a dedicated script (e.g., in `deploy.sh` or a custom `artisan` command) that checks the desired environment and executes the appropriate package manager commands with the correct flags. This gives us explicit control over what gets installed.

**Example Shell Script (`install_production.sh`):**

```bash
#!/bin/bash

# Check if --no-dev flag was passed (or inferred from context)
if [ "$1" == "--production" ]; then
    echo "Running production dependency installation..."
    # Install NPM dependencies, explicitly skipping devDependencies
    npm install --production
    # Install Bower dependencies, explicitly skipping devDependencies
    bower install --production
else
    echo "Running full development dependency installation..."
    # Full install for local development or CI environments
    npm install
    bower install
fi
```

### Step 3: Orchestration

Now, instead of relying on a single Composer command to handle everything, the deployment process becomes explicit. You run Composer for PHP setup, and then trigger the custom script for frontend assets:

1.  **PHP Setup:** `composer install --no-dev` (This handles all PHP dependencies cleanly).
2.  **Asset Setup:** `./install_production.sh --production` (This selectively installs only runtime Node/Bower packages).

## Conclusion: Clarity Over Magic

While the initial thought might be to force this logic into Composer's hooks, true flexibility in deployment environments often requires separating concerns. As we see with modern application architecture—especially within frameworks like Laravel where dependency management is layered—it is often more effective to use Composer for its primary role (PHP dependencies) and utilize dedicated shell scripts for managing external toolchains like NPM and Bower.

By adopting this wrapper approach, you gain explicit control over your deployment process, ensuring that production environments are lean, secure, and free from extraneous development packages. This practice promotes better separation of concerns, which is a core principle in building maintainable systems, much like the architectural clarity found in modern PHP frameworks like those promoted by Laravel company.
