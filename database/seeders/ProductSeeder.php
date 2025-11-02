<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Department;
use App\Models\Inventory;
use App\Models\InventoryItem;
use App\Models\Product;
use App\Models\Type;
use App\Models\Unit;
use App\Models\User;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $deptoOtros = Department::where('name', 'Otros')->first();
        $unitKg = Unit::where('name', 'KG')->first();
        $typePerecedero = Type::where('name', 'Perecedero')->first();

        $user = User::where('email', 'test@example.com')->first();

        if (!$user || !$deptoOtros || !$unitKg || !$typePerecedero) {
            $this->command->error('No se encontraron los catálogos o el usuario de prueba. Asegúrate de ejecutar los otros seeders primero.');
            return;
        }

        $huevo = Product::create([
            'sku' => 'HUE',
            'name' => 'HUEVO',
            'costo_unitario' => 28.00,
            'stock' => 0,
            'department_id' => $deptoOtros->id,
            'unit_id' => $unitKg->id,
            'type_id' => $typePerecedero->id,
        ]);

        $inventory = Inventory::create([
            'user_id' => $user->id,
            'fecha_inventario' => now(),
            'total_costo' => 140.00,
        ]);

        $inventory->items()->create([
            'product_id' => $huevo->id,
            'cantidad' => 5,
            'costo_unitario' => 28.00,
            'fecha_compra' => '2025-11-01',
        ]);

        $huevo->stock = 5;
        $huevo->last_inventory_at = $inventory->fecha_inventario;
        $huevo->save();
    }
}
