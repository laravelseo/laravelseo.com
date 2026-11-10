---
title: "Non-static method Illuminate\\Database\\Eloquent\\Model::update() should not be called statically"
description: "Non static Method Illuminate\\Database\\Eloquent\\Model::update() Should Not Be Called Statically: Understanding Eloquent Instance vs. Static Methods As..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As developers working with the Laravel framework and its Eloquent ORM, understanding the nuances of how models interact with the database is crucial. One common stumbling block developers encounter is related to calling methods on the `Model` class itself—specifically, trying to use instance methods statically. The error message you are seeing, "Non-static method Illuminate\Database\Eloquent\Model::update() should not be called statically," points directly to a fundamental concept in Object-Oriented Programming (OOP) and Eloquent’s design philosophy.

This post will delve into why this restriction exists, analyze your provided code snippets, and demonstrate the correct, idiomatic way to perform database updates in Laravel.

## The Core Concept: Static vs. Instance Methods in Eloquent

In PHP and Object-Oriented Programming, methods can be defined in two primary ways: static or instance.

1.  **Static Methods:** These methods belong to the class itself and can be called directly on the class name (e.g., `Model::where(...)`). They are useful for performing operations that don't depend on a specific object instance, such as querying the database across all records.
2.  **Instance Methods:** These methods belong to a specific object created from that class (an *instance*). Instance methods rely on the properties and state of that specific object. Methods like `update()`, `save()`, or `delete()` are inherently instance methods because they act upon a single, defined Eloquent model record.

When you write `$product::update([...])`, you are asking the static `Product` class to perform an operation that requires context—specifically, which product record should be updated? The framework correctly flags this as an error because the `update()` operation is designed to be executed on a specific *instance* of a model, not the entire model class statically.

## Analyzing Your Code:
