import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2, Edit } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Product {
    id: number;
    sku: string;
    name: string;
    unit?: { name: string };
    department?: { name: string };
}

interface SaleItem {
    id: number;
    product_id: number;
    cantidad: number;
    precio_venta_unitario: number;
    product: Product;
}

interface Sale {
    id: number;
    user_id: number;
    fecha_corte: string;
    total_vendido: number;
    created_at: string;
    user: User;
    items: SaleItem[];
}

interface SaleShowProps {
    sale: Sale;
}

export default function SaleShow({ sale }: SaleShowProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('es-MX', {
            dateStyle: 'long',
            timeStyle: 'short',
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(amount);
    };

    const handleDelete = () => {
        if (confirm('¿Estás seguro de eliminar esta afectación? Esta acción restaurará el stock de los productos.')) {
            router.delete(`/sales/${sale.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Inicio', href: '/' },
            { title: 'Afectaciones', href: '/sales' },
            { title: `Afectación #${sale.id}`, href: `/sales/${sale.id}` }
        ]}>
            <Head title={`Afectación #${sale.id}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="font-semibold text-2xl text-gray-800 leading-tight">
                                        Afectación #{sale.id}
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Registrado el {formatDate(sale.fecha_corte)}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Link href="/sales">
                                        <Button variant="outline">
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Volver
                                        </Button>
                                    </Link>
                                    <Link href={`/sales/${sale.id}/edit`}>
                                        <Button variant="default">
                                            <Edit className="mr-2 h-4 w-4" />
                                            Editar
                                        </Button>
                                    </Link>
                                    <Button variant="destructive" onClick={handleDelete}>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Eliminar
                                    </Button>
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-500">Usuario</p>
                                    <p className="text-lg font-semibold text-gray-900 mt-1">
                                        {sale.user.name}
                                    </p>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-500">Total de Items</p>
                                    <p className="text-2xl font-semibold text-blue-600 mt-1">
                                        {sale.items.length}
                                    </p>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-500">Total Vendido</p>
                                    <p className="text-2xl font-semibold text-red-600 mt-1">
                                        {formatCurrency(sale.total_vendido)}
                                    </p>
                                </div>
                            </div>

                            {/* Items Table */}
                            <div>
                                <h3 className="text-lg font-medium mb-4">Productos Vendidos</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unidad</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Departamento</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio Venta</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {sale.items.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {item.product.sku}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {item.product.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.product.unit?.name || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.product.department?.name || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {item.cantidad}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatCurrency(item.precio_venta_unitario)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                        {formatCurrency(item.cantidad * item.precio_venta_unitario)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-gray-50">
                                            <tr>
                                                <td colSpan={6} className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                                                    Total:
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">
                                                    {formatCurrency(sale.total_vendido)}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
