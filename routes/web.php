<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ExpenseCategoryController;
use App\Http\Controllers\ExpensesController;
use App\Http\Controllers\BankController;
use App\Http\Controllers\LedgerController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\ProductCategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\VarientController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\CustomerController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::get('/expense/category', [ExpenseCategoryController::class, 'index'])->name('expense.category');
    Route::post('/expense/category', [ExpenseCategoryController::class, 'store'])->name('expense.category.store');
    Route::put('/expense/category/{category}', [ExpenseCategoryController::class, 'update'])->name('expense.category.update');
    Route::delete('/expense/category/{category}', [ExpenseCategoryController::class, 'destroy'])->name('expense.category.destroy');

    Route::get('/expense/list', [ExpensesController::class, 'index'])->name('expenses');
    Route::post('/expense/list', [ExpensesController::class, 'store'])->name('expense.store');
    Route::put('/expense/list/{expenses}', [ExpensesController::class, 'update'])->name('expenses.update');
    Route::delete('/expense/list/{expenses}', [ExpensesController::class, 'destroy'])->name('expenses.destroy');


    Route::get('/bank', [BankController::class, 'index'])->name('bank.index');
    Route::post('/bank', [BankController::class, 'store'])->name('bank.store');
    Route::put('/bank/{id}', [BankController::class, 'update'])->name('bank.update');
    Route::delete('/bank/{id}', [BankController::class, 'destroy'])->name('bank.destroy');

    Route::get('/ledger', [LedgerController::class, 'index'])->name('ledger.index');
    Route::post('/ledger', [LedgerController::class, 'store'])->name('ledger.store');
    Route::put('/ledger/{ledger}', [LedgerController::class, 'update'])->name('ledger.update');
    Route::delete('/ledger/{ledger}', [LedgerController::class, 'destroy'])->name('ledger.destroy');

    Route::get('/brand',[BrandController::class, 'index'])->name('brand.index');
    Route::post('/brand',[BrandController::class, 'store'])->name('brand.store');
    Route::put('/brand/{brand}',[BrandController::class, 'update'])->name('brand.update');
    Route::delete('/brand/{brand}',[BrandController::class, 'destroy'])->name('brand.delete');
   
    Route::get('/productCategory',[ProductCategoryController::class, 'index'])->name('productcategory.index');
    Route::post('/productCategory',[ProductCategoryController::class, 'store'])->name('productcategory.store');
    Route::put('/productCategory/{productCategory}',[ProductCategoryController::class, 'update'])->name('productcategory.update');
    Route::delete('/productCategory/{productCategory}',[ProductCategoryController::class, 'destroy'])->name('productcategory.delete');

    Route::get('/product',[ProductController::class, 'index'])->name('product.index');
    Route::post('/product',[ProductController::class, 'store'])->name('product.store');
    Route::put('/product/{product}',[ProductController::class, 'update'])->name('product.update');
    Route::delete('/product/{product}',[ProductController::class, 'destroy'])->name('product.delete');
   
    Route::get('/varient',[VarientController::class, 'index'])->name('varient.index');
    Route::post('/varient',[VarientController::class, 'store'])->name('varient.store');
    Route::put('/varient/{varient}',[VarientController::class, 'update'])->name('varient.update');
    Route::delete('/varient/{varient}',[VarientController::class, 'destroy'])->name('varient.delete');

    Route::get('/stock',[StockController::class, 'index'])->name('stock.index');
    Route::post('/stock',[StockController::class, 'store'])->name('stock.store');
    Route::put('/stock/{stock}',[StockController::class, 'update'])->name('stock.update');
    Route::delete('/stock/{stock}',[StockController::class, 'destroy'])->name('stock.delete');

    Route::get('/customer',[CustomerController::class, 'index'])->name('customer.index');
    Route::post('/customer',[CustomerController::class, 'store'])->name('customer.store');
    Route::put('/customer/{customer}',[CustomerController::class, 'update'])->name('customer.update');
    Route::delete('/customer/{customer}',[CustomerController::class, 'destroy'])->name('customer.destroy');
});

require __DIR__.'/settings.php';
