// components/dashboard/RecentOrders.tsx
'use client'


import { Package, Clock, Truck, CheckCircle, XCircle, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'
import { mockOrders } from "@/src/libs/mockData"

const statusIcons = {
	Pending: Clock,
	Confirmed: Package,
	Shipped: Truck,
	Delivered: CheckCircle,
	Cancelled: XCircle,
}

const statusColors = {
	Pending: 'bg-yellow-100 text-yellow-800',
	Confirmed: 'bg-blue-100 text-blue-800',
	Shipped: 'bg-purple-100 text-purple-800',
	Delivered: 'bg-green-100 text-green-800',
	Cancelled: 'bg-red-100 text-red-800',
}

export function RecentOrders() {
	const recentOrders = [ ...mockOrders ].sort((a, b) =>
		new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
	).slice(0, 5)

	return (
		<div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
			<div className="p-6 border-b border-gray-100 flex justify-between items-center">
				<div>
					<h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
					<p className="text-sm text-gray-500">Latest customer orders</p>
				</div>
				<Link href="/orders" className="text-indigo-600 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
					View all <ArrowRight className="w-4 h-4" />
				</Link>
			</div>
			<div className="divide-y divide-gray-100">
				{recentOrders.map((order) => {
					const StatusIcon = statusIcons[ order.status ]
					return (
						<div key={order.id} className="p-5 hover:bg-gray-50 transition-colors cursor-pointer">
							<div className="flex items-center justify-between mb-3">
								<div>
									<p className="font-semibold text-gray-900">{order.orderNumber}</p>
									<p className="text-sm text-gray-500">{order.customerName}</p>
								</div>
								<div className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${statusColors[ order.status ]}`}>
									<StatusIcon className="w-3 h-3" />
									{order.status}
								</div>
							</div>
							<div className="flex items-center justify-between text-sm">
								<span className="text-gray-500">{order.items.length} items</span>
								<span className="font-semibold text-gray-900">${order.totalPrice.toFixed(2)}</span>
								<span className="text-gray-400 text-xs">{format(order.createdAt, 'MMM dd, yyyy')}</span>
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}
