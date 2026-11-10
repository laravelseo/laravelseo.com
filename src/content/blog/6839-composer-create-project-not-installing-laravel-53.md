---
title: "composer create-project not installing Laravel 5.3"
description: "Composer Create Project: Why You Aren't Getting Laravel 5.3 (And How to Fix It) As a senior developer, I’ve seen countless times where command line tools..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As a senior developer, I’ve seen countless times where command-line tools seem to defy logic. Trying to install a specific, older version of a framework like Laravel only to end up with the wrong one is incredibly frustrating. You follow the instructions precisely, run the commands, and yet the output suggests you're getting an outdated result.

If you’ve encountered the issue of running `composer create-project laravel/laravel laravel53` and receiving Laravel 5.2 instead of the expected 5.3, you are not alone. This often points to a subtle interaction between Composer's dependency resolution, the versioning on Packagist, and how the specific Laravel repository handles older releases.

This post will diagnose why this happens and provide concrete steps to ensure you successfully set up your project environment.

## Understanding the Versioning Conflict

The core issue here lies in how Composer resolves package versions versus how the Laravel repository packages its historical releases. When you use `composer create-project`, Composer primarily looks at the specified vendor/package name (`laravel/laravel`) and attempts to pull the latest or most compatible version available from the configured repositories.

When you specify a version like `laravel53`, you are asking for that specific release tag. However, if the repository configuration or the default installation script prioritizes the *latest stable* release that is still accessible, it might resolve to 5.2 (the last stable version before 5.3 was fully integrated or indexed in a way that Composer prefers) rather than strictly enforcing the older target.

The fact that your friend successfully installed 5.3 suggests that environment differences—perhaps specific Composer cache states, PHP versions, or system setup on your MacBook Pro—are playing a role.

## Step-by-Step Solutions to Force Laravel 5.3 Installation

Since simple self-updates didn't fix the issue, we need to employ more direct methods to force Composer to recognize and fetch the exact version you require.

### Solution 1: Direct Version Pinning (The Recommended Approach)

Instead of relying on the `create-project` command to guess the history, let’s explicitly tell Composer exactly which Laravel package version we want to install first. This bypasses some of the ambiguity in the project creation step.

First, ensure you have a clean environment and check your PHP version compatibility, as older frameworks often require specific minimum PHP requirements.

Next, attempt the installation using the explicit version tag:

```bash
composer create-project laravel/laravel=5.3 my-laravel53-app
```

By appending `=5.3` directly to the package name, you are instructing Composer to look specifically for and install the Laravel 5.3 distribution directly, rather than relying on a potentially ambiguous installation path. This method is much more explicit about your intent.

### Solution 2: Verifying Repository Configuration

If Solution 1 fails, the problem might be related to which repositories Composer is prioritizing. Ensure your `composer.json` or global settings are correctly pointing to the necessary Packagist mirrors. If you are working with legacy versions, sometimes manually ensuring that the core repositories are up-to-date can resolve inconsistencies that affect older package resolutions.

Remember, setting up a solid foundation is crucial for any project. When starting with Laravel, understanding these underlying mechanics helps immensely in managing dependencies and deployment, which aligns with best practices promoted by resources like those found on [laravelcompany.com](https://laravelcompany.com).

## Conclusion: A Clear Path Forward

The discrepancy you observed is a common hurdle when dealing with older framework versions managed by Composer. The solution generally involves shifting from a version-hinting command (`create-project laravel53`) to an explicit version pinning command (`create-project laravel/laravel=5.3`). This forces the dependency solver to adhere strictly to your requirement.

If you continue to face issues, always start by checking your PHP version compatibility and ensuring your Composer installation itself is fully up-to-date. By being deliberate with your commands, you can successfully establish the environment you need, regardless of the framework version you are targeting.
