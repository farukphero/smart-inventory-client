// app/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { DollarSign, ShoppingBag, Package, AlertTriangle, Clock, Sidebar } from 'lucide-react'
import { getDashboardStats, mockActivities } from "@/src/libs/mockData"
import { Header } from "@/src/Components/Header"
import { StatsCard } from "@/src/Components/dashboard/StatsCard"
import { RevenueChart } from "@/src/Components/dashboard/RevenueChart"
import { LowStockAlert } from "@/src/Components/dashboard/LowStockAlert"
import { RecentOrders } from "@/src/Components/dashboard/RecentOrders"
import { ActivityFeed } from "@/src/Components/dashboard/ActivityFeed"
import { DashboardSidebar } from "@/src/Components/Sidebar"

export default function DashboardPage() {
	const [ stats, setStats ] = useState<any>(null)
	const [ recentActivities, setRecentActivities ] = useState(mockActivities.slice(0, 6))

	useEffect(() => {
		setStats(getDashboardStats())
	}, [])

	if (!stats) {
		return (
			<div className="min-h-screen bg-gray-50">
				<DashboardSidebar />
				<div className="lg:ml-72">
					<Header />
					<div className="p-8 flex items-center justify-center h-96">
						<div className="text-center">
							<div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
							<p className="text-gray-500">Loading dashboard...</p>
						</div>
					</div>
				</div>
			</div>
		)
	}

	const statCards = [
		{ title: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, trend: stats.revenueChange, color: 'from-emerald-500 to-green-600' },
		{ title: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, trend: stats.ordersChange, color: 'from-blue-500 to-indigo-600' },
		{ title: 'Products', value: stats.totalProducts, icon: Package, color: 'from-purple-500 to-pink-600' },
		{ title: 'Low Stock', value: stats.lowStockCount, icon: AlertTriangle, color: 'from-orange-500 to-red-600' },
		{ title: 'Pending Orders', value: stats.pendingOrders, icon: Clock, color: 'from-yellow-500 to-amber-600' },
	]

	return (
		<div className="min-h-screen bg-gray-50">
			<DashboardSidebar />
			<div className="lg:ml-72">
				<Header />
				<main className="p-6 lg:p-8">
					{/* Welcome Section */}
					<div className="mb-8">
						<h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
						<p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your inventory today.</p>
					</div>

					{/* Stats Grid */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
						{statCards.map((card, index) => (
							<StatsCard key={index} {...card} />
						))}
					</div>

					{/* Charts and Alerts */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
						<div className="lg:col-span-2">
							<RevenueChart />
						</div>
						<div>
							<LowStockAlert />
						</div>
					</div>

					{/* Recent Orders and Activity */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						<div className="lg:col-span-2">
							<RecentOrders />
						</div>
						<div>
							<ActivityFeed activities={recentActivities} />
						</div>
					</div>
				</main>
			</div>
		</div>
	)
}
