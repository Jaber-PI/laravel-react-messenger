<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Conversation extends Model
{
    use HasFactory;

    protected $guarded = [];


    public function lastMessage():BelongsTo
    {
        return $this->belongsTo(Message::class, 'last_message_id');
    }
    public function user1()
    {
        return $this->belongsTo(User::class, 'user_id1');
    }
    public function user2()
    {
        return $this->belongsTo(User::class, 'user_id2');
    }

    public static function getConversationsForSidebar(User $user)
    {

        $users = User::getUsersExcept($user);
        $groups = Group::getGroupsFor($user);

        return $users->map(function (User $user) {
            return $user->toConversationArray();
        })->concat($groups->map(function (Group $group) {
            return $group->toConversationArray();
        }));
    }

    // update conversation last message
    public static function updateConversationWithMessage($receiverId, $senderId, $message)
    {
        $conversation = static::where('user_id1', $receiverId)
            ->where('user_id2', $senderId)
            ->orWhere('user_id1', $senderId)
            ->where('user_id2', $receiverId)
            ->first();

        if (!$conversation) {
            $conversation = Conversation::create([
                'user_id1' => $receiverId,
                'user_id2' => $senderId,
            ]);
        }
        $conversation->last_message_id = $message->id;
        // $conversation->last_message_date = $message->created_at;
        $conversation->save();
    }
}
