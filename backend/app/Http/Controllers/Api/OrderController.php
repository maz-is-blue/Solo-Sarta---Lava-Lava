<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller {
    public function store(Request $request) {
        $data = $request->validate([
            'brand'            => 'required|string',
            'customer_name'    => 'required|string|max:255',
            'customer_email'   => 'required|email|max:255',
            'customer_phone'   => 'required|string|max:50',
            'shipping_address' => 'required|string',
            'payment_method'   => 'required|string',
            'items'            => 'required|array',
            'total'            => 'required|integer|min:0',
        ]);

        $prefix = strtoupper(substr($data['brand'], 0, 2));
        $count  = str_pad(Order::count() + 1, 4, '0', STR_PAD_LEFT);
        $data['order_number'] = $prefix . '-' . date('Y') . '-' . $count;
        $data['status'] = 'pending';

        $order = Order::create($data);

        return response()->json(['order_number' => $order->order_number], 201);
    }
}
