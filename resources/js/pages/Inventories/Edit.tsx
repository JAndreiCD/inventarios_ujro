import React, { useState, FormEvent } from 'react';
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
    fecha_inventario: string;
    total_costo: number;
    items: InventoryItem[];
}

interface InventoryItemForm {
    product_id: number | '';
    cantidad: number | '';
    costo_unitario: number | '';
    product_name?: string;
    product_sku?: string;
}

interface EditInventoryProps {
    inventory: Inventory;
    products: Product[];
}

export default function EditInventory({ inventory, products }: EditInventoryProps) {
    // Convertir items existentes al formato del formulario
    const initialItems: InventoryItemForm[] = inventory.items.map(item => ({
        product_id: item.product_id,
        cantidad: item.cantidad,
        costo_unitario: item.costo_unitario,
        product_name: item.product.name,
        product_sku: item.product.sku,
    }));

    const { data, setData, put, processing, errors } = useForm({
        fecha_compra: inventory.items[0]?.fecha_compra || '',
        items: initialItems,
    });

    const [currentItem, setCurrentItem] = useState<InventoryItemForm>({
        product_id: '',
        cantidad: '',
        costo_unitario: '',
        product_name: '',
        product_sku: '',
    });

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
        put(`/inventories/${inventory.id}`);
    };

    const totalCosto = data.items.reduce((sum, item) => {
        return sum + (Number(item.cantidad) * Number(item.costo_unitario));
    }, 0);

    return (
        <AppLayout breadcrumbs={[
            { title: 'Inicio', href: '/' },
            { title: 'Inventarios', href: '/inventories' },
            { title: `Inventario #${inventory.id}`, href: `/inventories/${inventory.id}` },
            { title: 'Editar', href: `/inventories/${inventory.id}/edit` }
        ]}>
            <Head title={`Editar Inventario #${inventory.id}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight mb-6">
                                Editar Inventario #{inventory.id}
                            </h2>

                            <form onSubmit={submit}>
                                <div className="mb-6">
                                    <Label htmlFor="fecha_compra">Fecha de Compra (Opcional)</Label>
                                    <Input
                                        id="fecha_compra"
                                        type="date"
                                        value={data.fecha_compra}
                                        onChange={(e) => setData('fecha_compra', e.target.value)}
                                    />
                                    <InputError message={errors.fecha_compra} />
                                </div>

                                <div className="border rounded-lg p-4 mb-6 bg-gray-50">
                                    <h3 className="font-semibold text-lg mb-4">Agregar Producto</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div>
                                            <Label htmlFor="product_id">Producto</Label>
                                            <Select
                                                value={currentItem.product_id?.toString() || ''}
                                                onValueChange={(value) => {
                                                    const selectedProduct = products.find(p => p.id === Number(value));
                                                    setCurrentItem({
                                                        ...currentItem,
                                                        product_id: Number(value),
                                                        product_name: selectedProduct?.name || '',
                                                        product_sku: selectedProduct?.sku || '',
                                                    });
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona un producto" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {products.map((product) => (
                                                        <SelectItem key={product.id} value={product.id.toString()}>
                                                            {product.sku} - {product.name}
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
                                                step="0.01"
                                                min="0"
                                                value={currentItem.cantidad}
                                                onChange={handleItemChange}
                                                placeholder="0"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="costo_unitario">Costo Unitario</Label>
                                            <Input
                                                id="costo_unitario"
                                                name="costo_unitario"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={currentItem.costo_unitario}
                                                onChange={handleItemChange}
                                                placeholder="0.00"
                                            />
                                        </div>

                                        <div className="flex items-end">
                                            <Button type="button" onClick={handleAddItem} className="w-full">
                                                Agregar
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {data.items.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="font-semibold text-lg mb-4">Productos Agregados</h3>
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Costo Unit.</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Acción</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {data.items.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className="px-4 py-2">{item.product_sku}</td>
                                                        <td className="px-4 py-2">{item.product_name}</td>
                                                        <td className="px-4 py-2">{item.cantidad}</td>
                                                        <td className="px-4 py-2">${Number(item.costo_unitario).toFixed(2)}</td>
                                                        <td className="px-4 py-2 font-semibold">
                                                            ${(Number(item.cantidad) * Number(item.costo_unitario)).toFixed(2)}
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            <Button
                                                                type="button"
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => handleRemoveItem(index)}
                                                            >
                                                                Quitar
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot className="bg-gray-50">
                                                <tr>
                                                    <td colSpan={4} className="px-4 py-2 text-right font-bold">Total:</td>
                                                    <td className="px-4 py-2 font-bold text-green-600">
                                                        ${totalCosto.toFixed(2)}
                                                    </td>
                                                    <td></td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                )}

                                <div className="flex justify-end gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button type="submit" disabled={processing || data.items.length === 0}>
                                        Actualizar Inventario
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
