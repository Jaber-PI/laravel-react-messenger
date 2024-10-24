<?php

namespace App\Jobs;

use App\Events\GroupDeleted;
use App\Models\Group;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class DeleteGroupJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public Group $group) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $this->group->last_message_id = null;
        $this->group->save();
        $this->group->users()->detach();
        $this->group->messages->each->delete();
        $this->group->delete();
        GroupDeleted::dispatch($this->group->id, $this->group->name);
    }
}
