---
title: "How to use React js in blade template"
description: "Bridging the Gap: How to Use React Components within Laravel Blade Templates As a senior developer working with the Laravel ecosystem, integrating modern..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "JavaScript", "HTML"]
featured: false
---

As a senior developer working with the Laravel ecosystem, integrating modern front-end frameworks like React into traditional server-side rendering environments like Blade templates is a common and powerful pattern. When you use the `laravel/preset react`, you are setting up a scaffold that allows you to leverage the full power of both PHP for backend logic and JavaScript for dynamic UI.

The core challenge, as you rightly identified, lies in bridging the gap: how do we securely pass data retrieved from a Laravel controller (server-side) down into a dynamically rendered React component (client-side)? Simply echoing data in Blade doesn't automatically make it available to your compiled JavaScript bundle.

This post will walk you through the correct architectural approach to use server-side data within your React components, ensuring proper separation of concerns and efficient data flow.

## The Server-Side to Client-Side Data Flow

When dealing with Laravel and React, remember that Blade renders HTML on the server, and React renders the UI in the browser. Therefore, the data must be serialized into a format that JavaScript can easily consume—JSON is the perfect vehicle for this.

Your initial approach using `{{ $datas }}` only displays raw text; it does not inject actionable data into the client-side state management of your React application. To make data accessible to React components, we need to embed that data directly into the HTML structure as a JavaScript variable or configuration object.

### Step 1: Preparing Data in the Controller and Blade View

First, ensure your controller passes the data correctly. Assuming you are using Eloquent models (a cornerstone of building robust applications on Laravel), fetching the data is straightforward.

**In your Controller:**

```php
// Example HomeController.php
public function index()
{
    $datas = [
        ['id' => 1, 'name' => 'Item A', 'value' => 100],
        ['id' => 2, 'name' => 'Item B', 'value' => 250]
    ];

    // Pass the data to the view
    return view('theview', ['datas' => $datas]);
}
```

**In your Blade View (`theview.blade.php`):**

Instead of just echoing variables, we will use the `@json` directive or standard PHP to output a script block containing the necessary data for React to initialize itself.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>React Data Example</title>
</head>
<body>

    <!-- This is where React will mount -->
    <div id="react-root">
        <!-- Initial data injection point for React -->
        <script>
            // Pass the Laravel data as a JSON object to be consumed by the client-side script
            window.initialData = @json($datas);
        </script>
    </div>

    <!-- Your compiled React/JS bundle will load here -->
    <script src="{{ asset('js/app.js') }}"></script>
</body>
</html>
```

The key here is the `@json($datas)` Blade directive, which safely converts your PHP array into a valid JSON string that JavaScript can parse immediately upon page load. This ensures the data is available in the global scope (`window.initialData`) for any script running on the client side.

### Step 2: Consuming Data in the React Component

Now, within your main React component (which would typically be mounted into the `#react-root` div), you can access this globally available data to initialize your state or render lists.

**In your React Component (e.g., `Home.jsx`):**

```javascript
import React, { useState, useEffect } from 'react';

function Home() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        // 1. Check if the data was successfully passed from Blade
        if (window.initialData && Array.isArray(window.initialData)) {
            setItems(window.initialData);
        } else {
            console.error("Error: Initial data not found in window object.");
        }
    }, []);

    return (
        <div>
            <h2>Data Loaded via Laravel & React</h2>
            <ul>
                {items.map(item => (
                    <li key={item.id}>
                        Name: {item.name}, Value: ${item.value}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Home;
```
