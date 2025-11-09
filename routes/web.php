<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\DashboardController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Products Routes
    Route::get('products', [ProductController::class, 'index'])->name('products.index');
    Route::get('products/create', [ProductController::class, 'create'])->name('products.create');
    Route::post('products', [ProductController::class, 'store'])->name('products.store');
    Route::get('products/{product}', [ProductController::class, 'show'])->name('products.show');
    Route::get('products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
    Route::put('products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');

    // Inventories Routes
    Route::get('inventories', [InventoryController::class, 'index'])->name('inventories.index');
    Route::get('inventories/create', [InventoryController::class, 'create'])->name('inventories.create');
    Route::post('inventories', [InventoryController::class, 'store'])->name('inventories.store');
    Route::get('inventories/export', [InventoryController::class, 'export'])->name('inventories.export');
    Route::get('inventories/{inventory}', [InventoryController::class, 'show'])->name('inventories.show');
    Route::get('inventories/{inventory}/edit', [InventoryController::class, 'edit'])->name('inventories.edit');
    Route::put('inventories/{inventory}', [InventoryController::class, 'update'])->name('inventories.update');
    Route::delete('inventories/{inventory}', [InventoryController::class, 'destroy'])->name('inventories.destroy');

    // Sales Routes
    Route::get('sales', [SaleController::class, 'index'])->name('sales.index');
    Route::get('sales/create', [SaleController::class, 'create'])->name('sales.create');
    Route::post('sales', [SaleController::class, 'store'])->name('sales.store');
    Route::get('sales/export', [SaleController::class, 'export'])->name('sales.export');
    Route::get('sales/{sale}', [SaleController::class, 'show'])->name('sales.show');
    Route::get('sales/{sale}/edit', [SaleController::class, 'edit'])->name('sales.edit');
    Route::put('sales/{sale}', [SaleController::class, 'update'])->name('sales.update');
    Route::delete('sales/{sale}', [SaleController::class, 'destroy'])->name('sales.destroy');
});

require __DIR__ . '/settings.php';
