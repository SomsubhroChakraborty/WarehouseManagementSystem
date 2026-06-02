<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\ExpenseCategory;

class ExpenseCategoryController extends Controller
{
   public function index(Request $request)
{
    $query = ExpenseCategory::query();

    $search = $request->query('search');

    if ($search) {
        $query->where('name', 'like', "%{$search}%");
    }

    $categories = $query->latest()->get();

    return Inertia::render('Expense/Category', [
        'categories' => $categories,
        'search' => $search,
    ]);
}

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',

        ]);

        ExpenseCategory::create([
            'name' => $validated['name'],
        ]);
        return \redirect()->route('expense.category');
    }

    public function update(ExpenseCategory $category, Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',

        ]);

        $category->update([
            'name' => $validated['name'],

        ]);

        return \redirect()->route('expense.category');
    }

    public function destroy(ExpenseCategory $category)
    {

        $category->delete();
        return \redirect()->route('expense.category');
    }
}

