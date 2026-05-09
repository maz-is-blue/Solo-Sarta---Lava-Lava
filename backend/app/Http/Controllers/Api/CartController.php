<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller {
    private function getCart(Request $request): Cart {
        $sessionId = $request->header('X-Session-ID') ?? $request->get('session_id', 'default');
        return Cart::firstOrCreate(['session_id' => $sessionId]);
    }

    public function index(Request $request) {
        $cart = $this->getCart($request);
        return response()->json($cart->items()->with('product')->get());
    }

    public function add(Request $request) {
        $request->validate(['product_id' => 'required|exists:products,id', 'size' => 'required|string', 'quantity' => 'integer|min:1']);
        $cart = $this->getCart($request);
        $item = CartItem::where('cart_id', $cart->id)->where('product_id', $request->product_id)->where('size', $request->size)->first();
        if ($item) {
            $item->increment('quantity', $request->get('quantity', 1));
        } else {
            CartItem::create(['cart_id' => $cart->id, 'product_id' => $request->product_id, 'size' => $request->size, 'quantity' => $request->get('quantity', 1)]);
        }
        return response()->json($cart->items()->with('product')->get());
    }

    public function update(Request $request, $id) {
        $request->validate(['quantity' => 'required|integer|min:0']);
        $item = CartItem::findOrFail($id);
        if ($request->quantity === 0) {
            $item->delete();
        } else {
            $item->update(['quantity' => $request->quantity]);
        }
        $cart = $this->getCart($request);
        return response()->json($cart->items()->with('product')->get());
    }

    public function remove(Request $request, $id) {
        CartItem::findOrFail($id)->delete();
        $cart = $this->getCart($request);
        return response()->json($cart->items()->with('product')->get());
    }
}
