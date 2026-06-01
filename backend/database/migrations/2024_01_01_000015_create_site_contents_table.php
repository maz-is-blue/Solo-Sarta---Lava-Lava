<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('site_contents', function (Blueprint $table) {
            $table->id();
            $table->string('brand');        // 'solo', 'lava', 'shared'
            $table->string('section');      // 'landing', 'home', 'story', 'contact', 'collection'
            $table->string('key');          // 'headline', 'subtext', etc.
            $table->text('value');
            $table->string('label');        // human-readable label for admin UI
            $table->string('type')->default('text'); // 'text', 'textarea'
            $table->timestamps();
            $table->unique(['brand', 'section', 'key']);
        });
    }
    public function down(): void { Schema::dropIfExists('site_contents'); }
};
