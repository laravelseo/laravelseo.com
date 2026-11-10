---
title: "mocking out database queries laravel mockery"
description: "Mocking Out Database Queries in Laravel: Mastering Mockery for Eloquent Operations Testing complex business logic that interacts with the database is often..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP"]
featured: false
---

Testing complex business logic that interacts with the database is often where developers hit a wall. It’s easy to mock simple method calls, but mocking static methods, especially those that represent core Eloquent interactions like `Model::where()->first()`, requires a slightly different approach. As senior developers, our goal isn't just to make the test pass; it's to write tests that accurately reflect how the code behaves in production and adhere to SOLID principles.

This post will walk you through the challenges of mocking database calls in Laravel using PHPUnit and Mockery, and provide a robust solution for testing your `SoldProductModifier` class.

## The Challenge: Static Calls and Database Abstraction

Your struggle with mocking `Product::findByItemCode($item_code)` stems from a fundamental design choice: you are relying on static methods directly within your business logic (`SoldProductModifier`). In Unit Testing, we prefer to test isolated units of code without side effects. When a class directly calls a static Eloquent query, it tightly couples the unit to the database, making mocking cumbersome.

The core issue is that you want to isolate the `SoldProductModifier` from *how* the product is found (i.e., querying the DB) and test only *what* happens with the resulting data.

## Best Practice 1: Dependency Inversion (The Ideal Solution)

Before diving into complex mocking techniques, the most Laravel-idiomatic and testable solution is to apply the Dependency Inversion Principle (DIP). Instead of letting your service class directly access static model methods, you should inject the necessary data fetching mechanism.

Instead of:
```php
// Inside SoldProductModifier
$product = Product::findByItemCode($item_code); // Direct DB call!
```

Inject a repository or service that handles the data retrieval:

```php
use App\Repositories\ProductRepository; // Assume you create a repository

class SoldProductModifier 
{
    protected $productRepository;

    public function __construct(ProductRepository $productRepository) 
    {
        $this->productRepository = $productRepository;
    }

    public function modifyBasedOnItemCode($item_code)
    {
        // Now we call the injected dependency, which is easy to mock!
        $product = $this->productRepository->findByItemCode($item_code); 

        if (isset($product) && $product != false)
        {
            $this->sold_product->category_id = $product->category->id;
            $this->sold_product->product_id = $product->id;
        }

        return $this->sold_product;
    }
}
```

By doing this, you completely decouple the modifier logic from Eloquent specifics. You can now easily mock `ProductRepository` in your test and define exactly what data is returned:

```php
// In your test class...
$mockRepository = $this->mock(ProductRepository::class);
$mockRepository->shouldReceive('findByItemCode')
    ->with($this->itemId)
    ->andReturn($mockProduct); // Return the mocked product object
// ... inject $mockRepository into SoldProductModifier
```

## Best Practice 2: Mocking Static Calls with Mockery::mockStatic()

If refactoring the entire architecture is not immediately feasible, or if you *must* work with existing static methods for this specific scenario, Mockery provides a powerful tool called `mockStatic()` specifically designed to mock static classes. This allows you to intercept calls to static methods and define their return values during the test execution.

Here is how you can mock your `Product` model's static method:

```php
use App\Models\Product;
use Mockery;

class SoldProductModifierTest extends TestCase 
{
    public function testModifiesBasedOnItemCodeWithMockedDB()
    {
        // 1. Define the mock data we expect the DB call to return
        $mockProduct = Mockery::mock(Product::class);
        $mockProduct->id = 5;
        $mockProduct->category = (object)['id' => 10]; // Mocking nested relationship

        // 2. Tell Mockery to mock all static calls on the Product class
        Mockery::mockStatic(Product::class)->shouldReceive('findByItemCode')
            ->with('ITEM-123') // Expect this specific input
            ->andReturn($mockProduct); // Return our mocked result

        // Setup the system under test (SUT)
        $soldProduct = new SoldProduct(); // Assume you mock/stub your model setup here
        $modifier = new SoldProductModifier($soldProduct);

        // Execute the method being tested
        $result = $modifier->modifyBasedOnItemCode('ITEM-123');

        // 3. Assertions
        $this->assertEquals(5, $result->product_id);
        $this->assertEquals(10, $result->category_id);
    }
}
```

## Conclusion

Testing database interactions is less about mocking the raw SQL calls and more about mocking the *data source*. While `Mockery::mockStatic()` provides a direct way to address the specific challenge of static methods like `Product::findByItemCode()`, I strongly advise prioritizing **Dependency Injection** for long-term maintainability.

When working within the Laravel ecosystem, focusing on injecting repositories or services ensures that your tests remain fast, isolated, and reflective of true application behavior. Keep building those robust systems; adhering to these testing principles will make your code—and your tests—significantly cleaner. For more insights into building scalable applications with Laravel, check out the official resources at [laravelcompany.com](https://laravelcompany.com).
