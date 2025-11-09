<?php

namespace App\Exports;

use App\Models\Sale;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class SalesExport implements FromCollection, WithHeadings, WithMapping, WithStyles
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return Sale::with(['user', 'items.product.unit', 'items.product.department'])
            ->latest('fecha_corte')
            ->get();
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        return [
            'ID Afectación',
            'Fecha Corte',
            'Usuario',
            'SKU Producto',
            'Producto',
            'Cantidad Vendida',
            'Unidad',
            'Departamento',
            'Precio Venta Unitario',
            'Subtotal',
            'Total Vendido',
        ];
    }

    /**
     * @param mixed $sale
     * @return array
     */
    public function map($sale): array
    {
        $rows = [];

        foreach ($sale->items as $index => $item) {
            $rows[] = [
                $index === 0 ? $sale->id : '',
                $index === 0 ? $sale->fecha_corte->format('d/m/Y H:i') : '',
                $index === 0 ? $sale->user->name : '',
                $item->product->sku,
                $item->product->name,
                $item->cantidad,
                $item->product->unit->name ?? 'N/A',
                $item->product->department->name ?? 'N/A',
                '$' . number_format($item->precio_venta_unitario, 2),
                '$' . number_format($item->cantidad * $item->precio_venta_unitario, 2),
                $index === 0 ? '$' . number_format($sale->total_vendido, 2) : '',
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
