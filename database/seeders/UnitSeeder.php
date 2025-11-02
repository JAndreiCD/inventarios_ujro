<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Unit;

class UnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Unit::create(['name' => 'KG']);
        Unit::create(['name' => 'Pieza']);
        Unit::create(['name' => 'Litro']);
        Unit::create(['name' => 'Caja']);
        Unit::create(['name' => 'Paquete']);
    }
}
