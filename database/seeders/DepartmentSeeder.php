<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Department;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Department::create(['name' => 'Lácteos']);
        Department::create(['name' => 'Carnes']);
        Department::create(['name' => 'Abarrotes']);
        Department::create(['name' => 'Frutas y Verduras']);
        Department::create(['name' => 'Limpieza']);
        Department::create(['name' => 'Otros']);
    }
}
