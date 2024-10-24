<?php

namespace App\Models;

use App\Observers\MessageObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[ObservedBy([MessageObserver::class])]
class Message extends Model
{
    use HasFactory;

    protected $guarded =[];


    public function sender(){
        return $this->belongsTo(User::class,'sender_id');
    }

    public function receiver(){
        return $this->belongsTo(User::class,'receiver_id');
    }


    public function group(){
        return $this->belongsTo(Group::class,'group_id');
    }

    public function conversation(){
        return $this->belongsTo(Conversation::class,'conversation_id');
    }

    public function attachments(){
        return $this->hasMany(MessageAttachment::class,'message_id');
    }
}
