<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BrandVideo extends Model {
    protected $fillable = ['brand', 'url', 'sort_order'];
}
