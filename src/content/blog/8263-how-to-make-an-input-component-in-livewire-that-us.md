---
title: "How to make an input component in livewire that uses wire:model and returns data to parent component?"
description: "Mastering Reusable Inputs in Livewire: Achieving Seamless Two Way Data Binding As developers building complex interfaces with Livewire, one of the most..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript"]
featured: false
---

As developers building complex interfaces with Livewire, one of the most common challenges is creating reusable, self-contained component parts that successfully manage two-way data binding. You've encountered a very common hurdle: replicating the simple Vue pattern where an input component emits its value back to the parent via `$emit('input', value)`. While this works beautifully in frameworks like Vue, Livewire operates on a slightly different paradigm.

This post will dive deep into how to structure your Livewire components—specifically creating reusable input fields—so that they handle internal state correctly and seamlessly return data to their parent component using the native `wire:model` mechanism.

## The Livewire Data Binding Philosophy

In traditional frontend frameworks, you explicitly manage the flow of data through events (`@input`). In Livewire, the magic happens on the server side. When you use `wire:model`, you are telling Livewire to synchronize a property on the component with a property on the parent component on every interaction.

The key difference is that instead of emitting an event for every keystroke, Livewire manages this synchronization automatically when properties are correctly defined and bound. Our goal isn't to manually emit input events; it's to ensure the child component's state correctly reflects the data being passed down from the parent via `wire:model`.

## Building a Reusable Input Component

To make an input component truly reusable, it should expose its state through properties that can be bound externally. We will focus on defining the input component as a conduit for data, rather than an independent controller of that data.

### Step 1: Defining the Child Component (The Input)

Instead of trying to emit custom events, we define the input component to accept a property via `wire:model` and ensure its internal structure reflects that binding. For simple inputs, Livewire handles most of the heavy lifting if you bind the correct properties.

For this specific scenario where you want to pass data *down* for display but update the value *up*, we leverage standard Livewire bindings on the component itself.

**Example: `form-input` Component (Conceptual)**

In your component file, instead of focusing on emitting input events, focus on how external properties affect the rendering. Notice that the binding happens directly on the property you define within the component's state.

```php
// app/Livewire/FormInput.php

namespace App\Livewire;

use Livewire\Component;

class FormInput extends Component
{
    // This property will be bound from the parent via wire:model="value"
    public $value = ''; 
    public $label;
    public $placeholder;

    public function render()
    {
        return view('livewire.form-input', [
            'value' => $this->value,
            'label' => $this->label,
            'placeholder' => $this->placeholder ?? ''
        ]);
    }
}
```

### Step 2: Binding in the Parent Component (The Form)

The parent component's job is to define the state and pass it down. When you use `wire:model`, Livewire automatically handles the synchronization between the parent's property and the child's property.

**Example: Parent Form Component**

In your main form, you bind the input field using standard `wire:model`. The data flow is established by ensuring that the component being called (`livewire:components.form.form-input`) has the necessary properties defined and exposed.

```html
{{-- Parent Component View --}}
<div>
    <form wire:submit.prevent="save">
        @csrf
        
        {{-- The magic happens here: binding 'question' directly to the input component's state --}}
        <livewire:components.form.form-input 
            for="question" 
            label="What is your question?" 
            wire:model="question"  {{-- This synchronizes wire:model with the component's internal $value property --}}
        >
            {{-- Slot content for labels, etc. --}}
            <x-slot:label>
                <em>What is your question?</em>
            </x-slot:label>
        </livewire:components.form.form-input>

        <div class="my-4">
            <div class="text-3xl">Options</div>
        </div>

        <livewire:components.button type="submit" text="Submit">
        </livewire:components.button>
    </form>
</div>
```

## Conclusion: Embracing Livewire's Reactive Power

The reason the initial attempt to use `$emit('input', value)` failed is that it bypasses Livewire's built-in reactive system. By focusing on defining public properties within your component and using `wire:model` in the parent, you allow Livewire to manage the entire data lifecycle. The parent dictates the state, and the child reflects it, ensuring robust, synchronized two-way binding without manual event handling.

This pattern is fundamental to building scalable applications with Livewire. Whether you are creating complex forms or reusable UI widgets, embracing the server-side synchronization philosophy will lead to cleaner, more maintainable code. For deeper insights into architecting elegant solutions within the Laravel ecosystem, I highly recommend exploring the official documentation on the [Laravel Company website](https://laravelcompany.com).
