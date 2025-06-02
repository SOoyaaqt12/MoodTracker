<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mood extends Model
{
    protected $table = 'moods';

    protected $fillable = [
        'nama',
        'mood',
        'date',
    ];
}
