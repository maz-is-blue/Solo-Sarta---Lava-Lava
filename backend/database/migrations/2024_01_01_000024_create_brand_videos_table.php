<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('brand_videos', function (Blueprint $table) {
            $table->id();
            $table->string('brand', 20);
            $table->string('url', 1000);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
            $table->index('brand');
        });
    }

    public function down(): void {
        Schema::dropIfExists('brand_videos');
    }
};
