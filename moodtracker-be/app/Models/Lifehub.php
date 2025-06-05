<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lifehub extends Model
{
    protected $table = 'lifehubs';

    protected $fillable = [
        'kegiatan',
        'kategori',
        'status',
        'date',
    ];
}
