---
title: "Laravel validation: exists with additional column condition - custom validation rule"
description: "Title: Custom Laravel Validation Rule for Checking Existence with Additional Conditions Laravel is a powerful PHP framework renowned for its robust..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Custom Laravel Validation Rule for Checking Existence with Additional Conditions

Laravel is a powerful PHP framework renowned for its robust validation system. The built-in validation features are useful, but sometimes, you may require more specific conditions in your rules. This blog post will guide you on how to create custom validation rules in Laravel while referencing another field and fulfilling additional conditions.

Let's first understand the problem that we want to solve. We want to validate three fields: 'game_id', 'team1_id', and 'team2_id'. The first one ('game_id') should exist in the games table, while the second two ('team1_id' and 'team2_id') must exist in the teams table with a matching game ID.

Step 1: Creation of Custom Validation Rule
To create a custom validation rule to handle this, we will first define our custom validator class. Create a new file named GameValidator inside your application's 'App\Validators' directory and paste the following code:

<code>public function addCustomRules(Validator $validator) {
  $validator->extend('custom_game_teams', function($attribute, $value, $parameters, $validator) {
    // Retrieve data from database
    $data = DB::table('games')->where(['id' => $value])->get();

    if (count($data)) {
      $firstTeamID = DB::table('teams')->where([
        'game_id' => $value,
        'team1_id' => $parameters[0],
      ])->value('id');

      if ($firstTeamID === null) {
        return false;
      }

      $secondTeamID = DB::table('teams')->where([
        'game_id' => $value,
        'team1_id' => $parameters[0],
      ])->value('id');

      if ($secondTeamID === null) {
        return false;
      }
    } else {
      return false;
    }

    return true;
  });
}</code>

In this code, we extend the 'Validator' class and create a custom rule called 'custom_game_teams'. It first checks for the existence of a game ID by querying the database using the input value. If it finds records for both teams (team1_id and team2_id), as per your requirements, the validation passes; otherwise, it fails.

Step 2: Applying Custom Validation Rule in Your Controller
To use this custom rule, you can modify your controller code to validate inputs accordingly. Let's assume we have a 'store_game_details' method in our GamesController:

<code>public function storeGameDetails(Request $request) {
  $data = $request->validate([
    'game_id' => 'required|exists:games,id',
    'team1_id' => 'required|custom_game_teams:game_validator.php,custom_game_teams,$game_id,team1_id',
    'team2_id' => 'required|custom_game_teams:game_validator.php,custom_game_teams,$game_id,team2_id'
  ]);
  // Store game details in database
}</code>

In this code, we validate the 'game_id' as existing in the 'games' table and pass the values for the custom validation rules. The second two fields (team1_id and team2_id) require a specific game_id, which is mentioned in their respective custom rule calls.

In conclusion, you can create custom Laravel validation rules to handle complex requirements while ensuring data integrity. By following these steps, your validation system will maintain the accuracy of your database connections. For further information on Laravel's validation system and best practices, check out our detailed guides at https://laravelcompany.com.
