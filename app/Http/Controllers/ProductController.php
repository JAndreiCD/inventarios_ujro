<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Department;
use App\Models\Unit;
use App\Models\Type;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::with(['department', 'unit', 'type'])->orderBy('name')->get();
        return Inertia::render('Products/Index', ['products' => $products]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $departments = Department::orderBy('name')->get();
        $units = Unit::orderBy('name')->get();
        $types = Type::orderBy('name')->get();

        return Inertia::render('Products/Create', [
            'departments' => $departments,
            'units' => $units,
            'types' => $types
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'sku' => 'required|string|max:255|unique:products,sku',
            'name' => 'required|string|max:255',
            'costo_unitario' => 'required|numeric|min:0',
            'stock' => 'required|numeric|min:0',
            'department_id' => 'required|exists:departments,id',
            'unit_id' => 'required|exists:units,id',
            'type_id' => 'required|exists:types,id',
        ]);

        Product::create($validated);

        return redirect()->route('products.index')->with('success', 'Producto creado exitosamente');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $product->load(['department', 'unit', 'type']);

        return Inertia::render('Products/Show', [
            'product' => $product
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        $product->load(['department', 'unit', 'type']);
        $departments = Department::orderBy('name')->get();
        $units = Unit::orderBy('name')->get();
        $types = Type::orderBy('name')->get();

        return Inertia::render('Products/Edit', [
            'product' => $product,
            'departments' => $departments,
            'units' => $units,
            'types' => $types
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'sku' => 'required|string|max:255|unique:products,sku,' . $product->id,
            'name' => 'required|string|max:255',
            'costo_unitario' => 'required|numeric|min:0',
            'stock' => 'required|numeric|min:0',
            'department_id' => 'required|exists:departments,id',
            'unit_id' => 'required|exists:units,id',
            'type_id' => 'required|exists:types,id',
        ]);

        $product->update($validated);

        return redirect()->route('products.index')->with('success', 'Producto actualizado exitosamente');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        // Check if product has related inventory or sales
        if ($product->inventoryItems()->exists() || $product->saleItems()->exists()) {
            return redirect()->back()->with('error', 'No se puede eliminar el producto porque tiene movimientos de inventario o ventas asociados');
        }

        $product->delete();

        return redirect()->route('products.index')->with('success', 'Producto eliminado exitosamente');
    }
}
