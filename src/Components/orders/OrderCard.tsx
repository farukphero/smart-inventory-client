// components/orders/OrderCard.tsx
'use client'

import { useState } from 'react'

import { Package, ChevronDown, ChevronUp, Truck, CheckCircle, XCircle, Clock, Send, ShoppingBag } from 'lucide-react'
import { format } from 'date-fns'
import { Order } from "@/src/types"

interface OrderCardProps {
	order: Order
	onUpdate: (order: Order) => void
}

const statusColors = {
	Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
	Confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
	Shipped: 'bg-purple-100 text-purple-800 border-purple-200',
	Delivered: 'bg-green-100 text-green-800 border-green-200',
	Cancelled: 'bg-red-100 text-red-800 border-red-200',
}

const statusIcons = {
	Pending: Clock,
	Confirmed: ShoppingBag,
	Shipped: Truck,
	Delivered: CheckCircle,
	Cancelled: XCircle,
}

const nextStatuses = {
	Pending: 'Confirmed',
	Confirmed: 'Shipped',
	Shipped: 'Delivered',
}

export function OrderCard({ order, onUpdate }: OrderCardProps) {
	const [ expanded, setExpanded ] = useState(false)
	const StatusIcon = statusIcons[ order.status ]

	const handleStatusUpdate = (newStatus: any) => {
		onUpdate({ ...order, status: newStatus, updatedAt: new Date() })
	}

	const handleCancel = () => {
		if (confirm('Cancel this order? This action cannot be undone.')) {
			onUpdate({ ...order, status: 'Cancelled', updatedAt: new Date() })
		}
	}

	return (
		<div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
			<div className="p-5 lg:p-6">
				<div className="flex flex-wrap items-center justify-between gap-4">
					<div className="flex items-center gap-4">
						<div className={`p-3 rounded-xl ${statusColors[ order.status ]}`}>
							<StatusIcon className="w-5 h-5" />
						</div>
						<div>
							<p className="font-semibold text-gray-900 text-lg">{order.orderNumber}</p>
							<p className="text-sm text-gray-500">{order.customerName}</p>
						</div>
					</div>
					<div className="flex items-center gap-6">
						<div className="text-right">
							<p className="text-2xl font-bold text-gray-900">${order.totalPrice.toFixed(2)}</p>
							<p className="text-xs text-gray-400">{format(order.createdAt, 'MMM dd, yyyy')}</p>
						</div>
						<button
							onClick={() => setExpanded(!expanded)}
							className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
						>
							{expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
						</button>
					</div>
				</div>

				{expanded && (
					<div className="mt-6 pt-6 border-t border-gray-100 animate-fade-in">
						{/* Items */}
						<div className="mb-5">
							<h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
								<Package className="w-4 h-4" />
								Order Items
							</h4>
							<div className="space-y-2 bg-gray-50 rounded-xl p-4">
								{order.items.map((item, idx) => (
									<div key={idx} className="flex justify-between text-sm">
										<span className="text-gray-600">{item.productName} × {item.quantity}</span>
										<span className="font-medium text-gray-900">${item.total.toFixed(2)}</span>
									</div>
								))}
								<div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-semibold">
									<span>Total</span>
									<span>${order.totalPrice.toFixed(2)}</span>
								</div>
							</div>
						</div>

						{/* Customer Info */}
						{(order.customerEmail || order.customerPhone) && (
							<div className="mb-5">
								<h4 className="text-sm font-medium text-gray-700 mb-2">Customer Information</h4>
								<div className="space-y-1 text-sm text-gray-600">
									{order.customerEmail && <p>📧 {order.customerEmail}</p>}
									{order.customerPhone && <p>📞 {order.customerPhone}</p>}
								</div>
							</div>
						)}

						{/* Actions */}
						{order.status !== 'Cancelled' && order.status !== 'Delivered' && (
							<div className="flex flex-wrap gap-3">
								{nextStatuses[ order.status as keyof typeof nextStatuses ] && (
									<button
										onClick={() => handleStatusUpdate(nextStatuses[ order.status as keyof typeof nextStatuses ])}
										className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all"
									>
										<Send className="w-4 h-4" />
										Mark as {nextStatuses[ order.status as keyof typeof nextStatuses ]}
									</button>
								)}
								<button
									onClick={handleCancel}
									className="px-4 py-2.5 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 transition-all"
								>
									Cancel Order
								</button>
							</div>
						)}

						{order.status === 'Delivered' && (
							<div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-xl">
								<CheckCircle className="w-5 h-5" />
								<span className="text-sm font-medium">Order completed successfully</span>
							</div>
						)}

						{order.status === 'Cancelled' && (
							<div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl">
								<XCircle className="w-5 h-5" />
								<span className="text-sm font-medium">Order has been cancelled</span>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	)
}
