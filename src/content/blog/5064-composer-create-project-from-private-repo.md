---
title: "composer create-project from private repo"
description: "Composer Create Project from Private Repositories: Bridging Git and Dependency Management As developers working with private codebases, managing dependencies..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

As developers working with private codebases, managing dependencies becomes a critical challenge. While public repositories like Packagist offer seamless dependency resolution for open-source packages, projects hosted on platforms like Bitbucket or GitHub require a different approach. The core question is: Can we adapt the familiar `composer create-project vendor/name path` command to pull a project directly from our private Git repository?

The short answer is yes, absolutely. While Composer's primary focus is on package repositories (like Packagist), it deeply integrates with Git, allowing us to treat Git repositories as valid sources for bootstrapping new projects. As senior developers, we often need these advanced techniques when dealing with proprietary codebases, which is a common requirement in enterprise settings, similar to the robust architecture seen in frameworks like those promoted by [Laravel](https://laravelcompany.com).

This post will walk you through the most effective and secure methods for using Composer to create a project directly from a private Bitbucket repository, leveraging your existing SSH key setup.

---

## Understanding the Challenge

The standard `composer create-project` command expects a package name from a configured repository (like Packagist). When dealing with a private repository, we are not looking for a published *package*, but rather the source code of an entire application or library residing in Git. Therefore, we must bypass the standard package lookup and instruct Composer to use the Git protocol directly as the source.

The key prerequisite here is ensuring that the machine running Composer has the necessary SSH access credentials (your private key) authorized to read the specific repository on Bitbucket.

## Method 1: Cloning via Git and Installing Dependencies (The Recommended Approach)

The most robust way to handle this scenario is to separate the project cloning from the dependency installation, which offers better control over permissions and error handling.

### Step 1: Clone the Private Repository

First, use Git to pull your private project onto your local machine. Ensure your SSH key setup allows this operation without requiring repeated password prompts.

```bash
# Navigate to where you want the project to live
cd ~/projects

# Clone the private repository using SSH
git clone git@bitbucket.org:your-workspace/your-private-repo.git my-new-project
```

### Step 2: Initialize Composer and Install Dependencies

Once the source code is local, navigate into that directory and initialize Composer. This ensures that all dependencies are installed relative to the cloned project structure.

```bash
cd my-new-project

# Create the composer.json file if it doesn't exist (if you are creating a fresh project)
composer init

# Install the project's specific dependencies defined in its composer.json
composer install
```

This method is highly secure because Git handles the authentication via your SSH keys, and Composer simply reads the files already present in the cloned directory to resolve the necessary vendor packages.

## Method 2: Using Git as a Custom Repository (Advanced)

For scenarios where you specifically want to execute the full `create-project` command without manually cloning first, you can configure Composer to recognize your private repository as a source using a custom repository definition file (`composer.json`). This method is slightly more complex but achieves the goal of mimicking the standard command structure.

You would define a custom repository pointing to your private Git URL:

```json
{
    "repositories": [
        {
            "type": "vcs",
            "url": "git@bitbucket.org:your-workspace/your-private-repo.git"
        }
    ],
    "require": {
        "php": ">=8.1"
    }
}
```

Then, you can attempt the standard command:

```bash
composer create-project vendor/name path --repository-dir ./my-new-project
```

**Note:** While conceptually appealing, this method often requires careful debugging regarding how Composer interacts with VCS sources versus package source requirements. For most internal project bootstrapping, Method 1 remains the clearer and more manageable workflow for ensuring correct permissions and file integrity.

## Conclusion

When moving beyond public package management to private repository integration, think of Git as your primary source of truth, and Composer as the engine that manages the resulting dependencies. By using the direct `git clone` followed by `composer install`, you ensure robust security through SSH keys while achieving a clean, reproducible dependency setup. This approach provides the necessary control for managing proprietary codebases seamlessly within your development workflow, supporting the kind of focused architectural work valued in modern PHP ecosystems like those championed by [Laravel](https://laravelcompany.com).
