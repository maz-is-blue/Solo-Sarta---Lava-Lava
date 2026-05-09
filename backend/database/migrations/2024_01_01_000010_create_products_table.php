<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('brand')->default('lava');
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('sub')->nullable();
            $table->unsignedInteger('price');
            $table->string('cat');
            $table->string('tag')->nullable();
            $table->string('drop')->default('04');
            $table->json('palette');
            $table->string('accent')->nullable();
            $table->json('sizes');
            $table->text('story')->nullable();
            $table->text('details')->nullable();
            $table->text('care')->nullable();
            $table->string('fit')->nullable();
            $table->string('silhouette')->nullable();
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('products'); }
};
