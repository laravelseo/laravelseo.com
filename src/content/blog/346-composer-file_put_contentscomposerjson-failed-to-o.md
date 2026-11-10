---
title: "Composer: file_put_contents(./composer.json): failed to open stream: Permission denied"
description: "Title: Unraveling Composer Errors: Resolving \"file put contents(./composer.json): failed to open stream: Permission denied\" Issue Introduction..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

Title: Unraveling Composer Errors: Resolving "file_put_contents(./composer.json): failed to open stream: Permission denied" Issue

## Introduction
Installing new packages using Composer, the dependency manager for PHP projects, can come with its challenges. One of these common errors is the "Permission Denied" error when trying to create or update composer.json file. In this blog post, we will discuss the root cause and suitable solutions to fix such issues.

## Explanation
Composer uses a home directory as a working space for creating the composer.json file. This is because it follows the philosophy of not running Composer as Root or Super User. However, if you're logged in as a normal user and receive this error when adding a package like Prestissimo, it usually means that your current working directory does not have write permissions.

## Solution 1: Change the Working Directory
The best practice is to change the working directory that Composer uses for creating composer.json files. You can do this by setting the home folder's permissions appropriately, as follows:

1. Check your current working directory (e.g., `pwd` in Linux) and ensure it doesn't contain a sensitive file or directory.
2. If necessary, change to the desired working area using `cd <new_working_dir>`.
3. Modify the home folder's permissions using `chown -R username:group /home/yourusername` (replace 'username' with your actual user name).
4. Set read and write access for the user: `chmod g+w,o+w /home/yourusername`
5. Confirm the changes by checking the permissions for the folder: `ls -ldh /home/yourusername`. You should see a different owner and group but with rwxrwxrwx (777) or similar permissions.
6. Test the new working directory using Composer and installing the package, this time without error.

## Solution 2: Using Another Directory as Working Space
Another option is to use a different location than your home folder for composer operations. It could be any suitable directory on your system that doesn't cause permission issues. Follow these steps:

1. Create a dedicated working directory outside the home folder (e.g., `mkdir /tmp/composer_work`).
2. Change to this new working directory using `cd /tmp/composer_work`.
3. Configure your Composer global settings with the new working directory as the base path:
   a) Create or update the .composer directory in your home folder: `mkdir -p ~/.composer/`
   b) Edit the composer-settings.json file (create if not exists) inside the .composer directory with the following content:
      ```
      {
        "config": {
          "prefer-local": true,
          "paths": {
            "bin-dir": "./vendor/bin"
          },
          "extra": {
            "installer-paths": {
              "root/{$vendor}/{$name}/*",
              "global/{$vendor}/{$name}/bin/{$name}"
            }
          },
        },
        "options": {
          "installers.symlink-strategy": null,
          "installers.auto-scripts": false
        }
      ```
4. Update your Composer global settings using `composer config -g set composerconfig.path-map.vendor-dir /tmp/composer_work/vendor`.
5. Install and use Composer as usual, now with the new working directory.

## Conclusion
The "Permission Denied" error when creating or updating composer.json files can be a challenge to resolve. By following one of these solutions or exploring alternative approaches, you are better equipped to handle such issues in your future projects. Remember that maintaining permission controls and using well-established best practices will help prevent various problems like this from arising. Always aim for security while enhancing your development workflow.
