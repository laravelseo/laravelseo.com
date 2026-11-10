---
title: "Laravel queue:restart is not killing workers"
description: "Title: Troubleshooting Laravel Queue Workers: Understanding Why 'queue:restart' Isn't Killing Them Introduction Laravel is one of the most popular PHP..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Troubleshooting Laravel Queue Workers: Understanding Why 'queue:restart' Isn't Killing Them

Introduction
Laravel is one of the most popular PHP frameworks and allows you to handle queues efficiently using its built-in queue system. However, managing such systems can be tricky, especially when dealing with workers that don't seem to terminate after executing 'queue:restart'. This blog post aims to provide a comprehensive solution for this issue while explaining the possible reasons behind it.

Problem Analysis
To troubleshoot this problem effectively, we need to understand these aspects:
1. The Laravel queue system
2. The process of restarting workers with 'queue:restart' command and how it affects running processes
3. Potential causes for the issue and their solutions

Solution 1: Restarting Supervisor
Supervisor is a process management tool that helps you monitor and control your application processes. It can also be used to launch workers. If your Laravel app is configured using Supervisor, ensure all related workers are running under the same group or process name in the configuration file. To restart the entire Supervisor service, run the following command:

```bash
sudo supervisorctl update
sudo supervisorctl restart all
```

This will kill and reinitialize the processes, resolving any issues with not-stopping workers.

Solution 2: Running 'queue:restart' Manually
If Supervisor is not involved in managing your Laravel queues, you can run "kill" commands on the running worker processes to force them to end. Then, reboot or restart the Laravel queue using the 'queue:restart' command:

```bash
ps aux | grep queue:work
<list and IDs of the process>
kill -9 <process_id>
php artisan queue:restart
```

However, this approach may not be the most reliable or efficient long-term solution.

Solution 3: Enabling the 'stopping' Option in Laravel Queue Configuration
In Laravel versions below 5.6, you can enable the 'stopping' option to ensure that workers are properly terminated when restarting queues. To do this, add the following lines to your '.env' file and then run migrations:

```bash
QUEUE_CONNECTION=database
QUEUE_STOPPING=true
php artisan migrate
```

In Laravel 5.6+, you can use 'queue:work --stop' command to stop the queued jobs before starting new ones with queue:restart:

```bash
php artisan queue:work --stop
php artisan queue:restart
```

Solution 4: Ensure Proper Server Restart Scripts are in Place
If your application is deployed on a server, ensure that restart scripts are properly configured to handle both the Laravel and Supervisor processes. You can add custom scripts using 'hook' commands provided by most deployment tools like Envoyer or Forge. These scripts should terminate all running workers, restart the necessary services, and then run your application in a clean state.

Solution 5: Ensure Proper Deployment and Queue Restart Processes are Configured
If you encounter this issue frequently during deployments, review your deployment process and ensure that it handles the queue restarting correctly. You can use automated tools like Laravel Forge's 'deploy:restart' feature to handle these tasks for you seamlessly.

Conclusion
By following the above solutions, you should be able to resolve your issue with workers that don't die after executing the 'queue:restart' command. Remember to employ proper best practices in managing Laravel queue systems and ensure a smooth deployment process for a stable application. Should you encounter any further issues or need guidance on specific topics, reach out to the Laravel community and experts at https://laravelcompany.com.
