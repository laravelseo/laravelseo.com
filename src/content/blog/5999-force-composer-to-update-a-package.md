---
title: "Force Composer to update a package"
description: "Force Composer to Update a Package: Mastering Local Repository Dependencies As developers building custom solutions, especially within the Laravel ecosystem,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

As developers building custom solutions, especially within the Laravel ecosystem, managing local packages and their dependencies often introduces unique complexities. You've hit a common snag: you make changes to your source code on GitHub, commit them, but running `composer update` yields "nothing to install or update," even though the files exist remotely.

This post dives deep into why this happens with custom repositories and provides the robust methods senior developers use to force Composer to recognize and pull the latest state from a Git repository, ensuring your development workflow remains smooth and dependency-aware.

## The Core Problem: Composer's Dependency Resolution

The issue you are facing stems from how Composer manages dependencies defined via repositories, particularly when version constraints point to branches (like `"dev-master"`). When Composer runs `composer update`, it primarily looks for updates within the existing installed state or adheres strictly to declared version requirements. If a package is defined via a repository pointing to a Git branch, Composer may not initiate a full fetch unless explicitly prompted to re-evaluate the source reference.

Your setup demonstrates this perfectly: defining a local package as a repository allows Composer to know *where* to look for packages, but it doesn't automatically trigger a Git pull of the referenced branch upon an update command. Deleting the package forces a clean state because Composer treats that package as a standard dependency rather than a linked repository source.

Here is the relevant configuration snippet:

```json
  "repositories": [{
    "type": "package",
    "package": {
      "name": "myrepo/MyExtension",
      "version": "dev-master",
      "source": {
        "url": "https://github.com/myrepo/MyExtension.git",
        "type": "git",
        "reference": "master"
      },
      // ... autoload settings
    }
  ],
  "require": {
    // ... other requirements
    "myrepo/MyExtension": "dev-master"
  }
```

## The Solution: Forcing the Repository Refresh

Since standard `composer update` fails to pull changes from a Git reference defined in a repository, we need to use commands that force Composer to re-evaluate the external sources and dependencies. There isn't a single magic flag for this specific scenario, but combining careful dependency management with explicit commands solves the problem reliably.

### Method 1: Using `--with-all-dependencies` (The Clean Refresh)

While not always necessary, running `composer update --with-all-dependencies` can sometimes force Composer to re-examine all potential sources and dependencies more thoroughly. This is a good first step for general dependency refreshes.

```bash
composer update --with-all-dependencies
```

### Method 2: The Direct Git Pull (The Most Reliable Approach)

For custom packages sourced directly from Git, the most robust method, especially when dealing with local development branches, is to treat the repository as a standard remote and perform the actual Git pull *before* running Composer. This ensures your package source is fully up-to-date before Composer attempts installation or updating.

1. **Navigate to the Package Directory:** Go to the actual directory where you want the package installed (or the root of your project if you are managing it there).
2. **Pull the Latest Changes:** Perform a direct Git pull on that repository.
   ```bash
   git pull origin master
   ```
3. **Run Composer Update:** Now, run your standard update command. Because the local source code files have been updated, Composer will recognize the new state when it looks through the configured repositories.
   ```bash
   composer update
   ```

This two-step process separates the version control operation (Git) from the dependency management operation (Composer), leading to a much cleaner and more predictable outcome. This practice is essential for maintaining integrity in complex projects, mirroring the principles of robust architecture promoted by organizations like [Laravel Company](https://laravelcompany.com).

## Best Practices for Development Packages

When managing development packages that rely on active Git branches:

1. **Use Tags for Releases:** Instead of relying solely on `dev-master` in your package definition, consider using Git tags (e.g., `v1.0.0-dev`) when you intend to create a stable version. This makes dependency management clearer than relying on constantly moving branch pointers.
2. **Separate Development Workspaces:** For very large projects, consider separating local development assets from the installed vendor directory. Use tools like Git submodules or separate project directories if possible to limit the scope of what Composer manages directly.
3. **Publishing vs. Local Linking:** If your package is intended for broader use (even internal teams), the best practice is to publish it to a private repository or Packagist. This removes the complexity of managing local Git references in `composer.json` and allows standard dependency resolution to handle updates automatically, which is highly recommended for production-ready Laravel components.

## Conclusion

Dealing with custom package repositories requires moving beyond simple command execution. By understanding that Composer relies on the state of the source code itself, forcing a direct synchronization via `git pull` before running `composer update` provides the necessary control. Mastering these nuances ensures that your development environment remains synchronized with your remote source code, allowing you to focus on building powerful features rather than debugging dependency synchronization issues.
