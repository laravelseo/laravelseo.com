---
title: "Default Persistent Layout In Laravel + Inertia + Vite"
description: "Default Persistent Layout in Laravel + Inertia + Vite: Solving the Resolution Puzzle Setting up a modern stack involving Laravel, Inertia.js, and Vite is..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "HTML", "PHP"]
featured: false
---

Setting up a modern stack involving Laravel, Inertia.js, and Vite is incredibly powerful for building dynamic user interfaces. However, as developers evolve, small incompatibilities between tooling updates—like moving from traditional PHP loading to modern asset bundling via Vite—can introduce frustrating roadblocks.

Recently, I encountered a specific challenge when trying to implement a default layout system within an Inertia application. The goal was simple: automatically inject a `DefaultLayoutFile` into every page component, regardless of how the page was imported or resolved by the Vite bundler.

This post dives into the exact problem and presents a practical workaround for achieving this persistent layout injection in a modern Laravel/Inertia setup.

## The Dilemma: Why Simple Resolution Failed

The initial approach involved customizing the `resolve` property within the `createInertiaApp` function to manually dictate which page component file was loaded.

```javascript
// Original problematic attempt (Conceptual)
resolve: name => import('./Pages/' + name), // or resolve using require()
```

This worked fine in older setups where standard PHP-style `require` operations provided direct access to the exported object, allowing us to check for a `.layout` property and inject our default file if it was missing.

However, when migrating to the Vite-based asset bundling system, specifically utilizing functions like `resolvePageComponent` which rely on `import.meta.glob`, the import mechanism changes fundamentally. The way Vite bundles assets alters how module resolution occurs, meaning direct use of `require()` or simple `import()` doesn't always return the expected default object structure that we need to inspect and modify before Inertia renders the page. We lose the easy access to the exported defaults.

## The Workaround: Intercepting Page Resolution

Since directly modifying the import path proved insufficient due to Vite’s bundling layer, we needed a mechanism that hooks into the loading process *after* the files are resolved but *before* they are passed to Inertia.

The solution lies in moving the logic slightly and leveraging the structure provided by the component definitions themselves, rather than trying to force an impossible modification on the asset loader. Instead of relying solely on tweaking `resolve`, we can ensure that our page components themselves handle the layout injection based on a consistent convention.

### Implementing Layout Injection via Component Structure

Instead of trying to inject the layout deep within the Inertia setup configuration, we shift the responsibility to the page component itself. This aligns better with idiomatic Laravel/Inertia development, promoting clearer separation of concerns—a principle central to robust application design, much like the philosophy found in large-scale Laravel projects on **laravelcompany.com**.

Here is how we structure the process:

1.  **Define a Convention:** Ensure all page components adhere to a standard interface.
2.  **Component Logic:** The page component checks if it has been provided an explicit layout or defaults to the global default.

If you are using a base layout (e.g., `layouts.app`), you can structure your pages like this:

```javascript
// app/Pages/Dashboard.vue (or .jsx/.tsx)

import DefaultLayout from '@/Layouts/DefaultLayout.vue'; // Import the desired default layout

export default {
  layout: DefaultLayout, // Explicitly define the layout here
  // ... other page specific props or data
}
```

By making this explicit in every page file, we bypass the need to modify the complex Vite resolution chain for simple defaults. If a developer forgets to specify it, they are forced to explicitly choose a layout, which
