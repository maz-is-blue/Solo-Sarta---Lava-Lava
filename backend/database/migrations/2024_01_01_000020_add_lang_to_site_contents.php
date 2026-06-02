<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('site_contents', function (Blueprint $table) {
            $table->string('lang', 5)->default('en')->after('type');
            $table->dropUnique(['brand', 'section', 'key']);
            $table->unique(['brand', 'section', 'key', 'lang']);
        });
    }

    public function down(): void {
        Schema::table('site_contents', function (Blueprint $table) {
            $table->dropUnique(['brand', 'section', 'key', 'lang']);
            $table->dropColumn('lang');
            $table->unique(['brand', 'section', 'key']);
        });
    }
};
