<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Inventory;
use App\Models\Sale;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        // Total de productos
        $totalProducts = Product::count();

        // Valor total del inventario (suma de stock * costo de cada producto)
        $totalInventoryValue = Product::sum(DB::raw('stock * costo_unitario'));

        // Productos con stock bajo (menos de 10 unidades)
        $lowStockProducts = Product::where('stock', '<', 10)->count();

        // Actividad de los últimos 7 días
        $sevenDaysAgo = Carbon::now()->subDays(6)->startOfDay();

        // Obtener entradas (inventarios) por día
        $inventoryActivity = Inventory::where('fecha_inventario', '>=', $sevenDaysAgo)
            ->select(
                DB::raw('DATE(fecha_inventario) as date'),
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(total_costo) as total')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Obtener salidas (ventas) por día
        $salesActivity = Sale::where('fecha_corte', '>=', $sevenDaysAgo)
            ->select(
                DB::raw('DATE(fecha_corte) as date'),
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(total_vendido) as total')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Crear array con los últimos 7 días
        $chartData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');
            $dayName = Carbon::parse($date)->locale('es')->isoFormat('ddd D');

            $inventory = $inventoryActivity->firstWhere('date', $date);
            $sale = $salesActivity->firstWhere('date', $date);

            $chartData[] = [
                'date' => $dayName,
                'entradas' => $inventory ? (float) $inventory->total : 0,
                'salidas' => $sale ? (float) $sale->total : 0,
            ];
        }

        // Productos más vendidos (top 5)
        $topProducts = DB::table('sale_items')
            ->select(
                'sale_items.product_id',
                DB::raw('SUM(sale_items.cantidad) as total_vendido')
            )
            ->groupBy('sale_items.product_id')
            ->orderByDesc('total_vendido')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                $product = Product::find($item->product_id);
                return [
                    'nombre' => $product ? $product->nombre : 'Producto eliminado',
                    'total_vendido' => $item->total_vendido,
                ];
            });

        return Inertia::render('dashboard', [
            'stats' => [
                'totalProducts' => $totalProducts,
                'totalInventoryValue' => $totalInventoryValue,
                'lowStockProducts' => $lowStockProducts,
            ],
            'chartData' => $chartData,
            'topProducts' => $topProducts,
        ]);
    }
}
