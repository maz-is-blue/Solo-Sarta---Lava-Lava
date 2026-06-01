<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminAuth {
    public function handle(Request $request, Closure $next) {
        $token = $request->bearerToken();
        $expected = hash_hmac('sha256', 'admin_access', config('app.key'));
        if (!$token || !hash_equals($expected, $token)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        return $next($request);
    }
}
