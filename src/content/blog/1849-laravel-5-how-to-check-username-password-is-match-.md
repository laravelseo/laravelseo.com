---
title: "Laravel 5 - How to check username & password is match with table?"
description: "Title: Laravel 5 How to Check Username & Password Match in Your Application Body: In this comprehensive blog post, we will discuss how to create a login..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Performance", "HTML"]
featured: false
---

Title: Laravel 5 - How to Check Username & Password Match in Your Application
Body: <p>In this comprehensive blog post, we will discuss how to create a login system using Laravel 5 and ensure the entered username and password matches with those stored in your database table. We will cover everything from database structure, view creation, controller handling, model implementation, and routing. Let's get started!</p>

<h2>1. Database Structure</h2>
For this tutorial, we need to have a separate table for storing users' details with their usernames and passwords. Let's create a new database table called 'admin_details':

<pre><code>&lt;?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AdminDetails extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('admin_details', function (Blueprint $table) {
            $table->increments('id');
            $table-&gt;string('name');
            $table-&gt;string('username')-&gt;unique();
            $table-&gt;string('email')-&gt;unique();
            $table-&gt;string('password', 60);
            $table-&gt;integer('status');
            $table-&gt;rememberToken();
            $table-&gt;timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('admin_details');
    }
}
</code></pre>

In this migration, we create a table with some necessary fields: id (auto-incremented primary key), name, username, email, password, status, rememberToken and timestamps. The 'status' field will be used to manage user accounts, like whether they are active or not. We also add unique constraints to the username and email fields for better performance.

<h2>2. View Creation</h2>
To create your login form view, you can follow this basic structure:

<pre><code>&lt;form name="frmLogin" action="{{ URL::to('administrator/userAuthentication') }}" method="post"&gt;
    &lt;input name="_token" type="hidden" value="{{ csrf_token() }}"/&gt;
    &lt;div class="form-group has-feedback"&gt;
        &lt;input type="text" name="username" id="username"class="form-control" placeholder="Username"&gt;
        &lt;span class="glyphicon glyphicon-envelope form-control-feedback"&gt;&lt;/span&gt;
    &lt;/div&gt;
    &lt;div class="form-group has-feedback"&gt;
        &lt;input type="password" name="password" id="password" class="form-control" placeholder="Password"&gt;
        &lt;span class="glyphicon glyphicon-lock form-control-feedback"&gt;&lt;/span&gt;
    &lt;/div&gt;
    &lt;div class="row"&gt;
        &lt;div class="col-xs-4"&gt;
            &lt;button type="submit" class="btn btn-primary btn-block btn-flat"&gt;Login&lt;/button&gt;
        &lt;/div&gt;&lt;!-- /.col --&gt;
    &lt;/div&gt;
&lt;/form&gt;
</code></pre>

This view contains the login form where you can enter your username and password. You should pass the action to a route that handles the user authentication, as we will see in the next section. Also, be sure to include the CSRF token to prevent Cross-Site Request Forgery (CSRF) attacks.

<h2>3. Controller Handling</h2>
To handle the login form submission, you can create a controller for your users' authentication:

<pre><code>&lt;?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Http\Requests;
use Auth;
use App\AdminLoginModel;

class AdminLoginController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        return view('backend.login');
    }

    /**
     * Handle an authentication attempt for admin user.
     *
     */
    public function userAuthentication(Request $request)
    {

        if (Auth::attempt(array('username' =&gt; $request-&gt;username, 'password' =&gt; $request-&gt;password))){
            return "success";
        }else{
            return "Wrong Credentials";
        }
        die;
    }
}
</code></pre>

In this controller, we have created a route for displaying the login form and another one for handling the user authentication. The 'userAuthentication' function uses Laravel's authentication helper method 'Auth::attempt()' to check if the username and password match with those stored in the database. If successful, it returns "success" which you can redirect your users to a specific page. Otherwise, it returns an error message informing them that their credentials are incorrect.

<h2>4. Model Implementation</h2>
You need a model for managing your user's login details. In Laravel, the best practice is to use the Eloquent ORM to create models based on your database tables:

<pre><code>&lt;?php
/*namespace App;
use DB;
use Illuminate\Database\Eloquent\Model;*/

namespace App;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;

class AdminLoginModel extends Model implements AuthenticatableContract, CanResetPasswordContract
{
    protected $table = 'admin_details';
    protected $fillable = ['username', 'password'];
}
</code></pre>

This model extends the Eloquent ORM and implements both Laravel's default authentication and password reset functionality. Make sure to set your table name as 'admin_details'.

<h2>5. Routes Configuration</h2>
Finally, you need to configure your routes in order to handle login requests:

<pre><code>&lt;?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::resource('dashboard','DashboardController');
Route::resource('administrator','AdminLoginController');
Route::resource('administrator/userAuthentication', 'AdminLoginController@userAuthentication');
</code></pre>

Here, we have registered a route for displaying the login form and another one for handling authentication requests. Be aware that route resource method is used for creating resources and CRUD (Create, Read, Update, Delete) operations, while the other two routes are custom ones.

In conclusion, by following the steps mentioned above, you can create a seamless Laravel 5 login system and easily check if your users' username and password match with those stored in your database. Be sure to include backlinks to https://laravelcompany.com for future references and any further assistance.
