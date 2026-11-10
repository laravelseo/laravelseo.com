---
title: "abort all Axios requests when change route use vue-router"
description: "Abort All Axios Requests When Changing Routes with Vue Router When building modern Single Page Applications (SPAs) with frameworks like Vue.js and navigation..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["JavaScript"]
featured: false
---

When building modern Single Page Applications (SPAs) with frameworks like Vue.js and navigation libraries like Vue Router, managing asynchronous operations—especially network requests—is crucial. A common pitfall developers encounter is the issue you described: rapidly changing routes causes multiple, overlapping Axios requests to be initiated, which wastes bandwidth, burdens the server, and can lead to stale or erroneous data being processed once the user lands on a new page.

This post will dive deep into the problem and provide a robust, developer-focused solution using native browser APIs to gracefully cancel pending HTTP requests.

## The Problem: Request Overload During Navigation

Consider a scenario where a user clicks through several navigation links very quickly. If each route change triggers an asynchronous data fetch (an Axios call), you end up with a queue of incomplete requests. For example, the request for `/dashboard` might be sent, but before it resolves, the user navigates to `/profile`, triggering another request that should have been cancelled. These pending requests consume resources and complicate state management.

The goal is simple: when a new navigation event occurs, we must tell any currently running or pending network requests to stop immediately.

## The Solution: Using `AbortController` with Axios

The standard and most effective way to cancel an ongoing request in modern JavaScript environments, including those used within Vue applications, is by utilizing the `AbortController` API. Axios natively supports this cancellation mechanism by accepting an `AbortSignal`.

### How `AbortController` Works

1.  **Create a Controller:** Before making the request, we create an `AbortController` instance.
2.  **Get the Signal:** We retrieve the `signal` object from the controller.
3.  **Pass the Signal:** We pass this signal object into the Axios configuration as the `signal` property.
4.  **Aborting:** When a route change happens, we call the `.abort()` method on the controller. This immediately signals all listeners (including the underlying network stack) to terminate the request.

### Practical Implementation Example

Here is how you can refactor your data fetching logic in a Vue component to handle request cancellation effectively:

```javascript
import axios from 'axios';
import { ref } from 'vue';

export default {
  setup() {
    const fetchData = async (url, signal) => {
      try {
        console.log(`Request started for: ${url}`);
        // Axios uses the signal property to manage cancellation
        const response = await axios.get(url, { signal });
        console.log(`Success for: ${url}`);
        return response.data;
      } catch (error) {
        // Check if the error was explicitly due to abortion
        if (axios.isCancel(error)) {
          console.log(`Request aborted for: ${url}`);
        } else {
          console.error(`Error fetching ${url}:`, error);
        }
        throw error; // Re-throw to handle application state correctly
      }
    };

    const currentSignal = ref(null);

    const loadData = async (route) => {
      // 1. Abort any previous request immediately upon route change
      if (currentSignal.value) {
        currentSignal.value.abort();
      }

      // 2. Create a new controller for the new request
      const controller = new AbortController();
      currentSignal.value = controller; // Store the signal for potential future cancellation

      try {
        console.log(`Initiating fetch for: ${route}`);
        const data = await fetchData(route, controller.signal);
        // Update component state with fetched data here
        return data;
      } catch (error) {
        // Handle the case where the request was cancelled
        if (axios.isCancel(error)) {
          console.warn(`Data fetch for ${route} was successfully aborted.`);
        } else {
          console.error('An unexpected error occurred:', error);
        }
      }
    };

    // Example usage when a route change triggers this function
    const navigateToProfile = () => {
        loadData('/api/user/profile');
    }

    return { loadData, navigateToProfile };
  }
}
```

## Integration with Vue Router Lifecycle

To tie this cancellation logic directly to route changes in Vue Router, you can leverage lifecycle hooks or watch properties. Whenever the `$route` object changes, you trigger the cancellation of any outstanding operations before initiating a new one. This ensures that your application remains responsive and resource-efficient, adhering to best practices for API interaction, much like ensuring robust backend logic when dealing with data persistence handled by services like those in Laravel.

## Conclusion

By mastering the use of `AbortController` in conjunction with Axios, you transform potentially chaotic asynchronous behavior into a predictable, controlled process. This technique is essential for building high-performance frontends where rapid navigation is common. Always treat network requests as ephemeral operations that require explicit lifecycle management. By implementing this pattern, you prevent request flooding, improve user experience by avoiding unnecessary loading spinners, and ensure your application scales efficiently.
