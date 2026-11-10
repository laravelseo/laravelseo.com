---
title: "Install and configure supervisord on centos 7 to run Laravel queues permanently"
description: "Title: Install and Configure Supervisord on CentOS 7 for Permanent Laravel Queue Management Introduction: Queues play a crucial role in scalable software..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Title: Install and Configure Supervisord on CentOS 7 for Permanent Laravel Queue Management

Introduction:
Queues play a crucial role in scalable software applications; they help process tasks asynchronously without blocking the user interface. In Laravel, we use queues to defer processing time-consuming tasks such as sending emails or performing complex calculations. This allows your website to deliver faster responses and provide better user experience. In this comprehensive guide, I will walk you through installing Supervisord on CentOS 7 to ensure Laravel queue commands keep running even after the server reboots.

Step-by-step Process:
1. Update CentOS 7: Before proceeding, update your system packages using the command: `yum update`. This ensures you have the latest software and security patches.

2. Install Necessary Dependencies: To run Supervisord, we need to install its dependencies first. Execute these commands one by one:
   - `yum install gcc automake autoconf libtool make`
   - `yum groupinstall 'Development Tools'`

3. Install Supervisor: Use wget command to download and install supervisord:
   - `wget http://download.labs.suse.com/online/binaries/supervisorctl-3.3.8-1.el6.x86_64.rpm` (replace the version with the current one)
   - `yum install supervisorctl-3.3.8-1.el6.x86_64.rpm`
   - Verify installation using: `supervisord --version`

4. Configure Supervisord: After installation, we need to configure the supervisor.conf file to run Laravel queue commands.
   - Edit config file using nano: `nano /etc/supervisor/supervisord.conf`
   - Add this section at the end of the file:
      ```
      [program:laravel-queue]
        command=php artisan queue:work
        autostart=true
        autorestart=false
        user=www-data
        stdout_logfile=/var/run/supervisord/laravel.log
        redirect_stderr=true
      ```
   - Save and exit the file by pressing Ctrl + X and selecting 'Yes' to save changes.

5. Restart Supervisor: Run the following command to start supervisord and your Laravel queue commands:
   - `supervisorctl update`
   - Check if Laravel is running correctly using the command: `supervisorctl status laravel-queue`

6. Enable Auto Start on Server Reboot: To ensure Supervisor starts automatically on server reboot, run these commands:
   - `systemctl enable supervisord`
   - `systemctl start supervisord`
   - Verify the service is running after a restart using `systemctl status supervisord`.

7. Monitor Laravel Queue Status: You can monitor the queue status of your project using the command: `supervisorctl status laravel-queue`. This will display any errors or warnings that might occur while running the queue.

Conclusion:
Now you have successfully installed and configured Supervisord to run Laravel queues permanently even after server reboots. As a result, your application's background tasks will continue working without any interruptions. This ensures you can deliver high-quality real-time user experiences while maintaining optimal performance. Remember that keeping your systems up-to-date and well maintained is crucial for its efficient functioning. Happy coding!
