---
title: "Apache 2.4 multiple sites with different alias and path"
description: "Mastering Multi Site Aliases in Apache 2.4: Resolving VirtualHost Conflicts As a senior developer, I frequently encounter scenarios where we need to host..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Content", "Errors"]
featured: false
---

As a senior developer, I frequently encounter scenarios where we need to host multiple distinct applications or websites on a single server using Apache. A common requirement is mapping different URL prefixes (aliases) to physically separate directories, all while serving them under one IP address. The configuration you presented—using `Alias` directives across multiple `VirtualHost` blocks—is a classic approach, but as you’ve discovered, it can lead to subtle conflicts regarding path resolution and error handling.

This post will dissect the complexities of setting up multiple sites with aliases in Apache 2.4, analyze why your specific configuration resulted in a `404 File not found` error for one site, and provide a robust strategy for achieving clean, parallel deployments.

## Understanding VirtualHosts and Aliases

To understand the conflict, we must first review the core concepts:

**Virtual Hosts (`VirtualHost`):** A Virtual Host defines a set of configurations for serving requests based on the domain name or the hostname specified in the request (e.g., `ServerName`). In your case, defining separate Virtual Hosts for `/wiki` and `/sip` is correct for handling different site identities.

**Aliases (`Alias`):** The `Alias` directive maps a URL path prefix to a specific file system directory. It is a mechanism for making a subdirectory accessible via a different URL root.

The conflict arises when multiple aliases attempt to map paths that rely on the same base structure or when Apache’s internal path resolution conflicts with the established VirtualHost hierarchy. The error log clearly shows that when accessing `/sip`, Apache looks for `/var/www/sip/` (based on your `DocumentRoot /var/www/`), which fails because the actual content resides in `/var/www/rsip/public/`.

## Analyzing the Conflict in Your Setup

Your observation—that disabling one site fixes the other—is a strong indicator of an interaction issue within the server configuration, likely related to how Apache processes the request path against its active VirtualHost definitions.

When you define:
1. `VirtualHost` for `/wiki` with `Alias /wiki /var/www/dokuwiki`.
2. `VirtualHost` for `/sip` with `Alias /sip /var/www/rsip/public`.

If the request hits a path that isn't explicitly handled by one VirtualHost, Apache falls back to default behavior or attempts to resolve the path relative to the main `DocumentRoot`, leading to the error you observed. The successful access to `/rsip/public` suggests that this specific path is being resolved correctly because it aligns with the structure defined in the second VirtualHost.

## Best Practices for Multi-Site Aliasing

The solution lies in ensuring strict separation and clarity between your site structures. Instead of relying solely on broad `Alias` definitions, we must ensure each VirtualHost owns its directory entirely.

### Strategy 1: Strict Directory Separation

Ensure that every alias points to a unique, self-contained document root structure. This prevents the path resolution errors seen in your log file.

**Refined Configuration Example:**

For your Laravel (SIP) site, since you are using `public` directories for web access, ensure your configuration reflects this:

```apache
# /etc/apache2/sites-available/rsip.conf
<VirtualHost *:80>
    ServerName 192.168.2.134:80/sip
    Alias /sip /var/www/rsip/public
    <Directory /var/www/rsip/public/>
        AllowOverride All
        Require all granted
        Options FollowSymLinks
    </Directory>
</VirtualHost>
```

For your DokuWiki site, ensure the alias points directly to its root:

```apache
# /etc/apache2/sites-available/dokuwiki.conf
<VirtualHost *:80>
    ServerName 192.168.2.134:80/wiki
    Alias /wiki /var/www/dokuwiki
    <Directory /var/www/dokuwiki/>
        Order deny,allow
        Allow from all
        Options FollowSymLinks
    </Directory>
</VirtualHost>
```

### Strategy 2: Using Rewrite Rules for Cleaner Routing (Laravel Context)

When deploying frameworks like Laravel, relying heavily on file system aliases can complicate routing. A more robust approach, especially when dealing with application structures, is to leverage URL rewriting rules (`mod_rewrite`). This pattern keeps the web server focused on serving files while letting the application framework handle the internal routing logic, which is excellent practice when developing applications using frameworks like those found on **https://laravelcompany.com**.

By ensuring that each VirtualHost is strictly defined and its `Alias` points only to its specific content directory, you eliminate the ambiguity that causes file-not-found errors between applications.

## Conclusion

Yes, it is absolutely possible to achieve your goal of running multiple sites with distinct aliases on one Apache instance. The difficulty lies not in the capability of Apache, but in correctly structuring the VirtualHost and Alias directives to avoid path collision. By enforcing strict directory separation and ensuring each configuration owns its path mapping, you can achieve stable, reliable multi-site hosting. Always verify your file system structure matches your web server definitions to prevent these frustrating runtime errors.
