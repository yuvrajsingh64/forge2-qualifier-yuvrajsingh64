<?php

namespace Database\Seeders;

use App\Models\Board;
use App\Models\BoardList;
use App\Models\Card;
use App\Models\Member;
use App\Models\Tag;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $alice = Member::create([
            'name' => 'Alice',
            'email' => 'alice@example.com',
            'avatar_color' => '#6366f1',
        ]);

        $bob = Member::create([
            'name' => 'Bob',
            'email' => 'bob@example.com',
            'avatar_color' => '#10b981',
        ]);

        $board = Board::create([
            'name' => 'My First Board',
            'description' => 'A sample project board.',
            'color' => '#6366f1',
        ]);

        $board->members()->attach([$alice->id, $bob->id]);

        $bugTag = Tag::create(['board_id' => $board->id, 'name' => 'bug', 'color' => '#ef4444']);
        $designTag = Tag::create(['board_id' => $board->id, 'name' => 'design', 'color' => '#8b5cf6']);

        $todo = BoardList::create(['board_id' => $board->id, 'name' => 'To Do', 'position' => 1]);
        $doing = BoardList::create(['board_id' => $board->id, 'name' => 'In Progress', 'position' => 2]);
        $done = BoardList::create(['board_id' => $board->id, 'name' => 'Done', 'position' => 3]);

        $c1 = Card::create([
            'board_list_id' => $todo->id,
            'title' => 'Set up project',
            'description' => 'Initialize Laravel and React',
            'due_date' => now()->addDays(3),
            'member_id' => $alice->id,
            'position' => 1,
        ]);

        $c2 = Card::create([
            'board_list_id' => $doing->id,
            'title' => 'Build Kanban UI',
            'description' => 'React board with columns and cards',
            'due_date' => now()->subDay(),
            'member_id' => $bob->id,
            'position' => 1,
        ]);

        Card::create([
            'board_list_id' => $done->id,
            'title' => 'Design database schema',
            'description' => 'ERD and migrations',
            'position' => 1,
        ]);

        $c1->tags()->attach($designTag->id);
        $c2->tags()->attach([$bugTag->id, $designTag->id]);
    }
}
