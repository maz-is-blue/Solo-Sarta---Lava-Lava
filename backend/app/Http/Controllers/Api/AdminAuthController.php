<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AdminAuthController extends Controller {
    public function login(Request $request) {
        $password = $request->input('password', '');
        $adminPassword = env('ADMIN_PASSWORD', '');

        if (!$adminPassword || !hash_equals($adminPassword, $password)) {
            return response()->json(['error' => 'Invalid password'], 401);
        }

        $token = hash_hmac('sha256', 'admin_access', config('app.key'));
        return response()->json(['token' => $token]);
    }
}
