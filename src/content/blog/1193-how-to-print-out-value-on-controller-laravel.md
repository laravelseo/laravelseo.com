---
title: "How to print out value on controller Laravel?"
description: "Debugging a Laravel application involves printing out values on the controller, which is often required when you want to monitor specific data or test your..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

<p>Debugging a Laravel application involves printing out values on the controller, which is often required when you want to monitor specific data or test your code's logic. Luckily, there are multiple ways to achieve this within Laravel. In this comprehensive tutorial, we'll explore different approaches for debugging values in controllers and provide relevant examples.</p>

<h2>Dumping Values with <code>dd()</code></h2>
<pre><code>class TestMeController extends Controller {
    public function callMe($id)
    {
        $params = Request::all();

        dd($params);
    }
}
</code></pre>
The <code>dd()</code> function, short for "die and dump," is a helpful tool for debugging in Laravel. It not only prints the specified variable value but also halts your application's execution to inspect it further. After executing this code, you will see the entire request collection displayed on your console.

<h2>Using <code>dump()</code> and Continuing Execution</h2>
<pre><code>class TestMeController extends Controller {
    public function callMe($id)
    {
        $params = Request::all();

        dump($params); // No pause, just logs to the console

        echo "This will continue running after logging data";
    }
}
</code></pre>
If you don't want your application's execution paused while debugging, use <code>dump()</code>. It works similarly to <code>dd()</code>, but it doesn't halt the program. You can still see the output in the console and continue working on your code.

<h2>Logging Values via Console or Browser</h2>
Another method for debugging values is through logging them to the console or browser. This can be useful when you need to store debug information temporarily for future reference or just want to avoid cluttering up your controller with too many print statements.

<pre><code>class TestMeController extends Controller {
    public function callMe($id)
    {
        $params = Request::all();

        // Logging to console
        Logger::info("Params: " . json_encode($params));

        // Logging to browser
        echo "<pre>" . print_r($params, true) . "</pre>";
    }
}
</code></pre>
In this example, we log the request collection's JSON representation using <code>json_encode()</code> for both console and browser output. For more advanced logging options like storing data in files or database tables, you can check out Laravel's documentation on logging (https://laravelcompany.com/docs/6.x/logging).

<h2>Using <code>Log::debug()</code> for System-wide Logging</h2>
Sometimes, you may need to log specific debug information for your entire application instead of just a controller's execution. For this, Laravel provides the <code>Log</code> facade.

<pre><code>class TestMeController extends Controller {
    public function callMe($id)
    {
        $params = Request::all();

        Log::debug("This is a debug log message: " . json_encode($params));
    }
}
</code></pre>
By calling <code>Log::debug()</code>, we can store the logs associated with this controller method in Laravel's debug file, which allows us to view and analyze them later on. This is especially useful for large applications with many controllers that require individual debugging.

<h2>Conclusion</h2>
Debugging values in a Laravel application can be achieved using various methods, such as pausing execution with <code>dd()</code>, dumping without stopping your program with <code>dump()</code>, logging data to the console or browser, and system-wide logging through the <code>Log</code> facade. Each approach has its advantages depending on your specific needs, so pick the one that best fits your situation. Remember to always clean up and remove unnecessary debugging code once you're done with it to maintain a tidy application.
