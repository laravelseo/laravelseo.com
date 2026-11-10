---
title: "How to hide config files from direct access?"
description: "How to Hide Config Files from Direct Access: Securing Your Laravel Application As a senior developer deploying applications, one of the most immediate..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a senior developer deploying applications, one of the most immediate security concerns we face is ensuring that sensitive configuration files, environment variables, and source code are not directly accessible via a URL. The scenario you described—where files like `composer.json` are exposed—is a classic symptom of a misconfigured web server permission setup rather than a flaw in the Laravel application code itself.

Understanding how to prevent this requires looking beyond the PHP code and diving into the infrastructure layer where the web server (Apache, Nginx) operates.

## The Root Cause: Web Server Misconfiguration

When you deploy a Laravel application, files are served based on the permissions granted to the user account running the web server process (e.g., `www-data` or `apache`). If these permissions are too permissive, the web server can read and serve any file in the public directory, regardless of whether that file is intended for public viewing.

The solution is not usually something you fix within a single Laravel controller; it’s an infrastructure hardening step.

## Solution 1: Implementing Web Server Restrictions (The Primary Defense)

The most effective way to prevent direct access is by configuring your web server to explicitly deny access to specific file types or directories. This acts as a crucial layer of defense, blocking access even if a file name is guessed.

### For Apache Users (`.htaccess`)

If you are using Apache, you can use an `.htaccess` file within the public directory to restrict access. While less powerful than server-level configurations, it’s a good first step:

```apache
# .htaccess file in your public directory
<FilesMatch "\.(json|env|yml|ini)$">
    Require all denied
</FilesMatch>
```

This rule tells Apache to deny access to any file ending with `.json`, `.env`, `.yml`, or `.ini`.

### For Nginx Users (Server Blocks)

For Nginx, the control is typically managed within your server block configuration file. You can use `location` blocks to explicitly deny requests for sensitive files:

```nginx
server {
    # ... other configurations
    location ~ /\. {
        deny all; # Deny access to all files starting with a dot (hidden files)
    }
    location /composer.json {
        deny all;
    }
    # ... other locations
}
```

By applying these rules at the web server level, you ensure that the file system permissions are overridden by explicit network denial policies. This defense-in-depth approach is essential for any robust deployment, aligning with the security principles emphasized by modern frameworks like Laravel.

## Solution 2: Enforcing Strict File Permissions (Defense in Depth)

Beyond server configuration, you must also set strict file permissions on your entire public directory. By default, files and folders often have permissions that allow group or world readability. You should ensure that web server processes can only read what they absolutely need, and nothing more.

Use the `chmod` command to set highly restrictive permissions:

```bash
# Set directories to 755 (readable/executable by owner, readable by group/others)
find public -type d -exec chmod 755 {} \;

# Set files to 644 (readable by owner and group, readable by others)
find public -type f -exec chmod 644 {} \;
```

This ensures that while the web server can serve files correctly, any attempt to read configuration files outside of the intended routes is blocked by OS-level security controls. Never store sensitive environment variables directly in plain text within your publicly accessible file system if possible; use Laravel's `.env` file securely and ensure it is excluded from version control using `.gitignore`.

## Conclusion

Hiding config files from direct URL access is fundamentally an infrastructure security task, not just a coding task. By combining strict web server rules (Apache/Nginx configuration) with rigorous file system permissions (`chmod`), you create a robust barrier against accidental exposure. Always prioritize these infrastructure layers when deploying applications, ensuring your Laravel application remains secure and professional.
