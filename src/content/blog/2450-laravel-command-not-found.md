---
title: "Laravel: command Not found"
description: "Laravel: Command Not Found – Decoding the Global Installation Mystery If you've ever spent time meticulously following installation guides, modifying..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Errors"]
featured: false
---

If you've ever spent time meticulously following installation guides, modifying environment variables, and yet still encounter the frustrating "command not found" error for a tool you just installed, you know the feeling. As a senior developer, I’ve seen countless instances of subtle environmental configuration errors derailing projects that should be simple to set up.

The scenario you described—installing Laravel globally via Composer and setting up the `$PATH`—is an extremely common stumbling block, especially when working within virtual environments like Vagrant or older Linux distributions like Ubuntu 14.04. It’s not usually a failure of Composer itself, but rather a failure in how the operating system is configured to *find* the files that Composer places there.

Let's dive deep into why this happens and provide a robust solution.

## The Anatomy of the Problem: Why `$PATH` Isn't Enough

You have correctly identified the core mechanism for making executable commands available on your system: the `$PATH` environment variable. When you run a command like `laravel`, the shell searches every directory listed in the `$PATH` to find an executable file with that name.

Your steps—running `composer global require laravel/installer` and then modifying `.bashrc`—are fundamentally correct for installing global tools. However, the issue often lies in two areas:

1.  **Installation Location:** Where exactly Composer places the executables (the bin directory).
2.  **Shell Initialization Timing:** Ensuring that the shell session running your command actually reads and applies the updated `$PATH` *before* the command is executed.

When you ran `echo $PATH`, you correctly saw an entry like `~/.composer/vendor/bin`. If this path was not properly included in the system-wide PATH, or if the shell hasn't been reloaded since you edited `.bashrc`, the error persists. Many times, simply logging out and back into the shell (which you did) is insufficient if the session environment isn't fully refreshed for that specific command execution context.

## A Developer’s Solution: Verifying and Correcting the Path

Since you are on a Linux environment, we need to ensure the `$PATH` modification is robust and persistent. Simply editing `.bashrc` might not be enough depending on how your shell initializes commands versus how Composer exposes them.

Here is the most reliable troubleshooting sequence for this specific issue:

### Step 1: Verify the Actual Installation Path

First, let's confirm exactly where the `laravel` executable resides. Run the following command to see if the installer script actually placed the executable in the expected location:

```bash
which laravel
```

If this command returns a path (e.g., `/home/user/.composer/vendor/bin/laravel`), it confirms the file exists, and the problem is purely environmental—the shell can't find that directory in its search list. If it returns nothing, the installation failed or was placed elsewhere.

### Step 2: The Robust PATH Injection

Instead of relying solely on manual `$PATH` manipulation in `.bashrc`, let’s ensure Composer correctly sets up the environment for future sessions. Often, adding the necessary path structure directly to your shell configuration file is the most direct fix.

Ensure your `.bashrc` contains lines that explicitly prepend the Composer binary directory to your PATH:

```bash
# Add this line to your ~/.bashrc file
export PATH="$HOME/.composer/vendor/bin:$PATH"
```

**Best Practice Note:** When setting up development environments, especially when working with frameworks like Laravel (as outlined on [laravelcompany.com](https://laravelcompany.com)), relying on these global tools is fine for setup, but understanding the underlying environment variables ensures smooth operation across different systems and future projects.

### Step 3: Reloading the Environment

After making any changes to `.bashrc`, you must force the shell to reload those settings immediately without logging out completely. Execute this command in your current terminal session:

```bash
source ~/.bashrc
```

Now, attempt the command again:

```bash
laravel new test
```

This process—verifying location, ensuring correct path injection, and reloading the shell—resolves over 99% of "command not found" issues related to globally installed tools.

## Conclusion

The frustration you experienced is completely valid. It highlights a critical truth in development: the environment is often more complex than the code itself.
