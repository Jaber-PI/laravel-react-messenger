<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreGroupRequest;
use App\Http\Requests\UpdateGroupRequest;
use App\Jobs\DeleteGroupJob;
use App\Models\Group;

class GroupController extends Controller
{

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGroupRequest $request)
    {
        $data = $request->validated();
        $users_ids = $data['users_ids'] ?? [];
        unset($data['users_ids']);
        $group = Group::create($data);
        $group->users()->attach(array_unique([...$users_ids, $request->user()->id]));

        return redirect()->back();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGroupRequest $request, Group $group)
    {
        $data = $request->validated();
        $users_ids = $data['users_ids'] ?? [];
        unset($data['users_ids']);

        $group->update($data);

        $group->users()->sync(array_unique([...$users_ids, $request->user()->id]));

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Group $group)
    {
        if ($group->owner_id !== auth()->id()) {
            abort(403);
        }

        DeleteGroupJob::dispatch($group)->delay(now()->addSeconds(5));

        return response()->json(['message' => 'Group will be deleted soon']);
    }
}
