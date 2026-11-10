---
title: "SQLSTATE[HY000] [2002] Connection refused Laravel 8"
description: "SQLSTATE[HY000] [2002] Connection Refused in Containerized Laravel: A Deep Dive Containerizing a Laravel application, especially when dealing with database..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Errors"]
featured: false
---

Containerizing a Laravel application, especially when dealing with database connections, often introduces subtle networking issues that are invisible during local development. As a senior developer, we frequently encounter errors like `SQLSTATE[HY000] [2002] Connection refused` when moving an application from a local machine to a Docker or Laradock environment.

This post will dissect the specific problem you are facing—the connection refusal within your containerized Laravel 8 setup—and provide a comprehensive, practical solution based on best practices for container networking.

## Understanding the Error: Connection Refused

The error `SQLSTATE[HY000] [2002] Connection refused` is fundamentally a network error. It means that your Laravel application, running inside the Docker container, attempted to establish a TCP connection to the specified database host (`
