
'use client'
import { Category } from "@/src/types"
import { Search, Filter, X } from 'lucide-react'


interface ProductFiltersProps {
	searchTerm: string
	onSearchChange: (value: string) => void
	selectedCategory: string
	onCategoryChange: (value: string) => void
	categories: Category[]
	showFilters: boolean
	onToggleFilters: () => void
}

export function ProductFilters({
	searchTerm,
	onSearchChange,
	selectedCategory,
	onCategoryChange,
	categories,
	showFilters,
	onToggleFilters,
}: ProductFiltersProps) {
	return (
		<div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
			<div className="flex flex-col sm:flex-row gap-3">
				<div className="flex-1 relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
					<input
						type="text"
						placeholder="Search products..."
						value={searchTerm}
						onChange={(e) => onSearchChange(e.target.value)}
						className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
					/>
				</div>
				{(searchTerm || selectedCategory) && (
					<button
						onClick={() => {
							onSearchChange('')
							onCategoryChange('')
						}}
						className="flex items-center gap-1 px-3 py-2.5 text-gray-500 hover:text-gray-700 rounded-xl transition-colors"
					>
						<X className="w-4 h-4" />
						<span className="text-sm">Clear</span>
					</button>
				)}
			</div>

			{/* Expanded Filters */}
			{showFilters && (
				<div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
							<select
								value={selectedCategory}
								onChange={(e) => onCategoryChange(e.target.value)}
								className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
							>
								<option value="">All Categories</option>
								{categories.map(cat => (
									<option key={cat.id} value={cat.id}>{cat.name}</option>
								))}
							</select>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
