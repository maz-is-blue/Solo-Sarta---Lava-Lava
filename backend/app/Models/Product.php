<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model {
    protected $fillable = ['brand','slug','name','sub','price','cat','tag','drop','palette','sizes','story','details','care','fit','silhouette','accent','active'];
    protected $casts = ['palette' => 'array', 'sizes' => 'array', 'active' => 'boolean'];
    public function cartItems() { return $this->hasMany(CartItem::class); }
}
