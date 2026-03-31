// components/dashboard/StatsCard.tsx
'use client'

import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
	title: string
	value: string | number
	icon: LucideIcon
	trend?: number
	color: string
}

export function StatsCard({ title, value, icon: Icon, trend, color }: StatsCardProps) {
	return (
		<div className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm text-gray-500 mb-1">{title}</p>
					<p className="text-2xl font-bold text-gray-900">{value}</p>
					{trend !== undefined && (
						<p className={`text-xs mt-2 flex items-center gap-1 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
							{trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
						</p>
					)}
				</div>
				<div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
					<Icon className="w-6 h-6 text-white" />
				</div>
			</div>
		</div>
	)
}
