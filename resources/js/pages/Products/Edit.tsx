import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    department_id: number;
    unit_id: number;
    type_id: number;
}

interface ProductEditProps {
    product: Product;
    departments: Department[];
    units: Unit[];
    types: Type[];
}

export default function ProductEdit({ product, departments, units, types }: ProductEditProps) {
    const { data, setData, put, processing, errors } = useForm({
        sku: product.sku,
        name: product.name,
        costo_unitario: product.costo_unitario.toString(),
        stock: product.stock.toString(),
        department_id: product.department_id.toString(),
        unit_id: product.unit_id.toString(),
        type_id: product.type_id.toString(),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/products/${product.id}`);
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Inicio', href: '/' },
            { title: 'Productos', href: '/products' },
            { title: product.name, href: `/products/${product.id}` },
            { title: 'Editar', href: `/products/${product.id}/edit` }
        ]}>
            <Head title={`Editar ${product.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight mb-6">
                                Editar Producto: {product.name}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* SKU */}
                                    <div className="space-y-2">
                                        <Label htmlFor="sku">SKU</Label>
                                        <Input
                                            id="sku"
                                            value={data.sku}
                                            onChange={(e) => setData('sku', e.target.value)}
                                            placeholder="Ej: PROD-001"
                                        />
                                        {errors.sku && <p className="text-sm text-red-600">{errors.sku}</p>}
                                    </div>

                                    {/* Nombre */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nombre del Producto</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Nombre del producto"
                                        />
                                        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                                    </div>

                                    {/* Costo Unitario */}
                                    <div className="space-y-2">
                                        <Label htmlFor="costo_unitario">Costo Unitario</Label>
                                        <Input
                                            id="costo_unitario"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.costo_unitario}
                                            onChange={(e) => setData('costo_unitario', e.target.value)}
                                            placeholder="0.00"
                                        />
                                        {errors.costo_unitario && <p className="text-sm text-red-600">{errors.costo_unitario}</p>}
                                    </div>

                                    {/* Stock */}
                                    <div className="space-y-2">
                                        <Label htmlFor="stock">Stock</Label>
                                        <Input
                                            id="stock"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.stock}
                                            onChange={(e) => setData('stock', e.target.value)}
                                            placeholder="0"
                                        />
                                        {errors.stock && <p className="text-sm text-red-600">{errors.stock}</p>}
                                    </div>

                                    {/* Departamento */}
                                    <div className="space-y-2">
                                        <Label htmlFor="department_id">Departamento</Label>
                                        <Select
                                            value={data.department_id}
                                            onValueChange={(value) => setData('department_id', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona un departamento" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {departments.map((dept) => (
                                                    <SelectItem key={dept.id} value={dept.id.toString()}>
                                                        {dept.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.department_id && <p className="text-sm text-red-600">{errors.department_id}</p>}
                                    </div>

                                    {/* Unidad */}
                                    <div className="space-y-2">
                                        <Label htmlFor="unit_id">Unidad de Medida</Label>
                                        <Select
                                            value={data.unit_id}
                                            onValueChange={(value) => setData('unit_id', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona una unidad" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {units.map((unit) => (
                                                    <SelectItem key={unit.id} value={unit.id.toString()}>
                                                        {unit.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.unit_id && <p className="text-sm text-red-600">{errors.unit_id}</p>}
                                    </div>

                                    {/* Tipo */}
                                    <div className="space-y-2">
                                        <Label htmlFor="type_id">Tipo</Label>
                                        <Select
                                            value={data.type_id}
                                            onValueChange={(value) => setData('type_id', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona un tipo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {types.map((type) => (
                                                    <SelectItem key={type.id} value={type.id.toString()}>
                                                        {type.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.type_id && <p className="text-sm text-red-600">{errors.type_id}</p>}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        Actualizar Producto
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
