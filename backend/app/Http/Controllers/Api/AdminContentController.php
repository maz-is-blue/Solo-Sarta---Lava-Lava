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
        $updated = 0;
        foreach ($updates as $upd) {
            if (isset($upd['id'])) {
                $item = SiteContent::find($upd['id']);
                if ($item) {
                    $item->update(['value' => $upd['value'] ?? '']);
                    $updated++;
                }
            } elseif (isset($upd['brand'], $upd['section'], $upd['key'], $upd['lang'])) {
                SiteContent::updateOrCreate(
                    ['brand' => $upd['brand'], 'section' => $upd['section'], 'key' => $upd['key'], 'lang' => $upd['lang']],
                    ['value' => $upd['value'] ?? '', 'label' => $upd['label'] ?? $upd['key'], 'type' => $upd['type'] ?? 'text']
                );
                $updated++;
            }
        }
        return response()->json(['updated' => $updated]);
    }
}
