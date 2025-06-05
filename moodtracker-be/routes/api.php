<?php

use App\Http\Controllers\api\lifehubController;
use App\Http\Controllers\Api\moodController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::apiResource('moods', moodController::class);
Route::apiResource('lifehubs', lifehubController::class);
