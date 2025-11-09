import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

// --- 1. Definición de Tipos ---

interface User {
    id: number;
    name: string;
}

// El tipo de un solo registro de venta (afectación)
interface Sale {
    id: number;
    fecha_corte: string;
    total_vendido: number;
    user: User; // El usuario que lo registró
    items_count: number; // El conteo de productos vendidos
}

// El tipo para los datos paginados
interface PaginatedData<T> {
    data: T[];
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        to: number;
        total: number;
    };
}

// Las props que recibe la página
interface SaleIndexProps {
    sales: PaginatedData<Sale>;
    auth: any;
}

// --- 2. Componente de Paginación Simple (Helper) ---
const Pagination = ({ meta, links }: PaginatedData<any>) {
    if (meta.total <= meta.per_page) return null;

    return (
        <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-gray-700">
                Mostrando {meta.from} a {meta.to} de {meta.total} resultados
            </span>
            <div className="flex gap-2">
                {links.prev && (
                    <Link
                        href={links.prev}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Anterior
                    </Link>
                )}
                {links.next && (
                    <Link
                        href={links.next}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Siguiente
                    </Link>
                )}
            </div>
        </div>
    );
};


// --- 3. Componente Principal de la Página ---

export default function SaleIndex({ sales }: SaleIndexProps) {

    // Función para formatear la fecha
    const formatDate = (datetime: string) => {
        return new Date(datetime).toLocaleString('es-MX', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    };
    
    // Función para formatear dinero
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(amount);
    };

    return (
        <AppLayout
            title="Visualizador de Afectaciones"
            renderHeader={() => (
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Módulo 4: Visualizador Afectaciones Almacén (Salidas)
                </h2>
            )}
        >
            <Head title="Reporte de Afectaciones" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                        <div className="p-6">
                            
                            {/* --- Tabla de Reporte --- */}
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {/* Columnas de tu imagen 4 */}
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha del Corte</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Productos Vendidos</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Vendido $</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {sales.data.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                                No se encontraron registros de afectaciones.
                                            </td>
                                        </tr>
                                    )}
                                    {sales.data.map((sale) => (
                                        <tr key={sale.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{formatDate(sale.fecha_corte)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{sale.user.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{sale.items_count}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(sale.total_vendido)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {/* Botón "BOTON VER (PARA VER LOS PRODUCTOS VENDIDOS)" */}
                                                <button className="text-indigo-600 hover:text-indigo-900">
                                                    Ver Detalle
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* --- Paginación --- */}
                            <Pagination meta={sales.meta} links={sales.links} />

                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}