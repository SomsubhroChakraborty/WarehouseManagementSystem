<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('purchases', function (Blueprint $table) {
            $table->id();
             $table->foreignId('supplier_id')
        ->constrained()
        ->restrictOnDelete();

    $table->string('purchase_no')->unique();

    $table->string('supplier_invoice_no')->nullable();

    $table->date('purchase_date');

    $table->decimal('subtotal',12,2)->default(0);

    $table->decimal('discount',12,2)->default(0);

    $table->decimal('tax',12,2)->default(0);

    $table->decimal('shipping_charge',12,2)->default(0);

    $table->decimal('grand_total',12,2)->default(0);

    $table->enum('status',['Pending','Received','Cancelled'])
          ->default('Pending');

    $table->text('remarks')->nullable();

    $table->index('purchase_date');
    $table->index('status');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchases');
    }
};
