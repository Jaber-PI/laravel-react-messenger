<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;


class UserController extends Controller
{

    public function  store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:10'],
            'email' => ['required', 'email', 'unique:users,email'],
            'is_admin' => 'boolean',
            'avatar' => ['nullable', 'image', 'max:1024'],
        ]);
        // random password
        // $password = Str::random(8);
        $password = "password";
        $data['password'] = bcrypt($password);
        $data['email_verified_at'] = now();

        if ($data['avatar']) {
            $avatar = $request->file('avatar');
            $fileName = uniqid('avatar_') . '.' . $avatar->getClientOriginalExtension();
            $data['avatar'] = $avatar->storeAs('avatars', $fileName, 'public');
        }

        User::create($data);

        return redirect()->back();
    }

    public function changeRole(User $user)
    {
        $user->update([
            'is_admin' => !(bool) $user->is_admin,
        ]);
        return response()->json([
            'message' => "User role was changed, " . $user->name . " is now " . ($user->is_admin ? '"Admin."' : '"Regular User."')
        ]);
    }

    public function blockUnblock(User $user)
    {
        if($user->blocked_at) {
            $user->blocked_at = null;
            $message = "Account Unblocked.";
        } else {
            $user->blocked_at = now();
            $message = "Account blocked.";
        }

        $user->save();
        return response()->json([
            'message' => $message
        ]);
    }
}
