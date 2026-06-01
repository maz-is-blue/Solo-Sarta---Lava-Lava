<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class AdminOrderController extends Controller {
    public function index(Request $request) {
        $query = Order::latest();

        if ($request->filled('brand') && $request->brand !== 'all') {
            $query->where('brand', $request->brand);
        }
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        return response()->json($query->paginate(30));
    }

    public function update(Request $request, $id) {
        $order = Order::findOrFail($id);
        $data = $request->validate([
            'status'      => 'sometimes|string|in:pending,confirmed,processing,shipped,delivered,cancelled',
            'admin_notes' => 'sometimes|nullable|string',
        ]);
        $order->update($data);
        return response()->json($order);
    }
}
