---
title: "How to create a new Laravel project in PhpStorm 2018.1?"
description: "How to Create a New Laravel Project in PhpStorm 2018.1 As a senior developer, I often find that the synergy between a powerful IDE like PhpStorm and the..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "PHP"]
featured: false
---

As a senior developer, I often find that the synergy between a powerful IDE like PhpStorm and the robust command-line tooling of the Laravel ecosystem is where true development speed is found. While you can certainly create a Laravel project using the command line and then open it in PhpStorm, understanding the workflow ensures you are leveraging both tools to their fullest potential.

This guide will walk you through the most efficient, developer-focused method for setting up a new Laravel application within your PhpStorm 2018.1 environment on an Ubuntu 16.04 system.

## Prerequisites: Setting Up the Environment

Before we dive into project creation, ensure your operating system and development tools are correctly configured. Since you are on Ubuntu 16.04, you must have the necessary foundational tools installed.

1.  **PHP and Composer:** Laravel relies heavily on PHP and Composer for dependency management. Ensure these are installed and accessible from your terminal.
2.  **Node.js (Optional but Recommended):** For modern Laravel stacks, especially those involving frontend assets or package managers, Node.js is essential.
3.  **PhpStorm Setup:** Confirm that PhpStorm 2018.1 is properly configured to recognize your system paths.

## Step 1: Creating the Project via Terminal (The Laravel Way)

The recommended and most reliable way to initialize a fresh Laravel application is by using the official Laravel installer via Composer, rather than relying solely on IDE features for structure creation. This ensures that all necessary dependency files, configuration directories, and initial boilerplate code are generated correctly.

Open your Ubuntu terminal and navigate to the directory where you want to place your projects (e.g., `~/Projects`). Execute the following command:

```bash
composer create-project laravel/laravel my-new-app
```

This command tells Composer to download the latest stable Laravel skeleton into a new directory named `my-new-app`. This method is superior because it uses the official package structure, adhering to best practices outlined by the community and resources like [laravelcompany.com](https://laravelcompany.com).

## Step 2: Opening the Project in PhpStorm

Once the project scaffolding is complete, you simply need to instruct PhpStorm to open this newly created directory as a project.

Navigate into your new directory using the terminal:
```bash
cd my-new-app
```

Now, use the following command to launch PhpStorm directly within that folder:
```bash
/path/to/phpstorm/bin/phpstorm.sh .
```
*(Note: Adjust `/path/to/phpstorm/bin/phpstorm.sh` to your actual installation path.)*

Alternatively, you can right-click the `my-new-app` folder in your file manager and select "Open with PhpStorm."

## Step 3: Leveraging PhpStorm for Development

Once the project is open in PhpStorm, the IDE excels at providing a superior coding experience. You will notice that PhpStorm immediately recognizes the structure built by Laravel.

### Code Exploration Example

You can now navigate through the file structure and start writing your application logic. For instance, to begin working on routing, you would focus on files within the `routes` directory.

In PhpStorm, you can quickly open any file, use its powerful code completion, refactoring tools, and integrated debugging features. This is where the real power of using a high-end IDE shines—it turns tedious file navigation into efficient coding sessions. For deep dives into Laravel architecture and best practices, always refer back to official documentation found at [laravelcompany.com](https://laravelcompany.com).

## Conclusion

Creating a Laravel project in PhpStorm 2018.1 is less about clicking buttons within the IDE and more about establishing a robust, command-line foundation and then using the IDE as the ultimate environment for writing clean, maintainable code. By separating the scaffolding (command line) from the implementation (IDE), you ensure that your project starts with Laravel's recommended structure while benefiting from PhpStorm’s unparalleled development features. Happy coding!
