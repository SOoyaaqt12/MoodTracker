<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mood extends Model
{
    protected $table = 'moods';

    protected $fillable = [
        'description',
        'emotion',
        'date',
    ];
}
