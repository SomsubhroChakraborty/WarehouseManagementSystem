<?php

namespace App\Http\Controllers;

use App\Models\Bank;
use App\Models\Ledger;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LedgerController extends Controller
{
    public function index()
    {
        $ledgers = Ledger::with('bank')
            ->latest()
            ->get();

        $totalCredit = Ledger::where('type', 'credit')->sum('amount');
        $totalDebit = Ledger::where('type', 'debit')->sum('amount');

        return Inertia::render('Ledger', [
            'ledgers' => $ledgers,
            'banks' => Bank::all(),
            'totalCredit' => (float)$totalCredit,
            'totalDebit' => (float)$totalDebit,
            'balance' => (float)($totalCredit - $totalDebit),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'bank_id'          => 'required',
            'type'             => 'required',
            'amount'           => 'required',
            'transaction_date' => 'required',
            'note'             => 'nullable', 
        ]);

        Ledger::create($validated);

        return redirect()->back()->with('success', 'Ledger entry created successfully.');
    }

     public function update(Request $request, Ledger $ledger)
    {
        $request->validate([
            'bank_id' => 'required',
            'type' => 'required',
            'amount' => 'required',
            'transaction_date' => 'required',
            'note' => 'nullable',
        ]);

        $ledger->update([
            'bank_id' => $request->bank_id,
            'type' => $request->type,
            'amount' => $request->amount,
            'transaction_date' => $request->transaction_date,
            'note' => $request->note,
        ]);

        return redirect()->back();
    }

    public function destroy(Ledger $ledger)
    {
        $ledger->delete();

        return redirect()->back()->with('with', 'Ledger entry deleted successfully.');
    }
}