<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Member;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MemberController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Member::all());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:members',
            'avatar_color' => 'nullable|string|max:20',
        ]);

        $member = Member::create($data);

        return response()->json($member, 201);
    }
}
