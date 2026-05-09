<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;

class NewsletterController extends Controller {
    public function subscribe(Request $request) {
        $request->validate(['email' => 'required|email']);
        NewsletterSubscriber::firstOrCreate(['email' => $request->email], ['brand' => $request->get('brand', 'lava')]);
        return response()->json(['message' => 'You\'re on the list.']);
    }
}
