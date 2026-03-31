<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\TestController;
use App\Http\Controllers\Api\TestLogController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AttendanceController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// --- Test Routes ---
Route::get('/test', [TestController::class, 'index']);
Route::post('/test-logs', [TestLogController::class, 'store']);
Route::get('/test-logs', [TestLogController::class, 'index']);

// --- Auth Routes ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// --- Admin Login Route for React ---
Route::post('/verify-admin', function(Request $request) {
    $username = $request->input('username');
    $password = $request->input('password');

    // Hardcoded admin credentials
    if ($username === 'Admin' && $password === 'Admin123') {
        return response()->json([
            'success' => true,
            'user' => [
                'name' => 'Admin',
                'role' => 'admin'
            ]
        ]);
    }

    return response()->json([
        'success' => false,
        'message' => 'Invalid Credentials'
    ], 401);
});

// --- RFID Verification Route ---
Route::get('/admin/verify-rfid/{uid}', function($uid) {
    // Here you can replace with real DB check
    $adminUids = [
        'UID12345', // Example UID
        'UID67890'
    ];

    if (in_array($uid, $adminUids)) {
        return response()->json([
            'isAdmin' => true,
            'message' => 'Access Granted'
        ]);
    }

    return response()->json([
        'isAdmin' => false,
        'message' => 'Access Denied'
    ], 403);
});

// --- Dashboard Stats ---
Route::get('/dashboard-stats', function() {
    // Example stats, replace with DB logic
    return response()->json([
        'signedIn' => 12,
        'signedOut' => 5
    ]);
});

// --- Users CRUD ---
Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);

// --- Attendance ---
Route::get('/attendance/{date}', [AttendanceController::class, 'getByDate']);
Route::post('/attendance', [AttendanceController::class, 'store']);
