<?php

namespace App\Exports;

use App\Models\Inventory;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class InventoriesExport implements FromCollection, WithHeadings, WithMapping, WithStyles
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return Inventory::with(['user', 'items.product.unit', 'items.product.department'])
            ->latest('fecha_inventario')
            ->get();
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        return [
            'ID Inventario',
            'Fecha Inventario',
            'Usuario',
            'SKU Producto',
            'Producto',
            'Cantidad',
            'Unidad',
            'Departamento',
            'Costo Unitario',
            'Subtotal',
            'Fecha Compra',
            'Total Inventario',
        ];
    }

    /**
     * @param mixed $inventory
     * @return array
     */
    public function map($inventory): array
    {
        $rows = [];

        foreach ($inventory->items as $index => $item) {
            $rows[] = [
                $index === 0 ? $inventory->id : '',
                $index === 0 ? $inventory->fecha_inventario->format('d/m/Y H:i') : '',
                $index === 0 ? $inventory->user->name : '',
                $item->product->sku,
                $item->product->name,
                $item->cantidad,
                $item->product->unit->name ?? 'N/A',
                $item->product->department->name ?? 'N/A',
                '$' . number_format($item->costo_unitario, 2),
                '$' . number_format($item->cantidad * $item->costo_unitario, 2),
                $item->fecha_compra ? date('d/m/Y', strtotime($item->fecha_compra)) : 'N/A',
                $index === 0 ? '$' . number_format($inventory->total_costo, 2) : '',
            ];
        }

        return $rows;
    }

    /**
     * @param Worksheet $sheet
     * @return array
     */
    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
