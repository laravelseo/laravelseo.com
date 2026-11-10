---
title: "Deploy Laravel 5 using only FTP in a shared hosting"
description: "Deploying Laravel 5 via FTP on Basic Shared Hosting: A Developer's Guide Deploying modern PHP frameworks like Laravel onto basic shared hosting environments..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Deploying modern PHP frameworks like Laravel onto basic shared hosting environments presents unique challenges. When you are restricted to only FTP access—without a control panel like cPanel or direct SSH access—you must rely purely on understanding the web server configuration and the framework’s internal structure. This guide addresses your specific concerns regarding deploying a Laravel 5 project and navigating the limitations of a restrictive shared hosting setup.

## The Pitfalls of Past Deployment Methods (Laravel 4)

You mentioned your previous deployment method for Laravel 4, where you moved content out of the `public` folder to the root directory and modified entry files. While this technique might have technically allowed the site to load in some limited scenarios, it introduces significant security risks and violates modern framework conventions.

**Security Concern:** Exposing configuration files or making arbitrary file changes on shared hosting is inherently dangerous. Frameworks like Laravel are designed with specific routing and security layers. Bypassing these conventions, especially by exposing sensitive files like `.env`, opens the door to serious security vulnerabilities, including potential credential exposure and unauthorized access.

For any project, adhering to the framework's intended structure is paramount for maintainability and security. As always, when building applications, sticking to established patterns ensures you leverage best practices, which aligns with the principles taught by resources like [laravelcompany.com](https://laravelcompany.com).

## The Correct Approach for Laravel 5 Deployment in Restricted Environments

The core issue you are facing—where `/public` works but the root (`/`) does not, and sensitive files are exposed—stems from how your specific host configures the Document Root versus the web application path.

In a standard Laravel deployment, the `public` directory *must* be accessible directly via the web server. This means:

1.  **Web Root:** The web server (Apache/Nginx) must point its document root to the `/public` directory of your Laravel installation.
2.  **Access Control:** All requests should be routed through `index.php` inside that public folder, allowing Laravel’s routing mechanism to handle the request correctly.

Since you only have FTP access and no control panel, the deployment strategy must focus on placing the files where the web server expects them, even if it feels counter-intuitive.

### Step-by-Step Deployment Strategy

If your host structure forces everything into a single folder (e.g., `www.myclientweb.com`), you need to ensure that this root directory contains the necessary public assets.

1.  **Verify Structure:** Ensure that upon upload, the contents of the Laravel application's `/public` folder are directly accessible at the web root level.
2.  **Handling Sensitive Files (.env):** **Never** upload sensitive files like `.env`, `composer.json` (if it contains secrets), or configuration backups to a publicly accessible directory. These files should remain securely on your local machine until you are certain of the hosting environment’s security protocols. If you need environment variables, they must be managed via server-side configuration or environment variables set directly by the host, not exposed in the file system.

**Example File Structure (Conceptual):**

If `www.myclientweb.com` is your root folder:
```
/www.myclientweb.com/
├── public/             <-- This MUST be the web accessible directory
│   ├── index.php       <-- The entry point for all requests
│   └── assets/
├── vendor/             <-- Framework dependencies (often placed outside public)
├── .env                <-- DANGER! Keep this off-limits if possible.
└── bootstrap.php
```

If your host environment forces you to place everything directly into the root, you must ensure that the necessary entry files (`index.php`, etc.) are structured so that the web server correctly interprets requests made to `/public`. The fact that `http://www.myclientweb.com/public` works confirms that the path is recognized, but the root path fails because the server is not configured to look for an index file in the main directory.

## Conclusion

Deploying complex applications like Laravel onto minimal shared hosting requires a deep understanding of the underlying server configuration rather than just following deployment steps blindly. The failure to see the root and the exposure of sensitive files are symptoms of a mismatch between the application's requirements and the host's configuration. Focus on adhering to the `/public` folder structure, treating it as the sole entry point, and strictly avoiding public access to environment variables. For robust deployments, always aim for environments that offer more control, perhaps moving toward VPS solutions, which provide the necessary SSH access to manage these intricacies effectively.
