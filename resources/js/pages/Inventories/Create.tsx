import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

// --- 1. Definición de Tipos ---

interface Product {
    id: number;
    sku: string;
    name: string;
}

interface InventoryItemForm {
    product_id: number | '';
    cantidad: number | '';
    costo_unitario: number | '';
    product_name?: string; 
    product_sku?: string;
}

interface CreateInventoryProps {
    products: Product[];
}

export default function CreateInventory({ products }: CreateInventoryProps) {

    // --- 2. Hooks de React y useForm ---

    const { data, setData, post, processing, errors, reset } = useForm({
        fecha_compra: '',
        items: [] as InventoryItemForm[],
    });

    const [currentItem, setCurrentItem] = useState<InventoryItemForm>({
        product_id: '',
        cantidad: '',
        costo_unitario: '',
        product_name: '',
        product_sku: '',
    });

    // --- 3. Lógica de Handlers ---

    const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentItem(prev => ({ ...prev, [name]: value }));
    };

    const handleAddItem = () => {
        if (!currentItem.product_id || !currentItem.cantidad || !currentItem.costo_unitario) {
            alert('Por favor, completa todos los campos del producto.');
            return;
        }

        setData('items', [...data.items, currentItem]);

        setCurrentItem({
            product_id: '',
            cantidad: '',
            costo_unitario: '',
            product_name: '',
            product_sku: '',
        });
    };

    const handleRemoveItem = (indexToRemove: number) => {
        setData('items', data.items.filter((_, index) => index !== indexToRemove));
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/inventories', {
            onSuccess: () => reset(),
        });
    };

    // --- 4. Renderizado (JSX) ---

    return (
        <AppLayout breadcrumbs={[
            { title: 'Inicio', href: '/' },
            { title: 'Inventarios', href: '/inventories/create' },
            { title: 'Registrar', href: '/inventories/create' }
        ]}>
            <Head title="Registrar Inventario" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                        
                        <div className="p-6">
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight mb-6">
                                Módulo 1: Registrar Inventario (Entradas)
                            </h2>
                        
                            <form onSubmit={submit} className="space-y-6">

                                {/* --- SECCIÓN PARA AÑADIR ITEMS --- */}
                                <div className="p-4 border rounded-lg space-y-4">
                                <h3 className="text-lg font-medium">Añadir Producto al Inventario</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="col-span-2">
                                        <Label htmlFor="product_id">Producto</Label>
                                        <Select
                                            value={currentItem.product_id.toString()}
                                            onValueChange={(value) => {
                                                const selectedProduct = products.find(p => p.id === Number(value));
                                                setCurrentItem(prev => ({
                                                    ...prev,
                                                    product_id: Number(value),
                                                    product_name: selectedProduct?.name || '',
                                                    product_sku: selectedProduct?.sku || '',
                                                }));
                                            }}
                                        >
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Selecciona un producto..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {products.map((product) => (
                                                    <SelectItem key={product.id} value={product.id.toString()}>
                                                        ({product.sku}) {product.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="cantidad">Cantidad</Label>
                                        <Input
                                            id="cantidad"
                                            name="cantidad"
                                            type="number"
                                            value={currentItem.cantidad}
                                            onChange={handleItemChange}
                                            className="mt-1 block w-full"
                                            step="0.01"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="costo_unitario">Costo Unitario ($)</Label>
                                        <Input
                                            id="costo_unitario"
                                            name="costo_unitario"
                                            type="number"
                                            value={currentItem.costo_unitario}
                                            onChange={handleItemChange}
                                            className="mt-1 block w-full"
                                            step="0.01"
                                        />
                                    </div>
                                </div>
                                
                                <div className="text-right">
                                    <Button type="button" onClick={handleAddItem}>
                                        Añadir Producto
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium">Productos en este registro</h3>
                                <InputError message={errors.items} className="mt-2" />
                                <table className="min-w-full divide-y divide-gray-200 mt-2">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Costo</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {data.items.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                                    Aún no has añadido productos.
                                                </td>
                                            </tr>
                                        )}
                                        {data.items.map((item, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4">{item.product_sku}</td>
                                                <td className="px-6 py-4">{item.product_name}</td>
                                                <td className="px-6 py-4">{item.cantidad}</td>
                                                <td className="px-6 py-4">${item.costo_unitario}</td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveItem(index)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div>
                                <Label htmlFor="fecha_compra">Fecha de Compra (Opcional)</Label>
                                <Input
                                    id="fecha_compra"
                                    name="fecha_compra"
                                    type="date"
                                    value={data.fecha_compra}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setData('fecha_compra', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                <InputError message={errors.fecha_compra} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-end">
                                <Button disabled={processing || data.items.length === 0}>
                                    Guardar Inventario
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