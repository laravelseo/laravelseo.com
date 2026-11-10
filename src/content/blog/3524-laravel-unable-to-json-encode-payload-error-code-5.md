---
title: "Laravel: Unable to JSON encode payload. Error code: 5"
description: "Deciphering the Error: Solving Laravel's JSON Encoding Failure with Binary CSV Data As senior developers working with PHP and the Laravel ecosystem, we often..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

As senior developers working with PHP and the Laravel ecosystem, we often encounter subtle but frustrating errors that bridge the gap between application logic and data serialization. Today, we are diving deep into a specific scenario: dealing with file uploads, CSV parsing, and queuing jobs, where seemingly simple string operations lead to complex encoding failures. We will dissect the perplexing `Unable to JSON encode payload. Error code: 5` error when passing non-standard characters, specifically binary data like `ÿ`, through Laravel queues.

## The Scenario: CSV Parsing Meets Queue Serialization

The situation you've described is a classic example of a data integrity issue propagating through multiple layers of your application stack. You are successfully reading and processing the file content in PHP, but when Laravel attempts to serialize this resulting array for transport via a queue (like Redis), the underlying JSON encoder fails because it encounters data that is not valid UTF-8.

Your workflow involves:
1. Reading a CSV file line by line using `fgets()` and `explode()`.
2. Yielding contact data into an array structure.
3. Dispatching this array to a Job constructor (`ImportContacts::dispatch($contacts)`).

The error occurs during the queue serialization phase, indicating that the payload being sent to the queue (which includes your `$contacts` array) cannot be converted into valid JSON. The culprit is almost certainly the presence of byte sequences—like the `ÿ` character—that are not valid within a standard UTF-8 string context.

## Why Standard Encoding Functions Fail

You correctly experimented with functions like `utf8_encode()`, `mb_convert_encoding()`, and `iconv()`. The results highlight a crucial distinction: these functions are designed to *re-encode* or *translate* existing text, not necessarily to handle arbitrary binary data that has been mistakenly read into a string context.

When you encounter the byte sequence `ÿ` in a file, it often represents a specific byte value (e.g., 255 in Latin-1) that doesn't map cleanly into the multi-byte structure required by UTF-8 for characters like Greek ($\text{E}\theta\nu\iota\kappa\eta\varsigma$) or Cyrillic.

*   **`utf8_encode()`:** This forces everything into UTF-8, successfully solving the JSON error, but it destroys legitimate Unicode characters (like Greek and Cyrillic) by replacing them with question marks ($\text{????}$).
*   **`mb_convert_encoding()` / `iconv()`:** These functions are excellent for explicit character set conversions, but when applied to raw binary strings that aren't cleanly mappable to a specific source encoding (like Windows-1252 vs. UTF-8), they fail or introduce new errors (`iconv(): Detected an illegal character in input string`).

This confirms the hypothesis: attempting to force non-textual bytes into a Unicode framework without proper context leads to corruption, not correction.

## The Robust Solution: Strict Data Separation and Validation

The most robust solution is to stop treating raw file content as general strings immediately upon reading it. Instead of trying to coerce potentially binary data into text, we must isolate the non-textual components or reject the line entirely if strict UTF-8 compliance is mandatory.

### Best Practice Implementation: Strict UTF-8 Validation

If your goal is strictly to handle contact information (names, phones) and reject corrupted or unexpected byte sequences, you should enforce a stricter check during parsing.

Instead of relying solely on encoding functions that mask data, focus on ensuring the input conforms to the expected format *before* serialization. Since this involves file reading, consider using PHP's stream functions in conjunction with strict
