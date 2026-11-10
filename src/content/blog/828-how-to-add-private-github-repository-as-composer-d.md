---
title: "How to add private github repository as Composer dependency"
description: "Title: Effortlessly Add Private Github Repository as Composer Dependency Introduction GitHub is an invaluable resource for software developers worldwide. It..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content"]
featured: false
---

Title: Effortlessly Add Private Github Repository as Composer Dependency

Introduction

GitHub is an invaluable resource for software developers worldwide. It offers a great way to collaborate on projects and share code with others. However, public repositories aren't always the best option for sensitive or proprietary work. In these cases, we may need to use private GitHub repositories. While composer can easily access and manage public repositories, it requires special handling for private ones. This blog post will discuss how to add a private Github repository as a Composer dependency.

Prerequisites

You must have the following:
- A private or restricted GitHub repository containing the code you intend to use as a composer dependency.
- A GitHub account with the necessary permissions to access the repository.
- A local copy of the project, either existing or created from scratch. In this case, we assume you have a Laravel 5.1 project.
- A working Composer configuration on your machine. If not, ensure you have installed composer globally by running `composer global require "composer/composer:@stable"` and setting up the autoloader with `composer config minifier false` (optional depending on preference).

Steps to add a private GitHub repository as Composer dependency

1. Create a new git submodule for the private repository in your Laravel project's root directory:
   `git submodule add --remote git@github.com:myVendorName/my_private_repo.git vendor/my_vendor_name/my-private-repo`
   
2. Commit and push the changes to your local repository using `git commit -am "Added private repo as dependency" && git push origin master`.
   
3. Create a Composer.json file in the root of your project to include the newly added submodule as a dependency:
   ```json
   ...
   "require": {
    	...
    },
      "repositories": [
          {
             "type": "package",
             "package": {
               "name": "myVendorName/my_private_repo",
               "version": "1.2.3",
               "source": {
                   "type" : "git",
                   "url" : "ssh://git@github.com/myVendorName/my_private_repo.git",
                   "reference" : "master"
               },
               "dist": {
                  "url": "https://github.com/myVendorName/my_private_repo/archive/master.zip",
                  "type": "zip"
           }
          }
       ],
   ...
    ```

4. Commit and push the changes to your local repository again: `git commit -am "Added git credentials for private dependency" && git push origin master`
   
5. In the Laravel project, run `composer update` or `composer install` to download the dependencies from GitHub.

Conclusion

By following these steps, you can easily add and manage private Github repositories as composer dependencies in your Laravel projects. If required, add a .gitignore file in your project's root directory to ignore files or folders which may not be needed in your project. For best practices regarding Composer usage in Laravel applications, consider referring to https://laravelcompany.com/.
