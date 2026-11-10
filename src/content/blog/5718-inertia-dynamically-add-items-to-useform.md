---
title: "Inertia Dynamically add items to useForm()"
description: "Inertia & Vue: Dynamically Managing Form State with useForm() As developers building dynamic interfaces with Inertia.js and Vue 3, we often encounter the..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["JavaScript"]
featured: false
---

As developers building dynamic interfaces with Inertia.js and Vue 3, we often encounter the need to create reusable components that generate complex form structures on the fly. The goal is to leverage the power of `$inertia` helpers while maintaining full reactivity within the component structure.

One common challenge arises when trying to dynamically populate an Inertia `useForm()` instance with fields defined by props. As you've discovered, simply assigning reactive properties inside a custom composable doesn't always translate into the expected reactive behavior when integrated directly with `@inertiajs/vue3/useForm`.

This post dives into the specific difficulty of making dynamic form data behave reactively and presents a refined approach to managing state efficiently.

## The Reactivity Puzzle in Dynamic Forms

The scenario described—where you define fields via props, construct an internal `formData` object, and then pass this to `useForm()`—is conceptually sound but often hits friction points regarding Vue's reactivity tracking. You observe that while the underlying `formData` object seems reactive in dev tools, it doesn't behave as expected when bound to form inputs, leading to stale or non-updating fields.

This issue usually stems from mixing data structures: using a plain JavaScript object (`reactive({})`) and attempting to map those properties directly into the structure expected by Inertia’s state management system. When dealing with dynamic forms, the key is ensuring that every change propagates correctly through Vue's dependency tracking chain.

## Refactoring for True Reactivity

The goal isn't just to store data; it's to ensure that when a user types into an input bound via `v-model`, the underlying form state updates immediately and correctly reflects the structure defined by your dynamic fields.

Let’s refine the approach by ensuring our composable handles state initialization in a way that is fully compatible with Inertia’s expectations, focusing on defining the initial state explicitly rather than relying solely on reactive setup within `onBeforeMount`.

### The Improved Form Constructor Strategy

Instead of initializing an empty object and then populating it inside lifecycle hooks, we should construct the entire initial state based on the provided field definitions upfront. This makes the relationship between the fields and the form data explicit and easier for Vue to track.

Here is a conceptual refinement of your `useFormConstructor` composable:

```typescript
// In /composables/formConstructor.ts (Refined Approach)
import { reactive } from "vue";
import { useForm } from "@inertiajs/vue3";

interface FieldDefinition {
    type: string;
    name: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
}

export function useFormConstructor(fields: FieldDefinition[]) {
    // 1. Initialize the form data structure based on fields
    const initialFormData = reactive({});
    
    // Populate initial state with nulls or defaults for all fields
    fields.forEach((field) => {
        initialFormData[field.name] = field.required ? '' : ''; // Set sensible defaults
    });

    // 2. Initialize useForm with the newly structured data
    const form = useForm({ ...initialFormData });

    // Note: We remove onBeforeMount logic here as setup is now synchronous.

    return form;
}
```

### Integrating the Refined State

By initializing `useForm` with a fully defined, reactive object (`initialFormData`), any subsequent updates made via `$form.data` or direct manipulation of the state within your component will correctly trigger Vue's reactivity system. This ensures that when you bind inputs using `v-model`, the data flow is seamless and predictable, which is crucial for maintaining robust user experiences, especially when dealing with complex interactions that mirror the structure found in applications built on frameworks like Laravel.

In your `FormComponent.vue`, ensure that the binding logic strictly references the properties within the form object:

```html
<!-- In FormComponent.vue template -->
<Input
    v-for="(field, index) in fields"
    :key="index"
    :id="field.id"
    :type="field.type"
    :name="field.name"
    :value="form.data[field.name]"         <!-- Use form.data for binding -->
    @input="form.data[field.name] = $event.target.value" <!-- Explicitly update the state -->
    :placeholder="field.placeholder || ''"
/>
```

This explicit handling of setting and updating `form.data` ensures that Inertia's reactive layer correctly monitors changes, resolving the observed non-reactivity issue.

## Conclusion

Dynamically generating forms in an Inertia/Vue environment requires careful orchestration between your custom composables and the framework's state management utilities. The key takeaway is to treat the data passed into `useForm()` as the single source of truth for reactivity. By structuring your initial state synchronously and ensuring that all input binding methods explicitly modify this centralized reactive object, you can achieve dynamic form creation that is both powerful and fully responsive. For deeper insights into building robust application layers, exploring patterns similar to those used in Laravel projects can provide excellent context on managing complex state flow.
