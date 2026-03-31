<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $fillable = ['user_id', 'time_in', 'time_out', 'date'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
