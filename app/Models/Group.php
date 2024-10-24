<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Group extends Model
{
    use HasFactory;

    protected $guarded=[];

    public function users():BelongsToMany {
        return $this->belongsToMany(User::class,'groups_users');
    }

    public function messages():HasMany {
        return $this->hasMany(Message::class,'group_id');
    }
    public function owner():BelongsTo {
        return $this->belongsTo(User::class,'owner_id');
    }
    public function lastMessage():BelongsTo {
        return $this->belongsTo(Message::class,'last_message_id');
    }

    public static function getGroupsFor(User $user)
    {
        $userId = $user->id;
        $query  = Group::query()
        ->select(['groups.*','messages.message as last_message','messages.created_at as last_message_date'])
        ->join('groups_users','groups.id','groups_users.group_id')
        ->where('groups_users.user_id','=',$user->id)
        ->leftJoin('messages','messages.id','groups.last_message_id')
        ->orderBy('messages.created_at','desc')
        ->orderBy('groups.name')
        ->with('users')
        ;

        return $query->get();
    }

    public function toConversationArray(){
        return [
            'id'=> $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'is_group' => true,
            'is_user' => false,
            'owner_id'=> $this->owner_id,
            'users' => $this->users,
            'users_ids' => $this->users->pluck('id'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'last_message' => $this->last_message,
            'last_message_date' => $this->last_message_date,
        ];
    }


     // update conversation last message
     public static function updateGroupWithMessage($groupId, $message)
     {
         $conversation = static::find($groupId);
         $conversation->last_message_id = $message->id;
         $conversation->last_message_date = $message->created_at;
     }
}
