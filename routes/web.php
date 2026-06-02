<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ExpenseCategoryController;
use App\Http\Controllers\ExpensesController;
use App\Http\Controllers\BankController;

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
});

require __DIR__.'/settings.php';
