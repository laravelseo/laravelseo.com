---
title: "Disable Edit or Delete for specific record in Filament Laravel"
description: "Mastering Conditional Actions in Filament: Disabling Edit/Delete Based on Model State As developers building complex administrative interfaces with Laravel..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers building complex administrative interfaces with Laravel and Filament, we often need more than just basic CRUD functionality. We frequently encounter scenarios where the permissions or state of a record dictate what actions are available to the user. A common requirement is to dynamically disable the "Edit" or "Delete" buttons based on custom boolean flags stored within the model itself.

This post will walk you through the most effective, developer-centric way to achieve this conditional disabling in a Filament Table, ensuring your interface accurately reflects the underlying data constraints.

## The Challenge: Conditional UI Control

The scenario you've described is very common: You have two boolean fields on your Eloquent model—`is_editable` and `is_deletable`. If these flags are set to `false`, the user should not see or be able to interact with the Edit or Delete buttons in the Filament Table.

The challenge lies in the fact that Filament's default table rendering often assumes operations are available unless explicitly blocked by permissions, making custom conditional logic necessary when dealing with internal model states.

## The Solution: Customizing Table Actions

Since Filament is built on top of Laravel and Eloquent, we can leverage PHP logic directly within the table definition to control the visibility or enablement of actions. We will focus on overriding the default behavior of the table component to inject our conditional checks.

The most robust approach involves utilizing the `table()` method's ability to define custom column rendering and action handling based on the record data. While Filament provides powerful permission systems, for internal state control like this, direct PHP evaluation within the table structure offers precise control.

### Step-by-Step Implementation

To achieve dynamic disabling, you need to inspect the current row's data when defining your table columns or actions.

Here is a conceptual example demonstrating how you might modify your `Table` class within a Filament Resource:

```php
use Filament\Tables;
use Filament\Tables\Table;

class YourResourceTable extends Table
{
    protected function getTable(): Table
    {
        return Table::make()
            ->columns([
                // Standard columns...
                Tables\Columns\TextColumn::make('name'),

                // Custom logic to show/hide actions based on model state
                Tables\Columns\IconColumn::make('is_editable')
                    ->label('Editable Status')
                    ->getStateUsing(function ($record) {
                        return $record->is_editable ? 'Yes' : 'No';
                    }),
            ])
            ->actions([
                Tables\Actions\EditAction::make()
                    // CONDITION: Only show the Edit action if is_editable is true
                    ->visible(fn ($record) => $record->is_editable)
                    ->label('Edit Record'),

                Tables\Actions\DeleteAction::make()
                    // CONDITION: Only show the Delete action if is_deletable is true
                    ->visible(fn ($record) => $record->is_deletable)
                    ->label('Delete Record'),
            ])
            ->filters([
                // ... filters if needed
            ]);
    }
}
```

### Explanation of the Code

1.  **`Tables\Actions\EditAction::make()->visible(fn ($record) => $record->is_editable)`**: This is the core of the solution. We use a closure (`fn (...) => ...`) within the `visible()` method. This closure runs for every row being rendered. It checks the value of the `is_editable` attribute on the current `$record`. If it evaluates to `true`, the action button is displayed; otherwise, it is completely omitted from the UI.
2.  **Dynamic Control**: By using this conditional check, you ensure that the Edit and Delete buttons are only rendered if the corresponding model flags permit the action. This gives you granular control over the user interface based on your application's data state.

## Best Practices and Context

When working within the Laravel ecosystem, remember that Eloquent models are the foundation of everything. The principle behind this solution is separating presentation logic (what the user sees) from business logic (the actual model data).

As you build more complex features in Filament, always strive to keep your table definitions clean. For highly complex conditional logic, consider abstracting these checks into dedicated scope methods on your Eloquent model. This keeps your resource classes focused on defining *how* the data is displayed rather than managing complex database queries or state checks directly.

For robust data handling and architecture within Laravel applications, understanding how Eloquent relationships and model attributes interact is crucial. For deeper dives into structuring large-scale Laravel applications, exploring resources like those found on [laravelcompany.com](https://laravelcompany.com) will provide excellent context for architectural patterns.

## Conclusion

By leveraging Filament's ability to inject custom visibility logic into its Table actions—specifically using the `visible()` method tied to Eloquent model attributes—you can create highly dynamic and intuitive administrative interfaces. This approach ensures that your application remains synchronized with the current state of your data, providing a seamless and professional user experience for your administrators.
