<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Sale;
use App\Exports\SalesExport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class SaleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sales = Sale::with('user')
            ->withCount('items')
            ->latest('fecha_corte')
            ->paginate(15);

        return Inertia::render('Sales/Index', [
            'sales' => $sales,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Sales/Create', [
            'products' => Product::where('stock', '>', 0)
                ->orderBy('name')
                ->get(['id', 'name', 'sku', 'stock']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'fecha_corte' => 'nullable|date',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.cantidad' => 'required|numeric|min:0.01',
            'items.*.precio_venta' => 'required|numeric|min:0.01',
        ]);

        DB::transaction(function () use ($request) {

            $totalVendido = 0;
            foreach ($request->items as $item) {
                $totalVendido += $item['cantidad'] * $item['precio_venta'];
            }

            $sale = Sale::create([
                'user_id' => $request->user()->id,
                'fecha_corte' => $request->fecha_corte ?? now(),
                'total_vendido' => $totalVendido,
            ]);

            foreach ($request->items as $item) {
                $product = Product::find($item['product_id']);

                // Verificar stock disponible
                if ($product->stock < $item['cantidad']) {
                    throw new \Exception("Stock insuficiente para el producto {$product->name}");
                }

                $sale->items()->create([
                    'product_id' => $item['product_id'],
                    'cantidad' => $item['cantidad'],
                    'precio_venta_unitario' => $item['precio_venta'], // Nombre correcto del campo en DB
                ]);

                // Restar del stock
                $product->stock -= $item['cantidad'];
                $product->save();
            }
        });

        return to_route('sales.index')->with('message', 'Afectación registrada con éxito.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Sale $sale)
    {
        $sale->load(['user', 'items.product.unit', 'items.product.department']);

        return Inertia::render('Sales/Show', [
            'sale' => $sale,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Sale $sale)
    {
        $sale->load(['items.product']);

        return Inertia::render('Sales/Edit', [
            'sale' => $sale,
            'products' => Product::where('stock', '>', 0)
                ->orderBy('name')
                ->get(['id', 'name', 'sku', 'stock']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Sale $sale)
    {
        $request->validate([
            'fecha_corte' => 'nullable|date',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.cantidad' => 'required|numeric|min:0.01',
            'items.*.precio_venta' => 'required|numeric|min:0.01',
        ]);

        DB::transaction(function () use ($request, $sale) {
            // Restaurar el stock original
            foreach ($sale->items as $item) {
                $product = Product::find($item->product_id);
                $product->stock += $item->cantidad;
                $product->save();
            }

            // Eliminar items antiguos
            $sale->items()->delete();

            // Calcular nuevo total
            $totalVendido = 0;
            foreach ($request->items as $item) {
                $totalVendido += $item['cantidad'] * $item['precio_venta'];
            }

            // Actualizar venta
            $sale->update([
                'fecha_corte' => $request->fecha_corte ?? $sale->fecha_corte,
                'total_vendido' => $totalVendido,
            ]);

            // Crear nuevos items y actualizar stock
            foreach ($request->items as $item) {
                $product = Product::find($item['product_id']);

                // Verificar stock disponible
                if ($product->stock < $item['cantidad']) {
                    throw new \Exception("Stock insuficiente para el producto {$product->name}");
                }

                $sale->items()->create([
                    'product_id' => $item['product_id'],
                    'cantidad' => $item['cantidad'],
                    'precio_venta_unitario' => $item['precio_venta'],
                ]);

                $product->stock -= $item['cantidad'];
                $product->save();
            }
        });

        return to_route('sales.index')->with('message', 'Afectación actualizada con éxito.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sale $sale)
    {
        DB::transaction(function () use ($sale) {
            // Devolver el stock de los productos
            foreach ($sale->items as $item) {
                $product = Product::find($item->product_id);
                $product->stock += $item->cantidad;
                $product->save();
            }

            // Eliminar items y la venta
            $sale->items()->delete();
            $sale->delete();
        });

        return to_route('sales.index')->with('message', 'Afectación eliminada con éxito.');
    }

    /**
     * Export sales to Excel.
     */
    public function export()
    {
        return Excel::download(new SalesExport, 'afectaciones_' . date('Y-m-d_His') . '.xlsx');
    }
}
