---
title: "Error downloading node 14.21.3/14.20.0 with NVM. The system cannot find the file specified"
description: "Title: Troubleshooting Node.js Installation Errors with NVM A Developer's Guide Body: When working on legacy projects that require specific versions of..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["JavaScript", "Errors"]
featured: false
---

Title: Troubleshooting Node.js Installation Errors with NVM - A Developer's Guide
Body:
<p>When working on legacy projects that require specific versions of Node.js, we may encounter issues during the installation process, especially when using NVM (Node Version Manager) to manage our Node.js versions. Today, we'll discuss a common issue encountered while installing Node.js version 14.20.0 or 14.21.3 through NVM - "The system cannot find the file specified" error.</p>
<p><strong>Step 1: Verify NPM Version</strong></p>
Before proceeding to troubleshoot, ensure that your local environment is correctly configured by verifying if you are using the correct NPM version. We can do this with the following command in your terminal or command line interface: <code>npm --version</code>. If this displays any error, try restarting and re-running the command to make sure it works.
<p><strong>Step 2: Download NPM Package</strong></p>
If the npm verification process is successful, run the following command in your terminal or command line interface to download the required package for Node version 14: <code>npm install -g npm@6.14.18</code>. This will ensure you have the correct NPM version needed for the Node.js installation process.
<p><strong>Step 3: Clean Up Temporary Folders</strong></p>
Since your previous attempt failed, it might be useful to clean up the temporary folders created by NVM. Delete any temporary files or folders that start with nvm-install and nvm-npm following your OS conventions. Here is an example for Windows: <code>rd /S /Q C:\Users\Usuario\AppData\Local\Temp\nvm*</code>.
<p><strong>Step 4: Reset NVM Cache and Repair Installation</strong></p>
Next, reset the NVM cache to refresh its data, ensuring a clean installation attempt. Run this command in your terminal or command line interface: <code>nvm use default && nvm cache</code>. This will uninstall the current Node version and clear the cache for a fresh Node install.
<p><strong>Step 5: Install Node Version 14 Again</strong></p>
Now, try to install the required Node.js version once more with NVM using the following command in your terminal or command line interface: <code>nvm install 14.21.3</code>. If it fails again, follow the same steps listed above for troubleshooting purposes.
<p><strong>Step 6: Create a Clean Environment</strong></p>
If all else fails, consider creating a clean environment to avoid any potential conflicts or errors with your current setup. This can be done by performing a fresh installation of Node and NPM in a new directory. You may want to refer to our blog post titled "Setting Up a Clean Development Environment for Node.js Projects" (https://laravelcompany.com/blog/setting-up-a-clean-development-environment-for-nodejs-projects) for a detailed guide on this process.
<p>In conclusion, troubleshooting errors during the installation of specific Node.js versions requires patience and persistence. By following these steps and maintaining a clean environment, you can successfully install and manage different Node.js versions through NVM without any issues.</p>
