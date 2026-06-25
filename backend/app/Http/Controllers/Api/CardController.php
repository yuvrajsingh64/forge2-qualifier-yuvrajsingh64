<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BoardList;
use App\Models\Card;
use App\Models\Tag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CardController extends Controller
{
    public function index(BoardList $boardList): JsonResponse
    {
        return response()->json($boardList->cards()->with(['tags', 'member'])->get());
    }

    public function store(Request $request, BoardList $boardList): JsonResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'member_id' => 'nullable|exists:members,id',
        ]);

        $data['position'] = $boardList->cards()->max('position') + 1;
        $card = $boardList->cards()->create($data);

        return response()->json($card->load(['tags', 'member']), 201);
    }

    public function show(Card $card): JsonResponse
    {
        return response()->json($card->load(['tags', 'member', 'list.board']));
    }

    public function update(Request $request, Card $card): JsonResponse
    {
        $data = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'member_id' => 'nullable|exists:members,id',
        ]);

        $card->update($data);

        return response()->json($card->load(['tags', 'member']));
    }

    public function destroy(Card $card): JsonResponse
    {
        $card->delete();

        return response()->json(null, 204);
    }

    public function move(Request $request, Card $card): JsonResponse
    {
        $data = $request->validate([
            'board_list_id' => 'required|exists:board_lists,id',
            'position' => 'nullable|integer',
        ]);

        $card->update([
            'board_list_id' => $data['board_list_id'],
            'position' => $data['position'] ?? 0,
        ]);

        return response()->json($card->load(['tags', 'member']));
    }

    public function addTag(Request $request, Card $card): JsonResponse
    {
        $data = $request->validate(['tag_id' => 'required|exists:tags,id']);
        $card->tags()->syncWithoutDetaching([$data['tag_id']]);

        return response()->json($card->load('tags'));
    }

    public function removeTag(Card $card, Tag $tag): JsonResponse
    {
        $card->tags()->detach($tag->id);

        return response()->json(null, 204);
    }
}
