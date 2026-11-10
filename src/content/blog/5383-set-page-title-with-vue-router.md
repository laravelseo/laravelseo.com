---
title: "Set page title with Vue Router"
description: "Dynamically Setting Page Titles with Vue Router: A Practical Guide As developers building Single Page Applications (SPAs) with Vue and Vue Router, one of the..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Content", "JavaScript", "HTML", "Errors"]
featured: false
---

As developers building Single Page Applications (SPAs) with Vue and Vue Router, one of the most common requirements is ensuring that the browser tab title accurately reflects the current view. When you define meta titles within your route configuration (using `meta` properties), the next logical step is to dynamically display this title in your main content, such as an `<h2>` tag.

You've encountered a classic hurdle: attempting to use `$emit` within navigation guards to push data to a globally visible element often doesn't work as expected because routing state changes are handled internally by Vue Router, requiring specific hooks for global updates.

This guide will walk you through the correct, idiomatic ways to dynamically set your page title based on the current route, moving beyond the failed `$emit` attempt.

## Why `$emit` Fails in `beforeEach`

When you use `router.beforeEach`, its primary job is to intercept navigation *before* it happens (e.g., for authentication checks or redirecting). While you can emit events, these events are scoped to the component that emitted them and don't automatically propagate to a globally visible element like an `<h2>` outside of the direct component hierarchy unless you manage that state explicitly.

The issue is not with Vue Router itself, but rather how we bridge the router's navigation lifecycle with the view layer. To achieve dynamic title setting across your entire application, we need a mechanism that monitors route changes and updates a shared piece of data accessible by all components.

## Solution 1: Leveraging Route Metadata for Direct Access

The most straightforward and robust solution in Vue Router is to let the component itself read the necessary information directly from the current route object. This avoids the complexity of managing global emitted events for simple metadata display.

If you have defined your titles within the route configuration (as shown in your example), you can access them directly using `$route`.

### Implementation Example

Instead of trying to emit a title, let's ensure the component reading the title pulls it from `to.meta.title` when the route changes.

Here is how you can structure your setup:

```javascript
// router/index.js (Route Definition)
const routes = [
  {path: '/dashboard', component: dashboard, name:'dashboard', meta: { title: 'Dashboard' }},
  {path: '/about', component: about, name:'about', meta: { title: 'About' }}
];

const router = new VueRouter({
  routes 
});

// No need for complex beforeEach emission if components handle titles locally.
export default router;
```

And in your main view component (`App.vue` or a Layout component):

```html
<div id="app">
  <!-- The H1 dynamically reads the title from the current route object -->
  <h2>{{ $route.meta.title || 'Welcome' }}</h2> 
  <router-view></router-view>
</div>
```

This approach is simple because it keeps the data close to where it is used. It aligns with principles of clean separation, which is crucial when designing scalable systems, much like ensuring robust data flow in large Laravel applications relies on well-defined contracts.

## Solution 2: Setting Global State via Navigation Hooks (For Complex Apps)

If you need this title to reflect globally and potentially trigger side effects across many components—perhaps updating a persistent header component that sits outside the `<router-view>`—you should use a global state management pattern instead of direct emission.

You can use `router.afterEach` within your navigation guard to update a central store (like Vuex or Pinia).

```javascript
// router/index.js
router.beforeEach((to, from, next) => {
  // Perform authentication checks here...
  next();
});

router.afterEach((to) => {
  // After navigation is complete, update a global state store.
  // Assuming you have a store accessible globally:
  store.commit('setPageTitle', to.meta.title); 
});
```

In your main layout component, instead of binding the title directly to `$route.meta`, you would now listen for changes in that global store:

```javascript
// In your Layout Component setup
import { mapState } from 'vuex';

export default {
  computed: {
    pageTitle() {
      // Watch the global state instead of just reading route meta directly
      return this.$store.state.pageTitle; 
    }
  },
  mounted() {
    // Set initial title on load
    this.pageTitle = this.$store.state.pageTitle;
  },
  watch: {
    // React to state changes from the store
    '$pageTitle': {
      immediate: true,
      handler(newTitle) {
        document.title = newTitle; // Update the actual browser title tag
      }
    }
  }
}
```

## Conclusion

For setting dynamic page titles in a Vue Router application, the best approach depends on complexity. For simple cases, directly accessing `to.meta.title` within your component is the cleanest solution. If you are building a larger, enterprise-level application where many parts of the UI need to react to route changes, implementing a global state update via `router.afterEach` and leveraging Vuex or Pinia provides superior architectural control. Remember, focusing on clear data flow, similar to how we structure APIs in Laravel, leads to more maintainable frontends.
