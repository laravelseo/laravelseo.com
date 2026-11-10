---
title: "L5 Swagger - how to add examples for request body or response body"
description: "Title: Adding Request and Response Examples Using L5 Swagger for API Documentation Introduction Laravel's L5 Swagger provides an easy way to document your..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "HTML", "PHP"]
featured: false
---

Title: Adding Request and Response Examples Using L5 Swagger for API Documentation

Introduction
Laravel's L5 Swagger provides an easy way to document your application's RESTful APIs, giving clients a comprehensive understanding of the available endpoints, request parameters, response data, and more. In this blog post, we will discuss how to add examples for both the request body and response body within your API documentation using L5 Swagger.

Step-by-Step Guide
1. Understand the basic L5 Swagger syntax:
   - Use @OA\Post, @OA\Get, or other appropriate annotations for different HTTP methods.
   - Define request and response schemas using JSON Schema or YAML syntax.
   - Utilize example data or scenarios to illustrate how the API should be used.

2. Add annotations for request body examples:
   - Use @OA\RequestBody to define a specific request structure with an associated schema. Include an example object that demonstrates a valid request body, as shown below:
     ```php
     /**
      * @OA\Post(
      *     operationId=&quot;vehicleStore&quot;,
      *     ...
      *
      *     @OA\RequestBody(
      *       @OA\JsonContent(
      *          allOf={
      *                    @OA\Schema(ref=&quot;#/components/schemas/APIResponse&quot;),
      *                    @OA\Schema(ref=&quot;#/components/schemas/CustomRequestBody&quot;)
      *               },
      *              examples={ @OA\Examples( value = {
      *                   exampleData: "Example request data"
      *               }) }
      *          )
      *     ),
      * ...
      */
     ```

3. Add annotations for response body examples with external reference:
   - Use @OA\Examples to define a specific object that represents the expected response structure, along with its values and summary. Reference this object within your API documentation by providing an external link to the relevant JSON file or another source containing the example data. For instance, use <code>externalValue</code> as shown below:
     ```php
     /**
      * @OA\Post(
      * ...
      *     @OA\RequestBody(
      *       ...
      *      ),
      *
      *     @OA\Response(
      *         response=&quot;200&quot;,
      *         description=&quot;Successful&quot;,
      *          @OA\JsonContent()
      *     ),
      * ...
      */

     /**
      * @OA\Examples(
      *   summary=&quot;VehicleStore&quot;,
      *   value = {
      *              &quot;result&quot;: null,
      *              &quot;message&quot;: &quot;Unauthorized, you don't have access to this content, Invalid token.&quot;,
      *              &quot;status&quot;: 401
      *         },
      *   externalValue=&quot;http://api.nytimes.com/svc/search/v2/articlesearch.json&quot;,
      *   summary=&quot;1&quot;
      *)
     */

4. View and update examples in Swagger UI:
    - Once you have added the annotations for request and response body examples, these should appear in your API documentation within the "Example" section of each endpoint. If the Swagger UI is not displaying the examples correctly, make sure that you've followed the correct syntax and that all references are valid. You may need to update the Swagger configuration to include the necessary sections using Laravel 5 Swagger's documentation guide.

Conclusion
Adding request and response body examples in L5 Swagger helps improve your API documentation, making it easier for clients and developers to understand and use your application effectively. By understanding the syntax of this powerful tool and applying it correctly, you can ensure that your application's documentation is both clear and comprehensive for users.
