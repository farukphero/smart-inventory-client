// components/dashboard/LowStockAlert.tsx
'use client'


import { mockProducts } from "@/src/libs/mockData"
import { AlertTriangle, Package, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function LowStockAlert() {
	const lowStockProducts = mockProducts.filter(p => p.status === 'Low Stock')

	return (
		<div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
			<div className="p-6 border-b border-gray-100">
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-lg font-semibold text-gray-900">Low Stock Alert</h3>
						<p className="text-sm text-gray-500">Products needing restock</p>
					</div>
					<AlertTriangle className="w-5 h-5 text-amber-500" />
				</div>
			</div>
			<div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
				{lowStockProducts.length === 0 ? (
					<div className="p-12 text-center">
						<Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
						<p className="text-gray-500">All products are well stocked</p>
						<p className="text-sm text-gray-400 mt-1">No items need attention</p>
					</div>
				) : (
					lowStockProducts.map((product) => (
						<div key={product.id} className="p-4 hover:bg-gray-50 transition-colors">
							<div className="flex items-center justify-between mb-2">
								<div>
									<p className="font-medium text-gray-900">{product.name}</p>
									<p className="text-sm text-gray-500">{product.category}</p>
								</div>
								<div className="text-right">
									<p className="text-red-600 font-semibold">{product.stockQuantity} left</p>
									<p className="text-xs text-gray-400">Threshold: {product.minStockThreshold}</p>
								</div>
							</div>
							<div className="mt-2 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
								<div
									className="bg-gradient-to-r from-red-500 to-orange-500 h-1.5 rounded-full transition-all"
									style={{ width: `${Math.min((product.stockQuantity / product.minStockThreshold) * 100, 100)}%` }}
								/>
							</div>
						</div>
					))
				)}
			</div>
			<div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
				<Link href="/products" className="text-indigo-600 text-sm font-medium flex items-center justify-center gap-1 hover:gap-2 transition-all">
					View all products <ArrowRight className="w-4 h-4" />
				</Link>
			</div>
		</div>
	)
}
