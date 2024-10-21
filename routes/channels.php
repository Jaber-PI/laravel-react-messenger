<?php

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('online', function ($user) {
    return $user ? new UserResource($user) : null;
});

Broadcast::channel('chat.user.{userId1}-{userId2}', function (User $user, int $userId1, int $userId2) {
    return $user->id === $userId1 || $user->id === $userId2  ? new UserResource($user) : null;
});

Broadcast::channel('chat.group.{groupId}', function (User $user, int $groupId) {
    return $user->groups()->find($groupId) ? new UserResource($user) : null;
});
