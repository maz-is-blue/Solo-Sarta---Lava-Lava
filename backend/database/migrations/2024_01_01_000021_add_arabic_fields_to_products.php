<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('products', function (Blueprint $table) {
            $table->string('name_ar')->nullable()->after('name');
            $table->string('sub_ar')->nullable()->after('sub');
            $table->text('story_ar')->nullable()->after('story');
            $table->text('details_ar')->nullable()->after('details');
            $table->text('care_ar')->nullable()->after('care');
            $table->text('fit_ar')->nullable()->after('fit');
            $table->text('product_desc_ar')->nullable()->after('product_desc');
        });
    }

    public function down(): void {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['name_ar', 'sub_ar', 'story_ar', 'details_ar', 'care_ar', 'fit_ar', 'product_desc_ar']);
        });
    }
};
