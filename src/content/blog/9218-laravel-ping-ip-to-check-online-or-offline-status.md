---
title: "Laravel ping IP to check online or offline status"
description: "Mastering Service Health Checks in Laravel: Moving Beyond Flaky Pings As senior developers building robust applications with Laravel, we spend a significant..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As senior developers building robust applications with Laravel, we spend a significant amount of time ensuring our backend services are not just running, but are truly *healthy*. A common requirement is checking the status of an external service—an IP and specific port—to determine if it's online or offline. When dealing with network operations, especially across different environments (local host vs. remote servers), simple ICMP ping checks often prove unreliable.

You’ve encountered a classic dilemma: using packages like `laravel-ping` or attempting to leverage SSH commands via tools like `laravelcollective/remote` doesn't always yield accurate results. This usually happens because network connectivity issues, firewall configurations, or application-level responses interfere with basic ping utilities, leading to false negatives or positives.

This post will dive deep into why simple pinging fails for service health checks and provide a robust, developer-grade solution using native PHP capabilities within your Laravel application. We will establish a reliable method for verifying TCP port status that is far more dependable than a simple network probe.

## The Pitfalls of Simple Network Probing

The issue with relying solely on system `ping` commands or basic socket attempts is that they test different layers of the network stack. A successful ICMP ping only confirms basic reachability, not that a specific application process is actively listening on the requested port. If a server is up but the specific service you are checking is down or blocked by a firewall, the result can be misleading.

For true service health checks, we need to test the actual TCP connection handshake. If we can establish a connection to the target IP and port, it confirms that the service is both reachable *and* actively accepting connections. This level of granularity is essential when managing distributed systems, much like ensuring data integrity in complex Laravel applications.

## The Robust Solution: Leveraging PHP Socket Functions

Instead of relying on external ping utilities, the most reliable way to check if a port is open and listening from within a Laravel controller is by utilizing PHP's built-in stream functions, such as `fsockopen` or the more modern `stream_socket_client`. These functions allow your application to attempt a raw TCP connection, giving you definitive information about the service’s status.

Here is how we can rewrite your controller logic to perform a true port check:

```php
<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PlexServerController extends Controller
{
    public function serverStatus(Request $request)
    {
        $ip = $request->input('ip');
        $port = $request->input('port', 80); // Default to common port if not provided
        $host = $ip . ':' . $port;

        // Attempt to connect to the host using stream_socket_client
        $fp = @stream_socket_client($host, $errno, $errstr, 5);

        if ($fp) {
            // Connection successful: The port is open and listening
            fclose($fp);
            return response()->json([
                'status' => 'online',
                'health' => true
            ]);
        } else {
            // Connection failed: Host unreachable, connection refused, or timeout
            return response()->json([
                'status' => 'offline',
                'health' => false
            ], 503); // Service Unavailable HTTP status code
        }
    }
}
```

## Best Practices for Remote Health Checks

When dealing with remote checks (which is often the case when using tools like `laravelcollective/remote` to execute SSH commands), you must consider permissions and timeouts. If you are running this check on a remote server, ensure that PHP has the necessary permissions to initiate outbound TCP connections.

Furthermore, for complex diagnostics, don't stop at just checking if a connection succeeds. If you suspect a service is down but still accepting connections (a partial failure), consider combining the socket check with an SSH command. You can use `laravelcollective/remote` to execute a command like `systemctl status <service_name>` on the remote host. This combination gives you both network reachability *and* internal service state, providing a complete picture of the system's health—a key principle when architecting scalable services, which is something Laravel strongly supports through its ecosystem.

## Conclusion

Ditching unreliable ping utilities for direct TCP socket testing transforms your server status checks from guesswork into reliable data points. By implementing robust connection attempts within your Laravel controllers, you ensure that the feedback you receive regarding online/offline status is accurate and actionable. Always prioritize methods that test the actual service layer rather than just basic network connectivity.
