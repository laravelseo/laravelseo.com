---
title: "How to pass parameter to export file of Laravel Excel for DB query"
description: "Title: Efficiently Pass Parameters for DB Query based Excel Exports using Laravel Excel Body: In modern web applications, it's becoming increasingly common..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Efficiently Pass Parameters for DB Query-based Excel Exports using Laravel Excel
Body: <p>In modern web applications, it's becoming increasingly common to generate dynamic data exports in various formats like PDF and Excel files. In this blog post, we'll walk through the process of passing parameters to an exported file to perform a database query and fetch the results for the user. We'll use Laravel Excel, a powerful toolkit to simplify the process of generating custom excel exports.</p>

<h3>Understanding Controllers and Routes</h3>
First, let's understand how to structure our project correctly. We will be using Laravel's built-in routing mechanism and controllers to create a route for the exported page. In your project, you'll want a "Controller" folder (or similar) that contains the ExcelController class. The controller should extend from the Illuminate\Http\Controller class.

<h3>Setting up the Controller</h3>
Within this class, define a function called export(). This function will handle the request and return an Excel file with data based on the specified id. We'll use Laravel Excel to download the excel file directly to the user's device. The code in your controller should look like this:

<pre><code>&lt;?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Exports\MttRegistrationsExport;
use Maatwebsite\Excel\Facades\Excel;

class ExcelController extends Controller
{
    public function export($id)
    {
        return Excel::download(new MttRegistrationsExport, 'MttRegistrations.xlsx', compact('id'));
    }
}
</code></pre>

<h3>Export File: The MttRegistrationsExport Class</h3>
Next, we'll create an export class to manage the data that needs to be fetched from the database and formatted for the excel export. This export class should implement Maatwebsite\Excel\Concerns\FromCollection interface. Our MttRegistrationsExport implementation will perform a database query based on the passed id, retrieve all the relevant records, and map them to the required fields in an array. The code of your export file should look like this:

<pre><code>&lt;?php

namespace App\Exports;

use App\MttRegistration;
use Maatwebsite\Excel\Concerns\FromCollection;

class MttRegistrationsExport implements FromCollection
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return MttRegistration::where('lifeskill_id',$id)->get()([
            'first_name', 'email'
        ]);
    }
}
</code></pre>

<h3>Configuring the Route</h3>
Finally, we need to link all these elements together using a route. In Laravel, this is done through a GET request that takes an id parameter and maps it to your ExcelController's export() function:

<pre><code>&lt;?php

Route::get('/mtt/attendance/{id}',[
    'as' =&gt; 'mtt.attendance',
    'uses' =&gt; 'ExcelController@export']);
</code></pre>

Now, whenever a user visits the given route and provides an id as a parameter, your web application will generate a custom Excel file with data from the database based on that id. All this is made possible by leveraging Laravel Excel and passing parameters to the exported file for dynamic data generation.
