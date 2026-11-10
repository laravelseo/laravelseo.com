---
title: "PHPInfo / Valet - Two different PHP versions"
description: "Title: Solving PHP Version Conflict in Laravel, Valet, and macOS Configuration Introduction: Your Laravel development environment on your MacBook Air..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Solving PHP Version Conflict in Laravel, Valet, and macOS Configuration

Introduction:

Your Laravel development environment on your MacBook Air (Mojave) is an essential tool for working with your applications, and it's crucial to have a clear understanding of how to manage the PHP versions. In this blog post, we will explore how to solve the issue where `phpinfo()` shows one version while `php -v` displays another. We'll troubleshoot the given scenario using Laravel, Valet, and Homebrew on your MacBook Air.

Steps to Solve the Issue:

1. Check the installed PHP Versions: Firstly, find out which PHP versions are available in your Mac by running `sudo bash` in the Terminal. Then enter these commands one by one:
   ```bash
   brew info php@7.2
   brew info php@7.3
   ```

2. Unlink and Link PHP Versions Using Homebrew Cask: If your system doesn't have any PHP installed, you can use Homebrew Cask to install the required versions. Run these commands in the Terminal:
   ```bash
   brew cask install php@7.2
   brew cask unlink --force php@7.3
   ```

3. Set Up Valet with Different PHP Versions for Specific Sites: Create a `.env` file in your project's root directory and add the following lines to it:
   ```bash
   # PHP 7.2 for Laravel projects
   VALET_PHP_VER_LARAVEL=7.2
  
   # PHP 7.3 for specific sites (e.g., example.dev)
   VALET_PHP_VER_EXAMPLE=7.3

   # Check the php version for Laravel and example.dev
   php -v --ini=/usr/local/etc/php/7.2/php.ini | grep PHP
   php -v --ini=/usr/local/etc/php/7.3/php-fpm.d/www.conf | grep PHP
   ```

4. Restart the Nginx Service: To apply the changes, restart the Nginx service using `sudo brew services restart nginx`. Ensure that you have the latest version installed by running `brew update` and then `brew upgrade nginx`.

5. Configure Your Local Server to Use the Desired PHP Version for Specific Sites: To set up your Valet server with custom PHP versions, run these commands in Terminal:
   ```bash
   valet secure
   valet use laravel-project@7.2 --port 8001
   valet use example.dev@7.3 --port 8002
   ```

6. Test the PHP Versions: To verify that your configuration is working, visit `http://laravel-project:8001` and `http://example.dev:8002`. Use `php -v --ini=/path/to/php.ini | grep PHP` to check the current PHP version for each site.

Conclusion:

By following these steps, you can successfully manage different PHP versions on your MacBook Air using Laravel, Valet, and Homebrew. This approach allows you to tailor your development environment based on project requirements while maintaining a clear understanding of your PHP setup. If you need more assistance or have questions about this topic, don't hesitate to contact the Laravel Company for support.
