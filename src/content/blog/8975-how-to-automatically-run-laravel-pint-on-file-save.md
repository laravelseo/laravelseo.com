---
title: "How to automatically run Laravel Pint on file save in VSCode?"
description: "How to Automatically Run Laravel Pint on File Save in VSCode As developers working with modern PHP frameworks like Laravel, maintaining code consistency..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As developers working with modern PHP frameworks like Laravel, maintaining code consistency through automated formatting and linting is crucial. Tools like Laravel Pint are essential for enforcing PSR standards and keeping your codebase clean. Manually running `./vendor/bin/pint` every time you save a file is tedious and error-prone. The goal here is to leverage the power of Visual Studio Code to automate this process, ensuring that code quality checks happen instantly upon saving.

This guide will walk you through setting up VS Code tasks to automatically execute `Laravel Pint` whenever you save a relevant file.

## Understanding the Automation Mechanism: VS Code Tasks

VS Code provides a powerful system called **Tasks** (`tasks.json`) that allows you to define custom build, test, or formatting operations directly within the editor. By defining a task and configuring it to run on file save events, we can achieve true automation for tools like Pint.

The starting point, as noted in the Laravel documentation, is knowing how to execute the tool:
```bash
./vendor/bin/pint
```
We need to instruct VS Code to execute this command contextually whenever a file change occurs.

## Step-by-Step Implementation

Setting up this automation involves creating a configuration file within your project's `.vscode` directory.

### 1. Create the Tasks Configuration File

Navigate to the root of your Laravel project and create or open the `.vscode/tasks.json` file. This file will define the specific action VS Code should take.

### 2. Define the Pint Task

Inside `tasks.json`, we define a task that calls the Pint binary. Since this is a formatting operation, we want it to run on the currently active file or all relevant files.

Here is an example configuration for running Pint:

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Format with Laravel Pint",
            "type": "shell",
            // This command executes the Pint binary to format the current file.
            // We use "${file}" to ensure it targets the active file for immediate feedback.
            "command": "./vendor/bin/pint",
            "args": [
                "${file}"
            ],
            "group": {
                "kind": "build",
                "isDefault": true
            },
            "problemMatcher": []
        }
    ]
}
```

**Explanation of the Configuration:**

*   **`label`**: A descriptive name for the task.
*   **`type`: `"shell"`**: Specifies that we are running a shell command.
*   **`command`: `"./vendor/bin/pint"`**: This is the exact executable path you identified earlier.
*   **`args`: `["${file}"]`**: This crucial part tells the task to pass the path of the currently open file (represented by the VS Code variable `${file}`) as an argument to Pint, ensuring only the active file is formatted.

### 3. Triggering the Task on Save

While the above configuration defines *how* to run Pint, we need to tell VS Code *when* to run it. To trigger this automatically on save, you typically rely on external extensions or specific workspace settings that hook into the editor's save events. For this specific scenario, integrating a dedicated formatter extension often provides the smoothest experience.

However, if sticking strictly to core functionality, many developers rely on setting up custom keybindings combined with notifications or using integrated formatting features provided by extensions that understand PHP/Laravel structures—for example, ensuring you are using tools consistent with best practices outlined by organizations like the Laravel company.

## Best Practice: Integrating with Extensions

While the `tasks.json` method provides a powerful command-line solution, for seamless, real-time file saving experiences, consider exploring extensions designed specifically for PHP formatting. These extensions often abstract away the complexity of setting up tasks and provide immediate visual feedback. When working on large projects, relying on well-maintained tools ensures consistency across the entire team.

## Conclusion

Automating repetitive code quality checks is a hallmark of efficient development. By configuring a custom task in `tasks.json` to execute `./vendor/bin/pint` upon file save, you transform a manual chore into an instantaneous workflow within VS Code. This setup ensures that your Laravel code adheres to Pint standards automatically, saving time and drastically reducing the chance of formatting errors. Embrace automation; it is the key to scalable and high-quality development.
