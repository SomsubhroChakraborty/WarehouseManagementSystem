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
        Schema::create('quotation_items', function (Blueprint $table) {
            $table->id();
               $table->foreignId('quotation_id')
          ->constrained()
          ->cascadeOnDelete();

    $table->foreignId('varient_id')
          ->constrained('varients')
          ->cascadeOnDelete();

    $table->integer('quantity');

    // Save the quoted price at the time of quotation
    $table->decimal('price', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quotation_items');
    }
};
