---
title: "laravel new blog not work mockery/mockery 1.4.0"
description: "Fixing the Dependency Nightmare: Why laravel new Fails with Mockery 1.4.0 on PHP 7.2 As developers, we often encounter frustrating roadblocks during..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

As developers, we often encounter frustrating roadblocks during project setup, especially when dealing with dependency resolution via Composer. Recently, I encountered a very specific issue while trying to initialize a new Laravel project: attempting to run the standard command led to an error regarding the `mockery/mockery` package. Understanding why this conflict occurs and how to resolve it is crucial for maintaining a smooth development workflow.

This post dives deep into the technical reasons behind this PHP version incompatibility and provides practical solutions.

## The Error Explained: A Clash of Requirements

When you execute `laravel new blog`, Laravel relies heavily on Composer to fetch all necessary packages, including those needed by the scaffolding process. The error message clearly states the conflict:

```
Installation request for mockery/mockery 1.4.0 -> satisfiable by mockery/mockery[1.4.0].
mockery/mockery 1.4.0 requires php ^7.3.0 -> your PHP version (7.2.23) does not satisfy that requirement.
```

The core issue is a mismatch between the environment's current PHP version ($\text{7.2.23}$) and the minimum requirement set by one of the required dependencies ($\text{mockery/mockery 1.4.0}$, which demands $\text{PHP} \ge 7.3.0$).

## Why Does This Happen? The Role of Composer and Dependencies

This situation highlights a common pitfall in dependency management: **transitive dependencies**. Laravel itself specifies minimum PHP versions that it is designed to run on, often citing support for specific frameworks or features. However, the underlying packages that Laravel pulls in (like testing libraries or mocking frameworks) maintain their own strict version requirements.

Laravel's framework layer might be flexible enough to operate on older PHP versions, but the dependency resolution system (Composer) enforces the constraints of every single package installed. In this case, even though you are using a supported version of Laravel, one of its required components has evolved its standards and now demands a newer runtime environment.

This is not necessarily an error with Laravel itself, but rather a symptom of evolving library requirements in the PHP ecosystem. When setting up any new project, especially when dealing with tools that involve testing or advanced features, ensuring your PHP version meets the *strictest* requirement across all dependencies is paramount for stability.

## Practical Solutions: How to Resolve the Conflict

There are two primary, practical ways to resolve this specific dependency conflict: updating your environment or adjusting the process.

### Solution 1: Upgrade Your PHP Version (Recommended)

The most robust solution is to upgrade your local PHP environment to meet the requirements of the dependencies. Since `mockery/mockery` requires PHP $\ge 7.3$, upgrading your system's PHP version will satisfy this constraint and ensure compatibility with modern Laravel installations.

If you are using tools like Docker or Valet, updating the base image or configuration is relatively straightforward:

```bash
# Example command (varies based on your environment setup)
sudo apt update && sudo apt upgrade php*
```

By ensuring your PHP version is compatible with the modern ecosystem, you align your development environment with current best practices. For detailed guidance on setting up modern Laravel environments and dependencies correctly, always refer to resources provided by the official team at [laravelcompany.com](https://laravelcompany.com).

### Solution 2: Downgrade or Manually Override Dependencies (Advanced)

If upgrading PHP is not immediately feasible due to legacy system constraints, an advanced workaround involves manually editing the `composer.json` file within the project directory and forcing a dependency downgrade or manual resolution. However, this approach is generally error-prone and should be reserved for highly specific, constrained environments. For standard Laravel development, sticking to Solution 1 is the cleaner path forward.

## Conclusion

Encountering dependency conflicts during setup is an inevitable part of modern software development. The key takeaway here is that framework compatibility, while important, must always be balanced against the strict requirements imposed by the underlying package ecosystem managed by Composer. By recognizing that dependencies set stricter rules than the core framework and proactively updating your environment (like PHP) to meet those demands, you ensure a stable, reproducible, and future-proof development experience. Happy coding!
