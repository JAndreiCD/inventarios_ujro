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

interface InventoryItem {
    id: number;
    product_id: number;
    cantidad: number;
    costo_unitario: number;
    fecha_compra: string | null;
    product: Product;
}

interface Inventory {
    id: number;
    user_id: number;
    fecha_inventario: string;
    total_costo: number;
    created_at: string;
    user: User;
    items: InventoryItem[];
}

interface InventoryShowProps {
    inventory: Inventory;
}

export default function InventoryShow({ inventory }: InventoryShowProps) {
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
        if (confirm('¿Estás seguro de eliminar este inventario? Esta acción revertirá el stock agregado.')) {
            router.delete(`/inventories/${inventory.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Inicio', href: '/' },
            { title: 'Inventarios', href: '/inventories' },
            { title: `Inventario #${inventory.id}`, href: `/inventories/${inventory.id}` }
        ]}>
            <Head title={`Inventario #${inventory.id}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="font-semibold text-2xl text-gray-800 leading-tight">
                                        Inventario #{inventory.id}
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Registrado el {formatDate(inventory.fecha_inventario)}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Link href="/inventories">
                                        <Button variant="outline">
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Volver
                                        </Button>
                                    </Link>
                                    <Link href={`/inventories/${inventory.id}/edit`}>
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
                                        {inventory.user.name}
                                    </p>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-500">Total de Items</p>
                                    <p className="text-2xl font-semibold text-blue-600 mt-1">
                                        {inventory.items.length}
                                    </p>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-500">Costo Total</p>
                                    <p className="text-2xl font-semibold text-green-600 mt-1">
                                        {formatCurrency(inventory.total_costo)}
                                    </p>
                                </div>
                            </div>

                            {/* Items Table */}
                            <div>
                                <h3 className="text-lg font-medium mb-4">Productos Registrados</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unidad</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Departamento</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Costo Unit.</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Compra</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {inventory.items.map((item) => (
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
                                                        {formatCurrency(item.costo_unitario)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                        {formatCurrency(item.cantidad * item.costo_unitario)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.fecha_compra ? new Date(item.fecha_compra).toLocaleDateString('es-MX') : 'N/A'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-gray-50">
                                            <tr>
                                                <td colSpan={6} className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                                                    Total:
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                                                    {formatCurrency(inventory.total_costo)}
                                                </td>
                                                <td></td>
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
