---
title: "Dynamically add a child component in Vue JS"
description: "Dynamically Add Child Components in Vue.js: A Deep Dive into Component Composition As a senior developer working with the Laravel ecosystem and modern..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "HTML", "Errors"]
featured: false
---

As a senior developer working with the Laravel ecosystem and modern front-end frameworks like Vue.js, managing component composition—especially dynamic rendering—is a frequent challenge. When you need a parent component to decide which child component to render based on data, you move from static HTML generation to dynamic component management.

This post addresses the specific issue of dynamically adding components in Vue.js and clarifies why your initial attempt failed, providing a robust solution for composing complex UIs. We will explore the correct patterns for dynamic component loading within a Vue application.

## The Challenge: Dynamic Component Rendering

You are attempting to use a string (like `"show-1"`) passed from your backend (via Blade in Laravel) to dynamically load and render the corresponding Vue component within a parent wrapper. The core issue lies not in passing the data, but in how Vue handles component registration and dynamic binding.

Your observation that changing the `view` prop in the parent fixes the behavior suggests that the mechanism for mapping the string name to an actual component definition was missing or incorrectly implemented in the parent's script.

## The Vue Solution: Using `<component :is="...">`

In Vue, the standard and most flexible way to render a component dynamically is by using the built-in `<component>` tag combined with the `:is` attribute (or the shorthand `:is`). This tells Vue to render whichever component is specified by the value of the binding.

To make this dynamic system work, you must register all potential child components in the parent's `components` option before attempting to bind to them.

### Step 1: Registering Components in the Parent

In your `wrapper` component, you need to define which components are available. This is done by mapping component names to their actual imported definitions.

```vue
<script>
export default {
    props: ['title', 'view'], // Now we accept 'view' as a prop
    components: {
        'show-1': require('./components/Show1.vue'), // Register the child component
        'show-2': require('./components/Show2.vue'),
        'show-3': require('./components/Show3.vue'),
        // Add all other components here
    },
    data() {
        return {
            // We will use 'view' to store the dynamic component name
            view: '' 
        }
    }
}
</script>
```

### Step 2: Dynamic Rendering in the Template

Now, instead of using a static `<component is="view">`, you bind the `:is` attribute directly to your dynamic data property.

```html
<template>
    <div class="card border-light">
        <div class="card-header">
            <h5 class="title">{{ title }}</h5>
        </div>
        <div class="card-body">
            <!-- Dynamic rendering happens here -->
            <component :is="view"></component> 
        </div>
        <div class="card-footer"></div>
    </div>
</template>
```

### Step 3: Passing the Dynamic Data (Laravel/Blade Context)

The final step is ensuring your PHP/Blade layer passes the correct component name as a string. Since you are passing dynamic data, this value must be treated carefully. If you are using standard Blade syntax, ensure the variable being passed corresponds exactly to one of the registered component names.

In your Blade file:

```blade
<wrapper
    title="Example"
    view="show-1"  <!-- This string must match a key in the parent's components registration -->
>
</wrapper>
```

When `view` is set to `"show-1"`, Vue looks up the registered component named `show-1` and renders it. If you change it to `"show-2"`, Vue swaps out the rendered content instantly because the underlying data bound to `:is` has changed, triggering a re-render.

## Why This Works: Component Composition Philosophy

This pattern adheres to the principles of component composition, allowing your parent to act as a highly flexible container rather than dictating the exact structure of all its children. It separates *what* is being rendered (the data) from *how* it is rendered (the component definition).

When building complex applications, especially those leveraging the robust structure provided by frameworks like Laravel, ensuring clean separation between backend logic and frontend presentation is key. Understanding how Vue handles dynamic state management is crucial for scaling your architecture, similar to how well-structured Eloquent models guide data flow in a Laravel application. If you are developing sophisticated interfaces, understanding these architectural patterns will help you build more maintainable systems.

## Conclusion

Dynamically adding child components in Vue.js is achieved by leveraging the `<component :is="...">` directive and ensuring that all potential components are correctly registered within the parent component's `components` option. By treating the desired component name as reactive data, you create a powerful, flexible system capable of rendering entirely different UI structures based on simple data inputs. Embrace this pattern to build highly reusable and dynamic user interfaces.
