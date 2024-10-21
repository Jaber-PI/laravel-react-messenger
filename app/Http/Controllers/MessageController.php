<?php

namespace App\Http\Controllers;

use App\Events\SocketMessage;
use App\Http\Requests\StoreMessageRequest;
use App\Http\Resources\messageResource;
use App\Models\Conversation;
use App\Models\Group;
use App\Models\Message;
use App\Models\MessageAttachment;
use App\Models\User;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MessageController extends Controller
{
    public function byUser(User $user)
    {
        $messages = Message::query()
            ->where(function ($builder) use ($user) {
                $builder->where('sender_id', auth()->id())
                    ->where('receiver_id', $user->id);
            })
            ->orWhere(function ($builder) use ($user) {
                $builder->where('receiver_id', auth()->id())
                    ->where('sender_id', $user->id);
            })
            ->with('attachments')
            ->latest()
            ->paginate(20);

        return inertia('Home', [
            'selectedConversation' => $user->toConversationArray(),
            'messages' => messageResource::collection($messages),

        ]);
    }
    public function byGroup(Group $group)
    {
        $messages = Message::query()
            ->where('group_id', '=', $group->id)
            ->latest()
            ->paginate(20);

        return inertia('Home', [
            'selectedConversation' => $group->toConversationArray(),
            'messages' => messageResource::collection($messages),

        ]);
    }

    public function loadOlder(Message $message)
    {

        if ($message->group_id) {
            $messages = Message::query()
                ->where('created_at', '<', $message->created_at)
                ->where('group_id', '=', $message->group_id)
                ->latest()
                ->limit(10)
                ->get();
        } else {
            $messages = Message::query()
                ->where(function ($builder) use ($message) {
                    $builder->where(function ($builder) use ($message) {
                        $builder->where('sender_id', $message->sender_id)
                            ->where('receiver_id', $message->receiver_id);
                    })
                        ->orWhere(function ($builder) use ($message) {
                            $builder->where('receiver_id', $message->sender_id)
                                ->where('sender_id', $message->receiver_id);
                        });
                })
                ->where('created_at', '<', $message->created_at)
                ->latest()
                ->limit(10)
                ->get();
        }
        return messageResource::collection($messages);
    }
    public function store(StoreMessageRequest $request)
    {
        $data = $request->validated();
        $data['sender_id'] = auth()->id();
        $receiverId = $data['receiver_id'] ?? null;
        $groupId = $data['group_id'] ?? null;

        $files = $data['attachments'] ?? null;
        unset($data['attachments']);

        $message = Message::create($data);


        if ($files) {
            $attachements = [];
            foreach ($files as $file) {
                $directory = 'attachements/' . Str::random(32);
                Storage::makeDirectory($directory);
                $model = [
                    'message_id' => $message->id,
                    'name' => $file->getClientOriginalName(),
                    'mime' => $file->getClientMimeType(),
                    'size' => $file->getSize(),
                    'path' => $file->store($directory, 'public'),

                ];
                $attachements[] = MessageAttachment::create($model);
            }

            $message->attachments = $attachements;
        }

        if ($receiverId) {
            Conversation::updateConversationWithMessage($receiverId, auth()->id(), $message);
        } else {
            Group::updateGroupWithMessage($groupId, $message);
        }

        SocketMessage::dispatch($message);

        return messageResource::make($message);
    }

    public function destroy(Message $message)
    {
        if ($message->sender_id !== auth()->id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $message->delete();
        return response('', Response::HTTP_NO_CONTENT);
    }
}
