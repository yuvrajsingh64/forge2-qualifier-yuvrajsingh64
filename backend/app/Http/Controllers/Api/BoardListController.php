<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Board;
use App\Models\BoardList;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BoardListController extends Controller
{
    public function index(Board $board): JsonResponse
    {
        return response()->json($board->lists()->with('cards')->get());
    }

    public function store(Request $request, Board $board): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'nullable|integer',
        ]);

        $data['position'] = $data['position'] ?? $board->lists()->max('position') + 1;
        $list = $board->lists()->create($data);

        return response()->json($list, 201);
    }

    public function show(BoardList $boardList): JsonResponse
    {
        return response()->json($boardList->load(['cards.tags', 'cards.member']));
    }

    public function update(Request $request, BoardList $boardList): JsonResponse
    {
        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'position' => 'nullable|integer',
        ]);

        $boardList->update($data);

        return response()->json($boardList);
    }

    public function destroy(BoardList $boardList): JsonResponse
    {
        $boardList->delete();

        return response()->json(null, 204);
    }
}
