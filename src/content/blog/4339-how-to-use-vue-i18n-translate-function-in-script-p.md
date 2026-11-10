---
title: "How to use vue-i18n translate function in script part of component"
description: "Mastering Vue i18n: Accessing Translation Functions in Component Scripts As developers building complex applications with Laravel and Vue,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "Errors"]
featured: false
---

As developers building complex applications with Laravel and Vue, internationalization (i18n) is a crucial feature for creating truly global user experiences. When integrating packages like `laravel-vue-i18n-generator`, we set up a powerful translation layer. However, bridging the gap between accessing translations in the template versus accessing them within component logic—specifically in the `<script>` section—often reveals subtle scoping issues.

Today, we are diving into a very common pitfall: how to correctly call the translation function (like `$t()`) inside Vue component methods when using an injected setup. We will diagnose the error you encountered and provide the robust solution.

## The Problem: Why `$t()` Fails in Methods

You are running into the error `Uncaught TypeError: Cannot read property 't' of undefined`. This error occurs because, while your template successfully accesses the translation function (likely via the global context or setup provided by Vue), the component methods (`deleteAction` in your example) do not inherit this property directly on `this`.

In a standard Vue component structure, `$t` is usually attached to the component instance, but when using custom setups involving explicit injection like you are doing with `VueInternationalization`, access needs to be explicitly managed. The context provided by the setup isn't automatically merged into the component's local `this` object in a way that standard `$t()` expects for methods.

## The Solution: Accessing Translations via Injection

The key to solving this lies in how you structured your application initialization and how you access the injected services within your component. Since you have successfully injected the `VueInternationalization` instance into your component, we should use that injected object to retrieve the translation function instead of relying on the potentially missing `$t` accessor on `this`.

In your setup:
```javascript
// app.js snippet
const i18n = new VueInternationalization({ /* ... */ });

const app = new Vue({
    el: '#app',
    i18n, // The instance is available here
});
```

You correctly injected `$i18n` into your component via `inject: ['$i18n']`. This means the translation object is available on `this` as `$i18n`, not necessarily as `$t`.

### Correcting the Component Script

Instead of trying to access `this.$t(...)`, you must explicitly call the method on the injected instance, `$i18n`.

Here is how you adjust your component script:

```javascript
<script>
    import swal from 'sweetalert';
    import axios from 'axios';

    export default {
        inject: ['$i18n'], // Ensure $i18n is injected
        props:{
            // ... props defined here
        },
        methods:{
            deleteAction(){
                const vm = this;
                
                // FIX: Access the translation function via the injected instance ($i18n)
                const deleteTitle = vm.$i18n.t('component.delete.title');
                const confirmText = vm.$i18n.t('component.delete.confirm');
                const cancelText = vm.$i18n.t('component.delete.cancel');
                const successMsg = vm.$i18n.t('component.delete.success');
                const errorMsg = vm.$i18n.t('component.delete.error');
                const failedMsg = vm.$i18n.t('component.delete.failed');

                swal({
                    text: this.message, // Use props for dynamic messages if possible
                    buttons: {
                        catch: {
                            text: confirmText,
                            value: "delete",
                        },
                        cancel: cancelText
                    },
                    dangerMode: true
                }).then(name => {
                    if (!name) return false;

                    axios.delete(vm.endpoint)
                        .then(function (response) {
                            // Use the injected instance for success message too
                            swal( vm.$i18n.t('component.delete.congrats'), vm.success, 'success').then(() => {
                                location.reload();
                            });
                        })
                        .catch(function (error) {
                            // Use the injected instance for error messages too
                            swal( vm.$i18n.t('component.delete.error'), vm.failed, 'error');
                        });
                });
            }
        }
    }
</script>
```

## Best Practices and Context

This fix highlights a crucial principle: when dealing with custom Vue setups or complex state management (which is common in large Laravel/Vue applications), always rely on the explicitly injected services rather than assuming global properties like `$t` are universally available across all scopes. This practice promotes cleaner, more predictable code, which aligns perfectly with the principles of robust application design promoted by platforms like [Laravel Company](https://laravelcompany.com).

By injecting the localization manager (`$i18n`) and accessing its methods directly within your component methods, you ensure that your logic is decoupled from potentially unstable global context, making your code more maintainable and less prone to runtime errors.

## Conclusion

The discrepancy between template functionality and script execution for internationalization stems from scope management. When implementing i18n with custom Vue packages, the solution is to treat the localization service as an injected dependency. By accessing `$i18n.t('key')` within your component methods, you bypass the undefined error and ensure reliable text retrieval throughout your application. Embrace dependency injection for cleaner, more resilient front-end development!
