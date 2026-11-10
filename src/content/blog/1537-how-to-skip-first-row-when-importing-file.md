---
title: "How to skip first row when importing file"
description: "Title: Skipping the First Row When Importing Files with Laravel and Maatwebsite Excel Introduction In your project, you might want to import data from an..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content"]
featured: false
---

Title: Skipping the First Row When Importing Files with Laravel and Maatwebsite-Excel

Introduction
In your project, you might want to import data from an Excel file (.xlsx or .csv) into a database using Laravel. The first row in many spreadsheets usually contains column headers that are not required for inserting the actual data. To avoid importing these header values, you need to bypass the first row during the import process. This blog post will explain how you can achieve this with Laravel and Maatwebsite-excel package.

Skipping the First Row in Laravel 5.7 using the Excel Library
The Maatwebsite-Excel library allows you to easily parse and import data from various file formats, including .xlsx and .csv files. The latest version of this library (3.1.0) has introduced some changes that might require adapting your code accordingly if it uses the deprecated functions or syntax.

Example Code with Version 2 Syntax:
<pre><code>public function voter_import(Request $request)
{
    if (empty($request-&gt;file('file')-&gt;getRealPath())) 
    {
        return back()-&gt;with('success','No file selected');
    }
    else 
    {
        Excel::import(new VotersImport, $request-&gt;file('file'))-&gt;skip(1);
        return response('Import Successful, Please Refresh Page');
    }
}

class VotersImport implements ToModel
{
public function model(array $row)
   {
    return new Voter([
      'fname'          =&gt;  $row[0],
      'lname'          =&gt;  $row[1],
      'phone'          =&gt;  $row[2],
      'gender'         =&gt;  $row[3],
      'state'          =&gt;  $row[4],
      'occupation'     =&gt;  $row[5],
      'address'        =&gt;  $row[6],
      'vin'            =&gt;  $row[7],
      'dob'            =&gt;  $row[8],
      'campaign_id'    =&gt;  $row[9],
    ]);
   }
}
</code></pre>

Problem with This Code
The problem in the previous example is that it uses the deprecated version 2 syntax, which has been replaced by newer functions. The `skip()` method has been removed and replaced with a new object called `Reader`.

Correct Example Code with Version 3 Syntax:
<pre><code>public function voter_import(Request $request)
{
    if (empty($request-&gt;file('file')-&gt;getRealPath())) 
    {
        return back()-&gt;with('success','No file selected');
    }
    else 
    {
        Excel::load($request-&gt;file('file'), function(Reader $reader) use ($table, $model) {
            foreach ($reader as $row)
                Voter::create($row->toArray());
        });
        return response('Import Successful, Please Refresh Page');
    }
}

class VotersImport implements ToModel
{
public function model(array $row)
   {
    return new Voter([
      'fname'          =&gt;  $row['first_name'],
      'lname'          =&gt;  $row['last_name'],
      'phone'          =&gt;  $row['phone'],
      'gender'         =&gt;  $row['gender'],
      'state'          =&gt;  $row['state'],
      'occupation'     =&gt;  $row['occupation'],
      'address'        =&gt;  $row['address'],
      'vin'            =&gt;  $row['vin'],
      'dob'            =&gt;  $row['dob'],
      'campaign_id'    =&gt;  $row['campaign_id'],
    ]);
   }
}
</code></pre>

Conclusion
In this blog post, we have discussed how to skip the first row of a file being imported using Laravel and Maatwebsite-excel library. We have provided an example code that demonstrates the correct syntax for version 3 of the library, ensuring your data import process is efficient and accurate. Remember to always check for the latest updates in the Maatwebsite-excel package and use it accordingly for optimal results.
