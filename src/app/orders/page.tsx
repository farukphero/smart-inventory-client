// app/orders/page.tsx
'use client'

import { useState } from 'react'

import { Plus, Search, Filter, ClipboardList, Sidebar } from 'lucide-react'
import { Header } from "@/src/Components/Header"
import { CreateOrderModal } from "@/src/Components/orders/CreateOrderModal"
import { OrderCard } from "@/src/Components/orders/OrderCard"
import { mockOrders } from "@/src/libs/mockData"
import { DashboardSidebar } from "@/src/Components/Sidebar"

export default function OrdersPage() {
	const [ orders, setOrders ] = useState(mockOrders)
	const [ searchTerm, setSearchTerm ] = useState('')
	const [ statusFilter, setStatusFilter ] = useState('')
	const [ showCreateModal, setShowCreateModal ] = useState(false)

	const filteredOrders = orders.filter(order => {
		const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
		const matchesStatus = !statusFilter || order.status === statusFilter
		return matchesSearch && matchesStatus
	})

	const handleUpdateOrder = (updatedOrder: any) => {
		setOrders(orders.map(o => o.id === updatedOrder.id ? updatedOrder : o))
	}

	const handleCreateOrder = (newOrder: any) => {
		setOrders([ newOrder, ...orders ])
	}

	const statuses = [ 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled' ]

	return (
		<div className="min-h-screen bg-gray-50">
			<DashboardSidebar />
			<div className="lg:ml-72">
				<Header />
				<main className="p-6 lg:p-8">
					{/* Header */}
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
						<div>
							<h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Orders</h1>
							<p className="text-gray-500 mt-1">Manage customer orders</p>
						</div>
						<button
							onClick={() => setShowCreateModal(true)}
							className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-[1.02] transition-all"
						>
							<Plus className="w-5 h-5" />
							Create Order
						</button>
					</div>

					{/* Filters */}
					<div className="flex flex-col sm:flex-row gap-4 mb-6">
						<div className="flex-1 relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
							<input
								type="text"
								placeholder="Search by order number or customer..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
							/>
						</div>
						<div className="sm:w-64 relative">
							<Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
							<select
								value={statusFilter}
								onChange={(e) => setStatusFilter(e.target.value)}
								className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
							>
								<option value="">All Status</option>
								{statuses.map(status => (
									<option key={status} value={status}>{status}</option>
								))}
							</select>
						</div>
					</div>

					{/* Results Count */}
					<div className="mb-4 text-sm text-gray-500">
						Found {filteredOrders.length} orders
					</div>

					{/* Orders List */}
					{filteredOrders.length === 0 ? (
						<div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
							<ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
							<p className="text-gray-500">No orders found</p>
							<p className="text-sm text-gray-400 mt-1">Create your first order to get started</p>
						</div>
					) : (
						<div className="space-y-4">
							{filteredOrders.map((order) => (
								<OrderCard key={order.id} order={order} onUpdate={handleUpdateOrder} />
							))}
						</div>
					)}

					{/* Create Order Modal */}
					<CreateOrderModal
						isOpen={showCreateModal}
						onClose={() => setShowCreateModal(false)}
						onOrderCreated={handleCreateOrder}
					/>
				</main>
			</div>
		</div>
	)
}
