<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model {
    protected $fillable = [
        'order_number', 'brand', 'customer_name', 'customer_email',
        'customer_phone', 'shipping_address', 'payment_method',
        'items', 'total', 'status', 'admin_notes',
    ];
    protected $casts = ['items' => 'array'];
}
