// components/products/ProductCard.tsx
'use client'


import { Product } from "@/src/types"
import { Edit2, Trash2, TrendingDown, CheckCircle } from 'lucide-react'

interface ProductCardProps {
	product: Product
	onEdit?: () => void
	onDelete?: () => void
}

const statusColors = {
	Active: 'bg-green-100 text-green-800',
	'Low Stock': 'bg-yellow-100 text-yellow-800',
	'Out of Stock': 'bg-red-100 text-red-800',
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
	const stockPercentage = (product.stockQuantity / product.minStockThreshold) * 100

	return (
		<div className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
			<div className="p-5">
				{/* Header */}
				<div className="flex justify-between items-start mb-3">
					<div>
						<h3 className="font-semibold text-gray-900 text-lg">{product.name}</h3>
						<p className="text-sm text-gray-500">{product.category}</p>
					</div>
					<div className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[ product.status ]}`}>
						{product.status === 'Low Stock' && <TrendingDown className="w-3 h-3 inline mr-1" />}
						{product.status === 'Active' && <CheckCircle className="w-3 h-3 inline mr-1" />}
						{product.status}
					</div>
				</div>

				{/* Price */}
				<div className="mb-4">
					<p className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
					<p className="text-xs text-gray-400 mt-1">SKU: {product.sku}</p>
				</div>

				{/* Stock */}
				<div className="mb-4">
					<div className="flex justify-between text-sm mb-1.5">
						<span className="text-gray-600">Stock Level</span>
						<span className={`font-medium ${product.stockQuantity <= product.minStockThreshold ? 'text-red-600' : 'text-gray-900'}`}>
							{product.stockQuantity} / {product.minStockThreshold}
						</span>
					</div>
					<div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
						<div
							className={`h-2 rounded-full transition-all duration-500 ${product.stockQuantity <= product.minStockThreshold ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'
								}`}
							style={{ width: `${Math.min(stockPercentage, 100)}%` }}
						/>
					</div>
				</div>

				{/* Actions */}
				{(onEdit || onDelete) && (
					<div className="flex gap-2 pt-3 border-t border-gray-100">
						{onEdit && (
							<button
								onClick={onEdit}
								className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
							>
								<Edit2 className="w-4 h-4" />
								<span className="text-sm font-medium">Edit</span>
							</button>
						)}
						{onDelete && (
							<button
								onClick={onDelete}
								className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
							>
								<Trash2 className="w-4 h-4" />
								<span className="text-sm font-medium">Delete</span>
							</button>
						)}
					</div>
				)}
			</div>
		</div>
	)
}
