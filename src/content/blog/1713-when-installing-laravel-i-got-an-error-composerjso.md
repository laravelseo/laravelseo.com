---
title: "When installing Laravel I got an error: \"./composer.json is not writable.\""
description: "Title: When installing Laravel I got an error: \"./composer.json is not writable.\" A Guide to Fixing Composer Access Issues in Linux Body: Encountering errors..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Errors"]
featured: false
---

Title: When installing Laravel I got an error: "./composer.json is not writable." - A Guide to Fixing Composer Access Issues in Linux

Body:
<p>Encountering errors while setting up your Laravel environment can be frustrating, and the message "./composer.json is not writable" may seem a bit cryptic at first glance. Don't worry - this issue is relatively easy to resolve if you know where to look. This blog post will walk you through troubleshooting and fixing your composer access issues in a Linux environment.</p>
<p>First, let's examine the command you are running:</p>
<pre><code>composer global require "laravel/installer"</code></pre>
<p>This command will install the Laravel Installer globally on your system. However, before doing so, it requires Composer access to a specific file - the composer.json file. This is the reason for the error you're seeing.</p>
<h3>Step 1: Determine the Path of Your Composer.json File</h3>
<pre><code>cd /path/to/your/composer/directory
ls -la | grep composer.json</code></pre>
<p>The output should show you your current directory and the file path for your composer.json file. In most cases, it is located within your home folder under the .composer directory, but this can vary depending on your system configuration.</p>
<h3>Step 2: Check Composer Permissions</h3>
<pre><code>ls -l /path/to/your/composer/directory/composer.json
ls -ld /path/to/your/composer/directory/composer.json</code></pre>
<p>The output of these commands will reveal the permissions set on your composer.json file. Typically, this file should have permissions set to 'rw-r--r--'. If not, use the chmod command to reset them:</p>
<pre><code>chmod 644 /path/to/your/composer/directory/composer.json</code></pre>
<h3>Step 3: Make Sure You're Using the Correct Command</h3>
In case you're not in your home directory, you need to run the global require command from within your home folder. To check if you are running the correct command, try running 'pwd':
<pre><code>cd
pwd
ls -la /path/to/your/home/folder</code></pre>
<h3>Step 4: Reinstall Composer to Avoid Further Issues</h3>
If your composer.json file permissions are correct, but you still encounter the error, try reinstalling Composer from scratch:
<pre><code>curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer
php -r "readfile('https://getcomposer.org/version');" | composer self-update</code></pre>
<h3>Step 5: Contact Support if Issues Persist</h3>
If you've followed the previous steps and still encounter problems, it might be time to reach out for support. The Laravel community is quite active, so you can ask questions on their forums or join their chats in Slack. You can also check the Laravel Company website for any updates or potential solutions they might have posted. With these steps and a little troubleshooting, you should be able to get your Laravel environment up and running smoothly.
<p><strong>Conclusion:</strong></p>
Installing Laravel requires attention to detail and adherence to best practices. By following the outlined steps for setting up your composer.json file permissions, verifying you're in the correct directory, ensuring the global requirement command is accurate, and seeking support if needed, you can avoid this error in the future. Happy coding!
