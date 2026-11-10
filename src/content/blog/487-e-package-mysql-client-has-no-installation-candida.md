---
title: "E: Package 'mysql-client' has no installation candidate in php-fpm image build using docker compose"
description: "Title: Solving \"Package 'mysql client' has no installation candidate\" Issue in Docker Compose for Laravel Apps Introduction: In your attempt to set up a..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

Title: Solving "Package 'mysql-client' has no installation candidate" Issue in Docker Compose for Laravel Apps

Introduction:

In your attempt to set up a Laravel application using Docker Compose with NGINX and MySQL, you have encountered an error related to the installation of the mysql-client package. In this comprehensive blog post, we'll explore reasons for this error and offer solutions to resolve it.

Error Analysis:

The error you are getting occurs during the execution of a Docker command within your Dockerfile. It specifically mentions that there is no installation candidate for mysql-client while using the php-fpm image. This can be caused by potential issues with the apt-get install -y mysql-client line, the package version, or even conflicts between multiple packages in the Dockerfile.

Solution 1: Update the Apt Repository List

Before starting the installation of any package, ensure that your system is up to date by updating the apt repository list using the following command:

<pre><code>RUN apt-get update</code></pre>

Then run apt-get upgrade, which will install all the available updates on your system.

Solution 2: Specify the MySQL Client Package Version

The mysql-client package may have been removed from the default repositories or the version in use might be outdated. To solve this problem, try specifying a specific version of the mysql-client package to be installed using apt-get install -y <package_version>:

<pre><code>RUN apt-get update &amp;&amp; apt-get install -y mysql-client=5.7.38</code></pre>

Solution 3: Use the Latest Version of PHP Image

As of writing this, the latest version of php:fpm is 8.0. Since the error you mentioned seems to be a problem with php:7.3-fpm, try switching to the latest image and verify if that resolves the issue:

<pre><code>FROM php:8.0 as php</code></pre>

Solution 4: Use an Alternative Method for MySQL Client Installation

Alternatively, you can use a Dockerfile to install the mysql-client package:

1. Create a new file named mysql_dockerfile.txt and add the following content:

   <pre><code>FROM debian:jessie
   RUN apt-get update && \
    apt-get install -y mysql-client
</code></pre>

2. In your original Dockerfile, replace the mysql-client installation code with a reference to the new file:

   <pre><code>COPY --from=mysql_dockerfile.txt mysql_client_installer RUN /install_mysql_client.sh</code></pre>

Conclusion:

By following these solutions, you should be able to resolve the issue causing your Laravel application to fail on Docker Compose with MySQL and NGINX setup. Ensure to test each method carefully as some may not work for specific Docker versions or configurations. If none of the proposed solutions works, consider seeking help from experienced developers within the community or consult documentation of packages related to docker-compose. Remember that debugging and troubleshooting are an integral part of working with complex systems like containers in Docker.
