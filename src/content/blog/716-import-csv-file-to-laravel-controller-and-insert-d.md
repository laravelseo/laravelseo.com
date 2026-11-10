---
title: "Import CSV file to Laravel controller and insert data to two tables"
description: "Title: Importing CSV Data into Laravel Controllers: A Comprehensive Guide for Beginners Body: As a beginner in Laravel development, you might come across the..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO"]
featured: false
---

Title: Importing CSV Data into Laravel Controllers: A Comprehensive Guide for Beginners

Body: <p>As a beginner in Laravel development, you might come across the need to import data from a CSV file and insert it into two tables. This process involves handling both large amounts of data and dealing with complex relationships between database models. In this post, we'll walk through an example that shows how to import CSV data into two different tables using Laravel controllers.</p>

<p>First, let us assume you have a CSV file containing the following data:</p>

```csv
List Name, List Client ID
L1, 1234567890
L2, 2234567890
L3, 3234567890
...
Customer Name, Surname, Contact Number, List ID, Client ID
John Doe, Smith, 123-456-7890, L1, 1234567890
Jane Doe, Smith, 234-567-8901, L2, 1234567890
Mark Doe, Johnson, 345-678-9012, L3, 1234567890
...
```

We want to use this CSV file to insert data into the following tables:

1. A 'lists' table for storing list names and their corresponding client IDs.
2. A 'customers' table that stores customer information, including name, surname, contact number, as well as the associated list (list_id) and client ID (client_id).

Here is a working Laravel controller example with detailed explanations:

<pre><code>namespace App\Http\Controllers;

use Input;
use DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use App\Lists;
use App\Clients;
use App\Customers;
use Illuminate\Http\Response;
use Illuminate\Contracts\Filesystem\FileNotFoundException;

class ListsController extends Controller {
    public function importCSV() {
        $file = request()->file('csv');
        if ($file) {
            try {
                // Read the CSV file and create a reader object
                $reader = \Reader::createFromPath($file-&gt;getRealPath());

                // Extract headers from the first row of the CSV file
                $headers = array();
                foreach ($reader as $index => $row) {
                    if ($index === 0) {
                        $headers = $row;
                    } else {
                        $data = array_combine($headers, $row);
                        // Insert data into the customers table based on list and client IDs
                        Customers::create($data);
                        // Insert list name and client ID into the lists table for each record
                        Lists::insert(['client_id' => $data['client_id'], 'name' => $data['list_name']]);
                    }
                }
            } catch (Exception $e) {
                // Handle exceptions
                return response($e, 500);
            } catch (FileNotFoundException $e) {
                // Handle file not found errors
                return response('Failed to find CSV file', 400);
            }
        } else {
            // If no file is selected, show an error message
            return response('No CSV file selected', 400);
        }
    }
}
</code></pre>

In this example, we create a function named 'importCSV' in the ListsController. It handles the uploaded CSV file and creates a reader object to iterate through its rows. The headers are extracted from the first row, allowing us to easily map customer data to their respective tables. Data is inserted into both the lists and customers tables based on the given relationships.

This comprehensive guide should help you tackle importing CSV files into your Laravel application with ease. Remember to always use proper error handling and exception management in your code for a stable and efficient result. For more information, check out https://laravelcompany.com/blog for helpful tutorials and resources.
