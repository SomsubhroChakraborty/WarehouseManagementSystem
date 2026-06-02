<?php

namespace App\Http\Controllers;

use App\Models\Expenses;
use Illuminate\Http\Request;
use App\Models\ExpenseCategory;
use App\Models\User;
use Inertia\Inertia;
class ExpensesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
         $query = Expenses::query()->with('user', 'expense_category');

        if ($search = $request->filled('search')) {
            $query->orWhereHas('user', function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->query('search')}%");
            });
        }

        $expenses = $query->paginate(10);
        $categories = ExpenseCategory::all();
        $users = User::all();

        return Inertia::render('Expense/List', compact('expenses', 'categories', 'users', 'search'));
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
     $request->validate([
        'user_id'=>'required',
        'expense_category_id'=>'required',
        'amount'=>'required',
        'note'=>'nullable',
     ]);
     Expenses::create([
        'user_id'=>$request->user_id,
        'expense_category_id'=>$request->expense_category_id,
        'amount'=>$request->amount,
        'note'=>$request->note,
     ]);
     return redirect()->route('expenses');
    }

    /**
     * Display the specified resource.
     */
    public function show(Expenses $expenses)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Expenses $expenses)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Expenses $expenses)
    {
   $request->validate([
            'user_id' => 'required',
            'expense_category_id' => 'required',
            'amount' => 'required',
            'note' => 'nullable',
        ]);
        $expenses->update([
        'user_id' => $request->user_id,
        'expense_category_id' => $request->expense_category_id,
        'amount' => $request->amount,
        'note' => $request->note,


        ]);

        return redirect()->route('expenses');
    }
    public function destroy(string $id)
    {
        Expenses::findOrFail($id)->delete();

        return redirect()->route('expenses');
    }
}

