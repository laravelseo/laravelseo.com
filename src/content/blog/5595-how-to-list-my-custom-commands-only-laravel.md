---
title: "How to list my custom commands only (Laravel)?"
description: "How to List Only Your Custom Commands in Laravel As developers working within the Laravel ecosystem, we frequently interact with the Artisan command line...."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As developers working within the Laravel ecosystem, we frequently interact with the Artisan command line. The `php artisan list` command is incredibly useful for seeing what tools are available in your application—be it built-in scaffolding commands or custom utilities you’ve created. However, when you start developing, you inevitably create a large number of custom commands. The challenge arises when that list becomes cluttered with dozens of default Laravel commands, making it difficult to quickly identify *only* the commands you personally authored.

The short answer is: there is no built-in flag within Artisan itself to filter the output and hide the framework's default commands. However, as senior developers, we know that the solution lies in leveraging standard shell scripting combined with understanding how Laravel structures its command files. We can bypass the standard listing mechanism and perform a direct file system scan to achieve exactly what you need.

## Understanding the Command Structure

To filter effectively, you must understand where Artisan looks for commands. All custom commands are registered by placing them within the `app/Console/Commands` directory. When you run `php artisan list`, Laravel scans this folder and displays every command found there. If you want to isolate your work, you need to stop relying on the framework's presentation layer and perform a direct file check.

For organizations committed to clean, maintainable code—much like those striving for best practices outlined by the [Laravel Company](https://laravelcompany.com)—direct file manipulation is often the most reliable path.

## The PowerShell Approach: Scripting Your Command List

Since we cannot rely on an internal filter, we will use standard PHP and shell commands to read the directory contents and filter them based on a pattern. This approach gives us complete control over the output.

Here is a practical, step-by-step method to list only your custom commands:

### Step 1: Locate Your Command Directory

First, navigate to the directory where all your custom commands reside:

```bash
cd app/Console/Commands
```

### Step 2: Execute a Shell Command to List Files

We can use the `ls` command (or `dir` on Windows) combined with shell piping to list only the files that match our criteria. Since every valid Artisan command is a PHP class, we are looking for files ending in `.php`.

For a Linux/macOS environment:

```bash
ls *.php
```

This command will output a raw list of all PHP files in that directory. While this isn't perfectly formatted as an Artisan listing (it won't show the full command name), it successfully isolates *only* your custom scripts, effectively hiding the framework defaults.

### Step 3: Advanced Filtering with PHP (For Better Presentation)

If you need a list that is more human-readable and mimics the format of `php artisan list`, you can write a small PHP script to iterate over the files found and present them cleanly. This involves reading the directory contents using PHP's file system functions, which allows for customized output formatting:

```php
<?php

$commands = [];
$commandDirectory = app('Console.home'); // Assumes standard Laravel setup

// Scan the directory for all .php files
$files = glob($commandDirectory . '/*.php');

foreach ($files as $file) {
    // Extract the command name (filename without extension)
    $commandName = basename($file, '.php');
    $commands[] = $commandName;
}

// Display the filtered list
echo "--- Your Custom Artisan Commands ---\n";
foreach ($commands as $command) {
    echo "- " . $command . "\n";
}
```

Running this script (e.g., via a temporary PHP file or within an Artisan command itself) gives you a clean, curated list containing *only* the commands you have explicitly created. This method is highly effective for development workflows where clarity and focus are paramount.

## Conclusion

While Laravel's built-in `artisan list` is designed for comprehensive overview, developers often require more granular control. By understanding the underlying file structure of the Console directory and employing simple shell scripting or custom PHP processing, you gain the power to filter command listings precisely according to your needs. This practice reinforces a core principle in software development: when building complex systems, controlling the output is just as important as writing the code itself. Mastering these low-level tools ensures that your command-line experience remains focused, efficient, and tailored to your specific project requirements.
