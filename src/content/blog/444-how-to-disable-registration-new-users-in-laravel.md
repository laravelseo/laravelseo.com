---
title: "How to disable registration new users in Laravel"
description: "Title: Effortlessly Disable User Registration While Maintaining Login Functionality in Laravel Applications With the rise of security threats, privacy..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Effortlessly Disable User Registration While Maintaining Login Functionality in Laravel Applications

<p>With the rise of security threats, privacy concerns, and increasing regulation in different industries, it's not uncommon for web applications to restrict who can create new accounts. In Laravel, you might want to disable new user registrations while still allowing existing users to log in. This blog post will walk you through a simple process that disables registration forms, routes, and associated controllers without affecting login functionalities.</p>

<h2>Disable User Registration</h2>
<ol>
  <li><p>Firstly, navigate to the Laravel project's root folder. Open the <code>config/auth.php</code> file and search for the "default" section in the array.</p></li>
  <li><p>Find the <code>'register' => true</code>, which enables user registration by default. Change its value to false, making it <code>'register' => false</code>. This will disable new registrations altogether.</p></li>
  <li><p>Save the changes and close the file. Now refresh the app, ensuring no user can register a new account through the default routes or forms.</p></li>
</ol>

If you solely want to remove only the registration form from your application's interface but not disable it entirely, follow these steps:
<ol start="3">
  <li><p>Navigate to the Laravel project's root folder. Open the <code>resources/views/auth</code> directory.</p></li>
  <li><p>Delete or comment out the <code>'register' => true</code> line in the <code>RegisterController.php</code> file. This will prevent Laravel from rendering the default registration form when users visit that route.</p></li>
  <li><p>Save and close the file. Now, refresh your application, and check if the 'Register' link is no longer visible or accessible to visitors.</p></li>
</ol>

<h2>Disable Registration but Maintain Login Functionalities</h2>
To disable registration forms, routes, and controllers only while keeping login functionalities intact:
<ol start="4">
  <li><p>Navigate to the Laravel project's root folder. Open the <code>routes/web.php</code> file.</p></li>
  <li><p>Comment out or remove the following lines:</p></li>
  <ul>
    <li><code>'GET|POST' => 'auth/register',</code></li>
    <li><code>'GET' => 'auth/login',</code>, and</li>
    <li><code>'POST' => 'auth/authenticate',</code></li>
  </ul>
  <li><p>Save the changes, close the file, and refresh your application. Now, you won't see any registration forms or links in the app.</p></li>
  <li><p>Finally, navigate to the Laravel project's root folder again. Open the <code>config/auth.php</code> file and search for the "default" section. Edit the following lines in line with your requirements:</p></li>
  <ul>
    <li><code>'confirm' => false,</code>, to disable account confirmation.</li>
    <li><code>'passwords' => true,</code> to enable password reset functionality.</li>
    <li><code>'verify_email' => false,</code> to disable email verification for existing users.</li>
  </ul>
  <p>Save the changes and close the file. Refresh your app, ensuring no new user can register or perform specific account management operations.</p>
  </ol>

To ensure you have a complete solution tailored for your application, always consult the Laravel documentation (https://laravel.com/docs) and seek guidance from experienced developers at https://laravelcompany.com/.
