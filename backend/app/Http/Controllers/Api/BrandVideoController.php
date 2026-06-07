<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BrandVideo;
use Illuminate\Http\Request;

class BrandVideoController extends Controller {
    public function index(Request $request) {
        $brand = $request->get('brand', 'solo');
        return response()->json(
            BrandVideo::where('brand', $brand)
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get(['id', 'url', 'sort_order'])
        );
    }
}
