---
title: "Running laravel queue:work on a shared hosting"
description: "Title: Running Laravel Queue Work on Shared Hosting: A Practical Guide Introduction When developing a web application using the Laravel framework, you may..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Title: Running Laravel Queue Work on Shared Hosting: A Practical Guide

Introduction
When developing a web application using the Laravel framework, you may need to handle background jobs or tasks that require long running processes. Laravel's queue system allows you to offload such tasks and execute them asynchronously. However, when building upon shared hosting environments, this process can be tricky due to limited configuration options. This comprehensive guide will walk you through the steps needed to run Laravel's Queue Worker (queue:work) on a Linux-based shared server without installing any additional software like Supervisor.

Part 1: Setting up the Environment
Before we dive into running the queue worker, let's ensure that your environment is set up correctly for Laravel development. Follow these steps:

1. Connect to your shared hosting account via SSH or FTP. Ensure you have access to the server using a terminal or an FTP client like Filezilla.
2. Clone your Laravel project to the server with the command 'git clone <your_project_repo_url>'. You may need to provide SSH keys for authentication if required by the hosting provider.
3. Change your current working directory to the Laravel root folder ('cd <laravel_root_folder_path>').
4. Set up the web server configuration and virtual host file (if needed) to properly route requests to the correct document root. This will allow your website to be accessible from a web browser.
5. Configure the Laravel application environment for production mode by editing the '.env' file in the root folder. Change 'APP_ENV=local' to 'APP_ENV=production'.
6. Set up a suitable database connection by creating a new database and adjusting the credentials accordingly within the '.env' file.
7. Run the Laravel installation script ('php artisan serve') to ensure that your application works as expected. If you encounter any issues, troubleshoot them before proceeding with queue management.

Part 2: Running the Queue Worker
Now that your environment is set up and you can access your Laravel project from a web browser, we will configure the queue worker to run constantly inside the shared hosting account. Follow these steps:

1. Disable any existing cronjobs or daemon processes (if any) related to Laravel's queue worker.
2. Install and configure Cron on your shared hosting server following their documentation. Aim for a configuration that runs every minute without any time restrictions ('* * * * *').
3. Create a new Bash script called 'laravel_queue_worker.sh' in the root folder containing the following command:
   ```bash
   php artisan queue:work --tries=3 --fail
   ```
   This command will run your Laravel queue worker with 3 retries and automatically fail tasks that cannot be processed successfully.
4. Update the Cron job to run your new script every minute by adding the following line to the crontab configuration file:
   ```bash
   * * * * * cd <laravel_root_folder_path> && ./laravel_queue_worker.sh
   ```
5. Save and close the Cron job file, then restart the service if required by your shared hosting provider.
6. Test your setup by visiting a page on your website that uses queue processing. If everything is configured correctly, tasks should be executed asynchronously while the web server handles other requests simultaneously.

Conclusion
By following these steps, you can successfully run Laravel's 'queue:work' command on a shared hosting account without needing to install any additional software like Supervisor. With this setup in place, your Laravel project will continue processing queue tasks efficiently and seamlessly. Don't forget to leverage the power of Laravel Company resources for more useful tips and tutorials related to Laravel development and deployment.
