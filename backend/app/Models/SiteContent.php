<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteContent extends Model {
    protected $fillable = ['brand', 'section', 'key', 'value', 'label', 'type', 'lang'];
}
