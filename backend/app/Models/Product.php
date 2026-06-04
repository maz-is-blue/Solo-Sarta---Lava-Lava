<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model {
    protected $fillable = ['brand','slug','name','name_ar','sub','sub_ar','price','cat','sub_cat','tag','drop','palette','sizes','story','story_ar','details','details_ar','care','care_ar','fit','fit_ar','silhouette','accent','active','image_url','images','code','process_time','fabric','product_desc','product_desc_ar'];
    protected $casts = ['palette' => 'array', 'sizes' => 'array', 'images' => 'array', 'active' => 'boolean'];
    public function cartItems() { return $this->hasMany(CartItem::class); }
}
