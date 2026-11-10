---
title: "Laravel 5 Naming Conventions"
description: "Decoding Laravel Naming Conventions: Solving the Plural vs. Singular Debate Welcome to the world of Laravel! As you dive into a new framework, it’s..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content"]
featured: false
---

Welcome to the world of Laravel! As you dive into a new framework, it’s completely normal to encounter initial confusion regarding naming conventions. The discrepancy you noticed between video tutorials (like those from Jeffrey Way) and the official documentation is a very common point of friction for newcomers.

As a senior developer, I can tell you that while style guides exist, the most important thing is establishing a consistent pattern that aligns with the framework's core philosophy—specifically Object-Oriented Programming (OOP) principles enforced by Eloquent.

This post will break down the official and recommended conventions for naming entities in a Laravel application, providing a pragmatic guide to help you build cleaner, more maintainable code.

---

## The Core Philosophy: Singular Nouns for Models and Controllers

The primary source of confusion stems from different approaches to naming resources. In the context of Laravel and Eloquent, the convention leans heavily toward **Singular Nouns** for models and controllers representing a single resource.

### 1. Models vs. Tables (Eloquent Mapping)

In Laravel, Eloquent models are designed to represent a single entity. This singular view directly maps to how you structure your database tables.

*   **Model Name:** Should be singular (e.g., `Post`, `Comment`).
*   **Database Table Name:** Conventionally pluralized (e.g., `posts`, `comments`).

This separation is crucial because Eloquent uses the model name to invoke the corresponding table via the convention `$modelName` maps to `$modelName . 's'`.

**Example Mapping:**

| Concept | Recommended Naming | Rationale |
| :--- | :--- | :--- |
| **Model** | `Post` | Represents a single blog post. |
| **Table** | `posts` | Standard database pluralization. |
| **Relationship** | Belongs to `Post` | Clear, direct mapping within the application logic. |

If you are following best practices for data modeling (which is key when designing APIs and handling relationships), sticking to singular names for your classes makes the relationship definitions in Eloquent much cleaner. As we discussed in principles of robust architecture on sites like [laravelcompany.com](https://laravelcompany.com), consistency across the stack is paramount.

### 2. Controllers (Handling HTTP Requests)

Controllers manage the flow of logic for a specific resource. Therefore, they should also reflect that single entity.

*   **Convention:** Use singular nouns for controllers (e.g., `PostController`, `UserController`).
*   **Why Singular?** A controller is responsible for managing all operations related to *one type* of resource. If you need a controller for listing posts, updating a post, and showing a single post, it all belongs under the umbrella of the `Post` entity.

Your example: `PhotoController`, `TaskController` are perfectly aligned with this singular convention. While plural names like `PostsController` might seem intuitive for "listing" actions, sticking to the singular form keeps the class definition focused on the resource itself, which is cleaner when defining routes and resource definitions.

## Database Structure Conventions

When moving from the application layer (PHP/Eloquent) to the database layer (SQL), we apply conventional pluralization rules.

### Tables and Columns

For a standard relational structure:

*   **Tables:** Use plural nouns (e.g., `posts`, `comments`).
*   **Columns (Primary Keys):** Always use a singular ID for the primary key in your model, but the actual column name in the database is typically named after the table. The convention is to use an auto-incrementing integer primary key: `id`.
*   **Foreign Keys:** Foreign keys should clearly reference the related singular entity (e.g., `post_id` in the `comments` table references the `posts` table).

**Code Example (Conceptual Migration):**

```php
// database/migrations/..._create_posts_table.php

Schema::create('posts', function (Blueprint $table
