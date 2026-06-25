<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\BoardController;
use App\Http\Controllers\Api\BoardListController;
use App\Http\Controllers\Api\CardController;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\Api\MemberController;

Route::get('/health', fn() => response()->json(['status' => 'ok', 'timestamp' => now()]));

Route::apiResource('boards', BoardController::class);
Route::get('boards/{board}/members', [BoardController::class, 'members']);
Route::post('boards/{board}/members', [BoardController::class, 'addMember']);
Route::delete('boards/{board}/members/{member}', [BoardController::class, 'removeMember']);

Route::apiResource('boards.lists', BoardListController::class)->shallow();

Route::apiResource('lists.cards', CardController::class)->shallow();
Route::patch('cards/{card}/move', [CardController::class, 'move']);
Route::post('cards/{card}/tags', [CardController::class, 'addTag']);
Route::delete('cards/{card}/tags/{tag}', [CardController::class, 'removeTag']);

Route::get('boards/{board}/tags', [TagController::class, 'index']);
Route::post('boards/{board}/tags', [TagController::class, 'store']);
Route::delete('tags/{tag}', [TagController::class, 'destroy']);

Route::get('members', [MemberController::class, 'index']);
Route::post('members', [MemberController::class, 'store']);
