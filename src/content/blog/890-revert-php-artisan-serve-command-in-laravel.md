---
title: "revert 'php artisan serve' command in laravel"
description: "Title: Terminating 'php artisan serve' Command for Laravel Apps Body: In the world of web development, it is quite often that developers need to run the 'php..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Terminating 'php artisan serve' Command for Laravel Apps

Body:
<p>In the world of web development, it is quite often that developers need to run the <code>'php artisan serve'</code> command to test their Laravel applications locally. The <strong>localhost:8000</strong> address is where your app gets served through this command. However, sometimes you might want to stop serving your app on a particular port or just simply need it not to run at all.</p>

<p><strong>Note:</strong> This article assumes that you are using Windows for testing purposes. Linux users may find slight differences, mostly in the path names and terminal commands.</p>

<h3>Stopping the 'php artisan serve' Command</h3>
If your Laravel app is still running even after closing your command line interface (CLI), this indicates that you might have accidentally left behind a persistent process or a background service. In this case, you need to locate and terminate these processes to take control of the server again. Follow the steps below:

1. Press Ctrl+Shift+Esc on your keyboard to open Task Manager. Alternatively, right-click on the taskbar, select 'Task Manager' from the menu, or press Ctrl+Alt+Delete and click on 'Task Manager.'

2. In the Task Manager window, navigate to the 'Processes' tab if you're using Windows 10 or earlier, or go to 'Details' tab in more recent versions of Windows (Windows 11 or later).

3. Scroll through the list of running processes until you find any entry related to Laravel. You may see "artisan" or "php artisan serve." Identify the PID (process identifier) associated with this process and note it down, as we'll need it for further operations.

4. Right-click on the Laravel process to open a context menu, then choose 'Go to Details.' Alternatively, you can select the process and press Ctrl+Shift+E to go directly to the details window. This will open a new window containing more information about the selected process.

5. In the "Details" tab, locate the 'Command Line' field. Note down its content as this is the command that initiated your Laravel app. If you haven't changed the default path for your artisan commands, it should be <code>'C:\xampp\php\php.exe C:\\wamp64\\bin\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php start'</code>, or something similar to that.

<h3>Terminating the Laravel Processes</h3>
To stop the Laravel process, you can follow these steps:

1. In the Task Manager window, locate the PID (process identifier) associated with the Laravel process.

2. Right-click on the Laravel process and select 'End Task.' Alternatively, click on the 'End task' button located at the bottom of the task details window to terminate this process.

3. If you haven't closed the original console that executed the <code>'php artisan serve'</code> command, open a new terminal and navigate to the parent directory where the Laravel app is located.

4. Type <code>'kill -9 PID_NUMBER'</code>, replacing 'PID_NUMBER' with the PID you previously noted down. This will forcefully terminate the process associated with that PID.

<h3>Preventing Similar Issues in the Future</h3>
To avoid having your Laravel app running on port 8000 even after closing the CLI, perform these additional steps:

1. Change the <code>'php artisan serve'</code> command to a more specific one using your own custom PID or process name (if you have one). For instance, use <code>'php artisan serve --host localhost --port 8000 --pid PID_FILE_NAME.pid'</code> where <code>PID_FILE_NAME.pid</code> is a file that will store your process ID.

2. Whenever you run the command, place the script in a loop that checks if the process is still running before creating a new one. To do this, add an 'if' statement around your Laravel command, checking for the existence of the PID file and executing only if it doesn't exist or has been deleted since your last call to the server.

3. Incorporate proper error handling to ensure that your Laravel app can be safely stopped when needed. You could use the signal handler mechanism (https://www.php.net/manual/en/function.pcntl-signal.set) or a simple try-catch block around the loop to catch any errors.

With these steps, you'll have successfully learned how to terminate the 'php artisan serve' command for your Laravel app and avoid this problem in the future. For more tips on debugging and optimizing your Laravel applications, visit https://laravelcompany.com/blog or follow our technical blog posts.
