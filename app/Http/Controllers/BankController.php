<?php

namespace App\Http\Controllers;

use App\Models\Bank;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BankController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->query('search');

        $query = Bank::query();

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('branch', 'like', "%{$search}%")
                  ->orWhere('account_number', 'like', "%{$search}%");
        }

        $banks = $query->latest()->get();

        return Inertia::render('Bank', [
            'banks' => $banks,
            'search' => $search,
        ]);
    }

    /**
     * Store a newly created resource.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required',
            'branch' => 'required',
            'account_number' => 'required',
        ]);

        Bank::create($data);

        return redirect()->route('bank.index');
    }

    /**
     * Update the specified resource.
     */
    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'name' => 'required',
            'branch' => 'required',
            'account_number' => 'required',
        ]);

        Bank::findOrFail($id)->update($data);

        return redirect()->route('bank.index');
    }

    /**
     * Remove the specified resource.
     */
    public function destroy($id)
    {
        Bank::findOrFail($id)->delete();

        return redirect()->route('bank.index');
    }
}