---
title: "Parse error: syntax error, unexpected '__construct' (T_STRING), expecting function (T_FUNCTION) or const (T_CONST)"
description: "Title: Resolving Parse Error: Syntax Error Unexpected ' construct' When Using Laravel Add to Cart Functionality Introduction Parse errors occur when there is..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Content", "PHP"]
featured: false
---

Title: Resolving Parse Error: Syntax Error Unexpected '__construct' When Using Laravel Add to Cart Functionality

Introduction

Parse errors occur when there is a problem in the syntax of your code, which prevents PHP from correctly interpreting and executing your instructions. These issues are often related to missing semicolons, incorrect variable usage, or mismatched quotes. In this blog post, we will focus on resolving a specific issue that arises when adding products to a cart using Laravel.

The issue described in the introduction refers to an unexpected '__construct' error while clicking an add to cart button. This error is usually caused by issues with class instantiation and initialization, particularly with classes that are part of your application. To understand and solve this problem, let us take a close look at the code involved in this scenario.

Analyzing the Code

Your code consists of multiple elements, including a route declaration, a controller method, and a 'cart' class for handling shopping cart data. Let's break down each part:

1. Route declaration:
   <code>Route::get('add-to-cart/{id}', 'WebController@addToCart')-&gt;name('get.addToCart');</code>

2. Controller method (WebController):
   <pre><code>public function addToCart(Request $request, $id){
      $product = Product::find($id);
      $oldCart = Session::has('cart') ? Session::get('cart') : null;
      $cart = new Cart($oldCart);
      $cart-&gt;add($product,$product-&gt;id);
      $request-&gt;session()-&gt;put('cart',$cart);
      dd($request-&gt;session()-&gt;get('cart'));
      return redirect()-&gt;route(get.product);
   }</code></pre>

3. 'Cart' class:
   <pre><code>&lt;?php
namespace App;
class Cart{
   public $items=null;
   public __construct($oldCart){
      if($oldCart){
        this-&gt;$items=$oldCart-&gt;items;
      }
   }
   public function add($item,$id){
      $storedItem= ['name'=&gt;$item];
      if(this-&gt; $items)
      { 
         if(array_key_exists($id, this-&gt;$items)){
           $storedItem=this-&gt;$items[$id];
         }
      }
      this-&gt;$items[$id]=$storedItem;
   }
}</code></pre>

The first two parts seem to be working as expected, but the 'Cart' class might need some tweaking. The issue is likely caused by the `__construct()` method and how it handles the initialization of your shopping cart data. Let us address this problem with a better implementation.

Revisiting the Issue: Fixing the Code

To resolve the error, we will make the following changes to the 'Cart' class:

1. Remove the `__construct()` method from your Cart class (as it is currently unnecessary):
   <pre><code>&lt;?php
namespace App;
class Cart{
   public $items=null;
}
</code></pre>

2. Modify your WebController@addToCart method to instantiate the 'Cart' class:
   <pre><code>public function addToCart(Request $request, $id){
      $product = Product::find($id);
      $oldCart = Session::has('cart') ? Session::get('cart') : null;
      // Replace with the updated code:
      $cart = new Cart();
      if($oldCart){
        $cart-&gt;items=$oldCart-&gt;items;
      }
      $cart->add($product,$product-&gt;id);
      $request-&gt;session()-&gt;put('cart',$cart);
      dd($request-&gt;session()-&gt;get('cart'));
      return redirect()-&gt;route(get.product);
   }</code></pre>

Conclusion

In conclusion, the issue you faced was caused by an incorrect usage of the 'Cart' class constructor in your Laravel application. By removing the unnecessary `__construct()` method and making appropriate changes to your WebController@addToCart method, you have successfully resolved the parse error and can continue using the add-to-cart functionality without any issues. For more information on working with sessions and cart functionality in Laravel, refer to our blog or visit https://laravelcompany.com for comprehensive resources.
