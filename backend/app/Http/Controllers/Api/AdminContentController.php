<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteContent;
use Illuminate\Http\Request;

class AdminContentController extends Controller {
    public function index(Request $request) {
        $query = SiteContent::query();
        if ($request->has('brand')) {
            $query->where('brand', $request->brand);
        }
        return response()->json($query->get());
    }

    public function update(Request $request, $id) {
        $item = SiteContent::findOrFail($id);
        $item->update(['value' => $request->input('value', '')]);
        return response()->json($item);
    }

    public function bulkUpdate(Request $request) {
        $updates = $request->input('updates', []);
        $updated = [];
        foreach ($updates as $upd) {
            if (!isset($upd['id'], $upd['value'])) continue;
            $item = SiteContent::find($upd['id']);
            if ($item) {
                $item->update(['value' => $upd['value']]);
                $updated[] = $item;
            }
        }
        return response()->json(['updated' => count($updated)]);
    }
}
