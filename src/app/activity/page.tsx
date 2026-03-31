// app/activity/page.tsx
'use client'

import { useState } from 'react'

import { format } from 'date-fns'
import {
	Package,
	ShoppingCart,
	AlertTriangle,
	CheckCircle,
	Clock,
	TrendingUp,
	Filter,
	Search,
	Calendar,
	Download,
	Sidebar
} from 'lucide-react'
import { Header } from "@/src/Components/Header"
import { mockActivities } from "@/src/libs/mockData"
import { DashboardSidebar } from "@/src/Components/Sidebar"

const actionIcons = {
	'Order Created': ShoppingCart,
	'Order Updated': CheckCircle,
	'Stock Updated': Package,
	'Low Stock Alert': AlertTriangle,
	'Product Added': Package,
	'Order Status Updated': Clock,
	'Order Cancelled': AlertTriangle,
	'Product Updated': Package,
	'Stock Alert': AlertTriangle,
}

const actionColors = {
	'Order Created': 'bg-green-100 text-green-600',
	'Order Updated': 'bg-blue-100 text-blue-600',
	'Stock Updated': 'bg-purple-100 text-purple-600',
	'Low Stock Alert': 'bg-red-100 text-red-600',
	'Product Added': 'bg-indigo-100 text-indigo-600',
	'Order Status Updated': 'bg-yellow-100 text-yellow-600',
	'Order Cancelled': 'bg-red-100 text-red-600',
	'Product Updated': 'bg-orange-100 text-orange-600',
	'Stock Alert': 'bg-amber-100 text-amber-600',
}

