---
title: "How to keep Laravel Queue system running on server"
description: "Title: Keeping Laravel Queue System Running Smoothly in the Background Body: Introduction As a Laravel developer, you might have encountered situations where..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Performance", "PHP"]
featured: false
---

Title: Keeping Laravel Queue System Running Smoothly in the Background

Body:
Introduction
As a Laravel developer, you might have encountered situations where your Laravel queue system stops working once you disconnect from your server's SSH session. This can lead to delayed jobs or even blocked requests. In this blog post, we will explore effective ways to keep your Laravel queue running in the background without needing constant SSH connections.

1. Understanding Laravel Queue System
Laravel provides a built-in queuing system that allows you to handle time-consuming tasks asynchronously. It's powered by Beanstalkd, Redis, or even Amazon Simple Queue Service (SQS) for distributed queue implementations. This enables better performance and responsiveness in your application.

2. Using Cronjobs: A Crucial Step
Cronjobs are time-based tasks that run on a predefined schedule. They can be configured to execute specific commands at regular intervals, ensuring the Laravel queue system is always up and running. You can set up cronjobs for different queuing systems like Beanstalkd, Redis, or SQS using their respective command-line tools.

For example (using Cron in Linux):
```bash
* * * * * cd /path/to/your/laravel/project && php artisan queue:work --daemon
```
This cronjob will run the `queue:work --daemon` command every minute, ensuring that your Laravel queue system is always active.

3. Employing Supervisor
Supervisor is a process control system that monitors and manages your application's background services, allowing them to run continuously even when you don't have active terminal sessions. It can be installed and configured easily through the command-line interface (CLI).

For example:
```bash
$ sudo apt install supervisor # for Ubuntu/Debian
$ brew install supervisor # for MacOS using Homebrew
```
Then, create a configuration file (supervisord.conf) with the following content:
```bash
[program:laravel_queue]
command=php /path/to/your/laravel/project/artisan queue:work --daemon
autostart=true
autorestart=false
stdout_stderr=all # or redirect output to a different file
```
Start and enable Supervisor to keep the Laravel queue system running in the background.

4. Implementing Systemd Services
Systemd is a Linux system management tool that allows you to control services on your server. For Laravel queue systems, creating a custom service file can make it easier to manage and run in the background.

For example:
```bash
[Unit]
Description=Laravel Queue System Service
Before=network.target
After=syslog.target

[Service]
Type=simple
User=www-data
ExecStart=/path/to/your/laravel/project/artisan queue:work --daemon
Restart=always
TimeoutSec=120
```
Enable and start the systemd service for your Laravel queue to run in the background.

5. Conclusion
Keeping your Laravel queue system running in the background is essential for maintaining smooth application performance. By implementing cronjobs, Supervisor, or Systemd services, you can ensure that your queued jobs are handled efficiently and consistently, even when your SSH connection is closed. Remember to follow best practices like securing access to your server and monitoring your queue system's progress to maintain optimal performance.
