---
title: "Add Laravel storage disk/filesystem on the fly"
description: "Add Laravel Storage Disks/Filesystem On the Fly: Dynamic Disk Management When building complex applications, especially those dealing with external resources..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Performance", "PHP"]
featured: false
---

When building complex applications, especially those dealing with external resources like cloud storage, FTP servers, or S3 buckets, managing configuration centrally is crucial. In a standard Laravel setup, the `config/filesystems.php` file allows you to define your storage disks statically. However, what happens when your storage endpoints change frequently—for instance, when you have multiple FTP accounts stored in a database table, and each account needs to be exposed as a distinct filesystem within your application?

This post explores how to achieve dynamic filesystem registration on the fly, allowing you to provision new storage disks based on runtime data.

## The Challenge: Static Configuration vs. Dynamic Needs

Laravel's core filesystem configuration is designed to be loaded at application boot time. This approach prioritizes performance and predictability. Directly modifying `config/filesystems.php` within a middleware or request cycle is generally discouraged as it risks configuration drift and makes the application state unpredictable.

The goal here isn't to change the static configuration file, but rather to dynamically register new filesystem *drivers* (like an FTP driver) and associate them with named disks based on database entries.

## The Solution: Leveraging Service Providers for Dynamic Registration

The most robust way to achieve dynamic setup in Laravel is by utilizing the Service Provider pattern. Service providers are designed to bind services and register components during the application bootstrapping process, giving you a controlled point to inject dynamic logic before the rest of the application runs.

We can create a custom Service Provider that hooks into the database, reads the list of FTP accounts, and programmatically registers these new disks with the `Filesystem` facade.

### Step 1: Define the Data Model (Assumption)

Assume you have an `FtpAccount` model or table storing the necessary credentials (host, username, password, root path).

```php
// Example FtpAccount Model structure
class FtpAccount extends Model
{
    // host, username, password, root_path fields...
}
```

### Step 2: Create the Dynamic Disk Provider

We will create a provider that executes when the application boots to scan the database and register the disks.

```php
<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Storage;
use App\Models\FtpAccount; // Assuming your model is here

class DynamicFilesystemServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // No specific bindings needed here, just setup the logic in boot()
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Check if we have any FTP accounts to load
        $ftpAccounts = FtpAccount::all();

        foreach ($ftpAccounts as $account) {
            // 1. Define a unique disk name based on the account (e.g., 'ftp_account_1')
            $diskName = 'ftp_' . $account->id;

            // 2. Dynamically register the filesystem driver and disk
            // This leverages Laravel's underlying filesystem registration mechanism.
            Storage::extend('ftp', function ($app, $config) use ($account) {
                return new \App\Filesystem\FtpDiskDriver($account); // Custom driver implementation
            });

            // 3. Register the disk configuration (this step is conceptual; in a real scenario,
            // you might interact with config files or service container bindings depending on complexity).
            // For demonstration, we ensure the facade knows about the new extension if needed.
        }
    }
}
```

### Step 3: Register the Service Provider

Ensure this provider is registered in your `config/app.php` file within the `providers` array.

## The Custom Driver Implementation (The Core Logic)

For this to work, you need a custom driver class that implements the necessary methods for interaction with FTP. This class acts as the bridge between Laravel's generic `Storage` interface and your specific FTP logic.

```php
// app/Filesystem/FtpDiskDriver.php

namespace App\Filesystem;

use Illuminate\Contracts\Filesystem\<0x0D>Filesystem<0x0D>;
use Illuminate\Support\Facades\Storage;

class FtpDiskDriver implements Filesystem
{
    protected $ftpAccount;

    public function __construct($ftpAccount)
    {
        $this->ftpAccount = $ftpAccount;
    }

    public function put(string $path, string $contents, array $config = []): bool
    {
        // Actual FTP logic to upload $contents to $this->ftpAccount->root_path . $path
        \Log::info("Uploading via FTP account {$this->ftpAccount->id}: {$path}");
        // ... implementation using an FTP client library (like ftplib)
        return true;
    }

    public function get(string $path): string
    {
        // Actual FTP logic to download file from the remote server
        \Log::info("Downloading from FTP account {$this->ftpAccount->id}: {$path}");
        // ... implementation using an FTP client library
        return "FTP Content for: " . $path;
    }

    // Implement other required methods (read, delete, etc.)...
}
```

## Conclusion

By moving the dynamic setup logic into a Service Provider and implementing custom file system drivers, you successfully decouple your application's runtime needs from its static configuration files. This pattern adheres to SOLID principles and provides incredible flexibility. If you are looking to build highly scalable and customizable systems on top of Laravel, understanding how to extend core features like the Filesystem facade is essential. For more advanced architectural patterns and robust service definitions, exploring resources from [laravelcompany.com](https://laravelcompany.com) can provide excellent context.
