// app/categories/page.tsx
'use client'

import { useState } from 'react'

import { Plus, Edit2, Trash2, Package, Grid3x3, Sidebar } from 'lucide-react'
import { Header } from "@/src/Components/Header"
import { useAuth } from "@/src/contexts/AuthContext"
import { mockCategories } from "@/src/libs/mockData"
import { DashboardSidebar } from "@/src/Components/Sidebar"

export default function CategoriesPage() {
	const { isAdmin } = useAuth()
	const [ categories, setCategories ] = useState(mockCategories)
	const [ showModal, setShowModal ] = useState(false)
	const [ editingCategory, setEditingCategory ] = useState<any>(null)
	const [ categoryName, setCategoryName ] = useState('')
	const [ categoryColor, setCategoryColor ] = useState('#6366f1')
	const [ categoryIcon, setCategoryIcon ] = useState('📦')

	const icons = [ '📱', '👕', '🍎', '🪑', '📚', '💄', '🎮', '🏠', '⚡', '🎵' ]

	const handleSave = () => {
		if (!categoryName.trim()) return

		if (editingCategory) {
			setCategories(categories.map(c =>
				c.id === editingCategory.id
					? { ...c, name: categoryName, color: categoryColor, icon: categoryIcon }
					: c
			))
		} else {
			setCategories([ ...categories, {
				id: Date.now().toString(),
				name: categoryName,
				color: categoryColor,
				icon: categoryIcon,
				productCount: 0,
			} ])
		}
		setShowModal(false)
		setEditingCategory(null)
		setCategoryName('')
		setCategoryColor('#6366f1')
		setCategoryIcon('📦')
	}

	const handleDelete = (id: string) => {
		const category = categories.find(c => c.id === id)
		if (category && category.productCount > 0) {
			alert(`Cannot delete category with ${category.productCount} products. Please reassign or delete products first.`)
			return
		}
		if (confirm('Delete this category?')) {
			setCategories(categories.filter(c => c.id !== id))
		}
	}

	const handleEdit = (category: any) => {
		setEditingCategory(category)
		setCategoryName(category.name)
		setCategoryColor(category.color)
		setCategoryIcon(category.icon)
		setShowModal(true)
	}

	// if (!isAdmin) {
	// 	return (
	// 		<div className="min-h-screen bg-gray-50">
	// 			<DashboardSidebar />
	// 			<div className="lg:ml-72">
	// 				<Header />
	// 				<main className="p-8">
	// 					<div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
	// 						<Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
	// 						<p className="text-gray-500">Access denied. Admin only.</p>
	// 						<p className="text-sm text-gray-400 mt-1">You need administrator privileges to manage categories.</p>
	// 					</div>
	// 				</main>
	// 			</div>
	// 		</div>
	// 	)
	// }

	return (
		<div className="min-h-screen bg-gray-50">
			<DashboardSidebar />
			<div className="lg:ml-72">
				<Header />
				<main className="p-6 lg:p-8">
					{/* Header */}
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
						<div>
							<h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Categories</h1>
							<p className="text-gray-500 mt-1">Manage product categories</p>
						</div>
						<button
							onClick={() => {
								setEditingCategory(null)
								setCategoryName('')
								setCategoryColor('#6366f1')
								setCategoryIcon('📦')
								setShowModal(true)
							}}
							className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-[1.02] transition-all"
						>
							<Plus className="w-5 h-5" />
							Add Category
						</button>
					</div>

					{/* Categories Grid */}
					{categories.length === 0 ? (
						<div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
							<Grid3x3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
							<p className="text-gray-500">No categories yet</p>
							<p className="text-sm text-gray-400 mt-1">Create your first category to organize products</p>
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
							{categories.map((category) => (
								<div key={category.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden">
									<div className="p-6">
										<div className="flex items-center justify-between mb-4">
											<div
												className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-transform group-hover:scale-110"
												style={{ backgroundColor: `${category.color}15` }}
											>
												{category.icon}
											</div>
											<div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
												<button
													onClick={() => handleEdit(category)}
													className="p-2 text-gray-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50"
												>
													<Edit2 className="w-4 h-4" />
												</button>
												<button
													onClick={() => handleDelete(category.id)}
													className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
												>
													<Trash2 className="w-4 h-4" />
												</button>
											</div>
										</div>
										<div>
											<h3 className="font-semibold text-gray-900 text-lg">{category.name}</h3>
											<p className="text-sm text-gray-500 mt-1">{category.productCount} products</p>
										</div>
										<div className="mt-4">
											<div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
												<div
													className="h-1.5 rounded-full transition-all duration-500"
													style={{ width: `${Math.min((category.productCount / 20) * 100, 100)}%`, backgroundColor: category.color }}
												/>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					)}

					{/* Modal */}
					{showModal && (
						<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
							<div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
								<div className="p-6 border-b border-gray-100">
									<h2 className="text-xl font-semibold text-gray-900">{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
									<p className="text-sm text-gray-500 mt-1">Create a category to organize your products</p>
								</div>
								<div className="p-6 space-y-5">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
										<input
											type="text"
											value={categoryName}
											onChange={(e) => setCategoryName(e.target.value)}
											className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
											placeholder="e.g., Electronics"
											autoFocus
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
										<div className="grid grid-cols-5 gap-2">
											{icons.map(icon => (
												<button
													key={icon}
													type="button"
													onClick={() => setCategoryIcon(icon)}
													className={`text-2xl p-2 rounded-xl transition-all ${categoryIcon === icon
														? 'bg-indigo-100 ring-2 ring-indigo-500 scale-105'
														: 'bg-gray-50 hover:bg-gray-100'
														}`}
												>
													{icon}
												</button>
											))}
										</div>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
										<div className="flex gap-3">
											{[ '#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316' ].map(color => (
												<button
													key={color}
													type="button"
													onClick={() => setCategoryColor(color)}
													className={`w-10 h-10 rounded-xl transition-all ${categoryColor === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
														}`}
													style={{ backgroundColor: color }}
												/>
											))}
										</div>
									</div>
									<div className="flex gap-3 pt-4">
										<button
											onClick={() => setShowModal(false)}
											className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
										>
											Cancel
										</button>
										<button
											onClick={handleSave}
											className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
										>
											{editingCategory ? 'Update' : 'Create'}
										</button>
									</div>
								</div>
							</div>
						</div>
					)}
				</main>
			</div>
		</div>
	)
}
