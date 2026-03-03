<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;



// Public routes
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/create', [ProductController::class, 'create'])->name('products.create');

Route::get('/products/{product}', [ProductController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);


Route::middleware('auth:sanctum')->group(function () {

    // Protected routes
    Route::get('/user', function (Request $request) {
        return $request->user();
    });


    // Customer routes
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);

    // Admin only
    Route::middleware('isAdmin')->group(function () {
        Route::apiResource('products', ProductController::class)->except(['index', 'show']);
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{category}', [CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
    });

    // Vendor only
    Route::middleware('isVendor')->group(function () {
        Route::put('/products/{product}/stock', [ProductController::class, 'updateStock']);
    });
});
