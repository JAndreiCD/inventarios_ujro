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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('sku')->unique()->nullable();
            $table->string('name');
            $table->decimal('costo_unitario', 10, 2);
            $table->decimal('stock', 10, 2)->default(0.00);
            $table->foreignId('department_id')
                ->constrained('departments')
                ->onDelete('cascade');
            $table->foreignId('unit_id')
                ->constrained('units')
                ->onDelete('cascade');
            $table->foreignId('type_id')
                ->constrained('types')
                ->onDelete('cascade');
            $table->timestamp('last_inventory_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
