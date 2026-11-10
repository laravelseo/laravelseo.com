---
title: "Laravel Queue Batches: How to chain multiple batches"
description: "Laravel Queue Batches: How to Chain Multiple Batches for Sequential Execution As developers working with asynchronous processing in Laravel, managing complex..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers working with asynchronous processing in Laravel, managing complex workflows often involves running multiple batches sequentially. The desire to link these batches together—ensuring Batch B only starts after Batch A is fully complete, and tracking the overall progress—is a very common requirement.

The approach you started with, deeply nesting `Bus::batch()->then(...)` calls, successfully executes the jobs in sequence but, as you noted, sacrifices control and makes post-processing (like canceling or updating UI status) extremely difficult. This highlights a key architectural challenge: Laravel's queue system is excellent for parallel execution of discrete tasks, but orchestrating complex, dependent workflows requires external state management.

Let’s dive into why standard chaining methods fall short and how we can build a robust, traceable system using database orchestration.

## Understanding Batch Chaining in Laravel

When dealing with queue batches, we need to distinguish between *executing* jobs sequentially and *chaining* the batch objects themselves.

### The Limitations of `Bus::chain()`

You experimented with `Bus::chain()`, which is a powerful feature for sequencing independent operations:

```php
Bus::chain([
    function(){ /* Batch 1 */ },
    function(){ /* Batch 2 */ },
])->dispatch();
```

While this method successfully queues the execution of these blocks sequentially, it primarily chains the *dispatching* of jobs or simple batch executions. It does not inherently solve the problem of linking complex, internally managed batches where the output of one batch must dictate the input for the next. If you need fine-grained control over the lifecycle (like cancellation status or progress tracking) of each individual batch, relying solely on `Bus::chain()` becomes insufficient.

### The Power of Orchestration: Database Linking

For workflows that require strict dependency and comprehensive tracking—especially when dealing with long-running queue batches—the most reliable pattern is to treat the batch chain as a workflow definition stored in your database, rather than trying to force the queue system itself to manage the complex state. This approach aligns perfectly with best practices for building scalable applications, much like the patterns encouraged by Laravel principles found on **[laravelcompany.com](https://laravelcompany.com)**.

We can achieve true chaining and traceability by linking batches using a dedicated model.

## Implementing a Robust Batch Chain via Database

Instead of nesting jobs within each other, we define the entire sequence in one transaction and use a model to represent the dependency graph between the batches.

Here is an architectural approach that addresses your need for tracking and sequential execution:

1.  **Define a `JobBatch` Model:** Create a table (e.g., `job_batches`) to store metadata about each batch, including its status, name, and crucially, a foreign key linking it to the next batch in the sequence.
2.  **Execute Sequentially:** Run Batch 1. Upon successful completion, retrieve its ID. Use that ID to dispatch Batch 2 (and so on).

Here is how this concept translates into code logic:

```php
use Illuminate\Support\Facades\Bus;
use App\Models\JobBatch;

// 1. Start the chain definition and execution
$parentBatch = Bus::batch(new \App\Jobs\TestBatchJob())
    ->name('test-batch-1')
    ->allowFailures()
    ->dispatch();

// 2. Log the first batch in the database
$parentBatchRecord = JobBatch::create([
    'uuid' => $parentBatch->uuid, // Assuming you use UUIDs for tracking
    'status' => 'pending',
]);

// 3. Chain subsequent batches based on the parent's completion
Bus::batch(new \App\Jobs\TestBatchJob2())
    ->name('test-batch-2')
    ->allowFailures()
    ->then(function (\Illuminate\Bus\Batch $batch) use ($parentBatchRecord) {
        // CRITICAL STEP: Update the database link before dispatching the next batch
        $nextBatch = Bus::batch(new \App\Jobs\TestBatchJob2())
            ->name('test-batch-3')
            ->allowFailures()
            ->dispatch();

        // Link Batch 2 to Batch 3 via the database record
        $parentBatchRecord->addChild($nextBatch);
        return $nextBatch; // Return the next batch object if needed
    })
    ->dispatch();

// 4. Final tracking update (This logic would be more complex in a real scenario, often involving monitoring the results of each dispatch)
echo "Workflow initiated and linked via JobBatch record: " . $parentBatchRecord->id;
```

## Conclusion

While Laravel provides excellent tools for parallel queue processing, orchestrating complex, dependent workflows requires an external state layer. For chaining multiple batches where dependency and traceability are paramount—especially when you need to interact with progress indicators or cancellation features—relying on database records (like the `JobBatch` model) is far superior to deep method nesting. This pattern ensures that your workflow remains auditable, resilient, and scalable, providing a solid foundation for complex background processing in any Laravel application.
