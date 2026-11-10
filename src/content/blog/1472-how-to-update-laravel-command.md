---
title: "How to update Laravel command?"
description: "Title: Efficiently Update Your Laravel Command for the Latest Version Body: Updating your Laravel command is essential to keep up with the latest features..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Efficiently Update Your Laravel Command for the Latest Version

Body:

Updating your Laravel command is essential to keep up with the latest features and enhancements in the framework, especially when you're working on a project. This blog post will guide you through the process of updating your Laravel command while ensuring that it remains compatible with your existing workflows.

Firstly, let us examine why we need to update our Laravel command. When new versions bring forth useful changes and bug fixes, they can significantly impact both the security and efficiency of our applications. Keeping the Laravel framework updated ensures that you reap the benefits of these improvements.

Now, let's walk through how to install the latest Laravel version using your current command:

1. Assess your current installation:
   - Run the following command to check your installed Laravel versions:
     <pre><code>laravel --version</code></pre>
    The output should show both global and local versions. If they are different, take note of the path for each (e.g., /home/username/.composer/vendor/bin for global).

2. Update your composer:
   - Ensure you have the latest Composer version installed:
     <pre><code>curl -s https://getcomposer.org/installer | php</code></pre>
    This command will download and install the newest Composer if not present, or update to the latest version if it is already present.

3. Uninstall your old Laravel installer:
   - To remove the current Laravel installer (assuming you're using composer):
     <pre><code>composer global uninstall laravel/installer</code></pre>
    This will delete the previously installed Laravel command from the global path. You can also delete it manually if necessary.

4. Install the new Laravel version:
   - Update your composer with the latest Laravel version (e.g., 5.7) by running this command:
     <pre><code>composer create-project laravel/laravel app --prefer-dist</code></pre>
    This will install the specified Laravel version and create a new project directory. You can then use it to ensure your command works with the updated framework.

5. Configure your global command path:
   - Reinstall the Laravel installer using your updated composer:
     <pre><code>composer global require "laravel/installer"</code></pre>
    This will re-create the required files and update your global path to match your new installation. Be sure to check for any warnings or errors during this process.

6. Test your updated command:
   - To confirm that everything is working as intended, create a new project with the latest Laravel version using your installed command:
     <pre><code>laravel new new_project</code></pre>
    This will create a new project directory with Laravel 5.7, ensuring compatibility with your updated command.

Remember to always keep your command up-to-date to take advantage of the latest features and bug fixes in each Laravel version. In case of any issues or further clarifications, refer to the official Laravel documentation and community forums.

Conclusion:
Updating your Laravel command is essential to ensure compatibility with new framework versions, enhancements, and security updates. By following this comprehensive guide, you can achieve a well-functioning global Laravel command that matches your local version. Happy coding!