export default function ActivityPage() {
	const [ searchTerm, setSearchTerm ] = useState('')
	const [ selectedAction, setSelectedAction ] = useState('')
	const [ dateRange, setDateRange ] = useState<'today' | 'week' | 'month' | 'all'>('all')

	const actions = [ ...new Set(mockActivities.map(a => a.action)) ]

	const filteredActivities = mockActivities.filter(activity => {
		const matchesSearch = activity.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
			activity.userName.toLowerCase().includes(searchTerm.toLowerCase())
		const matchesAction = !selectedAction || activity.action === selectedAction

		let matchesDate = true
		const now = new Date()
		const activityDate = new Date(activity.createdAt)

		if (dateRange === 'today') {
			matchesDate = activityDate.toDateString() === now.toDateString()
		} else if (dateRange === 'week') {
			const weekAgo = new Date(now.setDate(now.getDate() - 7))
			matchesDate = activityDate >= weekAgo
		} else if (dateRange === 'month') {
			const monthAgo = new Date(now.setMonth(now.getMonth() - 1))
			matchesDate = activityDate >= monthAgo
		}

		return matchesSearch && matchesAction && matchesDate
	})

	const getDateLabel = (date: Date) => {
		const today = new Date()
		const yesterday = new Date(today)
		yesterday.setDate(yesterday.getDate() - 1)

		if (date.toDateString() === today.toDateString()) return 'Today'
		if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
		return format(date, 'EEEE, MMM dd')
	}

	const groupedActivities = filteredActivities.reduce((groups, activity) => {
		const dateLabel = getDateLabel(activity.createdAt)
		if (!groups[ dateLabel ]) groups[ dateLabel ] = []
		groups[ dateLabel ].push(activity)
		return groups
	}, {} as Record<string, typeof mockActivities>)

	return (
		<div className="min-h-screen bg-gray-50">
			<DashboardSidebar />
			<div className="lg:ml-72">
				<Header />
				<main className="p-6 lg:p-8">
					{/* Header */}
					<div className="mb-8">
						<h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Activity Log</h1>
						<p className="text-gray-500 mt-1">Track all system actions and user activities</p>
					</div>

					{/* Stats Summary */}
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
						<div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-2xl font-bold text-gray-900">{mockActivities.length}</p>
									<p className="text-xs text-gray-500">Total Events</p>
								</div>
								<div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
									<Clock className="w-5 h-5 text-indigo-600" />
								</div>
							</div>
						</div>
						<div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-2xl font-bold text-gray-900">
										{mockActivities.filter(a => a.action.includes('Order')).length}
									</p>
									<p className="text-xs text-gray-500">Order Events</p>
								</div>
								<div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
									<ShoppingCart className="w-5 h-5 text-green-600" />
								</div>
							</div>
						</div>
						<div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-2xl font-bold text-gray-900">
										{mockActivities.filter(a => a.action.includes('Stock')).length}
									</p>
									<p className="text-xs text-gray-500">Stock Events</p>
								</div>
								<div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
									<Package className="w-5 h-5 text-purple-600" />
								</div>
							</div>
						</div>
						<div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-2xl font-bold text-gray-900">
										{mockActivities.filter(a => a.action.includes('Alert')).length}
									</p>
									<p className="text-xs text-gray-500">Alerts</p>
								</div>
								<div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
									<AlertTriangle className="w-5 h-5 text-red-600" />
								</div>
							</div>
						</div>
					</div>

					{/* Filters */}
					<div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
						<div className="flex flex-col lg:flex-row gap-4">
							<div className="flex-1 relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
								<input
									type="text"
									placeholder="Search activities..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
								/>
							</div>

							<div className="lg:w-56 relative">
								<Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
								<select
									value={selectedAction}
									onChange={(e) => setSelectedAction(e.target.value)}
									className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
								>
									<option value="">All Actions</option>
									{actions.map(action => (
										<option key={action} value={action}>{action}</option>
									))}
								</select>
							</div>

							<div className="lg:w-48 relative">
								<Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
								<select
									value={dateRange}
									onChange={(e) => setDateRange(e.target.value as any)}
									className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
								>
									<option value="all">All Time</option>
									<option value="today">Today</option>
									<option value="week">Last 7 Days</option>
									<option value="month">Last 30 Days</option>
								</select>
							</div>

							{(searchTerm || selectedAction || dateRange !== 'all') && (
								<button
									onClick={() => {
										setSearchTerm('')
										setSelectedAction('')
										setDateRange('all')
									}}
									className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
								>
									Clear Filters
								</button>
							)}
						</div>
					</div>

					{/* Results Count */}
					<div className="mb-4 text-sm text-gray-500">
						Showing {filteredActivities.length} activities
					</div>

					{/* Activity Timeline */}
					{filteredActivities.length === 0 ? (
						<div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
							<Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
							<p className="text-gray-500">No activities found</p>
							<p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
						</div>
					) : (
						<div className="space-y-6">
							{Object.entries(groupedActivities).map(([ dateLabel, activities ]) => (
								<div key={dateLabel}>
									<div className="flex items-center gap-3 mb-4">
										<div className="w-2 h-2 bg-indigo-500 rounded-full" />
										<h2 className="text-lg font-semibold text-gray-800">{dateLabel}</h2>
										<div className="flex-1 h-px bg-gray-200" />
										<span className="text-xs text-gray-400">{activities.length} events</span>
									</div>

									<div className="space-y-3">
										{activities.map((activity) => {
											const Icon = actionIcons[ activity.action as keyof typeof actionIcons ] || TrendingUp
											const colorClass = actionColors[ activity.action as keyof typeof actionColors ] || 'bg-gray-100 text-gray-600'

											return (
												<div
													key={activity.id}
													className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all group"
												>
													<div className="flex items-start gap-4">
														<div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
															<Icon className="w-6 h-6" />
														</div>
														<div className="flex-1 min-w-0">
															<div className="flex flex-wrap items-start justify-between gap-2 mb-2">
																<div>
																	<h3 className="font-semibold text-gray-900">{activity.action}</h3>
																	<p className="text-sm text-gray-600 mt-1">{activity.details}</p>
																</div>
																<div className="text-right">
																	<p className="text-sm font-medium text-gray-900">{activity.userName}</p>
																	<p className="text-xs text-gray-400">{format(activity.createdAt, 'hh:mm a')}</p>
																</div>
															</div>
															<div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
																<div className="flex items-center gap-1 text-xs text-gray-400">
																	<Clock className="w-3 h-3" />
																	{format(activity.createdAt, 'MMM dd, yyyy')}
																</div>
																<div className="text-xs text-gray-400">
																	User ID: {activity.userId}
																</div>
															</div>
														</div>
													</div>
												</div>
											)
										})}
									</div>
								</div>
							))}
						</div>
					)}

					{/* Export Button */}
					{filteredActivities.length > 0 && (
						<div className="mt-8 flex justify-end">
							<button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
								<Download className="w-4 h-4" />
								Export Activity Log
							</button>
						</div>
					)}
				</main>
			</div>
		</div>
	)
}
