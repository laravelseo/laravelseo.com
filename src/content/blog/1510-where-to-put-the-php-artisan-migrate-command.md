---
title: "Where to put the php artisan migrate command"
description: "Title: Executing PHP Artisan Migrate Command in Dockerized Laravel Applications Body: In developing Laravel applications using Docker, managing database..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "PHP"]
featured: false
---

Title: Executing PHP Artisan Migrate Command in Dockerized Laravel Applications

Body:
<p>In developing Laravel applications using Docker, managing database migrations is a crucial aspect of the process. The <strong><em>php artisan migrate</em></strong> command is used to generate the required tables in your chosen database system. But sometimes you may be confused about where to put this important step in the Docker setup.</p>
<p>First, let's understand how Laravel's migration feature works. The <em>migrate</em> command executes all migrations defined within Laravel's database/migrations directory. It automatically creates new tables, modifies existing ones, or removes them based on the commands contained in each migration file.</p>
<p><strong>Docker-Compose</strong></p>
<p>Docker Compose is a tool for defining and running multi-container Docker applications. It uses a YAML configuration file to define services, their dependencies, and other configurations. To run the Laravel application with MySQL database in Docker, you can use the following config:</p>
<pre><code>version: '3.3'

services:
    db:
        image: mysql:5.7
        networks:
            - smstake
        ports:
          - "3306:3306"
        volumes:
          - db_data:/var/lib/mysql
        environment:
            MYSQL_ROOT_PASSWORD: password
            MYSQL_DATABASE: smstake
            MYSQL_USER: root
            MYSQL_PASSWORD: password
        deploy:
            mode: replicated
            placement:
                constraints:
                    - node.role == manager
    
    app:
        image: smstake:latest
        ports:
          - 8000:80
        networks:
            - smstake
        command: docker-compose exec app php artisan migrate --seed
        deploy:
            mode: replicated
            replicas: 1
            placement:
                constraints:
                    - node.role == manager
volumes:
    db_data:
</code></pre>
<p>The command <em>docker-compose exec app php artisan migrate --seed</em> runs the Laravel's migration inside the application container, ensuring that all necessary tables are generated in the database.</p>
<p><strong>Dockerfile</strong></p>
<p>When building a custom image for your application, you can define the PHP artisan migrate command during the Docker build process. However, as shown above, it is more flexible and efficient to run this command within the production environment:</p>
<pre><code>FROM alpine

ENV \
    APP_DIR="/app" \
    APP_PORT="80"

## the "app" directory (relative to Dockerfile) contains your Laravel app...
COPY app/ $APP_DIR
## or we can make the volume in compose to say use this directory 

RUN apk update &amp;&amp; \
    apk add curl \
    php7 \
    php7-opcache \
    php7-openssl \
    php7-pdo \
    php7-json \
    php7-phar \
    php7-dom \
    php7-curl \
    php7-mbstring \
    php7-tokenizer \
    php7-xml \
    php7-xmlwriter \
    php7-session \
    php7-ctype \
    php7-mysqli \
    php7-pdo \
    php7-pdo_mysql\
    &amp;&amp; rm -rf /var/cache/apk/*

RUN curl -sS https://getcomposer.org/installer | php -- \
  --install-dir=/usr/bin --filename=composer

RUN cd $APP_DIR &amp;&amp; composer install

WORKDIR $APP_DIR

RUN chmod -R 775 storage
RUN chmod -R 775 bootstrap

#CMD php artisan migrate:fresh
CMD php artisan serve --host=0.0.0.0 --port=$APP_PORT
</code></pre>
<p>While you can add the <em>php artisan migrate:fresh</em> command to your Dockerfile, as it's commented out in the example, there is a risk that this could leave you with inconsistent database states. Instead, use the compose file command execution to perform migrations after starting the application.</p>
<p><strong>Jenkins and Continuous Integration</strong></p>
<p>In your continuous integration pipeline using tools like Jenkins or GitLab, you can run commands on running services. To migrate the database in a Docker environment, you could execute:</p>
<pre><code>docker-compose up -d --force-recreate --build

#Running commands on already running service
docker-compose exec -T app php artisan migrate:fresh --seed --force
</code></pre>
<p>When adding this command to your pipeline, ensure that it is run only after all migrations have been completed and tested. This practice ensures a consistent database state across different environments.</p>
<p><strong>Conclusion</strong></p>
<p>To run Laravel's migration commands in a Dockerized application, use the <em>migrate</em> command within the production environment via compose or manually using the shell. This approach ensures that your database remains consistent and provides better control over migration execution.</p>
