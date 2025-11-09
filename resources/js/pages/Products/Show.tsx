import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2, Edit } from 'lucide-react';

interface Department {
    id: number;
    name: string;
}

interface Unit {
    id: number;
    name: string;
}

interface Type {
    id: number;
    name: string;
}

interface Product {
    id: number;
    sku: string;
    name: string;
    costo_unitario: number;
    stock: number;
    department: Department;
    unit: Unit;
    type: Type;
    last_inventory_at: string | null;
    created_at: string;
    updated_at: string;
}

interface ProductShowProps {
    product: Product;
}

export default function ProductShow({ product }: ProductShowProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(amount);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('es-MX', {
            dateStyle: 'long',
            timeStyle: 'short',
        });
    };

    const handleDelete = () => {
        if (confirm('¿Estás seguro de eliminar este producto?')) {
            router.delete(`/products/${product.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Inicio', href: '/' },
            { title: 'Productos', href: '/products' },
            { title: product.name, href: `/products/${product.id}` }
        ]}>
            <Head title={product.name} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="font-semibold text-2xl text-gray-800 leading-tight">
                                        {product.name}
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        SKU: {product.sku}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Link href="/products">
                                        <Button variant="outline">
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Volver
                                        </Button>
                                    </Link>
                                    <Link href={`/products/${product.id}/edit`}>
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
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-500">Costo Unitario</p>
                                    <p className="text-2xl font-semibold text-gray-900 mt-1">
                                        {formatCurrency(product.costo_unitario)}
                                    </p>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-500">Stock Disponible</p>
                                    <p className="text-2xl font-semibold text-blue-600 mt-1">
                                        {product.stock}
                                    </p>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-500">Valor en Inventario</p>
                                    <p className="text-2xl font-semibold text-green-600 mt-1">
                                        {formatCurrency(product.stock * product.costo_unitario)}
                                    </p>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-500">Departamento</p>
                                    <p className="text-lg font-semibold text-gray-900 mt-1">
                                        {product.department.name}
                                    </p>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-500">Unidad de Medida</p>
                                    <p className="text-lg font-semibold text-gray-900 mt-1">
                                        {product.unit.name}
                                    </p>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-500">Tipo</p>
                                    <p className="text-lg font-semibold text-gray-900 mt-1">
                                        {product.type.name}
                                    </p>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-500">Último Inventario</p>
                                    <p className="text-sm text-gray-900 mt-1">
                                        {formatDate(product.last_inventory_at)}
                                    </p>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-500">Fecha de Creación</p>
                                    <p className="text-sm text-gray-900 mt-1">
                                        {formatDate(product.created_at)}
                                    </p>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-500">Última Actualización</p>
                                    <p className="text-sm text-gray-900 mt-1">
                                        {formatDate(product.updated_at)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
