---
title: "Laravel Livewire: Component in Foreach loop. Button Click shows on all items instead of Single item"
description: "Mastering Livewire Loops: Solving the \"Single Item Focus\" Problem in Component Interactions As developers building dynamic interfaces with Livewire, one of..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

As developers building dynamic interfaces with Livewire, one of the most common challenges arises when dealing with components rendered within loops. Specifically, when you have a list of items and want an interaction (like clicking a button) to affect only *one* specific item in that list, rather than all of them simultaneously, things can get tricky.

This post dives into a very common Livewire scenario: controlling a child component based on an action triggered within a parent loop. We’ll analyze the exact problem you are facing and demonstrate the cleanest, most performant way to ensure your Livewire components interact with only the intended item.

## The Challenge: Looping and State Management in Livewire

You are attempting to use a `foreach` loop to display multiple instances of a `<livewire:audio-player>` component, each tied to a different data ID. When you click a "Play" button associated with one item, the child component mistakenly updates or displays for every item on the screen.

The core issue usually stems from how Livewire manages state synchronization across repeated DOM elements, especially when using event listeners within loops. While your current setup uses `:wire:key`, which is excellent for list reactivity, the interaction logic needs to be tightly scoped to the specific data point being manipulated.

## Why Does This Happen? (The Developer's Perspective)

When you trigger an action in a parent component that emits an event to a child component, if the triggering mechanism isn't explicitly tied to the loop iteration, the state change often propagates broadly. In your case, even though you are passing `$item['id']` via `:wire:key`, the interaction might be triggering a general state update across all instances of the child component that share the same parent context.

To fix this, we need to ensure that the event emitted from the loop is carrying the necessary context—the unique ID—so the child component knows exactly which instance it should target for its state change (e.g., setting `$videoId`).

## The Solution: Scoping Interactions with Data Attributes

The solution lies in making the interaction explicit and ensuring every element within the loop has access to its unique identifier, not just relying on implicit context. We will refine your existing structure to make the data flow crystal clear between the parent controller and the child component.

### 1. Refined Parent Component (`SearchVideo.php`)

The parent component needs to ensure that when `openPlayer` is called, it targets the specific ID directly. Your current emission pattern is mostly correct, but we must ensure the scope is perfect.

```php
class SearchVideo extends Component
{
    public $searchResults = []; // Assume this holds your data

    // ... other methods

    public function openPlayer($vid)
    {
        // Emit the specific ID to the listener for the audio-player component
        $this->emit('showPlayer', $vid); 
    }

    public function closePlayer()
    {
        $this->emit('closePlayer');
    }

    public function render()
    {
        return view('livewire.search-video');
    }
}
```

### 2. Refined View (`search-video.blade.php`)

The key is ensuring the `wire:click` handler on the button explicitly uses the unique ID of that specific `$item`. Your usage of `:wire:key` was correct; we just need to ensure the click event references that unique context perfectly.

```html
@foreach ($searchResults as $item)
    <div class="w-full mx-auto border rounded-md border-gray-300 shadow">
        {{-- ... other content ... --}}
        <div class="flex flex-wrap py-4">

            {{-- Livewire Audio Player Component here --}}
            <div class="w-full">
               {{-- The :wire:key is crucial for Livewire list performance and tracking --}}
               <livewire:audio-player :wire:key="$item['id']">
               </livewire:audio-player>
            </div>

            {{-- *** THE FIX IS HERE: Explicitly binding the click to the specific item's ID *** --}}
            <div wire:click="openPlayer('{{ $item['id'] }}')"
                 class="cursor-pointer border rounded font-semibold bg-blue-300 border-blue-600 px-4 py-2 mr-2 text-blue-600">
                Play
            </div>

        </div>
    </div>
@endforeach
```

### 3. Refined Child Component (`AudioPlayer.php`)

The child component remains largely the same, as it correctly listens for the emitted event and updates its internal state based on the ID passed to it.

```php
class AudioPlayer extends Component
{
    public $showPlayer = false;
    public $videoId;

    protected $listeners = ['showPlayer' => 'openPlayer', 'closePlayer' => 'closePlayer'];

    public function openPlayer($vid)
    {
        // The state change is now explicitly tied to the ID received.
        $this->showPlayer = true;
        $this->videoId = $vid;
    }

    public function closePlayer()
    {
        $this->showPlayer = false;
        $this->videoId = null;
    }

    public function render()
    {
        return view('livewire.audio-player');
    }
}
```

## Conclusion: Consistency is Key in Livewire Development

The problem you encountered is a classic case of state scoping within dynamic loops. By treating every item in the loop as an independent unit, and explicitly passing its unique identifier (`$item['id']`) through both the event emission (`openPlayer`) and the component key (`:wire:key`), we ensure that Livewire's reactivity system correctly isolates the state change to only the intended audio player.

When working with complex data structures and components in Laravel, remember that clarity in data flow is paramount. Always validate that your parent component is explicitly telling the child *which* piece of data it cares about. For robust architecture, keep this principle in mind as you build more intricate features using frameworks like Laravel and Livewire. If you are looking for deeper insights into Eloquent relationships or Blade architecture, exploring resources on [laravelcompany.com](https://laravelcompany.com) will provide excellent foundational knowledge.
