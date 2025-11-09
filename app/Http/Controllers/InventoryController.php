<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Inventory;
use App\Exports\InventoriesExport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class InventoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $inventories = Inventory::with('user')
            ->withCount('items')
            ->latest()
            ->paginate(15);
        return Inertia::render('Inventories/Index', [
            'inventories' => $inventories,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Inventories/Create', [
            'products' => Product::orderBy('name')->get(['id', 'name', 'sku']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'fecha_compra' => 'nullable|date',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.cantidad' => 'required|numeric|min:0.01',
            'items.*.costo_unitario' => 'required|numeric|min:0.01',
        ]);

        DB::transaction(function () use ($request) {

            $totalCosto = 0;
            foreach ($request->items as $item) {
                $totalCosto += $item['cantidad'] * $item['costo_unitario'];
            }

            $inventory = Inventory::create([
                'user_id' => $request->user()->id,
                'fecha_inventario' => now(),
                'total_costo' => $totalCosto,
            ]);

            foreach ($request->items as $item) {
                $inventory->items()->create([
                    'product_id' => $item['product_id'],
                    'cantidad' => $item['cantidad'],
                    'costo_unitario' => $item['costo_unitario'],
                    'fecha_compra' => $request->fecha_compra,
                ]);

                $product = Product::find($item['product_id']);
                $product->stock += $item['cantidad'];
                $product->last_inventory_at = $inventory->fecha_inventario;
                $product->save();
            }
        });

        return to_route('products.index')->with('message', 'Inventario registrado con éxito.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Inventory $inventory)
    {
        $inventory->load(['user', 'items.product.unit', 'items.product.department']);

        return Inertia::render('Inventories/Show', [
            'inventory' => $inventory,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Inventory $inventory)
    {
        $inventory->load(['items.product']);

        return Inertia::render('Inventories/Edit', [
            'inventory' => $inventory,
            'products' => Product::orderBy('name')->get(['id', 'name', 'sku']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Inventory $inventory)
    {
        $request->validate([
            'fecha_compra' => 'nullable|date',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.cantidad' => 'required|numeric|min:0.01',
            'items.*.costo_unitario' => 'required|numeric|min:0.01',
        ]);

        DB::transaction(function () use ($request, $inventory) {
            // Revertir el stock original
            foreach ($inventory->items as $item) {
                $product = Product::find($item->product_id);
                $product->stock -= $item->cantidad;
                $product->save();
            }

            // Eliminar items antiguos
            $inventory->items()->delete();

            // Calcular nuevo total
            $totalCosto = 0;
            foreach ($request->items as $item) {
                $totalCosto += $item['cantidad'] * $item['costo_unitario'];
            }

            // Actualizar inventario
            $inventory->update([
                'total_costo' => $totalCosto,
            ]);

            // Crear nuevos items y actualizar stock
            foreach ($request->items as $item) {
                $inventory->items()->create([
                    'product_id' => $item['product_id'],
                    'cantidad' => $item['cantidad'],
                    'costo_unitario' => $item['costo_unitario'],
                    'fecha_compra' => $request->fecha_compra,
                ]);

                $product = Product::find($item['product_id']);
                $product->stock += $item['cantidad'];
                $product->last_inventory_at = $inventory->fecha_inventario;
                $product->save();
            }
        });

        return to_route('inventories.index')->with('message', 'Inventario actualizado con éxito.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Inventory $inventory)
    {
        DB::transaction(function () use ($inventory) {
            // Revertir el stock de los productos
            foreach ($inventory->items as $item) {
                $product = Product::find($item->product_id);
                $product->stock -= $item->cantidad;
                $product->save();
            }

            // Eliminar items y el inventario
            $inventory->items()->delete();
            $inventory->delete();
        });

        return to_route('inventories.index')->with('message', 'Inventario eliminado con éxito.');
    }

    /**
     * Export inventories to Excel.
     */
    public function export()
    {
        return Excel::download(new InventoriesExport, 'inventarios_' . date('Y-m-d_His') . '.xlsx');
    }
}
