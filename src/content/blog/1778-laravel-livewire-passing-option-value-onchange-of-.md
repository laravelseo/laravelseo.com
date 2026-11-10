---
title: "Laravel Livewire: Passing option value onChange of Select input"
description: "Title: Laravel Livewire: Handling Select Inputs with Value Passing and Change Events Body: Incorporating a dynamic form is essential for building interactive..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

Title: Laravel Livewire: Handling Select Inputs with Value Passing and Change Events

Body:
<p>Incorporating a dynamic form is essential for building interactive web applications. Laravel Livewire enables you to create seamless interactions between the front end (Blade) view components and the back-end logic (controller). If you encounter issues while trying to pass an option value from a select input on change, this comprehensive guide will help you understand and solve your problem.</p>
<p><strong>Livewire Blade View Component:</strong></p>
<pre><code>{!! Form::select('goals',$goals_plucked,null,[
    'placeholder' =&gt; trans('classes.backend.forms.select_goals'),
    'class' =&gt; 'custom-select',
    'id' =&gt; 'goals',
    'wire:change' =&gt; 'onGoalsChange(this.value)',
]) !!}
</code></pre>
<p>In this example, the select input is related to goals and passes its value to a function named <code>onGoalsChange()</code>, which will be defined in your Livewire Controller Component.</p>
<p><strong>Livewire Controller Component:</strong></p>
<pre><code>public $goals;

protected $listeners = ['goalsChanged' => 'updateGoals'];

public function onGoalsChange($value)
{
    $this->goals = $value;
}

public function updateGoals()
{
    dd($this->goals);
}
</code></pre>
<p>This code snippet utilizes the <code>'wire:change'</code> attribute to trigger a Livewire event when the select input is changed. The first function, <code>onGoalsChange()</code>, updates the component property with the selected value from the select input. The second function, <code>updateGoals()</code>, lists all goals. Finally, the listener <code>'goalsChanged' =&gt; 'updateGoals';</code> ensures that the Livewire event is connected to your code.</p>
<p><strong>Understanding the Flow:</strong></p>
<p>The flow you are trying to build requires a cascading effect of selection. This can be achieved by using nested select inputs. To do this, firstly, call form fields for the country in the main view component and pass its value to another Livewire Component, which will contain the state dropdowns. Then, in the State Controller Component, you'll have a similar approach with city dropdowns. Your code may look like:</p>
<pre><code>// Main View Component
public $country_options;
public $selected_country;

protected $listeners = ['countryChanged' => 'updateCountry'];

public function countryChange($value)
{
    $this->selected_country = $value;
}

public function updateCountry()
{
    $response = SomeAPI::getStateByCountryId($this->selected_country);
    $this->state_options = json_decode($response, true);
    dd($this->state_options);
}

// State Controller Component
public $state_options;
public $selected_state;

protected $listeners = ['stateChanged' => 'updateStates'];

public function stateChange($value)
{
    $this->selected_state = $value;
}

public function updateStates()
{
    $response = SomeAPI::getCitiesByStateId($this->selected_state);
    $this->city_options = json_decode($response, true);
    dd($this->city_options);
}
</code></pre>
<p>In this method, your form will show the country dropdown at first. On selection change, it will pass the value to the State Controller Component. The State Controller Component will fetch the appropriate state options from an API and display them in its view. Similarly, selecting a state updates the City Controller Component with city options.</p>
<p><strong>Conclusion:</strong></p>
<p>Handling select inputs, especially when working with multiple layers of hierarchy like country-state-city is achievable using Laravel Livewire's powerful event-driven architecture. The key to success lies in understanding how to pass data between components and effectively handle change events. By following the best practices discussed above, you can build engaging and interactive user interfaces for your web applications.</p>

Remember to incorporate relevant backlinks, such as https://laravelcompany.com/livewire-components-tutorial, into your posts. Always aim for thoroughness and clarity, as this will greatly improve the overall quality of your blog post.
