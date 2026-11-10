---
title: "Livewire how to $emit event on select change (wire:model)"
description: "Livewire how to $emit event on &lt;select&gt; change (wire:model) Livewire is a powerful framework for building interactive web applications with Laravel. It..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Livewire how to $emit event on <code>&lt;select&gt;</code> change (wire:model)

Livewire is a powerful framework for building interactive web applications with Laravel. It provides a clean and straightforward way to handle user interactions, including the management of forms and select elements. In this blog post, we will focus on how to trigger events using Livewire when a <code>&lt;select&gt;</code> changes its value (wire:model).

Firstly, let's understand wire:model. Wire:model is a directive used in Livewire views for automatically syncing the model properties with input values. It allows us to bind form fields directly to PHP class properties, making our application more responsive and user-friendly. In this case, we want to emit an event when the <code>&lt;select&gt;</code> changes its value.

To achieve this, first create a component that will be responsible for handling the update and emitting events. In your project folder, add the following code:

```php
<?php

namespace App\Http\Livewire;

use App\Models\Event;
use App\Models\Hall;
use Livewire\Component;

class ShowReservationForm extends Component
{
    public $hall_id = '';

    protected $queryString = [
        'hall_id' => ['except' => ''],
    ];

    public function mounted()
    {
        //
    }

    public function updatedHallId($name, $value)
    {
        $this->emit('hallChanged', $value);
    }

    public function render()
    {
        return view('livewire.show-reservation-form', [
            'halls' => Hall::all(),
        ]);
    }

    public function getHallEventsProperty()
    {
        return Event::where('hall_id', $this->hall_id)->get();
    }
}
```

In this code, we defined a Livewire component called 'ShowReservationForm'. We added the wire:model attribute 'hall_id' with an initial value of '' (empty string). We also overrode the default queryString to not include the 'hall_id' in the URL when the component is mounted. The updatedHallId method will emit an event named 'hallChanged' whenever the <code>&lt;select&gt;</code> updates its value, passing the new value as a parameter, which we can use in other components.

Next, let's create another component to handle the event and show relevant data:

```php
<?php

namespace App\Http\Livewire;

use Livewire\Component;

class ShowReservations extends Component
{
    protected $listeners = ['hallChanged'];

    public $showTable = false;

    public function render()
    {
        return view('livewire.show-reservations');
    }

    public function hallChanged($value)
    {
        $this->showTable = true;
    }
}
```

In this example, we listen for the 'hallChanged' event emitted by the first component and set a property called '$showTable' to true. In your views, you can use this property to show relevant data or perform additional actions when the table is visible.

Finally, let's modify your HTML code to use wire:model and fire events on <code>&lt;select&gt;</code> change:

```html
<select id="hall" wire:model="hall_id">...
</select>
```

When you select a value from the dropdown, the event 'hallChanged' will be emitted, and the component responsible for handling this event can access the selected value. In conclusion, using Livewire allows us to create interactive web applications with clean code and efficient data management. By understanding how to emit events on select change and implementing it in our application, we ensure a better user experience and improved responsiveness.
