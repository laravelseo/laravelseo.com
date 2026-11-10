---
title: "\"laravel: command not found\" after installing Laravel"
description: "Laravel: Command Not Found After Global Installation – A Deep Dive into Composer PATH Issues As developers, we often encounter frustrating roadblocks where a..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Errors"]
featured: false
---

As developers, we often encounter frustrating roadblocks where a process seems successful but the resulting command simply refuses to execute. Recently, I encountered a common issue when setting up the Laravel global installer using Composer: installing the tool successfully, yet being unable to run the `laravel` command afterward. This post dives deep into why this happens and provides the definitive steps to fix it, ensuring your development environment is perfectly configured.

## The Mystery of "Command Not Found"

You followed the standard procedure for installing the Laravel installer globally:

```bash
composer global require laravel/installer
```

The output suggested success, but when attempting to run the command:

```bash
laravel
```

the system responded with the dreaded error: `laravel: command not found`.

This seemingly paradoxical situation is almost always related to how your operating system finds executable files—a concept governed by the `$PATH` environment variable. While Composer successfully installed the files, the specific directory where global executables reside might not be correctly included in the directories the shell searches when you type a command.

## Diagnosing the PATH Problem

Let's look at the diagnostic steps provided, as they highlight the core conflict:

When you checked your `$PATH`:
```bash
echo $PATH
```
You saw paths like: `~/.composer/vendor/bin:...`

If that path *is* present in the output of `echo $PATH`, yet the command still fails, the issue usually lies not with the existence of the path itself, but with how your current shell session (or login scripts) is loading and utilizing that variable. Sometimes, global installations place executables in locations that are missed by default configurations, especially across different operating systems or shell environments (like Bash, Zsh, or WSL).

The solution involves ensuring these globally installed binaries are properly accessible to your terminal environment.

## The Solution: Fixing the Environment Variables

To resolve the "command not found" error for global Composer packages, you need to ensure that the directory containing the Composer global executables is correctly added to your system's `$PATH`.

### Step 1: Determine the Correct Global Bin Directory

Composer typically installs global binaries into a specific location. You need to identify this path and add it permanently to your shell configuration file (e.g., `.bashrc`, `.zshrc`).

For most Linux/macOS users, the standard location for Composer global vendor files is often within the user's home directory structure related to Composer.

### Step 2: Modifying Your Shell Configuration File

You need to edit your shell configuration file to permanently update the `$PATH` variable every time you open a new terminal.

1.  **Open the configuration file:**
    ```bash
    nano ~/.bashrc  # Or ~/.zshrc if you use Zsh
    ```

2.  **Add the Composer path:**
    You need to add an `export` command that prepends the Composer bin directory to your existing `$PATH`. Assuming the correct global location is within your home directory, you would add a line similar to this (adjusting the specific path based on your system):

    ```bash
    export PATH="$PATH:$HOME/.composer/vendor/bin"
    ```

3.  **Save and Reload:**
    Save the file and then apply the changes to your current session:
    ```bash
    source ~/.bashrc  # Or source ~/.zshrc
    ```

After sourcing the file, try running the command again:

```bash
laravel
```

This should now execute successfully. This ensures that any executable installed via Composer globally is immediately discoverable by your operating system.

## Best Practices for Laravel Development

When working with frameworks like Laravel, relying on global installations can sometimes lead to these environment setup headaches. While the global installer method works well for tools like `laravel/installer`, many modern PHP projects benefit from managing dependencies locally within the project directory.

For project-specific dependencies, using **Composer's local installation** is often considered a cleaner and more robust practice. When you are inside a Laravel project directory, running commands via `./vendor/bin` (if properly set up) or ensuring your project uses Composer's standard structure aligns perfectly with the principles advocated by resources like [https://laravelcompany.com](https://laravelcompany.com). This approach keeps dependencies isolated and avoids system-wide path conflicts.

## Conclusion

The "command not found" error after installing global packages is a classic environment configuration issue, usually stemming from an improperly updated `$PATH` variable. By correctly identifying where Composer places its executables and explicitly adding that directory to your shell's configuration file, you can resolve this conflict instantly. Mastering these foundational system settings is crucial for any senior developer, ensuring smooth workflow regardless of the tools you are using.
