<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller {
    public function upload(Request $request) {
        $request->validate([
            'file' => 'required|file|image|max:8192',
        ]);

        $path = $request->file('file')->store('products', 'public');

        return response()->json(['url' => '/storage/' . $path]);
    }
}
