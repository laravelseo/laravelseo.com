---
title: "Auto refresh token and autologout in vue"
description: "Mastering Session Management in Vue: Auto Refresh Tokens and Smart Logouts Welcome to the world of full stack development! Moving from setting up your first..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript"]
featured: false
---

Welcome to the world of full-stack development! Moving from setting up your first Laravel project to building dynamic frontend applications with Vue is an exciting journey. As you tackle more complex features, managing authentication state—specifically refreshing tokens and handling inactivity—becomes crucial. It’s a common challenge for beginners, but it involves understanding how client-side JavaScript interacts with server-side APIs.

You are running into a very common hurdle: using simple `setTimeout` functions only works for one-time events. For continuous, background tasks like token refreshing or inactivity monitoring, you need a persistent mechanism that runs repeatedly, even when the user isn't actively interacting with the page.

This guide will walk you through the correct, robust way to handle auto-refresh tokens and implement smart logouts within your Vue application.

## Why Simple `setTimeout` Fails for Background Tasks

Your attempt using `setTimeout` is conceptually sound for a single delayed action:

```javascript
setTimeout(function() {
  window.location.href = "domain.com/logout";
}, 30000); // 30 seconds
```

However, this function executes *once* after the specified delay. It doesn't create a loop or persist state across multiple refreshes or user interactions necessary for true session management. To achieve auto-refreshing and inactivity detection, we need an ongoing process managed by `setInterval`.

## Strategy 1: Implementing Automatic Token Refreshing

Token refreshing is vital to maintain a valid session without forcing the user to log in repeatedly. This typically involves setting up an interval that periodically calls your refresh endpoint (e.g., `/api/refresh`) using the stored refresh token.

### The Vue Implementation with `setInterval`

We will use Vue's reactivity system and `setInterval` within a composable or a main component setup to manage this loop effectively.

Here is a conceptual example demonstrating how you might structure this logic in your Vue component:

```javascript
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  setup() {
    const token = ref('your_initial_access_token');
    let refreshIntervalId = null;
    const REFRESH_INTERVAL_MS = 60000; // Refresh every 60 seconds (1 minute)

    // Function to handle the token refresh request
    const refreshToken = async () => {
      console.log("Attempting to refresh token...");
      try {
        // In a real app, you would use axios or fetch here
        const response = await fetch('https://domain.com/api/refresh', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}` // Or whatever authentication method is used
          }
        });

        if (!response.ok) {
          throw new Error('Token refresh failed');
        }

        const data = await response.json();
        // Update the token and potentially a new expiry time
        token.value = data.new_access_token; 
        console.log("Token successfully refreshed.");
      } catch (error) {
        console.error("Error during token refresh:", error);
        // Handle expired token scenarios (e.g., redirect to login)
      }
    };

    const startAutoRefresh = () => {
      if (refreshIntervalId) return; // Prevent starting multiple intervals
      
      // Run immediately upon load, then set the interval
      refreshToken(); 
      refreshIntervalId = setInterval(refreshToken, REFRESH_INTERVAL_MS);
      console.log(`Token refresh scheduled every ${REFRESH_INTERVAL_MS / 1000} seconds.`);
    };

    const stopAutoRefresh = () => {
      if (refreshIntervalId) {
        clearInterval(refreshIntervalId);
        refreshIntervalId = null;
        console.log("Token refresh stopped.");
      }
    };

    onMounted(() => {
      startAutoRefresh();
    });

    onUnmounted(() => {
      // Crucial: Clean up the interval when the component is destroyed
      stopAutoRefresh();
    });

    return { token, startAutoRefresh, stopAutoRefresh };
  }
}
```

## Strategy 2: Detecting User Inactivity (Auto-Logout)

Detecting inactivity requires tracking user interactions. The most reliable way to manage this in a web application is by monitoring the "last activity time" and checking it against the current time.

1.  **Tracking Activity:** Every time a user interacts with the page (clicks, types), update a timestamp stored in your Vue state (or ideally, send an AJAX ping to a dedicated server endpoint).
2.  **The Inactivity Check:** Use `setInterval` again, but this time to check the inactivity timer every few minutes.

For true security and reliability, the actual session timeout logic should reside on the **Laravel backend**. The Vue application simply signals the need for a logout. When the client detects prolonged inactivity (e.g., 5 minutes without an API call), it triggers a request to the server to invalidate the session token. This ensures that the session state is managed securely by your Laravel application, which is where robust security belongs.

## Conclusion: Security and Separation of Concerns

As you grow your project, remember the principle of separation of concerns. While Vue excels at managing the user experience (what the user sees and does), the critical tasks—like token validation, session expiration, and actual logout—must be handled securely by the backend, where your Laravel application resides.

By leveraging `setInterval` for background polling (token refresh) and carefully tracking client-side events for inactivity indicators, you can build sophisticated, responsive applications. Keep building! If you are working with API structures, understanding how Laravel handles token issuance and revocation is key to making these frontend mechanics work smoothly. For deep dives into robust API design, exploring resources like [https://laravelcompany.com](https://laravelcompany.com) will only deepen your knowledge of secure backend practices.
