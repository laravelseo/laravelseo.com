---
title: "Storing parts of API data to database"
description: "Mastering Data Ingestion: Storing Nested API Data into Your Database As developers working with modern APIs, one of the most common challenges is taking..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "PHP"]
featured: false
---

As developers working with modern APIs, one of the most common challenges is taking complex, deeply nested JSON responses and transforming them into a structured, queryable relational database. The goal isn't just to dump the raw data; it's to normalize it correctly so that your application can efficiently retrieve, filter, and manage those relationships later on.

This post will walk you through the process of taking an array of soccer match data from a RESTful API and effectively storing it in a Laravel database using best practices.

## The Challenge of Nested Data

You are fetching match data where each match contains arrays for `homeTeam` and `awayTeam`, which themselves contain team details (ID and name). Storing this structure directly into a single column is inefficient, makes querying difficult, and violates the principles of database normalization.

Your goal is to store: `'id', 'homeTeam', 'awayTeam', 'utcDate'` for every match. The complexity lies in correctly handling the nested team arrays from your API response.

## The Relational Approach: Normalization is Key

Instead of trying to cram all the nested information into a single table, the correct approach is **normalization**. This means separating related entities (Matches and Teams) into their own distinct tables linked by foreign keys. This pattern is fundamental in building robust applications, much like how relationships are managed within a framework like Laravel.

For this scenario, we need at least two primary tables: one for Matches and one for Teams.

### 1. Database Schema Setup (Migrations)

We will define separate migrations for better structure. The provided migration needs refinement to handle the team data properly.

First, let's create a `teams` table to store unique team information, and then link it from our `matches` table.

```php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMatchesTable extends Migration
{
    public function up()
    {
        // Create the matches table
        Schema::create('matches', function (Blueprint $table) {
            $table->id(); // Primary key for the match record
            $table->string('home_team_name'); // Store team name directly or use an FK later
            $table->string('away_team_name');
            $table->dateTime('utc_date');
            $table->timestamps();
        });

        // Create a separate teams table for normalization
        Schema::create('teams', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('matches');
        Schema::dropIfExists('teams');
    }
}
```

### 2. The Data Ingestion Strategy

The process involves three main steps: fetch, process (normalize), and save. This transformation logic should reside in your service layer or controller, keeping your Eloquent models clean.

Here is how you would process the Guzzle response:

```php
use App\Models\Match;
use App\Models\Team;

class MatchImporter
{
    public function importMatches(array $apiData)
    {
        // 1. Pre-fetch or map team IDs to avoid duplicate entries in the teams table
        $teamIds = [];
        foreach ($apiData['matches'] as $match) {
            // Process Home Team
            if (isset($match['homeTeam']['id'])) {
                $teamId = $match['homeTeam']['id'];
                $teamIds[$teamId] = $teamId; // Collect unique IDs
            }

            // Process Away Team
            if (isset($match['awayTeam']['id'])) {
                $teamId = $match['awayTeam']['id'];
                $teamIds[$teamId] = $teamId;
            }
        }

        // 2. Iterate and Save
        foreach ($apiData['matches'] as $match) {
            // Find or create the Home Team record
            $homeTeam = Team::firstOrCreate(['id' => $match['homeTeam']['id']], ['name' => $match['homeTeam']['name']]);

            // Find or create the Away Team record
            $awayTeam = Team::firstOrCreate(['id' => $match['awayTeam']['id']], ['name' => $match['awayTeam']['name']]);

            Match::create([
                'home_team_name' => $homeTeam->name,
                'away_team_name' => $awayTeam->name,
                'utc_date' => $match['utcDate'], // Ensure date format is correct for DB insertion
            ]);
        }
    }
}
```

## Conclusion: Building Robust Data Pipelines

By adopting a normalized approach, you move beyond simple data storage and start building a scalable system. When dealing with external APIs, always treat the incoming JSON as raw input that needs transformation before persistence. Using Eloquent relationships, as promoted by the Laravel ecosystem, allows you to manage these complex relationships elegantly. For deeper dives into mastering database design patterns within your framework, exploring resources from [laravelcompany.com](https://laravelcompany.com) is highly recommended. This method ensures that if a team name changes or you need to query all matches for a specific team, your database structure will support it seamlessly.
