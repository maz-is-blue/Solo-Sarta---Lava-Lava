<?php
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\NewsletterController;
use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Api\AdminContentController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{slug}', [ProductController::class, 'show']);

    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'add']);
    Route::put('/cart/{id}', [CartController::class, 'update']);
    Route::delete('/cart/{id}', [CartController::class, 'remove']);

    Route::post('/contact', [ContactController::class, 'store']);
    Route::post('/newsletter', [NewsletterController::class, 'subscribe']);

    // Public content read (used by all pages)
    Route::get('/content', [AdminContentController::class, 'index']);
});

// Admin routes
Route::prefix('admin')->group(function () {
    Route::post('/login', [AdminAuthController::class, 'login']);

    Route::middleware('admin.auth')->group(function () {
        Route::get('/content', [AdminContentController::class, 'index']);
        Route::put('/content/{id}', [AdminContentController::class, 'update']);
        Route::post('/content/bulk', [AdminContentController::class, 'bulkUpdate']);
    });
});
