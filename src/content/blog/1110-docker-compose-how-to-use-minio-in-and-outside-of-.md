---
title: "docker-compose: how to use minio in- and outside of the docker network"
description: "Title: docker compose: how to use Minio inside and outside of the Docker network Introduction Developers often struggle when trying to access their local..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content"]
featured: false
---

Title: docker-compose: how to use Minio inside and outside of the Docker network

Introduction

Developers often struggle when trying to access their local development environments using services like AWS S3 or its compatible alternatives like MinIO, especially if they need them to work both within and outside the Docker network. This blog post aims to provide a comprehensive solution for this problem by explaining how to set up and configure your Laravel application, Docker Compose, and MinIO storage to achieve this goal.

Configuring Docker-compose for Laravel with MinIO

Firstly, let's take a look at the given Docker Compose configuration:

1. Define services: Here we have created services for your Laravel application (app), database (database), and MinIO (s3) storage.
2. Linking services: You are using links to establish connections between services, like linking app with both the database and s3 services.
3. Environment variables: Properly defined environment variables for AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_BUCKET, AWS_ENDPOINT (which we will modify later), and for MinIO specific variables MINIO_ACCESS_KEY and MINIO_SECRET_KEY.
4. Volumes: You have mounted the storage of your Laravel application to be used by MinIO.
5. Command: Set the command for starting the s3 service as 'server /data' which is a default command provided by the Minio image to start a local server with the specified data directory. This is crucial to achieve our goal.

Using MinIO inside and outside of Docker network using the given configuration

The current setup allows you to generate URLs for files like this: <code>http://s3:9000/Bucket/some-file.txt</code>. To make these URLs accessible both in- and outside of your Docker network, follow these steps:

1. Configure MinIO to use HTTPS protocol instead of HTTP. This can be done by running the following command inside your minio container:
   <code>minio server /data --addr localhost:9011</code>
   This will start an HTTPS server at localhost:9011 and redirect requests on the default port 9000 to this secure port.
2. Modify the Docker Compose file to reflect these changes for your Laravel application, database, and MinIO services:

   a. For app service, update ports like this:
      <code>ports:
        - "80:80"
        - "443:9011"</code>
    This will expose both HTTP (port 80) and the secure HTTPS port (port 443) for your Laravel application.
   b. For s3 service, update ports to use the new HTTPS port:
      <code>ports:
        - "9000:9011"</code>
    This will redirect all requests on port 9000 to the secure port 9011 of your MinIO server.
    c. For database service, you don't have to make any changes since it runs on a default MySQL port (63306).
3. Update your Laravel application configuration files to use HTTPS URLs for accessing MinIO storage like:
   <code>Storage::disk('s3')-&gt;url('some-file.txt')</code> becomes <code>Storage::disk('s3')->url('http://localhost:9011/Bucket/some-file.txt')</code>.

Conclusion

With the above-explained steps, you can successfully configure your Laravel application with Docker Compose and MinIO to generate URLs for files that are accessible both inside and outside of your Docker network. This will enable easy collaboration between team members while ensuring accessibility for external users as well. Additionally, this approach allows you to use the HTTPS protocol for better security.
