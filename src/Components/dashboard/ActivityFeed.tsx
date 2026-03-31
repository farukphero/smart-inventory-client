// components/dashboard/ActivityFeed.tsx
'use client'


import { Activity } from "@/src/types"
import { format } from 'date-fns'
import { Package, ShoppingCart, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

interface ActivityFeedProps {
	activities: Activity[]
}

const actionIcons = {
	'Order Created': ShoppingCart,
	'Order Updated': CheckCircle,
	'Stock Updated': Package,
	'Low Stock Alert': AlertTriangle,
	'Product Added': Package,
	'Order Status Updated': Clock,
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
	return (
		<div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
			<div className="p-6 border-b border-gray-100">
				<h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
				<p className="text-sm text-gray-500">Latest system actions</p>
			</div>
			<div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
				{activities.map((activity) => {
					const Icon = actionIcons[ activity.action as keyof typeof actionIcons ] || Package
					return (
						<div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
							<div className="flex items-start gap-3">
								<div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
									<Icon className="w-4 h-4 text-indigo-600" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium text-gray-900">{activity.action}</p>
									<p className="text-xs text-gray-500 mt-0.5">{activity.details}</p>
									<p className="text-xs text-gray-400 mt-1">{format(activity.createdAt, 'hh:mm a, MMM dd')}</p>
								</div>
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}
