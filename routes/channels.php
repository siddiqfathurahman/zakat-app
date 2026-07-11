<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The required channels are declared here so that
| they may be registered properly by the application.
|
*/

// Public channel untuk realtime qurban updates
Broadcast::channel('realtime-qurban', function ($user) {
    return true; // Allow all users
});

// Public channel untuk individual animal updates
Broadcast::channel('realtime-qurban.{jenis_hewan}.{nomor_hewan}', function ($user) {
    return true; // Allow all users
});

// Public channel untuk delivery updates
Broadcast::channel('shohibul-delivery', function ($user) {
    return true; // Allow all users
});

// Public channel untuk jatah distribution per RT
Broadcast::channel('jatah-distribution.{rt}', function ($user) {
    return true; // Allow all users
});

Broadcast::channel('penerima-qurban', function ($user) {
    return true;
});

Broadcast::channel('penerima-qurban.rt.{rt}', function ($user, $rt) {
    return true;
});

/*
 * Optional: Private/Presence channels untuk security
 * 
 * Private channel example:
 * Broadcast::channel('qurban.admin.{userId}', function ($user, $userId) {
 *     return (int) $user->id === (int) $userId && $user->hasRole('admin');
 * });
 */
