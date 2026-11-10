---
title: "How to avoid Maximum execution time of 60 seconds exceeded Laravel without change php.ini max_execution_time"
description: "Optimizing Laravel Code for Large Data Exports without Changing Maximum Execution Time You need to optimize your Laravel application's code for exporting..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP"]
featured: false
---

<h2>Optimizing Laravel Code for Large Data Exports without Changing Maximum Execution Time</h2>

You need to optimize your Laravel application's code for exporting large datasets, such as exporting over 100,000 data records. You've noticed that changing the maximum execution time in php.ini is not an ideal solution. Instead, we will discuss how you can use chunking techniques and better-organized database queries to load large amounts of data without significantly increasing your server response times.

1. Use Chunk-Based Queries -
   Break down your bulk operations into smaller chunks that are easier for the system to handle. This includes separating the retrieval of data, processing/filtering it, and performing further actions. For example, you can load 1000 data records at a time using a 'limit' clause in your query:

   ```php
   AssetRepository::query()->where('type_id', '<>', 4)->limit(500)->get();
   AssetRepository::query()->where('type_id', 4)->limit(500)->get();
   ```

2. Use Chunk-Based Iterations -
   Apply chunk-based iterations to your data processing code, so you don't load all the records at once. You can use a simple 'for' loop or Laravel's collection methods:

   ```php
   // Simple for loop
   $totalData = AssetRepository::query()->count();
   $chunkSize = 500;
   for ($i = 0; $i < ceil($totalData / $chunkSize); $i++) {
       $offset = $i * $chunkSize;
       $chunkedData[] = AssetRepository::query()->offset($offset)->limit($chunkSize)->get();
   }

   foreach ($chunkedData as $data) {
       // Process your data here
   }

   // Laravel collection method
   $chunkedData = AssetRepository::query()->chunk(500);
   foreach ($chunkedData as $datas) {
       if (is_object($datas))
           $datas = (array)$datas;
       // Process your data here
   }
    ```

3. Optimize Your Database Queries -
   Reduce the number of database queries and simplify your code using joins in your query if possible:

   ```php
   AssetRepository::query()->join('asset_to_sid', 'a.id', '=', 'asset_to_sid.asset_id')->get();
    ```

4. Index Relevant Tables -
   Create appropriate indexes on your database tables to improve performance and reduce the need for full table scans:

   ```sql
   CREATE INDEX index_assets ON assets (type_id);
   ```

5. Leverage Laravel's Eloquent Relationships -
   Use Laravel's relationships to reduce the number of queries and improve your code readability:

   ```php
   $asset = Asset::with(['relations1', 'relations2'])->find(asset_id);
    ```

6. Optimize Your Database Schema -
   Ensure that your database schema is well-designed to support efficient querying and data retrieval:

   ```sql
   CREATE TABLE assets (
     id SERIAL PRIMARY KEY,
     ...
     type_id INT NOT NULL REFERENCES types(id), // foreign key to type table
     ...
   );
   
   CREATE TABLE asset_to_sid (
     id SERIAL PRIMARY KEY,
     asset_id INT NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
     sid INTEGER NOT NULL, // foreign key to a table containing SIDs
     ...
   );
   
   ALTER TABLE assets ADD COLUMN (asset_to_sid_id INT); // linking table column
   
   UPDATE assets SET asset_to_sid_id = (SELECT DISTINCT s.id FROM asset_to_sid a, sid AS s WHERE a.sid = s.id AND a.asset_id = assets.id) WHERE EXISTS ((SELECT 1 FROM asset_to_sid a2 WHERE a2.asset_id = assets.id AND a2.sid = sids.sid) OR (SELECT 1 FROM sids AS s2, asset_to_sid_linking WHERE sids.id = s2.sid AND asset_to_sid_linking.asset_id = assets.id))
   ```

By implementing these techniques and optimizing your code for large data exports without changing the maximum execution time, you can successfully handle massive datasets and improve the overall performance of your Laravel application. Remember to always consider the trade-off between performance and resource utilization when designing your database schema and writing queries.
