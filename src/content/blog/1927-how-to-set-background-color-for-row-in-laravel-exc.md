---
title: "How to set background color for row in Laravel Excel?"
description: "Title: Efficiently Set Background Color for Rows Using Laravel Excel's Events Handling Body: If you are working on a project that involves utilizing the..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Efficiently Set Background Color for Rows Using Laravel Excel's Events Handling

Body:
<p>If you are working on a project that involves utilizing the <a href="https://laravelcompany.com/blog/introduction-to-the-spatie-laravel-excel-package">Laravel Excel library</a>, you might have encountered situations where you need to set background colors for specific rows in your spreadsheets. This blog post will provide a comprehensive solution to this problem using Laravel Excel's powerful events handling feature.</p>

<h2 id="preparing-the-events-class">Preparing the Events Class</h2>

First, create a new Events class in your application. This class will be responsible for listening to specific events and executing tasks according to their types:

<pre><code class="language-php">use Maatwebsite\Excel\Events\AfterSheet;

class ExcelEvents
{
    public function registerEvents(): array
    {
        return [
            AfterSheet::class => [
                'methodName' => 'afterSheetCallback',
            ],
        ];
    }
}
</code></pre>

Here, we use the <code class="language-php">registerEvents()</code> method to register our custom events. We pass in an array with the event name as key and callable function as value. In this case, we are listening for the <code class="language-php">AfterSheet</code> event and assigning a custom callback function called <code class="language-php">afterSheetCallback()</code>.

<h2 id="creating-the-callback-functions">Creating the Callback Functions</h2>

Now, create the following functions:

1. The <code class="language-php">setHeaderRowBackgroundColor()</code> function to set background colors for a specific range of cells (headers).
2. The <code class="language-php">afterSheetCallback()</code> function to be called after all the columns are exported and ready for use. In this callback, we can apply our custom styles.

<pre><code class="language-php">public function setHeaderRowBackgroundColor(Worksheet $worksheet)
{
    $cellRange = 'A1:W1'; // All headers
    $styleArray = [
        'fill' => [
            'color' => [
                'rgb' => '000000',
            ],
        ],
    ];

    $worksheet->getDelegate()->getStyle($cellRange)->applyFromArray($styleArray);
}

public function afterSheetCallback(AfterSheet $event)
{
    $this->setHeaderRowBackgroundColor($event->sheet);
}
</code></pre>

In the <code class="language-php">afterSheetCallback()</code>, we call the custom function that sets background colors for a specific range of cells. We use the $cellRange property to define our desired range and apply the desired style array (fill color) using the <code class="language-php">applyFromArray()</code> method.

<h2 id="registering-the-events-with-laravel-excel">Registering the Events with Laravel Excel</h2>

Finally, include our newly created <code class="language-php">ExcelEvents</code> class in your application's service provider. You can inject it as a dependency and register your events:

<pre><code class="language-php">use Maatwebsite\Excel\Events\AfterSheet;
use App\Services\ExcelEvents;

class ExportServiceProvider extends ServiceProvider
{
    public function boot()
    {
        $this->app->bind(ExcelEvents::class, function () {
            return new ExcelEvents();
        });
    }
}
</code></pre>

In conclusion, by using Laravel Excel's events handling feature and creating custom functions to handle specific tasks, you can now set background colors for rows in your spreadsheets with ease. Feel free to explore more options within the <a href="https://laravelcompany.com/blog/introduction-to-the-spatie-laravel-excel-package">Laravel Excel library</a> and apply them to enhance the functionality of your applications.
