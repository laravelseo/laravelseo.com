---
title: "Use different PHP version CLI executable for one command"
description: "Title: Efficiently Use Different PHP Version CLI Executables for One Command Body: You have a Gentoo box with three PHP versions installed (never mind the..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Title: Efficiently Use Different PHP Version CLI Executables for One Command

Body: <p>You have a Gentoo box with three PHP versions installed (never mind the reasons). You want to install Laravel using composer, but it's throwing an error due to the compatibility issues:</p>

<ol>
<li><code>/usr/bin/php</code> -> <code>/usr/lib64/php5.4/bin/php</code></li>
<li><code>/usr/bin/php5.5</code> -> <code>/usr/lib64/php5.5/bin/php</code></li>
<li><code>/usr/bin/php5.6</code> -> <code>/usr/lib64/php5.4/bin/php</code></li>
</ol>

You attempt to install Laravel by executing a composer command with the default PHP interpreter (PHP 5.4), but it fails because Laravel requires a newer version than that, specifically PHP > 5.5.9. However, when you specify the correct path to your desired PHP executable, the installation process partially succeeds until it hits post-installation commands from <code>composer.json</code>.

To achieve your goal of having all Laravel installation commands executed through a particular PHP version, you can utilize environment variables. These variables allow you to customize how certain applications or scripts run, including the specific PHP interpreter they should use. When dealing with the Laravel framework and composer, you can set an appropriate environment variable for each command that may need to call a different PHP version (like <code>php</code>, <code>composer</code>, or <code>artisan</code>) while still maintaining its original functioning.

To set these variables:
1. Create a file named ".bashrc" in your home directory (i.e., /home/user/.bashrc).
2. Open this file with your preferred text editor and add the following lines:
   <pre><code>export PHP_COMPOSER_MEMORY=256M;
   export COMPOSER_PHP="php5.6";
   export ARTISAN_PHP="php5.6";</code></pre>
3. Save and close the file.

Here, we've set three environment variables:
- PHP_COMPOSER_MEMORY: Increase memory allocation for composer to avoid any possible issues caused by inadequate memory.
- COMPOSER_PHP: Define the PHP version to be used when running composite commands (i.e., <code>composer</code>) from our shell.
- ARTISAN_PHP: Set the desired PHP interpreter for Laravel's CLI utility (<code>artisan</code>) as well.

Now, when you execute a command to install Laravel through composer using <code>php5.6</code>, you should be all set without worrying about your Laravel installation being interrupted midway.

Remember that these environment variables will only apply for the current shell session and will not persist across multiple sessions or different user accounts. You may need to adjust them according to your specific requirements, but this method provides a simple way to invoke your desired PHP executable for each command without making any permanent changes to the underlying system.

By following these steps, you can effectively execute the Laravel installation process using your preferred PHP interpreter while still maintaining compatibility with your Laravel framework and other applications.
