<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminProductController extends Controller {
    public function index(Request $request) {
        $products = Product::where('brand', $request->get('brand', 'lava'))
            ->orderBy('id')
            ->get();
        return response()->json($products);
    }

    public function store(Request $request) {
        $data = $request->validate([
            'brand'        => 'required|string',
            'name'         => 'required|string|max:255',
            'sub'          => 'nullable|string|max:255',
            'price'        => 'required|integer|min:0',
            'cat'          => 'required|string|max:100',
            'tag'          => 'nullable|string|max:50',
            'drop'         => 'nullable|string|max:10',
            'images'       => 'nullable|array',
            'images.*'     => 'string|max:500',
            'sizes'        => 'nullable|array',
            'palette'      => 'nullable|array',
            'accent'       => 'nullable|string|max:20',
            'story'        => 'nullable|string',
            'details'      => 'nullable|string',
            'care'         => 'nullable|string',
            'fit'          => 'nullable|string',
            'silhouette'   => 'nullable|string|max:50',
            'code'             => 'nullable|string|max:20',
            'process_time'     => 'nullable|string|max:100',
            'fabric'           => 'nullable|string|max:255',
            'product_desc'     => 'nullable|string',
            'name_ar'          => 'nullable|string|max:255',
            'sub_ar'           => 'nullable|string|max:255',
            'story_ar'         => 'nullable|string',
            'details_ar'       => 'nullable|string',
            'care_ar'          => 'nullable|string',
            'fit_ar'           => 'nullable|string',
            'product_desc_ar'  => 'nullable|string',
        ]);

        $data['slug']      = Str::slug($data['name']) . '-' . time();
        $data['active']    = true;
        $data['palette']   = $data['palette'] ?? [];
        $data['sizes']     = $data['sizes'] ?? [];
        $data['images']    = $data['images'] ?? [];
        $data['image_url'] = $data['images'][0] ?? null;

        $product = Product::create($data);
        return response()->json($product, 201);
    }

    public function update(Request $request, $id) {
        $product = Product::findOrFail($id);
        $data = $request->validate([
            'name'         => 'sometimes|string|max:255',
            'sub'          => 'nullable|string|max:255',
            'price'        => 'sometimes|integer|min:0',
            'cat'          => 'sometimes|string|max:100',
            'tag'          => 'nullable|string|max:50',
            'drop'         => 'nullable|string|max:10',
            'images'       => 'nullable|array',
            'images.*'     => 'string|max:500',
            'sizes'        => 'nullable|array',
            'palette'      => 'nullable|array',
            'accent'       => 'nullable|string|max:20',
            'story'        => 'nullable|string',
            'details'      => 'nullable|string',
            'care'         => 'nullable|string',
            'fit'          => 'nullable|string',
            'silhouette'   => 'nullable|string|max:50',
            'active'       => 'sometimes|boolean',
            'code'             => 'nullable|string|max:20',
            'process_time'     => 'nullable|string|max:100',
            'fabric'           => 'nullable|string|max:255',
            'product_desc'     => 'nullable|string',
            'name_ar'          => 'nullable|string|max:255',
            'sub_ar'           => 'nullable|string|max:255',
            'story_ar'         => 'nullable|string',
            'details_ar'       => 'nullable|string',
            'care_ar'          => 'nullable|string',
            'fit_ar'           => 'nullable|string',
            'product_desc_ar'  => 'nullable|string',
        ]);
        if (isset($data['images'])) {
            $data['image_url'] = $data['images'][0] ?? null;
        }
        $product->update($data);
        return response()->json($product);
    }

    public function destroy($id) {
        $product = Product::findOrFail($id);
        $product->update(['active' => false]);
        return response()->json(['ok' => true]);
    }
}
