<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model {
    protected $fillable = ['brand','slug','name','sub','price','cat','tag','drop','palette','sizes','story','details','care','fit','silhouette','accent','active','image_url','images','code','process_time','fabric','product_desc'];
    protected $casts = ['palette' => 'array', 'sizes' => 'array', 'images' => 'array', 'active' => 'boolean'];
    public function cartItems() { return $this->hasMany(CartItem::class); }
}
