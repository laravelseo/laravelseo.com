---
title: "Laravel JsonResource (resource collection) add extra data to response"
description: "Title: Efficiently Adding Custom Data to Laravel JSON Responses with JsonResource Introduction: In Laravel, the JsonResource class is a powerful tool for..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content"]
featured: false
---

Title: Efficiently Adding Custom Data to Laravel JSON Responses with JsonResource

Introduction: In Laravel, the JsonResource class is a powerful tool for transforming data into structured JSON responses in your API. This blog post will explore how you can add extra data to the response through various techniques - from using the `JsonResource::with` method to combining multiple resources together. Additionally, we'll cover best practices and tips to make your JsonResources even more efficient.

1. Using JsonResource::with() Method:
   The easiest approach you can try is calling the `JsonResource::with` method from within the controller, chained to the resource itself - as illustrated in the example below. This way, your additional data will be included along with the JsonResource's transformed data.
   <pre><code>return (new UserCollection(User::all()->load('roles')))
            ->additional(['extra' => [
                'key' => 'value',
            ]]);</code></pre>

2. Combining Multiple Resources:
   Another option is to combine multiple resources together in your controller and then pass them through a single JsonResource class instance that will be responsible for transforming all of it into a JSON response. You can do this by creating and returning multiple collections and then combining them using the `array_merge` function. Here's an example:
   <pre><code>$userCollections = [];
    $users = User::where('is_available', 1)->get();
    $users = $users->paginate();

    $userCollection = new UserCollection(User::all()->load('roles'));
    $extraCollection = JsonResource::collection($extraData);

    array_push($userCollections, $userCollection);
    array_push($userCollections, $extraCollection);

    return UserCollection::collection($userCollections);</code></pre>

3. Customizing the JsonResource Class:
   If you want to keep your custom data within the resource itself, you can extend the JsonResource class and define an additional method `toArray` or `with`, depending on your preference. Then, override these methods in your extended class to append extra data to your response. Here's a modified version of the `UserCollection`:
   <pre><code>class UserCollection extends JsonResource
    {
        protected $result = [];

        /**
         * Transform the resource into an array.
         *
         * @param  \Illuminate\Http\Request  $request
         * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
         */
        public function toArray($request)
        {
            $this->result = [
                'attributes' => [
                    'id'                   => $this->id,
                    'name'                  => $this->name,
                    'position'              => $this->position,
                ],
            ];

            return $this->result;
        }

        public function with($request)
        {
            return [
                'extra' => [
                    'key' => 'value',
                ],
            ];
        }

    }</code></pre>

4. Conclusion:
   To customize your Laravel JsonResources and add extra data to the response, you can choose from several options depending on your needs and coding style preferences. The `JsonResource::with` method is a simple but powerful way to add extra data at the controller level. In contrast, combining multiple resources together or extending the base class for a more personalized implementation allows you to control and organize your data more effectively. By following these techniques and best practices, you can build efficient APIs with Laravel and easily scale your applications as needed.
