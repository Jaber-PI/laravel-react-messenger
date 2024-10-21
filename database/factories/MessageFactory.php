<?php

namespace Database\Factories;

use App\Models\Group;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Message>
 */
class MessageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $senderId = $this->faker->randomElement(
            [0, 1]
        );

        if ($senderId == 0) {
            $senderId = $this->faker->randomElement(
                User::where('id', '!=', 1)->pluck('id')->toArray()
            );
            $receiverId = 1;
        } else {
            $receiverId = $this->faker->randomElement(
                User::where('id', '!=', 1)->pluck('id')->toArray()
            );
        }

        $groupId = null;

        if($this->faker->boolean()) {
            $groupId = $this->faker->randomElement(
                Group::pluck('id')->toArray()
            );
            $senderId = $this->faker->randomElement(
                User::pluck('id')->toArray()
            );
            $receiverId = null;
        }

        return [
            'sender_id' => $senderId,
            'receiver_id' => $receiverId,
            'group_id' => $groupId,
            'message' => $this->faker->realText(90),
            'created_at' => $this->faker->dateTimeBetween('-1 month', 'now'),

        ];
    }
}
