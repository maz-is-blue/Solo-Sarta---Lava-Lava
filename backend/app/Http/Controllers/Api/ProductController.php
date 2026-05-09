<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller {
    public function index(Request $request) {
        $query = Product::where('active', true)->where('brand', $request->get('brand', 'lava'));
        if ($request->has('cat') && $request->cat !== 'All') {
            $query->where('cat', $request->cat);
        }
        return response()->json($query->get());
    }

    public function show($slug) {
        $product = Product::where('slug', $slug)->where('active', true)->firstOrFail();
        return response()->json($product);
    }
}
