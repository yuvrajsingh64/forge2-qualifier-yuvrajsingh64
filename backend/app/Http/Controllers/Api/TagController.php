<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Board;
use App\Models\Tag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TagController extends Controller
{
    public function index(Board $board): JsonResponse
    {
        return response()->json($board->tags);
    }

    public function store(Request $request, Board $board): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'color' => 'nullable|string|max:20',
        ]);

        $tag = $board->tags()->create($data);

        return response()->json($tag, 201);
    }

    public function destroy(Tag $tag): JsonResponse
    {
        $tag->delete();

        return response()->json(null, 204);
    }
}
