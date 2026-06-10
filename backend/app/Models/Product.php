<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model {
    protected $fillable = ['brand','slug','name','name_ar','sub','sub_ar','price','price_egp','cat','sub_cat','tag','drop','palette','sizes','story','story_ar','details','details_ar','care','care_ar','fit','fit_ar','silhouette','accent','active','image_url','images','size_images','code','process_time','fabric','product_desc','product_desc_ar'];
    protected $casts = ['palette' => 'array', 'sizes' => 'array', 'images' => 'array', 'size_images' => 'array', 'active' => 'boolean'];
    public function cartItems() { return $this->hasMany(CartItem::class); }
}
