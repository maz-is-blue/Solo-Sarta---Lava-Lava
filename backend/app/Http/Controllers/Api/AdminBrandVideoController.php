<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BrandVideo;
use Illuminate\Http\Request;

class AdminBrandVideoController extends Controller {
    public function index(Request $request) {
        $brand = $request->get('brand', 'solo');
        return response()->json(
            BrandVideo::where('brand', $brand)->orderBy('sort_order')->orderBy('id')->get()
        );
    }

    public function store(Request $request) {
        $data = $request->validate([
            'brand'      => 'required|string|max:20',
            'url'        => 'required|string|max:1000',
            'sort_order' => 'nullable|integer|min:0',
        ]);
        $data['sort_order'] = $data['sort_order'] ?? 0;
        return response()->json(BrandVideo::create($data), 201);
    }

    public function destroy($id) {
        BrandVideo::findOrFail($id)->delete();
        return response()->json(['ok' => true]);
    }

    public function uploadVideo(Request $request) {
        $request->validate([
            'file' => 'required|file|mimetypes:video/mp4,video/webm,video/quicktime,video/x-msvideo|max:102400',
        ]);

        $path = $request->file('file')->store('videos', 'public');
        return response()->json(['url' => '/storage/' . $path]);
    }
}
