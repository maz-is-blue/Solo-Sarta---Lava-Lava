<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('products', function (Blueprint $table) {
            $table->string('image_url')->nullable()->after('active');
            $table->string('code')->nullable()->after('brand');
            $table->string('process_time')->nullable()->after('code');
            $table->string('fabric')->nullable()->after('process_time');
            $table->text('product_desc')->nullable()->after('fabric');
        });
    }

    public function down(): void {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['image_url', 'code', 'process_time', 'fabric', 'product_desc']);
        });
    }
};
