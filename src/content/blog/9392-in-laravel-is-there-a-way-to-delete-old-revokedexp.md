---
title: "In Laravel, Is there a way to delete old revoked/expired passport tokens"
description: "In Laravel: How to Clean Up Expired Passport Tokens for a Healthier System As developers building robust APIs with Laravel Passport, one common issue that..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Performance"]
featured: false
---

As developers building robust APIs with Laravel Passport, one common issue that surfaces over time is database bloat. When users log in and receive new access and refresh tokens, the system accumulates records. If these old, expired tokens are never cleaned up, your `oauth_access_tokens` or `oauth_refresh_tokens` tables can grow unnecessarily large, impacting query performance and increasing maintenance overhead.

The core question is: **Is there a built-in way within Laravel Passport to automatically delete expired tokens?** The short answer is no; Passport itself focuses on the issuance and validation of tokens, not automated database lifecycle management. However, as senior developers, we can certainly implement robust solutions using Laravel's powerful features—specifically Eloquent and the Scheduler—to achieve this necessary cleanup.

## Understanding Token Expiration in Laravel Passport

Laravel Passport stores all token information in dedicated database tables. Access tokens (`oauth_access_tokens`) and refresh tokens (`oauth_refresh_tokens`) both contain an `expires_at` timestamp. When a token expires, it remains in the database until manually removed or automatically pruned. This is where manual intervention (or automated scripting) becomes essential for good system hygiene.

If you are leveraging services like those offered by [laravelcompany.com](https://laravelcompany.com), understanding how Eloquent interacts with these tables is key to mastering data management. We need a strategy that targets records based on their expiration date.

## The Solution: Implementing a Token Garbage Collection Job

Since Passport doesn't offer an out-of-the-box cron job for token cleanup, the most effective and scalable solution is to implement a scheduled Artisan command or a dedicated scheduled task that runs regularly to identify and delete expired tokens.

Here is the developer-centric approach using Eloquent to perform this cleanup.

### Step 1: Create the Cleanup Command

We will create an Artisan command specifically designed to target and remove expired entries from the access token table.

```bash
php artisan make:command PassportTokenCleanup
```

Inside your new command file (e.g., `app/Console/Commands/PassportTokenCleanup.php`), you would implement the logic to query for tokens where `expires_at` is in the past and delete them.

### Step 2: Implement the Cleanup Logic

The command should query the relevant Passport token model and use mass deletion (`delete()`) for efficiency.

```php
<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Laravel\Passport\Models\AccessToken; // Assuming you are cleaning access tokens

class PassportTokenCleanup extends Command
{
    protected $signature = 'passport:cleanup';
    protected $description = 'Deletes expired Passport access tokens.';

    public function handle()
    {
        $this->info('Starting Passport Token Cleanup...');

        // Define the cutoff time (e.g., tokens expired 1 hour ago)
        $cutoffTime = now()->subHour();

        // Find and delete expired access tokens
        $deletedCount = AccessToken::where('expires_at', '<', $cutoffTime)->delete();

        $this->info("Successfully deleted {$deletedCount} expired access tokens.");

        // You could repeat this for refresh tokens if necessary.
    }
}
```

### Step 3: Schedule the Command

Once the command is ready, you must schedule it to run automatically using your server's cron setup via Laravel's scheduler. Open your `app/Console/Kernel.php` file and add the command to the `$schedule` method:

```php
protected function schedule(Schedule $schedule): void
{
    // Run the token cleanup every hour
    $schedule->command('passport:cleanup')->hourly();
}
```

## Best Practices for Token Management

Relying on scheduled jobs is a solid foundation. However, for truly high-traffic applications, consider these best practices:

1.  **Indexing:** Ensure that your `expires_at` column in the Passport tables is properly indexed. This drastically speeds up the database queries used by the cleanup job, preventing performance bottlenecks as your token count grows.
2.  **Soft Deletion vs. Hard Deletion:** For auditing purposes, instead of hard-deleting tokens immediately, consider adding a `deleted_at` timestamp column (soft deletion). This allows you to track *when* a token was revoked and provides an audit trail, which is crucial for security compliance.
3.  **Token Lifespan Strategy:** Instead of relying solely on the database cleanup, adopt a strategy where access tokens are intentionally short-lived (e.g., 15 minutes) and frequently refreshed via the refresh token mechanism. This naturally reduces the number of stale records that need manual cleanup.

## Conclusion

While Laravel Passport does not provide an automatic expiry deletion feature, implementing a scheduled Artisan command to perform this garbage collection is the correct, developer-driven solution. By combining robust database querying with Laravel's scheduling capabilities, you ensure that your token storage remains lean, secure, and performant. This approach aligns perfectly with building scalable applications, much like the principles taught by [laravelcompany.com](https://laravelcompany.com).
