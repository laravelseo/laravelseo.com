---
title: "Insert 1 million records using Laravel DB Seed"
description: "Insert 1 Million Records Using Laravel DB Seed: Avoiding Memory Exhaustion As a senior developer working with large scale data seeding in Laravel..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Performance", "PHP", "Errors"]
featured: false
---

As a senior developer working with large-scale data seeding in Laravel applications, we often run into performance bottlenecks when attempting to generate and insert millions of records. The goal is simple: populate the database efficiently. However, as you have experienced, trying to construct an array containing one million complex data objects in memory simultaneously leads directly to fatal errors like `Allowed memory size exhausted`.

This post will diagnose why your current approach fails and provide a robust, scalable solution using batch processing techniques that are essential for handling massive datasets effectively within the Laravel ecosystem.

## The Root Cause: Memory Overload During Data Generation

The error you are encountering—`PHP Fatal error: Allowed memory size of 1073741824 bytes exhausted`—is not a failure of your database connection; it is a failure of your PHP process to hold the entire dataset in RAM.

When you execute this code:

```php
for( $i=1; $i <= $no_of_rows; $i++ ){
    $user_data[] = [ /* ... large array of data ... */ ];
}
User::insert($user_data);
```

You are forcing PHP to allocate memory for 1,000,000 records *before* the `insert` command is even executed. Each record stored in `$user_data` consumes significant memory. Even if you have set `memory_limit` to a high value like `1024M`, generating this monolithic array often exceeds the available heap space allocated to the script, causing the fatal error.

The solution is to stop building the entire dataset in memory at once and instead process the data in manageable chunks.

## The Solution: Implementing Batch Insertion

Instead of creating one massive array, we should iterate, generate a small batch of data, insert it immediately, and then clear that batch before proceeding to the next chunk. This keeps memory usage low and stable, allowing you to handle millions of records without crashing your server.

We will use the `chunk()` method provided by Laravel's Eloquent or Query Builder features for highly optimized iteration over large sets.

### Optimized Code Example: Using Chunking

Here is how you can rewrite your seeding logic to safely insert one million records in batches, which is a fundamental best practice when dealing with large data migrations or seeding operations.

```php
use App\Models\User; // Assuming you are using an Eloquent model
use Illuminate\Support\Facades\DB;
use Faker\Factory;

$no_of_rows = 1000000;
$faker = Factory::create();

// Iterate in manageable chunks (e.g., 5,000 records at a time)
for ($chunk = 0; $chunk < $no_of_rows; $chunk += 5000) {
    $batch_size = min(5000, $no_of_rows - $chunk);
    $user_data_batch = [];

    // Generate data only for the current batch
    for ($i = 0; $i < $batch_size; $i++) {
        $user_data_batch[] = [
            'status' => 'ACTIVE',
            'username' => $faker->userName,
            'email' => $faker->email,
            'password' => bcrypt('password'), // Always hash passwords!
            'firstname' => $faker->firstName,
            'surname' => $faker->lastName,
            'mobilenumber' => $faker->phoneNumber,
            'confirmed' => $faker->boolean(50),
            'gender' => $faker->boolean(50) ? 'MALE' : 'FEMALE',
            'dob' => $faker->date(),
            'address_line_1' => $faker->address,
            'address_line_2' => '',
            'post_code' => $faker->postcode,
        ];
    }

    // Insert the batch immediately
    User::insert($user_data_batch);

    // Optional: Log progress to keep monitoring
    echo "Inserted " . count($user_data_batch) . " records...\n";
}

echo "Seeding complete!\n";
```

### Why This Works Better

1.  **Reduced Memory Footprint:** Instead of holding 1 million arrays, you are only holding the memory required for one batch (e.g., 5,000 records) at any given time. This keeps memory usage minimal and prevents the fatal error.
2.  **Database Resilience:** Inserting in smaller batches is generally safer for database stability, especially under heavy load. If an error occurs mid-process, you only lose the current batch, not the entire operation.
3.  **Scalability:** This technique scales perfectly. Whether you need 10 million or 1 billion records, as long as your memory limit allows it, the process remains stable by iterating in controlled steps.

## Conclusion: Embrace Batching for Large Seeding

When dealing with large-scale data operations in Laravel, especially seeding, always prioritize efficiency and memory management. Avoid loading entire datasets into memory before performing database operations. By adopting batch processing techniques like the one demonstrated above, you transform a potential crash point into a reliable, scalable solution. Remember that effective application development, much like efficient database interaction, relies on understanding resource constraints. For deeper insights into optimizing Eloquent interactions and scaling your data layer, always refer to resources from [laravelcompany.com](https://laravelcompany.com).
