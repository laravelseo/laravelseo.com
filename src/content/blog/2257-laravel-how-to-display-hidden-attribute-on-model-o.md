---
title: "Laravel How to display $hidden attribute on model on paginate"
description: "Title: Discovering Advanced Methods for Displaying Hidden Attributes on Paginated Models in Laravel Introduction: Managing sensitive data in your application..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content"]
featured: false
---

Title: Discovering Advanced Methods for Displaying Hidden Attributes on Paginated Models in Laravel

Introduction: Managing sensitive data in your application is vital to ensure proper security, especially when dealing with user information like passwords or tokens. In Laravel 5.5 and beyond, the makeVisible() method allows you to hide specific attributes from being serialized to Json before returning them as responses. However, displaying these hidden attributes while paginating through a collection of models can be a bit tricky. This article explores various methods for achieving this goal without compromising security.

Method 1: Using makeVisible() with a Custom Query Builder
If you prefer using Laravel's query builder rather than Eloquent ORM, the following method can help solve your problem:

<pre><code>$hidden = ['password', 'remember_token', 'email'];

// Get all users with hidden attributes visible
DB::table('users')
    ->select(DB::raw("JSON_OBJECT('user', JSON_UNQUOTE(to_json((user: JSON_MERGE_PATCH(users.*, JSON_BUILD_ARRAY('email' => COALESCE(users.'email', NULL), 'hidden' => 'true')))))) as user, users.*"))
    ->whereIn('id', function ($query) use ($hidden) {
        array_walk($hidden, function ($item) use ($query) {
            $query->orWhereNotNull($item);
        });
    })
    ->paginate(10);
</code></pre>

Method 2: Overriding the ToArray() Method in Eloquent Models
Another approach is to override the `toArray($request)` method, which returns a JSON representation of a model instance. You can hide attributes as per your requirements by defining them within the `$hidden` array before calling the method on your model:

<pre><code>class User extends Model {
    protected $hidden = ['password', 'remember_token', 'email'];

    public function toArray($request) {
        $attributes = parent::toArray($request);
        foreach ($this->$hidden as $field) {
            if (array_key_exists($field, $attributes)) {
                unset($attributes[$field]);
            }
        }

        return $attributes;
    }
}

// Get all users with hidden attributes visible
$users = User::with('role', 'level')->paginate(10);
</code></pre>

Method 3: Custom Serializer Class to Handle Hidden Attributes
You can create a custom serializer class that will handle the serialization process for your models. This method allows you to keep your existing codebase clean and avoid modifying the core Laravel framework.

<pre><code>class UserSerializer extends JsonSerializable {
    public function getAttributes() {
        return array_merge(parent::getAttributes(), [
            'email' => $this->getEmail()
        ]);
    }

    protected function getEmail() {
        if ($this->isHidden('email')) {
            throw new \Exception('Email cannot be accessed');
        }

        return $this->getAttribute('email');
    }
}

// Get all users with hidden attributes visible
$users = User::with('role', 'level')->make(function ($user) {
    $user->setSerializationOptions([
        'serializesModels' => false,
        'serializeNulls'    => true,
        'customClass'      => UserSerializer::class
    ]);
})->paginate(10);
</code></pre>

Conclusion:
Displaying hidden attributes on paginated models in Laravel can be achieved using various methods. While each approach has its advantages and disadvantages, ensuring the security of your application is crucial. By understanding these techniques and implementing them based on your specific needs, you can efficiently manage sensitive data for your users without compromising their privacy. For further assistance or guidance, feel free to contact us at https://laravelcompany.com/.
