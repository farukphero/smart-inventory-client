// components/dashboard/RevenueChart.tsx
'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Calendar } from 'lucide-react'

const data = [
	{ name: 'Mon', revenue: 4200, orders: 24 },
	{ name: 'Tue', revenue: 5800, orders: 32 },
	{ name: 'Wed', revenue: 4900, orders: 28 },
	{ name: 'Thu', revenue: 7100, orders: 41 },
	{ name: 'Fri', revenue: 8600, orders: 53 },
	{ name: 'Sat', revenue: 6800, orders: 38 },
	{ name: 'Sun', revenue: 5300, orders: 29 },
]

export function RevenueChart() {
	return (
		<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
					<p className="text-sm text-gray-500">Weekly revenue and order trends</p>
				</div>
				<div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
					<TrendingUp className="w-4 h-4" />
					<span className="text-sm font-medium">+12.5%</span>
				</div>
			</div>
			<ResponsiveContainer width="100%" height={320}>
				<AreaChart data={data}>
					<defs>
						<linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
							<stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
						</linearGradient>
					</defs>
					<CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
					<XAxis dataKey="name" stroke="#94a3b8" fontSize={12} axisLine={false} tickLine={false} />
					<YAxis stroke="#94a3b8" fontSize={12} axisLine={false} tickLine={false} />
					<Tooltip
						contentStyle={{
							backgroundColor: '#fff',
							border: 'none',
							borderRadius: '12px',
							boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
							padding: '8px 12px',
						}}
					/>
					<Area
						type="monotone"
						dataKey="revenue"
						stroke="#6366f1"
						strokeWidth={2}
						fill="url(#colorRevenue)"
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	)
}
