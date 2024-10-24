<?php

namespace App\Observers;

use App\Models\Conversation;
use App\Models\Group;
use App\Models\Message;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\Storage;

class MessageObserver
{
    public function deleting(Message $message)
    {

        // delete message attachments
        $message->attachments->each(function ($attachment) {
            // Delete attachment file from storage
            $dir = dirname($attachment->path);
            Storage::disk('public')->deleteDirectory($dir);
        });
        $message->attachments()->delete();

        if ($message->group_id) {
            $group  = Group::where('last_message_id', $message->id)->first();
            if ($group) {
                $lastMessage = Message::where('group_id', $group->id)
                    ->whereNot('id', $message->id)
                    ->latest()
                    ->first();

                $group->last_message_id = $lastMessage?->id;
                $group->save();
            }
        } else {
            $conv = Conversation::where('last_message_id', $message->id)->first();
            if ($conv) {
                $lastMessage = Message::where(function ($query) use ($message) {
                    return $query->where('sender_id', $message->sender_id)
                        ->where('receiver_id', $message->receiver_id)
                        ->orWhere('sender_id', $message->receiver_id)
                        ->where('receiver_id', $message->sender_id)
                    ;
                })
                    ->whereNot('id', $message->id)
                    ->latest()
                    ->first();

                $conv->last_message_id = $lastMessage?->id;
                $conv->save();
            }
        }
    }
}
