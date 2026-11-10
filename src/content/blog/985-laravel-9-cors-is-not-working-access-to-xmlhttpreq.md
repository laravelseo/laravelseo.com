---
title: "Laravel 9 - CORS is not working (Access to XMLHttpRequest has been blocked by CORS policy)"
description: "Title: Resolving Laravel 9 CORS Issues with Vuejs Frontend App Body: Laravel is a powerful PHP framework for creating elegant web applications. VueJS, on the..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "PHP", "Errors"]
featured: false
---

Title: Resolving Laravel 9 CORS Issues with Vuejs Frontend App

Body: Laravel is a powerful PHP framework for creating elegant web applications. VueJS, on the other hand, is one of the most popular JavaScript libraries to create interactive and reactive user interfaces. The combination of these two technologies is an excellent choice for building responsive frontend-backend applications. However, sometimes you may encounter Cross-Origin Resource Sharing (CORS) issues when accessing API responses from a Vuejs frontend application. In this comprehensive guide, we will discuss the reasons behind such problems and provide solutions to resolve these CORS issues in a Laravel 9 project with a Vuejs frontend application.

<h2>Understanding CORS Issues</h2>
CORS is a security feature designed to prevent Cross-Site Request Forgery (CSRF) attacks by allowing only specific origins to access resources from different domains. When your Laravel 9 API is hosted on 'http://localhost:8000' and the Vuejs application is running on 'http://127.0.0.1:8080,' there will be an inherent cross-origin access issue if the API response has no 'Access-Control-Allow-Origin' header. This header specifies the origins which can safely access your API resources, and without it, browsers won't allow CORS requests to succeed.

<h2>Configuring Laravel CORS</h2>
To solve this issue, you need to ensure that your Laravel application is sending the required 'Access-Control-Allow-Origin' header in its API responses. You can achieve this through either modifying your `cors.php` file or using a third party library like Valesta. Here's an example of updating `cors.php` to allow all origins:

<pre><code>&lt;?php

return [
    'paths' =&gt; ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' =&gt; ['*'],
    'allowed_origins' =&gt; ['*'],
    'allowed_origins_patterns' =&gt; [],
    'allowed_headers' =&gt; ['*'],
    'exposed_headers' =&gt; [],
    'max_age' =&gt; 0,
    'supports_credentials' =&gt; false,
];
</code></pre>

This configuration will allow access to the API responses from all origins. However, it is not recommended to keep this setting in production as it may open your resources up to security risks. The best practice would be to restrict the allowed origins to specific domains that require access to your API. For more information on configuring CORS in Laravel, please refer to the official documentation: https://laravel.com/docs/9.x/cors#configuration

<h2>Configuring Vuejs Application</h2>
If you are using Axios for making HTTP requests from your Vuejs frontend application, you can configure the Axios instance to allow cross-origin access:

<pre><code>&lt;script&gt;
import { createApp } from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

const app = createApp(App)
app.use(VueAxios, axios.create({
    baseURL: 'http://localhost:8000/api',
    withCredentials: true,
    crossDomain: true,
}))
app.mount('#app')
</code></pre>

This configuration allows your Vuejs application to access the Laravel API responses safely without encountering CORS issues. If you are still facing problems, ensure that your browser's extension or settings are not blocking cross-origin requests.

<h2>Conclusion</h2>
To solve CORS issues in a Laravel 9 project with Vuejs frontend application, you need to configure both the Laravel application and the Vuejs frontend to allow access to each other's resources. The configuration process may vary depending on your specific use cases and security requirements. It is best to follow the official documentation and implement safe practices to secure your API endpoints while ensuring smooth communication between the frontend and backend applications.
