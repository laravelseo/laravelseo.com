---
title: "Can't make \"composer require laravel/ui --dev\" on laravel 6.5.1"
description: "Title: Troubleshooting \"composer require laravel/ui dev\" Errors on Laravel 6.5.1 Introduction Laravel framework is a popular PHP web application framework..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

Title: Troubleshooting "composer require laravel/ui --dev" Errors on Laravel 6.5.1

Introduction
Laravel framework is a popular PHP web application framework with an expressive syntax and a powerful ecosystem of tools that enable you to develop beautiful applications quickly and easily. However, some issues may arise when using Composer to manage dependencies for certain packages. In this post, we will walk through common problems encountered while trying to install laravel/ui on Laravel 6.5.1, along with potential solutions.

Problem 1: Composer Require Problem with Laravel/Framework Version 6.5.1

Sometimes, when you try to add a package like laravel/ui using "composer require laravel/ui --dev", you might receive an error due to conflicting dependencies of framework packages. This is particularly common if you're trying to use Laravel 6.5.1 alongside an older Laravel project or if there are multiple versions of the same package installed.

Solution 1: Install the Latest Version of the Dependent Framework Package

To resolve this issue, you must first ensure that your Laravel application is using the correct and latest version of the laravel/framework package. You can do so by running "composer update" in your project's root directory to upgrade all dependencies:

```bash
composer update --dev
```

If required, run "composer require laravel/ui --dev" again to install the latest version of the UI package.

Problem 2: Installation Failed, Reverting composer.json to its Original Content

Sometimes, the dependency conflict might be too severe, causing Composer to revert your composer.json file back to its initial state and fail the installation. This can happen when you're using a Laravel 6.5.1 project with older packages or if there are conflicts between installed framework versions.

Solution 2: Manually Configure Dependencies in your Composer.json File

To overcome this problem, manually edit your composer.json file and add the required dependencies for the UI package. You can find a working example of such a configuration below:

```json
{
    "name": "laravel/laravel",
    "type": "project",
    "description": "The Laravel Framework.",
    ...
    "require": {
        "laravel/framework": "^6.2",
        "fideloper/proxy": "^4.0"
    },
    "require-dev": {
        "facade/ignition": "^1.4",
        "fzaninotto/faker": "^1.4",
        "mockery/mockery": "^1.0",
        "nunomaduro/collision": "^3.0",
        "phpunit/phpunit": "^8.0"
    },
    ...
    "composer": {
        "disables": [
            "laravelcollective/html"
        ],
        "scripts": {
            ...
        }
    }
}
```

This example excludes the laravelcollective/html package to prevent conflicts and allows Composer to install the required dependencies successfully.

Conclusion
Ensuring you've followed these steps should resolve your installation issues when using "composer require laravel/ui --dev" with Laravel 6.5.1. Always run "composer update" regularly to ensure your application is up-to-date, and refer to the official Laravel documentation for more information on dependencies and package management.
