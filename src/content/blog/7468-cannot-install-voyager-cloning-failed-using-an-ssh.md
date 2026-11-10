---
title: "Cannot install Voyager - Cloning failed using an ssh key for authentication, enter your GitHub credentials to access private repos"
description: "Decoding the Dependency Nightmare: Solving Composer Installation Failures with Private GitHub Repos As senior developers, we often find ourselves wrestling..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As senior developers, we often find ourselves wrestling with dependency management systems. Tools like Composer, while incredibly powerful for managing PHP ecosystems, can sometimes throw cryptic errors when interacting with external version control systems like GitHub. The issue you are facing—failing to install a package because it cannot clone a private repository using SSH keys—is a very common hurdle when working with open-source projects that require authentication.

This post will break down exactly why this happens and provide a comprehensive, practical solution for installing dependencies like `tcg/voyager` successfully, ensuring your development workflow remains smooth and efficient.

## Understanding the Git and Composer Authentication Conflict

The error message you received stems from how Composer attempts to fetch private dependencies hosted on GitHub. When Composer tries to clone a repository (which is what happens when installing packages that aren't publicly available or require specific permissions), it relies on underlying Git configuration, usually involving SSH keys or HTTPS credentials.

When the system fails with an authentication prompt, it means the mechanism Composer is using cannot securely authenticate the request to GitHub for that specific private repository.

**The core conflict here is between:**
1.  **SSH Authentication:** Relies on public/private key pairs for secure, non-interactive access. This requires setting up SSH keys correctly on your local machine and ensuring they are properly configured with GitHub permissions.
2.  **HTTPS Authentication (with Tokens):** Relies on username/password or a Personal Access Token (PAT) passed directly in the URL. This is often simpler for automated tools like Composer, especially when dealing with environments that don't easily support complex SSH setup.

The update you noted—suggesting using a personal token instead of a password—is the key insight here. For modern development workflows, especially when running commands via CLI tools like Composer, using a Personal Access Token over HTTPS is generally the most reliable path to success.

## The Solution: Using Personal Access Tokens (PATs)

The recommended way to resolve this issue, as hinted by the error message itself, is to use a GitHub Personal Access Token (PAT) instead of relying solely on SSH key authentication for Composer operations. This method provides Composer with a secure, revocable credential that it can use to access private repositories without requiring you to expose your actual SSH keys directly into the command line environment repeatedly.

Here is the step-by-step process to fix your installation:

### Step 1: Generate a GitHub Personal Access Token

1.  Navigate to your GitHub settings page.
2.  Go to **Settings** $\rightarrow$ **Developer settings** $\rightarrow$ **Personal access tokens** $\rightarrow$ **Tokens (classic)** or **Fine-grained tokens** (depending on your preference, but classic tokens are often simpler for Composer integration).
3.  Generate a new token. Ensure the token has the necessary `repo` scope checked to allow access to private repositories.
4.  **Crucially, copy this token immediately.** You will not be able to view it again once you navigate away.

### Step 2: Configure Composer Credentials (The Best Practice)

Instead of relying on Composer prompting you interactively, the most robust way is to configure Git credentials so Composer can use the PAT automatically when cloning private repos via HTTPS.

You can set up Git credential helpers, or in many cases, simply ensure your system recognizes this token for Git operations. If the direct `composer require` command still prompts you, you might need to adjust your global Git configuration, although modern Composer versions often handle this flow better once the PAT is available.

For many users, the simplest functional fix when dealing with specific package cloning issues is to ensure that any operation involving private repositories defaults to HTTPS authentication secured by a PAT. When installing dependencies for frameworks like Laravel (which heavily relies on robust dependency management), ensuring these foundational steps are correct prevents these frustrating installation dead-ends. As developers building applications on platforms like those supported by the [Laravel Company](https://laravelcompany.com) ecosystem, mastering these CLI interactions is essential.

## Conclusion

The failure to install Voyager was not a bug in the package itself, but rather an authentication hurdle between Composer and GitHub. By understanding the difference between SSH key-based and token-based authentication for Git operations, we can bypass this roadblock. Using a Personal Access Token as your secure credential allows automated tools like Composer to access private dependencies smoothly and securely.

Always favor HTTPS with a properly scoped PAT when dealing with dependency cloning in CI/CD pipelines or local setups where direct SSH key management can be complex. This approach ensures that your development environment remains stable, regardless of the complexity of the underlying repository permissions. Happy coding!
