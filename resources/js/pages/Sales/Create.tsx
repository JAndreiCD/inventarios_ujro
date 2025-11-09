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

interface Product {
    id: number;
    sku: string;
    name: string;
    stock: number;
}

interface SaleItemForm {
    product_id: number | '';
    cantidad: number | '';
    precio_venta: number | '';
    product_name?: string;
    product_sku?: string;
    product_stock?: number;
}

interface CreateSaleProps {
    products: Product[];
}

export default function CreateSale({ products }: CreateSaleProps) {

    const { data, setData, post, processing, errors, reset } = useForm({
        fecha_corte: '',
        items: [] as SaleItemForm[],
    });

    const [currentItem, setCurrentItem] = useState<SaleItemForm>({
        product_id: '',
        cantidad: '',
        precio_venta: '',
        product_name: '',
        product_sku: '',
        product_stock: 0,
    });

    const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentItem(prev => ({ ...prev, [name]: value }));
    };

    const handleAddItem = () => {
        if (!currentItem.product_id || !currentItem.cantidad || !currentItem.precio_venta) {
            alert('Por favor, completa todos los campos del producto.');
            return;
        }

        if (currentItem.product_stock && Number(currentItem.cantidad) > currentItem.product_stock) {
            alert(`Stock insuficiente. Solo hay ${currentItem.product_stock} unidades disponibles.`);
            return;
        }

        setData('items', [...data.items, currentItem]);

        setCurrentItem({
            product_id: '',
            cantidad: '',
            precio_venta: '',
            product_name: '',
            product_sku: '',
            product_stock: 0,
        });
    };

    const handleRemoveItem = (indexToRemove: number) => {
        setData('items', data.items.filter((_, index) => index !== indexToRemove));
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/sales', {
            onSuccess: () => reset(),
        });
    };

    const calculateTotal = () => {
        return data.items.reduce((sum, item) => {
            return sum + (Number(item.cantidad) * Number(item.precio_venta));
        }, 0);
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Inicio', href: '/' },
            { title: 'Afectaciones', href: '/sales' },
            { title: 'Registrar', href: '/sales/create' }
        ]}>
            <Head title="Registrar Afectación" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight mb-6">
                                Registrar Afectación de Almacén (Salidas/Ventas)
                            </h2>
                        
                            <form onSubmit={submit} className="space-y-6">

                                <div className="p-4 border rounded-lg space-y-4">
                                    <h3 className="text-lg font-medium">Añadir Producto Vendido</h3>
                                    
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
                                                        product_stock: selectedProduct?.stock || 0,
                                                    }));
                                                }}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Selecciona un producto..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {products.map((product) => (
                                                        <SelectItem key={product.id} value={product.id.toString()}>
                                                            ({product.sku}) {product.name} - Stock: {product.stock}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {currentItem.product_stock !== undefined && currentItem.product_stock > 0 && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Stock disponible: {currentItem.product_stock}
                                                </p>
                                            )}
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
                                                max={currentItem.product_stock}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="precio_venta">Precio de Venta ($)</Label>
                                            <Input
                                                id="precio_venta"
                                                name="precio_venta"
                                                type="number"
                                                value={currentItem.precio_venta}
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
                                    <h3 className="text-lg font-medium">Productos a afectar</h3>
                                    <InputError message={errors.items} className="mt-2" />
                                    <table className="min-w-full divide-y divide-gray-200 mt-2">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {data.items.length === 0 && (
                                                <tr>
                                                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                                        Aún no has añadido productos.
                                                    </td>
                                                </tr>
                                            )}
                                            {data.items.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="px-6 py-4">{item.product_sku}</td>
                                                    <td className="px-6 py-4">{item.product_name}</td>
                                                    <td className="px-6 py-4">{item.cantidad}</td>
                                                    <td className="px-6 py-4">${item.precio_venta}</td>
                                                    <td className="px-6 py-4">${(Number(item.cantidad) * Number(item.precio_venta)).toFixed(2)}</td>
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
                                            {data.items.length > 0 && (
                                                <tr className="bg-gray-50 font-semibold">
                                                    <td colSpan={4} className="px-6 py-4 text-right">Total:</td>
                                                    <td className="px-6 py-4">${calculateTotal().toFixed(2)}</td>
                                                    <td></td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div>
                                    <Label htmlFor="fecha_corte">Fecha de Corte (Opcional)</Label>
                                    <Input
                                        id="fecha_corte"
                                        name="fecha_corte"
                                        type="date"
                                        value={data.fecha_corte}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setData('fecha_corte', e.target.value)}
                                        className="mt-1 block w-full"
                                    />
                                    <InputError message={errors.fecha_corte} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-end">
                                    <Button disabled={processing || data.items.length === 0}>
                                        Registrar Afectación
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
