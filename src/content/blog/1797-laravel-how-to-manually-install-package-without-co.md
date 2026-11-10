---
title: "Laravel, how to manually install package without composer"
description: "Title: Manually Installing Laravel Packages Without Composer: A Step by Step Guide for Overcoming File Transfer Limitations Body: Introduction..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Manually Installing Laravel Packages Without Composer: A Step-by-Step Guide for Overcoming File Transfer Limitations
Body:

## Introduction
Laravel, the popular PHP framework, offers a wide array of useful packages to enhance your application development experience. However, there are instances where you may need to manually install a package without using Composer, especially in situations where you don't have command line access or your file transfer tool doesn't allow composer commands. This article aims to guide you through the process of manually installing Laravel packages, focusing on the Maatwebsite/Laravel-Excel package as an example.

## Prerequisites
Before proceeding with the manual installation process, ensure that your local development environment is set up correctly. You will also need to have a basic understanding of using an FTP client for uploading and downloading files. In this case, we'll be using Filezilla as our FTP client.

## Step 1: Download the Laravel-Excel Package
Navigate to https://packagist.org/packages/maatwebsite/laravel-excel in your browser and click on the "Download" button next to the package version you wish to use. This will download the compressed archive of the package to your computer.

## Step 2: Upload the Package to Your Laravel Project
Connect to your remote server using the Filezilla FTP client by entering the host, username, and password information. Once connected, navigate to your Laravel project directory on your local machine. Drag and drop the downloaded package archive into the root of your Laravel project folder on the remote server.

Note: Make sure the uploaded file is in a folder named vendor or the package may not work correctly. If you encounter any issues with the package installation, your hosting provider may have limitations in place and might need to be contacted for further assistance.

## Step 3: Register the Service Provider
Now that the Laravel-Excel package is uploaded to your project, you'll need to register it as a service provider within your application. Create a new "ServiceProvider" directory in your root project folder and add an appropriate filename (e.g., CustomServiceProviders.php).

Open this file and add the following code:
```php
use Illuminate\Support\Facades\Blade;

return [
   'providers' => [
       Maatwebsite\Excel\ExcelServiceProvider::class,
    ],
   'aliases' => [
       'Excel' => Maatwebsite\Excel\Facades\Excel::class
    ]
];
```
Note: This code assumes that the Laravel-Excel package is located in a vendor directory named "vendor". If your package is in a different location, adjust the code accordingly. Ensure you have a working Laravel application before proceeding to the next step.

## Step 4: Include the Package's Autoload File
Next, we need to ensure that the package's autoload file is included in your project so that it can be recognized by PHP. Modify the "composer.json" file located at the root of your Laravel application directory and add the "autoload": {
    "classmap": [
        "app/Providers/AppServiceProvider.php",
        "vendor/" . MAATWEB_THEME_FOLDER,
        "vendor/" . VIEWS_PATH,
        "vendor/" . LIBRARY_PATH,
        "storage/framework",
        "storage/apps"
    ]
} line at the end of the existing autoload configuration. Replace MAATWEB_THEME_FOLDER, VIEWS_PATH, and LIBRARY_PATH with your preferred paths for those directories in your Laravel project. The classmap array typically includes the app's service provider file, as well as any custom themes, views, libraries, and storage folders.

## Step 5: Test the Installation
To verify the installation, run a simple test using the Excel package. For example, you can create a controller with the following code snippet:

```php
<?php
namespace App\Http\Controllers;

use Maatwebsite\Excel\Facades\Excel;

class ExportController extends Controller
{
    public function export()
    {
        $rows = array(array("A1", "B1", "C1"), array("D1", "E1", "F1")); // sample data as an array of arrays
        return \Excel::create('MySpreadsheet', function($excel) use ($rows) {
            $sheet = $excel->getActiveSheet();
            foreach ($rows as $row) {
                $sheet->fromArray($row);
            }
        })->download('xls');
    }
}
```
Make sure to adjust the pathing for your own project. This code exports a sample spreadsheet with some data when accessed via localhost/your_app/export.

## Conclusion
While Composer offers an easier way to manage Laravel packages and their dependencies, sometimes manual installation is necessary due to limitations in file transfer tools or the hosting environment itself. The steps outlined here provide a practical guide for manually installing packages like Maatwebsite/Laravel-Excel without using composer. With this knowledge, you are equipped with the necessary skills to overcome these challenges and continue developing your Laravel applications effectively. For more information on working with Laravel or optimizing your development environment, visit https://laravelcompany.com/.
