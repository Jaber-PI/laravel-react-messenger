<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class UserResource extends JsonResource
{
    public static $wrap = false;
     /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'avatar_url' => $this->avatar ? Storage::url($this->avatar) : null,
            'email' => $this->email,
            'name' => $this->name,
            'updated_at' => $this->updated_at,
            'created_at' => $this->created_at,
            'is_admin' => (bool) $this->is_admin,
            'last_message' => $this->last_message,
            'last_message_date' => $this->last_message_date,
        ];
    }
}
