---
title: "How to set env with laravel artisan to have two different database connections (local/remote)?"
description: "How to Set Environment Variables in Laravel: Managing Multiple Database Connections Locally and Remotely As a senior developer, I often encounter confusion..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As a senior developer, I often encounter confusion when setting up multi-environment projects, especially regarding how frameworks handle configuration switching. The issue you are facing—trying to use `php artisan --env=local` or modifying `.htaccess` to switch between local and remote database settings—stems from misunderstanding where Laravel manages its environment awareness versus where your application defines its actual connection details.

This post will dive deep into the correct, idiomatic way to manage different environments in a Laravel application, focusing specifically on setting up separate connections for local development and remote production databases.

## Understanding Laravel's Environment System

Laravel relies heavily on the concept of environment variables to switch behavior, configuration loading, and feature toggles between different deployment stages (like local development, staging, and production). This separation is crucial for security and maintainability.

When you run an application, Laravel looks for specific environment files to determine its settings. The primary file is the `.env` file in the root of your project. Variables defined here, such as `APP_ENV`, dictate which set of configuration files (e.g., `config/database.php`) are loaded and which database credentials are used.

The command you mentioned, `php artisan --env=local`, refers to how Artisan commands interact with the environment settings, but it doesn't *set* the environment for the entire application context; it tells a specific command *which* configuration to follow.

## The Correct Approach: Using `.env` Files for Database Connections

To manage two distinct database connections (e.g., a local SQLite/MySQL for development and a remote PostgreSQL server for production), you should define these settings within the environment files themselves, rather than trying to manipulate the execution command with arbitrary flags.

### Step 1: Separate Environment Files

The best practice is to maintain separate `.env` files for each environment. This keeps your local setup completely isolated from your deployed configuration.

**A. Local Development Environment (`.env.local`)**
This file will hold your local database credentials.

```dotenv
APP_NAME=LaravelDev
APP_ENV=local
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel_dev
DB_USERNAME=root
DB_PASSWORD=password
```

**B. Production Environment (`.env`)**
This file holds the sensitive credentials for your remote, production database.

```dotenv
APP_NAME=LaravelProd
APP_ENV=production
DB_CONNECTION=pgsql
DB_HOST=remote.db.server
DB_PORT=5432
DB_DATABASE=laravel_prod
DB_USERNAME=prod_user
DB_PASSWORD=secure_password
```

### Step 2: Configuring Database Connections in `config/database.php`

Your main configuration file (`config/database.php`) will reference these settings. Because the application loads the environment variables based on the active `APP_ENV`, setting `APP_ENV=local` tells Laravel to use the local settings, and `APP_ENV=production` tells it to use the production settings.

When you run migrations or seeders locally, Laravel automatically uses the credentials defined in the currently loaded `.env` file. This approach ensures that your code remains portable and adheres to SOLID principles of configuration management, which is a core principle emphasized by modern framework design, similar to how robust systems are built on platforms like those discussed at [laravelcompany.com](https://laravelcompany.com).

## Why Avoid `.htaccess` for Environment Setting?

You asked about setting the environment via `public/.htaccess`. While `.htaccess` is powerful for web server configuration (like routing or PHP settings), it is **not** the correct mechanism for managing application-level environment variables in Laravel. Application configuration, including database connections, must be managed within the framework's structure (i.e., the `.env` files) so that Artisan commands and core services can correctly interpret the settings regardless of the server setup.

## Conclusion

To successfully manage multi-environment projects with different database connections in Laravel, stop trying to use arbitrary command flags to switch environments. Embrace the official Laravel convention: use separate `.env` files—one for local development and one for production. This method is clean, secure, and ensures that your application correctly loads the necessary credentials based on the defined `APP_ENV`. By following these practices, you ensure consistency and make maintenance significantly easier for yourself and any future team members.
