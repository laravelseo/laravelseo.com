---
title: "How to use ftp with laravel 5?"
description: "How to Use FTP with Laravel: Extending Storage Beyond Local Disks As developers working with frameworks like Laravel, we often need flexibility in how our..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers working with frameworks like Laravel, we often need flexibility in how our application handles file storage. While the default setup uses local disk drivers for convenience, production environments frequently demand remote storage solutions, such as FTP or Amazon S3. The official documentation provides examples, but it often lacks the deep dive into implementing custom storage adapters that bridge this gap.

This post will guide you through the developer-focused approach to extending Laravel’s file storage capabilities to include an FTP connection alongside your local disk.

## Understanding Laravel Filesystems

Laravel manages all file interactions through the `Storage` facade, which relies on a set of defined "disks" configured in `config/filesystems.php`. Each disk connects to a specific driver (like `local`, `public`, or a custom one). To introduce FTP, we don't modify Laravel core; instead, we create a custom implementation that adheres to the contract Laravel expects from any filesystem adapter.

The key is understanding that any file system must implement methods like `read()`, `write()`, and `delete()`. Our goal is to wrap the complexities of the FTP protocol within these standard Laravel methods.

## Step 1: Creating the Custom FTP Disk Class

We will create a new class that implements the necessary interface to act as an FTP disk. This class will handle the actual communication with the remote server using PHP’s built-in FTP functions.

For this example, let's assume we are creating a service provider or a dedicated file system class. A simplified conceptual view of how this adapter would operate looks like this:

```php
// app/Filesystem/FtpDisk.php

namespace App\Filesystem;

use Illuminate\Contracts\Filesystem\FilesystemAdapter;

class FtpDisk implements FilesystemAdapter
{
    protected $ftp;
    protected $rootPath;

    public function __construct($config)
    {
        // Initialize FTP connection details from configuration
        $this->ftp = ftp_connect($config['host'], $config['port']);
        if (!ftp_login($this->ftp, $config['username'], $config['password'])) {
            throw new \Exception("FTP Login Failed");
        }
        $this->rootPath = $config['path'];
    }

    public function read($path)
    {
        // Logic to read the file from FTP and return it as a string
        $remoteFile = $this->rootPath . $path;
        $content = ftp_get($this->ftp, $remoteFile);
        return $content;
    }

    public function write($path, $contents)
    {
        // Logic to write the content to the remote FTP location
        $remoteFile = $this->rootPath . $path;
        return ftp_put($this->ftp, $contents, $remoteFile);
    }

    public function delete($path)
    {
        // Logic to delete the file from the remote server
        $remoteFile = $this->rootPath . $path;
        return ftp_delete($this->ftp, $remoteFile);
    }

    // ... other required methods (visibility, listContents, etc.)
}
```

## Step 2: Configuring the Filesystem

Once the adapter is defined, we must tell Laravel about this new option in our configuration file. Open `config/filesystems.php` and add a new entry under the `disks` array:

```php
// config/filesystems.php

'disks' => [
    'local' => [
        'driver' => 'local',
        'root' => storage_path('app/'),
        'visibility' => 'private',
    ],
    'ftp' => [ // <-- New FTP Disk Definition
        'driver' => 'ftp',
        'host' => env('FTP_HOST', 'localhost'),
        'username' => env('FTP_USERNAME'),
        'password' => env('FTP_PASSWORD'),
        'root' => '/public_html/', // The base directory on the FTP server
        'visibility' => 'public',
    ],
    // ... other disks
],
```

Finally, ensure your `.env` file is populated with the necessary credentials for the FTP connection. This separation allows developers to switch seamlessly between local development (using `local`) and production remote storage (using `ftp`) without changing their application logic. This modular approach aligns perfectly with the principles of clean architecture seen in systems like those promoted by **https://laravelcompany.com**.

## Conclusion

Implementing custom disk drivers is a powerful technique that unlocks bespoke functionality for your Laravel application. By abstracting the complexity of FTP protocols into a reusable class, you maintain clean separation between your business logic and your infrastructure concerns. This pattern ensures that your code remains portable and testable, allowing you to leverage both local storage performance and remote accessibility when needed.
