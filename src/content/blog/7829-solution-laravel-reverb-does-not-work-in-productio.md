---
title: "Solution Laravel Reverb does not work in production with Apache"
description: "Solving Laravel Reverb Production Deployment Issues with Apache: A Guide Deploying modern, real time features using technologies like Laravel Reverb into..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "Errors"]
featured: false
---

Deploying modern, real-time features using technologies like Laravel Reverb into production environments can often introduce unexpected hurdles, especially when integrating with traditional web servers like Apache. Many developers find that what works perfectly on a local development machine simply breaks in the live environment due to differences in network configuration, proxy settings, or SSL handling.

This post addresses a very specific and frustrating scenario: why Laravel Reverb broadcasting fails in production when running behind an Apache server on an AWS Lightsail instance. We will diagnose the likely cause and provide a comprehensive solution to ensure your real-time communication works flawlessly.

***

## The Production Headache: Local Success vs. Live Failure

You are running a Laravel application using Reverb for broadcasting, and everything functions perfectly when tested locally. However, once deployed on an Apache setup—especially when dealing with HTTPS and WebSocket connections—the broadcast mechanism fails, resulting in errors like `Pusher error: <!DOCTYPE html>... Not Found`.

This discrepancy almost always points to a failure in how the HTTP server (Apache) is configured to proxy the WebSocket traffic required by Reverb to the separate application server running Reverb. The issue isn't usually with the Laravel code itself, but with the middleware layer between the client and the broadcast service.

## Diagnosing the Apache/Reverb Conflict

Laravel Reverb runs as a standalone service, typically on a specific port (e.g., 808
