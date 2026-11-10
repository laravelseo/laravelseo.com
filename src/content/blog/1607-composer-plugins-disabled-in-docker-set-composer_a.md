---
title: "Composer plugins disabled in Docker: Set COMPOSER_ALLOW_SUPERUSER=1 to enable plugins"
description: "Title: Composer Plugins Disabled in Docker: Set COMPOSER ALLOW SUPERUSER=1 to Enable Plugins Body: I'm trying to set up my React + Laravel application with..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "PHP", "Errors"]
featured: false
---

Title: Composer Plugins Disabled in Docker: Set COMPOSER_ALLOW_SUPERUSER=1 to Enable Plugins

Body:
<p>I'm trying to set up my React + Laravel application with Docker, but I'm encountering an issue while running the <code>composer install</code> command inside the Docker container.</p>
<p>When I run <code>docker-compose up -d --build</code>, the build fails at the <code>composer install</code> step with the following error:</p>
<p>&quot;[backend 8/9] RUN composer install --no-interaction --no-scripts --no-plugins:
#0 0.537 Composer plugins have been disabled for safety in this non-interactive session. Set COMPOSER_ALLOW_SUPERUSER=1 if you want to allow plugins to run as root/super user.&quot;</p>
<p>I have tried adding the <code>COMPOSER_ALLOW_SUPERUSER=1</code> environment variable in various places, including in the Dockerfile, the docker-compose.yaml file, and even as a command-line argument when running <code>docker-compose up</code>. However, I still encounter the same error.</p>
<p>Here is an example of my docker-compose.yaml file:</p>
<pre><code>version: '3'
services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      - COMPOSER_ALLOW_SUPERUSER=1
    volumes:
      - .:/app
## other service configuration...
</code></pre>

The issue you're facing is a common one when using composers inside your non-interactive containers. The default setting for Composer in containers prevents the usage of plugins, which causes the error that you are seeing. To enable plugins in these situations, simply set the environmental variable <code>COMPOSER_ALLOW_SUPERUSER=1</code>, as mentioned earlier.

However, this solution is not always enough to solve your problem. To achieve a stable environment, you can also try the following steps:

1. Specify the location of Composer binaries in the Docker image by adding these lines to your Dockerfile:
   <pre><code>RUN curl -s https://getcomposer.org/installer | php
   RUN mv composer.phar /usr/local/bin/composer
</code></pre>
This ensures that you have the latest Composer version and simplifies its usage.

2. Add the following to your Dockerfile:
   <pre><code>ENV COMPOSER_HOME /tmp
   WORKDIR /tmp/composer-install
   RUN /usr/local/bin/composer create-project --prefer-dist --no-dev laravel/laravel laravel-app && \
      mv ./laravel-app/* . && \
      (cd .. ; rm -rf composer-install)
</code></pre>
This step installs the Laravel project, moves it into your application directory, and removes the temporary Composer files created during this process.

3. Modify your docker-compose.yaml file as shown below:
   <pre><code>version: '3'
services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      - COMPOSER_ALLOW_SUPERUSER=1
    volumes:
      - ./app:/app
## other service configuration...
</code></pre>
This setup ensures that the Laravel application files are correctly mounted into your container, allowing you to take advantage of the customized Dockerfile and environment variable settings.

By following these steps, you should be able to successfully install your React + Laravel application inside a Docker container, while enabling Composer plugins for a seamless development experience.
