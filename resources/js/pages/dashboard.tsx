import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Package, DollarSign, AlertTriangle, TrendingUp, LucideIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface ChartDataItem {
    date: string;
    entradas: number;
    salidas: number;
}

interface TopProduct {
    nombre: string;
    total_vendido: number;
}

interface Stats {
    totalProducts: number;
    totalInventoryValue: number;
    lowStockProducts: number;
}

interface DashboardProps {
    stats: Stats;
    chartData: ChartDataItem[];
    topProducts: TopProduct[];
}

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    color: string;
}

const StatCard = ({ title, value, icon: Icon, color }: StatCardProps) => (
    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-gray-800">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
            </div>
            <div className={`rounded-full p-3 ${color}`}>
                <Icon className="h-6 w-6 text-white" />
            </div>
        </div>
    </div>
);

export default function Dashboard({ stats, chartData, topProducts }: DashboardProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(amount);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Tarjetas de Estadísticas */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <StatCard
                        title="Total de Productos"
                        value={stats.totalProducts}
                        icon={Package}
                        color="bg-blue-500"
                    />
                    <StatCard
                        title="Valor del Inventario"
                        value={formatCurrency(stats.totalInventoryValue)}
                        icon={DollarSign}
                        color="bg-green-500"
                    />
                    <StatCard
                        title="Stock Bajo (<10)"
                        value={stats.lowStockProducts}
                        icon={AlertTriangle}
                        color="bg-red-500"
                    />
                </div>

                {/* Gráfica de Movimientos */}
                <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-gray-800">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                        Movimientos de Inventario - Últimos 7 Días
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip 
                                formatter={(value) => formatCurrency(Number(value))}
                                contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }}
                            />
                            <Legend />
                            <Bar dataKey="entradas" fill="#10b981" name="Entradas" />
                            <Bar dataKey="salidas" fill="#ef4444" name="Salidas" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Productos Más Vendidos */}
                <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-gray-800">
                    <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
                        <TrendingUp className="mr-2 h-5 w-5" />
                        Top 5 Productos Más Vendidos
                    </h3>
                    <div className="space-y-3">
                        {topProducts.length === 0 ? (
                            <p className="text-center text-gray-500">No hay datos de ventas aún</p>
                        ) : (
                            topProducts.map((product, index) => (
                                <div key={index} className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
                                            {index + 1}
                                        </span>
                                        <span className="font-medium text-gray-900 dark:text-white">{product.nombre}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                                        {product.total_vendido} unidades
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
