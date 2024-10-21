<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [HomeController::class, 'home'])->name('dashboard');
    Route::controller(MessageController::class)->name('chat.')->group(function () {
        Route::get('/user/{user}', 'byUser')->name('user');
        Route::get('/group/{group}', 'byGroup')->name('group');

        Route::post('/message', 'store')->name('store');

        Route::delete('/message/{message}', 'destroy')->name('destroy');

        Route::get('/message/older/{message}', 'loadOlder')->name('loadOlder');


    });
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
