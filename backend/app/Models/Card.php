<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Card extends Model
{
    protected $fillable = ['board_list_id', 'member_id', 'title', 'description', 'due_date', 'position'];

    protected $casts = [
        'due_date' => 'datetime',
    ];

    protected $appends = ['is_overdue'];

    public function list(): BelongsTo
    {
        return $this->belongsTo(BoardList::class, 'board_list_id');
    }

    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }

    public function getIsOverdueAttribute(): bool
    {
        return $this->due_date !== null && $this->due_date->isPast();
    }
}
