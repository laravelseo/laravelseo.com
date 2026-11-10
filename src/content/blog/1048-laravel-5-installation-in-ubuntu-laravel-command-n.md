---
title: "Laravel 5 Installation in Ubuntu: laravel command not found"
description: "Title: Laravel 5 Installation in Ubuntu: laravel Command Not Found Issue Solved Introduction: Laravel is an open source PHP framework that enables developers..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "JavaScript", "PHP"]
featured: false
---

Title: Laravel 5 Installation in Ubuntu: laravel Command Not Found Issue Solved

Introduction: Laravel is an open-source PHP framework that enables developers to create web applications more efficiently. Installing Laravel on your Ubuntu system should be a seamless process, but errors and problems can arise. In this blog post, we will discuss one of the common issues faced while installing Laravel 5 in Ubuntu: "laravel command not found" issue. We will also provide solutions that will help you efficiently resolve it.

Problem Breakdown: When installing Laravel 5 on your Ubuntu system, and if you're getting the error stating "laravel: command not found," it is likely due to an incorrect installation of the Composer global require for Laravel/installer package. It also may be caused by other installation missteps or a faulty configuration setup.

Correcting the Installation Steps: To fix this issue, follow these steps:

1. Ensure that your system has all necessary components installed and configured correctly. You will need PHP, Composer, Git, Node.js, and npm (Node Package Manager) to install Laravel 5 on Ubuntu.

2. Properly initialize the system path. Before attempting any further installation steps, make sure that your user's PATH environment variable is configured correctly to include the Composer install folder. You can do this by running:
   <code>export PATH="$HOME/.composer/vendor/bin:$PATH"</code>

3. Run the global require command: Open your terminal and run the following command to install Laravel globally. This will create a "laravel" executable file in your system's bin folder.
   <code>composer global require "laravel/installer=~1.1"</code>

4. Test the installed "laravel" command: Now, you can test if the installation was successful by using the laravel new command to create a new project called 'blog'. Run this command in your terminal:
   <code>laravel new blog</code>

5. Fix common issues: In case of any errors that still prevent Laravel from working, such as PHP-specific issues or Composer misconfiguration, make sure you address them accordingly. Be thorough with research and follow a proper installation procedure.

6. Reinstall Laravel: Sometimes, rerunning the "composer global require" command might solve the issue, especially if there was a configuration error earlier in the installation process.

Conclusion: The "laravel: command not found" issue is commonly encountered during the installation of Laravel 5 on Ubuntu systems. By following the guidance and troubleshooting steps outlined above, you should be able to resolve this problem and install Laravel successfully. Always remember to double-check your system's environment variables, configuration files, and installation processes for errors that might prevent Laravel from functioning as expected.

For more detailed information on Laravel installation and usage, visit our comprehensive tutorials at https://laravelcompany.com.
