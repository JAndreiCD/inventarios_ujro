import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Eye, Edit } from 'lucide-react';
interface Product {
    id: number;
    sku: string;
    name: string;
    stock: number;
    costo_unitario: number;
    department: { name: string };
    unit: { name: string };
    type: { name: string };
    last_inventory_at: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface ProductsPageProps {
    products: Product[];
    auth: {
        user: User;
    };
}

export default function ProductsIndex({ products }: ProductsPageProps) {
    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de eliminar este producto?')) {
            router.delete(`/products/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Inicio', href: '/' },
            { title: 'Productos', href: '/products' }
        ]}>
            <Head title="Productos" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                                    Módulo 2: Productos en Tienda
                                </h2>
                                <Link href="/products/create">
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Nuevo Producto
                                    </Button>
                                </Link>
                            </div>
                            
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidad</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Costo</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departamento</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {products.map((product) => (
                                        <tr key={product.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{product.sku}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{product.unit.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">${product.costo_unitario}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{product.department.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex gap-2">
                                                    <Link href={`/products/${product.id}`}>
                                                        <Button variant="outline" size="sm">
                                                            <Eye className="h-4 w-4 mr-1" />
                                                            Ver Detalle
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/products/${product.id}/edit`}>
                                                        <Button variant="default" size="sm">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDelete(product.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}