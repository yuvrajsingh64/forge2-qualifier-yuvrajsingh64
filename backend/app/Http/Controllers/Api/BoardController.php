<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Board;
use App\Models\Member;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BoardController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Board::with(['members', 'lists'])->get());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:20',
        ]);

        $board = Board::create($data);

        return response()->json($board->load('members'), 201);
    }

    public function show(Board $board): JsonResponse
    {
        return response()->json(
            $board->load(['lists.cards.tags', 'lists.cards.member', 'members', 'tags'])
        );
    }

    public function update(Request $request, Board $board): JsonResponse
    {
        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:20',
        ]);

        $board->update($data);

        return response()->json($board);
    }

    public function destroy(Board $board): JsonResponse
    {
        $board->delete();

        return response()->json(null, 204);
    }

    public function members(Board $board): JsonResponse
    {
        return response()->json($board->members);
    }

    public function addMember(Request $request, Board $board): JsonResponse
    {
        $data = $request->validate(['member_id' => 'required|exists:members,id']);
        $board->members()->syncWithoutDetaching([$data['member_id']]);

        return response()->json($board->load('members'));
    }

    public function removeMember(Board $board, Member $member): JsonResponse
    {
        $board->members()->detach($member->id);

        return response()->json(null, 204);
    }
}
