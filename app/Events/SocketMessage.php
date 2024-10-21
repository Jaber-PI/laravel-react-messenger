<?php

namespace App\Events;

use App\Http\Resources\messageResource;
use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SocketMessage implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public Message $message)
    {
        //
    }

    public function broadcastWith() :array {

        return [
            'message' => new messageResource($this->message)
        ];
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        $msg = $this->message;

        if ($this->message->group_id) {
            return [
                new PrivateChannel('chat.group.' . $msg->group_id),
            ];
        }
        return [
            new PrivateChannel('chat.user.' . collect([$msg->sender_id, $msg->receiver_id])->sort()->implode('-')),
        ];
    }
}
