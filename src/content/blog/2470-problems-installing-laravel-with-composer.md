---
title: "Problems installing laravel with composer"
description: "Solving the Laravel Installation Nightmare: Understanding the Composer PATH Problem Installing new frameworks can often feel like navigating a maze of..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Errors"]
featured: false
---

Installing new frameworks can often feel like navigating a maze of cryptic instructions, especially when dealing with command-line tools and dependency managers like Composer. If you've run into the frustration of getting past the setup steps for Laravel 5—and encountered errors about executables not being found—you are far from alone. This post will demystify that confusing message about the `PATH` variable so you can successfully install Laravel without further headaches.

## Deconstructing the Composer PATH Mystery

The core of your problem lies in understanding what the instruction "Make sure to place the `~/.composer/vendor/bin` directory in your PATH so the laravel executable can be located by your system" actually means. This is a fundamental concept in how operating systems locate and execute programs.

### What is the PATH Environment Variable?

Think of your system's `$PATH` variable as a list of directories where your shell (like Bash or Zsh) looks for executable files when you type a command. When you type `laravel`, the operating system doesn't inherently know where to look; it checks every directory listed in the PATH until it finds an executable file named `laravel`.

When Composer installs global tools, it places those executable scripts into a specific subdirectory (in your case, `~/.composer/vendor/bin`). If this new directory isn't in your shell's `$PATH`, your system has no idea where to find the `laravel` command, resulting in the dreaded `-bash: laravel: command not found` error.

### The Practical Fix for macOS Users

For global Composer installations on macOS, you need to modify your shell configuration file (usually `.zshrc` or `.bash_profile`) to permanently add this directory to the PATH list.

Here is a general approach to ensure these tools are accessible:

1.  **Identify Your Shell:** On modern macOS systems (Yosemite and newer), you are likely using Zsh.
2.  **Edit the Configuration File:** Open your shell configuration file in a text editor:
    ```bash
    nano ~/.zshrc
    ```
3.  **Add the Export Command:** Add the following line to the end of the file. This
