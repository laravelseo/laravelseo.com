---
title: "Attempt to read property \"name\" on null"
description: "Title: Displaying Category Name in Your Laravel Application Category Model Code: class Category extends Model { use HasFactory; protected $fillable=..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

Title: Displaying Category Name in Your Laravel Application
Category Model Code:
<pre><code>class Category extends Model
{
use HasFactory;

protected $fillable= ['name','number'];

public function news(){
    return $this-&gt;hasMany(News::class);
}
}
</code></pre>
News Model Code:
<pre><code>class News extends Model
{
use HasFactory;

protected $fillable= ['cat_id','title','photo','description','author_id','status'];

public function category(){
        return $this-&gt;belongsTo(Category::class);
    }

  public function author(){
  return $this-&gt;belongsTo(Author::class);
    }
}
</code></pre>
Author Model Code:
<pre><code>class Author extends Model
{
use HasFactory;

protected $fillable= ['name','status'];

public function news(){
    return $this-&gt;hasMany(News::class);
}
}
</code></pre>
Controller Function:
<pre><code>  public function news_index(){
    $news= News::with('category')-&gt;get();
    return view('News.list',compact('news'));
}
</code></pre>
Blade Page Code:
<pre><code>@foreach($news as $new)
            &lt;tr&gt;
                &lt;th scope=&quot;row&quot;&gt;{{$loop-&gt;iteration}}&lt;/th&gt;
                &lt;td&gt; {{$new-&gt;category-&gt;name}}&lt;/td&gt;
                &lt;td&gt;  {{$new-&gt;title}}&lt;/td&gt;
                &lt;td&gt; @if($new-&gt;photo)
                        &lt;a href=&quot;{{url('storage/images/'.$new-&gt;photo)}}&quot; target=&quot;_blank&quot; class=&quot;btn btn-sm btn-secondary&quot;&gt;Görüntüle&lt;/a&gt;&lt;/td&gt;
                @endif
                &lt;td&gt;  {{$new-&gt;author_id}}&lt;/td&gt;
                &lt;td&gt;  {{$new-&gt;description}}&lt;/td&gt;
                &lt;td&gt;  {{$new-&gt;status}}&lt;/td&gt;

                &lt;td&gt;
                    &lt;a class=&quot;btn btn-danger&quot; onclick=&quot;return confirm('Silmek istediğinize emin 
       misiniz?')&quot; href=&quot;{{route('news_delete', $new-&gt;id)}}&quot;&gt;&lt;i class=&quot;fa fa-trash&quot;&gt;&lt;/i&gt;&lt;/a&gt;
                    &lt;a class=&quot;btn btn-primary&quot; href=&quot;{{route('news_update',$new-&gt;id)}}&quot;&gt;&lt;i class=&quot;fa 
      fa-pen&quot;&gt;&lt;/i&gt;&lt;/a&gt;

                &lt;/td&gt;
            &lt;/tr&gt;
        @endforeach
</code></pre>
Migration Table Code:
<pre><code>public function up()
    {
        Schema::create('news', function (Blueprint $table) {
            $table-&gt;id();
            $table-&gt;unsignedBigInteger('cat_id');
            $table-&gt;string('title');
            $table-&gt;string('photo');
            $table-&gt;longText('description');
            $table-&gt;unsignedBigInteger('author_id');
            $table-&gt;boolean('status')-&gt;default('1');
$table-&gt;foreign('cat_id')-&gt;references('id')-&gt;on('categories')-&gt;onDelete('cascade');
            $table-&gt;foreign('author_id')-&gt;references('id')-&gt;on('authors')-&gt;onDelete('cascade');
            $table-&gt;timestamps();
        });
    }
</code></pre>

The error "Attempt to read property "name" on null" appears when you try to access the non-existent category name for a news item that isn't associated with any category. To solve this issue, ensure that each news article is connected to a proper category by using the correct relationships in your models.

First, update your Controller function as follows:
<pre><code>  public function news_index(){
    $news= News::with('category')-&gt;get();
    if($news){
        return view('News.list',compact('news'));
    }else{
        return redirect()->route('error')->withErrors("There is an error in fetching news or categories.")->withInput();
    }
}
</code></pre>

This code checks whether there are any news items and if so, it renders the view containing your loop with the necessary category information. Otherwise, it redirects to a custom error page, displaying an appropriate message. This ensures that your application will handle the situation where news or categories couldn't be fetched successfully.

Now, let's examine the relationships between the models. The 'category' belongsTo(News) relationship in the Category model must be changed as shown below to maintain consistency:
<pre><code>class Category extends Model
{
use HasFactory;

protected $fillable= ['name','number'];

public function news(){
    return $this-&gt;hasMany(News::class);
  }
}
</code></pre>

Next, you need to modify the relationships in the News and Author models. Since each news item belongs to a category and author respectively, their relationships should be updated as follows:
<pre><code>class News extends Model
{
use HasFactory;

protected $fillable= ['cat_id','title','photo','description','author_id','status'];

public function category(){
        return $this-&gt;belongsTo(Category::class);
    }

  public function author(){
  return $this-&gt;belongsTo(Author::class);
    }
}

class Author extends Model
{
use HasFactory;

protected $fillable= ['name','status'];

public function news(){
    return $this-&gt;hasMany(News::class);
}
</code></pre>

Now, the relationships between your models are consistent and clear. As a result, it will be much easier for you to implement them in your application without receiving any errors related to null properties or missing relationships.
