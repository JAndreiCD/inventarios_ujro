import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Trash2, Edit, Download } from 'lucide-react';

interface User {
    id: number;
    name: string;
}

interface Inventory {
    id: number;
    fecha_inventario: string;
    total_costo: number;
    user: User;
    items_count: number;
}

interface PaginatedData<T> {
    data: T[];
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

interface InventoryIndexProps {
    inventories: PaginatedData<Inventory>;
}

interface PaginationProps {
    data: PaginatedData<Inventory>;
}

const Pagination = ({ data }: PaginationProps) => {
    if (data.total <= data.per_page) return null;

    return (
        <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-gray-700">
                Mostrando {data.from} a {data.to} de {data.total} resultados
            </span>
            <div className="flex gap-2">
                {data.prev_page_url && (
                    <Link
                        href={data.prev_page_url}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Anterior
                    </Link>
                )}
                {data.next_page_url && (
                    <Link
                        href={data.next_page_url}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Siguiente
                    </Link>
                )}
            </div>
        </div>
    );
};

export default function InventoryIndex({ inventories }: InventoryIndexProps) {

    const formatDate = (datetime: string) => {
        return new Date(datetime).toLocaleString('es-MX', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    };
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(amount);
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de eliminar este inventario? Esta acción revertirá el stock agregado.')) {
            router.delete(`/inventories/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Inicio', href: '/' },
            { title: 'Reporte Inventario', href: '/inventories' }
        ]}>
            <Head title="Reporte de Inventarios" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                                    Módulo 3: Visualizador de Inventarios (Entradas)
                                </h2>
                                <div className="flex gap-2">
                                    <a href="/inventories/export" download>
                                        <Button variant="outline">
                                            <Download className="mr-2 h-4 w-4" />
                                            Exportar Excel
                                        </Button>
                                    </a>
                                    <Link href="/inventories/create">
                                        <Button>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Registrar Inventario
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha del Inventario</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Productos Registrados</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total $</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {inventories.data.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                                No se encontraron registros de inventario.
                                            </td>
                                        </tr>
                                    )}
                                    {inventories.data.map((inventory) => (
                                        <tr key={inventory.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{formatDate(inventory.fecha_inventario)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{inventory.user.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{inventory.items_count}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(inventory.total_costo)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex gap-2">
                                                    <Link href={`/inventories/${inventory.id}`}>
                                                        <Button variant="outline" size="sm">
                                                            <Eye className="h-4 w-4 mr-1" />
                                                            Ver Detalle
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/inventories/${inventory.id}/edit`}>
                                                        <Button variant="default" size="sm">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDelete(inventory.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <Pagination data={inventories} />

                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
