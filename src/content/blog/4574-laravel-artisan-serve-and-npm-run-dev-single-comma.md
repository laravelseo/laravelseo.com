---
title: "Laravel artisan serve and npm run dev single command"
description: "Laravel Development Workflow: Running Artisan and Vite Simultaneously with Shell Power As developers working on modern frameworks like Laravel, we frequently..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers working on modern frameworks like Laravel, we frequently find ourselves juggling multiple long-running processes—for example, a local PHP server running `php artisan serve` and a frontend asset bundler running `npm run dev` for Vite. The desire to execute these commands simultaneously, perhaps in a single terminal session or with a convenient shortcut, is very common.

The short answer is: yes, there are effective ways to achieve this, but the solution often lies not just in simple piping, but in utilizing robust shell features and process management tools.

## The Challenge of Simultaneous Execution

When you run commands sequentially, the terminal waits for the first command to finish before executing the next. When running both `php artisan serve` and `npm run dev`, they are typically independent processes that need to run concurrently so your development workflow remains efficient. Simply using the ampersand (`&`) in a standard shell might get you started, but it often leads to problems regarding process management, output handling, and session persistence.

## Method 1: The Basic Approach – Backgrounding Jobs

The simplest way to start these commands simultaneously is by placing the background operator (`&`) after each command. This tells the shell to execute the command and immediately return control to you, allowing other commands to run in the background.

```bash
php artisan serve &
npm run dev &
```

**Pros:** Quick and easy for immediate testing.
**Cons:** If you close the terminal window or run a new command, these background processes might be orphaned or become difficult to monitor. There is no centralized control over their output or stopping them gracefully later.

## Method 2: Session Managers for Persistent Workflows (The Recommended Way)

For serious development work where persistence and management are key, relying solely on backgrounding is insufficient. The professional solution involves using session managers like `screen` or `tmux`. These tools create virtual terminal sessions that persist even if you detach from them. You can start your services inside these sessions, run them concurrently, and then reattach later to see the exact state of both processes.

Using `tmux` (or `screen`) allows you to manage both tasks within a single, persistent environment:

1.  Start a new tmux session: `tmux new -s laravel_dev`
2.  Inside the session, run your commands sequentially (which will now run concurrently within that session):
    ```bash
    php artisan serve & npm run dev
    ```
3.  Detach from the session (leaving the processes running): Press `Ctrl+B`, then `D`.
4.  When you return later, reattach to see everything running: `tmux attach -t laravel_dev`

This method ensures that both your Laravel server and Vite build process are running stably, regardless of whether you switch applications or close your primary terminal window. This level of control is essential when managing complex setups, much like when dealing with the dependencies and structure promoted by the Laravel ecosystem, as seen on [laravelcompany.com](https://laravelcompany.com).

## Method 3: Advanced Process Orchestration (For Automation)

For highly automated or production-like scenarios where you need to manage many services across different machines, dedicated process managers like `pm2` are incredibly useful. While often overkill for a simple local setup, tools like `pm2` allow you to manage background processes, automatically restart them on failure, and keep track of their logs in a centralized manner.

## Conclusion

While running commands with the `&` operator is easy, for maintaining a reliable and professional development environment—especially when juggling services like Laravel's backend and Vite's frontend assets—session managers like `tmux` or `screen` provide the necessary control. They allow you to run `php artisan serve` and `npm run dev` simultaneously within a persistent context, turning a chaotic set of terminal commands into a structured, manageable development workflow. Always prioritize process management when building robust applications.
