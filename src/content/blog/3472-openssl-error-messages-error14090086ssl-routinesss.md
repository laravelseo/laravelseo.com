---
title: "OpenSSL Error messages: error:14090086:SSL routines:SSL3_GET_SERVER_CERTIFICATE:certificate verify failed Failed to enable crypto"
description: "Decoding the Dreaded SSL Error in Composer: Fixing error:14090086 on macOS As developers, we spend a significant amount of time wrestling with..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Errors"]
featured: false
---

As developers, we spend a significant amount of time wrestling with dependencies, and sometimes, the biggest hurdle isn't the code itself—it’s the infrastructure. One scenario that plagues many users, especially those setting up development environments on older systems like OS X Yosemite, is dealing with SSL/TLS certificate verification failures during package downloads.

If you are running into cryptic errors like `error:14090086:SSL routines:SSL3_GET_SERVER_CERTIFICATE:certificate verify failed` when using Composer to install Laravel or other dependencies, it signals a problem with how your operating system or the underlying OpenSSL libraries are handling secure HTTPS connections.

This post will dive deep into why this error occurs and provide concrete, developer-grade solutions to ensure Composer can communicate reliably with repositories like Packagist and GitHub.

## Understanding the Core Problem: Certificate Verification Failure

The error message you are seeing—`certificate verify failed`—means that the client (in this case, Composer, which relies on OpenSSL) was unable to successfully verify the authenticity of the server's SSL certificate. In simpler terms, your system does not trust the certificate presented by the remote server.

This usually boils down to one of three issues:
1. **Outdated Root Certificates:** The list of trusted Certificate Authorities (CAs) on your system is incomplete or outdated.
2. **Outdated OpenSSL Libraries:** The version of OpenSSL installed on your OS or within your environment might be too old to handle modern certificate chains properly.
3. **System Configuration Issues:** Network proxies, firewalls, or specific security settings are interfering with the handshake process.

When you run `composer diagnose`, it exposes this failure because Composer cannot establish a secure channel to download necessary files. This is particularly frustrating when trying to start a project, such as setting up a new Laravel application from the command line.

## Practical Solutions for Fixing SSL Errors

Since you mentioned being new to the command line, we will focus on system-level solutions first, as these are the most robust fixes for certificate issues.

### Solution 1: Update System Certificates and Packages

The most common fix involves ensuring your operating system has the latest root certificates installed. Since you are on macOS, this usually involves running standard system update commands.

Execute these commands in your Terminal to ensure all system packages are up-to-date:

```bash
sudo softwareupdate -i -a
sudo apt-get update && sudo apt-get upgrade  # If using a Debian/Ubuntu based environment (or similar package manager)
```

After updating, try running `composer diagnose` again. Often, simply refreshing the system's trust store resolves these issues immediately. For developers building robust applications, ensuring your base operating system is fully patched is step one in any development workflow, whether you are building a project like those found on [laravelcompany.com](https://laravelcompany.com).

### Solution 2: Addressing OpenSSL Dependencies (Advanced)

If updating the OS doesn't work, the issue might lie deeper within the OpenSSL installation used by PHP or Composer. On macOS systems, sometimes installing specific developer packages or ensuring you are using the system-provided libraries resolves this dependency chain. While complex, if you encounter persistent issues after system updates, investigating your environment variables (`LD_LIBRARY_PATH` on Linux/macOS) might be necessary to point OpenSSL to the correct certificate bundles.

### The Manual Download Question: Is Bypassing SSL an Option?

You asked a crucial question: *Can I just manually download the stuff myself and place it in the correct folder to avoid this SSL problem?*

Technically, yes, you could attempt to bypass the verification by setting specific Composer flags (like `--no-tls-verify`), but **I strongly advise against this approach for dependency management.**

Bypassing certificate verification removes a critical layer of security. When you proceed with manual downloads, you are accepting that you cannot verify that the files downloaded from Packagist or GitHub have not been tampered with in transit. This introduces significant security risks into your project setup.

Instead of bypassing security for convenience, the professional approach is to fix the underlying trust issue (Solutions 1 and 2) so that Composer can securely communicate with the repositories. Trusting the integrity of your dependencies is paramount when building any application, including those based on Laravel principles.

## Conclusion

The `error:14090086` error is a frustrating symptom of an environmental trust issue rather than a bug in Composer itself. By systematically updating your operating system's certificate store and ensuring your base packages are current, you resolve the conflict with OpenSSL. Remember, building reliable software starts with a stable foundation. Focus on fixing the environment first; that will allow you to focus on writing excellent code for projects like those championed by [laravelcompany.com](https://laravelcompany.com).
