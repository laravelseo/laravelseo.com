---
title: "Laravel eloquent multiple WHERE with OR AND OR and LIKE?"
description: "Title: Querying Laravel Eloquent with Multiple Conditions and LIKE Statements Laravel's query builder is incredibly powerful and flexible, allowing you to..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Keywords"]
featured: false
---

Title: Querying Laravel Eloquent with Multiple Conditions and LIKE Statements

Laravel's query builder is incredibly powerful and flexible, allowing you to construct sophisticated queries easily. In this article, we discuss how to optimally handle multiple conditions with the OR and AND operators as well as performing LIKE queries on specific fields while working within Laravel Eloquent models. We'll look at code snippets for clarity and show off the power of the query builder in action.

Let's start by tackling multiple WHERE clauses using both AND and OR operators. As you may already know, Laravel's Query Builder provides a variety of methods to manipulate conditions. The where() method is useful for checking a single condition, while orWhere() allows for an additional "or" clause in your query. In the given example code snippet:

<pre><code>$matchThese = ['link.hos_id' => $hos_id, 'outcome.otc_otcdischargedate' => $td];
$orThose = ['outcome.otc_outcome' => '@ICU@', 'outcome.otc_outcome' => '@I.C.U@'];</code></pre>

We have two sets of conditions - one for checking the "link" table and another for querying the "outcome" table. We can pass these conditions into a single query using both `where()` and `orWhere()`:

<pre><code>$todaysReferrals = DB::table('link')
	->join('daily_link', 'link.lnk_id', '=', 'daily_link.dlk_lnkid')
	->join('demographic', 'link.lnk_dmgid', '=', 'demographic.dmg_id')
	->join('admission', 'link.lnk_admid', '=', 'admission.adm_id')
	->join('or_call', 'admission.adm_calid', '=', 'or_call.cal_id')
	->join('admission_score', 'admission.adm_scoreid', '=', 'admission_score.ascore_id')
	->join('diagnosis', 'link.lnk_dgnid', '=', 'diagnosis.dgn_id')
	->join('outcome', 'link.lnk_otcid', '=', 'outcome.otc_id')
	->where($matchThese)
	->orWhere($orThose)
	->get();</code></pre>

The final query is a composite of multiple joined tables, and it includes conditions based on both arrays - one for matching the specific "link" table fields (`$matchThese`) and another for checking "outcome" table fields (`$orThose`). This approach will perform an "OR" join between the `$matchThese` array and an "AND" join within the `$orThose` array.

Now let's take a look at LIKE queries in Eloquent. In your case, you want to query using this condition: "The data in that field can be many things, but there will always be a key work like 'L3' or 'ICU' in the field." This can be accomplished through Eloquent's `like()` method.

Here's how you can modify your query to include LIKE conditions:

<pre><code>$todaysReferrals = DB::table('link')
	->join('daily_link', 'link.lnk_id', '=', 'daily_link.dlk_lnkid')
	->join('demographic', 'link.lnk_dmgid', '=', 'demographic.dmg_id')
	->join('admission', 'link.lnk_admid', '=', 'admission.adm_id')
	->join('or_call', 'admission.adm_calid', '=', 'or_call.cal_id')
	->join('admission_score', 'admission.adm_scoreid', '=', 'admission_score.ascore_id')
	->join('diagnosis', 'link.lnk_dgnid', '=', 'diagnosis.dgn_id')
	->join('outcome', 'link.lnk_otcid', '=', 'outcome.otc_id')
	->where(['link.hos_id' => $hos_id, 'outcome.otc_otcdischargedate' => $td])
	->orWhere([['outcome.otc_outcome', 'like', '%ICU%'], ['outcome.otc_outcome', 'like', '@I.C.U@']])
	->get();</code></pre>

We have replaced `$matchThese` and `$orThose` with simple array conditions that use the `where()` method for exact matches (using `=` or `==`) and `orWhere()` with `like()` to perform LIKE queries. Make sure your query is performing as expected according to your requirements, but this example should help point you in the right direction for handling multiple conditions and LIKE queries within Laravel Eloquent models.

Remember that performance and scalability play a crucial role in how you implement your queries. Make sure you're doing all you can to optimize query speed and efficiency without compromising on data accuracy. As always, be aware of SQL Injection risks when working with dynamic user input. If needed, consider implementing prepared statements or query bindings for better security.

In conclusion, handling multiple conditions and LIKE queries in Laravel Eloquent can be achieved through various methods using the query builder's flexible API. Be sure to optimize your queries for speed and efficiency while maintaining data accuracy and security. With these tools at your disposal, you should now feel more confident in writing efficient and secure Eloquent queries that will help you make the most of Laravel's powerful features.
