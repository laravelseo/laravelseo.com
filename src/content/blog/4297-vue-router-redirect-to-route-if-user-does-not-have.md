---
title: "Vue-router: redirect to route if user does not have permissions"
description: "Vue Router: Redirecting Routes Based on User Permissions As a senior developer working with modern full stack applications, you frequently encounter the..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Content", "JavaScript"]
featured: false
---

As a senior developer working with modern full-stack applications, you frequently encounter the challenge of implementing authorization in the frontend. While your backend—powered by robust systems like Laravel with packages such as Spatie's permission system—correctly handles access control at the server level, the frontend must also enforce these rules to prevent unauthorized access and maintain a secure user experience.

You have set up an excellent foundation by fetching permissions upon login and storing them in `localStorage`. The next logical step is leveraging Vue-router’s navigation guards to intercept route changes and perform this crucial authorization check before allowing the user to view protected content.

This guide will walk you through how to effectively use Vue-router's capabilities to redirect users based on their permissions, ensuring that only authorized users can access specific resources.

## The Strategy: Using Navigation Guards

The most effective place to implement global route protection in Vue is within the `router.beforeEach` navigation guard. This guard executes before any route transition occurs. Inside this function, we can inspect the target route's metadata (which you have correctly set up with the `meta` property) and compare it against the user's permissions stored locally.

This approach centralizes your authorization logic, ensuring that every protected route is guarded by the same security policy.

### Step 1: Preparing the Route Metadata

Your setup using `meta` tags is perfect for this purpose. We rely on Vue-router to expose this data during navigation.

```javascript
// Example Route Configuration (as provided)
{
  path: 'users',
  name: 'Users',
  component: Users,
  meta : {
    permissions: 'read_users' // Required permission for this route
  }
},
// ... other routes
```

### Step 2: Implementing the Authorization Logic in `beforeEach`

We will define a function that checks if the current user possesses *all* the required permissions for the target route. If they do not, we redirect them to a safe default location (like the homepage or an access denied page).

Here is how you can integrate this logic into your router setup:

```javascript
import { createRouter, createWebHistory } from 'vue-router';
import router from './router'; // Assuming you import your router instance

// Assume permissions are stored in localStorage and loaded here
const userPermissions = JSON.parse(localStorage.getItem('permissions') || '[]');

router.beforeEach((to, from, next) => {
  // 1. Determine the required permissions for the target route
  const requiredPermission = to.meta.permissions;

  if (!requiredPermission) {
    // If no permission is specified for this route, allow access by default
    next();
    return;
  }

  // 2. Check if the user has the specific permission
  const hasPermission = userPermissions.includes(requiredPermission);

  if (hasPermission) {
    // Permission granted: proceed to the route
    next();
  } else {
    // Permission denied: redirect the user
    console.warn(`Access Denied: User does not have permission for ${to.path}`);
    // Redirect to a safe default page, like the customers list
    next('/customers'); 
  }
});

export default router;
```

### Step 3: Contextualizing with Backend Data (Best Practice)

While checking `localStorage` works for simple applications, it is vital to remember that **client-side checks are only for UX enhancement**. Never rely solely on frontend checks for security. The final gatekeeper must always be the backend.

The Laravel permissions system you mentioned is excellent because it enforces data integrity server-side. When a user attempts an action (e.g., creating a role), your API endpoint must first check the authenticated user's permissions *before* executing the database operation, exactly as you would enforce in any robust application architecture, including systems built on Laravel principles.

For complex applications, consider fetching the necessary permissions for the route directly from a secure API call during initialization or when navigating to a protected section, rather than relying solely on potentially stale local storage data. This ensures that if `localStorage` is tampered with, your security remains intact.

## Conclusion

By strategically implementing navigation guards in Vue-router and utilizing route metadata (`meta`), you can effectively build a layer of front-end authorization. The pattern demonstrated—checking user permissions against route requirements before allowing navigation—is a cornerstone of secure application development. Remember that while the frontend provides immediate feedback, the integrity of your system ultimately rests on the robust security measures enforced by your backend, much like the strong foundation provided by frameworks like Laravel.
