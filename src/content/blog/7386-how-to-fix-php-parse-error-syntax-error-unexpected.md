---
title: "How to fix PHP Parse error: syntax error, unexpected '?', on laravel 5.8"
description: "How to Fix PHP Parse Error: Syntax Error, Unexpected '?' During Cron Jobs on Laravel 5.8 Dealing with obscure parsing errors during automated tasks,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Dealing with obscure parsing errors during automated tasks, especially on shared hosting environments, can be incredibly frustrating. When you set up a cron job to run a script—like backing up a database using tools like `spatie/laravel-backup`—and receive a cryptic error pointing deep inside framework files (like Zend Framework components), it often signals an issue with the execution environment or dependency integrity rather than a simple typo in your backup script.

As a senior developer, I’ve encountered similar issues when deploying Laravel applications to restrictive shared hosting environments. This guide will walk you through diagnosing and resolving the `syntax error, unexpected '?'` error you are seeing on your cron job logs.

## Understanding the Error Context

The error message you provided:
```
PHP Parse error: syntax error, unexpected '?', expecting variable (T_VARIABLE) in /home/username/app-folder/vendor/zendframework/zend-diactoros/src/functions/marshal_uri_from_sapi.php on line 83
```

This specific error is highly indicative of a problem within the underlying Zend Framework components that Laravel relies upon, specifically related to URI marshaling functions. While the error points deep into the `vendor` directory, it means the PHP interpreter failed while executing code that relies on these core dependencies. This usually happens when:

1. **Dependency Corruption:** Files in the `vendor` directory have become corrupted or incomplete during deployment or updates.
2. **Environment Mismatch:** The specific PHP version (7.3.5 in your case) interacts poorly with how the environment executes scripts, especially under resource-constrained shared hosting setups.
3. **File Permissions/Execution Context:** Cron jobs often run under a very restricted context that can lead to parsing failures if file access is subtly misconfigured.

## Step-by-Step Fixes for Shared Hosting Issues

Since the issue lies outside your application logic and within the execution environment, we need to focus on refreshing the dependencies and ensuring correct execution paths.

### 1. Reinstall Composer Dependencies (The Most Crucial Step)

The first and most effective step is to force a complete reinstallation of all project dependencies. This resolves most issues related to corrupted or mismatched vendor files.

Navigate to your project root directory (`/home/username/app-folder`) via SSH and run the following commands:

```bash
# 1. Clear the existing vendor directory (optional, but thorough)
rm -rf vendor

# 2. Reinstall all dependencies fresh
composer install --no-dev --optimize-autoloader
```

Running `composer install` ensures that every file within the `vendor` folder is correctly placed and matches the requirements of your PHP version and Laravel framework structure. This process is fundamental to maintaining application integrity, much like ensuring proper dependency management when building robust systems, which is a core principle in modern development practices as promoted by organizations like [Laravel Company](https://laravelcompany.com).

### 2. Verify Cron Job Execution Context

If reinstalling dependencies does not solve the issue, the problem likely stems from how the cron job executes. When running scripts via cron, the environment variables and current working directory can be different from a standard web request.

Ensure your cron command is fully qualified and explicitly calls the PHP binary:

**Instead of:**
```bash
* * * * * php /home/username/app-folder/artisan backup:run
```

**Try ensuring you use the full path to the PHP executable and set the working directory explicitly:**

```bash
* * * * * cd /home/username/app-folder && /usr/bin/php artisan backup:run >> /home/username/app-folder/cron.log 2>&1
```
Adding `cd` ensures the script runs from the correct root, and redirecting output (`>> cron.log`) allows you to capture any resulting errors directly in a log file for later inspection.

### 3. Check File Permissions

Shared hosting environments are notoriously sensitive to file permissions. Ensure that the user executing the cron job has read and execute permissions over the entire application directory, including `vendor`, `app`, and `public` folders. Use appropriate `chown` or `chmod` commands if you suspect permission issues:

```bash
# Example for setting ownership (adjust 'username' as needed)
sudo chown -R username:username /home/username/app-folder
```

## Conclusion

The `syntax error, unexpected '?'` during a cron job execution, particularly when dealing with framework dependencies like those used by `spatie/laravel-backup`, is almost always an environmental or dependency integrity issue rather than a bug in the backup script itself. By systematically refreshing your Composer dependencies and carefully examining the execution context of your cron job, you can resolve this parsing error and ensure your automated tasks run smoothly. Remember, maintaining clean dependencies is the first step toward building reliable applications on any platform.
