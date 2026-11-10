---
title: "Force a full page reload in Livewire"
description: "Title: Force a Full Page Reload in Livewire Introduction Livewire is an impressive framework for Laravel that enhances your application's UI responsiveness..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Content", "JavaScript"]
featured: false
---

Title: Force a Full Page Reload in Livewire

Introduction

Livewire is an impressive framework for Laravel that enhances your application's UI responsiveness through two-way data binding. However, it can be challenging to seamlessly integrate with external libraries like jQuery Datatables due to their complexities. In this post, we address the issue of refreshing a page in order to update the Datatable when an edit is made.

Problem Statement

Livewire handles state changes elegantly through its $refresh variable which automatically updates the component. However, in our case, the Datatable is enclosed within a <code>wire:ignore</code> attribute, preventing it from refreshing automatically on updating the model instance. The issue arises because we want to perform a full page reload instead of just refreshing the table.

Attempted Solutions and Issues

1. Using `return redirect()->back()`: This solution seemed promising but doesn't work in this context as it would only refresh the current component and not the entire page, leaving the Datatable unchanged.
2. Manually reloading the page with JavaScript or an Ajax request is possible, but these methods are cumbersome, time-consuming, and prone to errors. Besides, they still require a clean implementation to ensure proper functionality.

Finding a Solution

The solution lies in combining Livewire's power with the simplicity of native JavaScript. Since Livewire is built on top of Laravel, it has access to all its features, including Blade and JS scripts. To solve this problem, we would need to create a small JS function that forces a complete page reload upon button click. This can be done by using Livewire's `this.reload()` method, which triggers the reload of both client-side JavaScript and server-generated content.

Code Example

In your application, add a new JavaScript file containing the following code:

```javascript
function forceFullPageReload(){
    window.livewire.emit('reload'); // Emits 'reload' event in Livewire.
}
```

In your Livewire component, handle this event and trigger the reload:

```php
public function mount() {
   // Initialize a new listener for the 'reload' event emitted by JavaScript
    window.livewire.on('reload', () => {
        $this->emit('reload-page');
    });
}

public function reloadPage(){
    // Force full page reload using Livewire's built-in functionality
    this.reload();
}
```

In your template, call the `forceFullPageReload()` function when the edit button is clicked:

```html
<div wire:ignore>
<!-- ... (your Datatable code) ... -->
</div>

<!-- Your Livewire component template -->
<button class="btn btn-primary" data-toggle="modal" data-target="#mymodal">Edit</button>

<!-- Modal HTML -->
<div id="mymodal" class="modal fade">
    <!-- Your Edit form and submit button here... -->
    <button type="submit" wire:click="save" wire:loading.remove class="btn btn-primary">Save Changes</button>
</div>

<!-- Add JavaScript for the force reload function -->
<script defer src="/js/force_full_page_reload.js"></script>
```

Conclusion

By combining Livewire's powerful two-way data binding and JavaScript functionality, you can easily handle complex situations such as refreshing an external library like the Datatable after an edit is made in your application. The solution presented here gives developers a reliable yet straightforward method to achieve that without any additional hassles.
