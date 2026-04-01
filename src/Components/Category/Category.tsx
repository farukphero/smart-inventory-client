// app/categories/page.tsx
'use client'

import { useState, useEffect } from 'react'
import {
	Plus, Edit2, Trash2, Package, Grid3x3, Search, X,
	Palette, Tag, Sparkles, TrendingUp, Layers,
} from 'lucide-react'
import { Header } from "@/src/Components/Header"
import { DashboardSidebar } from "@/src/Components/Sidebar"
import {
	useCreateCategoryMutation,
	useDeleteCategoryMutation,
	useGetAllCategoriesQuery,
	useGetSingleCategoryQuery,
	useUpdateCategoryMutation
} from "@/src/redux/api/ProductCategory/productCategoryApi"
import toast from "react-hot-toast"
import Pagination from "@/src/Components/UI/SmartPagination"

// Types
interface Category {
	_id: string
	categoryName: string
	color: string
	icon: string
	productCount?: number
	createdAt?: string
	updatedAt?: string
}

interface CategoryFormData {
	categoryName: string
	color: string
	icon: string
}

interface PaginationState {
	page: number
	limit: number
	total: number
	totalPages: number
}

const CategoriesPage = () => {

	const [ showModal, setShowModal ] = useState(false)
	const [ editingCategory, setEditingCategory ] = useState<Category | null>(null)
	const [ searchTerm, setSearchTerm ] = useState('')
	const [ pagination, setPagination ] = useState<PaginationState>({
		page: 1,
		limit: 12,
		total: 0,
		totalPages: 0
	})
	const [ formData, setFormData ] = useState<CategoryFormData>({
		categoryName: '',
		color: '#6366f1',
		icon: '📦'
	})

	// API Hooks with pagination and search
	const {
		data: categoriesData,
		isLoading: isCategoriesLoading,
		refetch: refetchCategories
	} = useGetAllCategoriesQuery({
		page: pagination.page,
		limit: pagination.limit,
		searchTerm: searchTerm
	})

	const [ createCategory, { isLoading: isCreating } ] = useCreateCategoryMutation()
	const [ updateCategory, { isLoading: isUpdating } ] = useUpdateCategoryMutation()
	const [ deleteCategory, { isLoading: isDeleting } ] = useDeleteCategoryMutation()

	const {
		data: singleCategoryData,
		isLoading: isSingleCategoryLoading
	} = useGetSingleCategoryQuery(editingCategory?._id, {
		skip: !editingCategory?._id,
	})

	// Update pagination info when data changes - FIXED for meta structure
	useEffect(() => {
		if (categoriesData?.data?.meta) {
			const { page, limit, total, totalPage } = categoriesData.data.meta;
			setPagination({
				page: page || 1,
				limit: limit || 12,
				total: total || 0,
				totalPages: totalPage || 0
			});
		}
	}, [ categoriesData ]);

	// Update form data when single category data is fetched
	useEffect(() => {
		if (singleCategoryData?.data && editingCategory) {
			setFormData({
				categoryName: singleCategoryData.data.categoryName || '',
				color: singleCategoryData.data.color || '#6366f1',
				icon: singleCategoryData.data.icon || '📦'
			})
		}
	}, [ singleCategoryData, editingCategory ])

	// Debounced search
	useEffect(() => {
		const timer = setTimeout(() => {
			if (pagination.page !== 1) {
				setPagination(prev => ({ ...prev, page: 1 }))
			} else {
				refetchCategories()
			}
		}, 500)

		return () => clearTimeout(timer)
	}, [ searchTerm ])

	const icons = [ '📱', '👕', '🍎', '🪑', '📚', '💄', '🎮', '🏠', '⚡', '🎵', '🎨', '⚽', '🎭', '🚗', '⌚' ]

	const resetForm = () => {
		setFormData({
			categoryName: '',
			color: '#6366f1',
			icon: '📦'
		})
		setEditingCategory(null)
		setShowModal(false)
	}

	const handleCreateCategory = async () => {
		if (!formData.categoryName.trim()) {
			toast.error('Category name is required')
			return
		}

		try {
			const result = await createCategory(formData).unwrap()

			if (result.success) {
				toast.success('Category created successfully')
				resetForm()
				refetchCategories()
			} else {
				toast.error(result.message || 'Failed to create category')
			}
		} catch (error: any) {
			console.error('Create error:', error)
			toast.error(error?.data?.message || 'Something went wrong')
		}
	}

	const handleUpdateCategory = async () => {
		if (!editingCategory?._id) {
			toast.error('No category selected for update')
			return
		}

		if (!formData.categoryName.trim()) {
			toast.error('Category name is required')
			return
		}

		try {
			const result = await updateCategory({
				id: editingCategory._id,
				...formData
			}).unwrap()

			if (result.success) {
				toast.success('Category updated successfully')
				resetForm()
				refetchCategories()
			} else {
				toast.error(result.message || 'Failed to update category')
			}
		} catch (error: any) {
			console.error('Update error:', error)
			toast.error(error?.data?.message || 'Something went wrong')
		}
	}

	const handleDeleteCategory = async (categoryId: string, productCount: number = 0) => {
		if (productCount > 0) {
			toast.error(`Cannot delete category with ${productCount} products. Please reassign or delete products first.`)
			return
		}

		const confirmDelete = window.confirm('Are you sure you want to delete this category? This action cannot be undone.')
		if (!confirmDelete) return

		try {
			const result = await deleteCategory(categoryId).unwrap()

			if (result.success) {
				toast.success('Category deleted successfully')
				refetchCategories()
			} else {
				toast.error(result.message || 'Failed to delete category')
			}
		} catch (error: any) {
			console.error('Delete error:', error)
			toast.error(error?.data?.message || 'Something went wrong')
		}
	}

	const handleEdit = (category: Category) => {
		setEditingCategory(category)
		setFormData({
			categoryName: category.categoryName,
			color: category.color,
			icon: category.icon
		})
		setShowModal(true)
	}

	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= pagination.totalPages) {
			setPagination(prev => ({ ...prev, page: newPage }))
			window.scrollTo({ top: 0, behavior: 'smooth' })
		}
	}

	const isLoading = isCreating || isUpdating || isDeleting

	// Get categories data - adjust based on your API structure
	const categories = categoriesData?.data?.data || categoriesData?.data || []
	const hasCategories = categories.length > 0

	// Loading skeleton
	if (isCategoriesLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
				<DashboardSidebar />
				<div className="lg:ml-72">
					<Header />
					<main className="p-6 lg:p-8">
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{[ ...Array(8) ].map((_, i) => (
								<div key={i} className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
									<div className="flex items-center justify-between mb-4">
										<div className="w-14 h-14 bg-gray-200 rounded-2xl"></div>
										<div className="flex gap-1">
											<div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
											<div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
										</div>
									</div>
									<div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-2"></div>
									<div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
								</div>
							))}
						</div>
					</main>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 mb-20 pb-20">
			<DashboardSidebar />
			<div className="lg:ml-72">
				<Header />
				<main className="p-6 lg:p-8">
					{/* Hero Section */}
					<div className="mb-8">
						<div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 lg:p-8 text-white mb-8">
							<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
								<div>
									<h1 className="text-3xl lg:text-4xl font-bold mb-2 flex items-center gap-2">
										<Layers className="w-8 h-8" />
										Categories
									</h1>
									<p className="text-indigo-100">Manage and organize your product categories</p>
								</div>
								<button
									onClick={() => {
										resetForm()
										setShowModal(true)
									}}
									className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl font-medium hover:bg-white/30 transition-all border border-white/30 cursor-pointer"
								>
									<Plus className="w-5 h-5" />
									Add Category
								</button>
							</div>
						</div>

						{/* Search Bar */}
						<div className="relative">
							<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
							<input
								type="text"
								placeholder="Search categories..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-12 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
							/>
							{searchTerm && (
								<button
									onClick={() => setSearchTerm('')}
									className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
								>
									<X className="w-5 h-5" />
								</button>
							)}
						</div>
					</div>

					{/* Stats Summary */}
					{hasCategories && (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
							<div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-gray-500">Total Categories</p>
										<p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
									</div>
									<div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
										<Tag className="w-5 h-5 text-indigo-600" />
									</div>
								</div>
							</div>
							<div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-gray-500">Showing</p>
										<p className="text-2xl font-bold text-gray-900">
											{((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)}
										</p>
									</div>
									<div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
										<Grid3x3 className="w-5 h-5 text-purple-600" />
									</div>
								</div>
							</div>
							<div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-gray-500">Items Per Page</p>
										<p className="text-2xl font-bold text-gray-900">{pagination.limit}</p>
									</div>
									<div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
										<TrendingUp className="w-5 h-5 text-green-600" />
									</div>
								</div>
							</div>
							<div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-gray-500">Total Pages</p>
										<p className="text-2xl font-bold text-gray-900">{pagination.totalPages}</p>
									</div>
									<div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
										<Sparkles className="w-5 h-5 text-orange-600" />
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Categories Grid */}
					{!hasCategories ? (
						<div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
							<div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
								<Package className="w-12 h-12 text-indigo-600" />
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">No categories yet</h3>
							<p className="text-gray-500 mb-6">Create your first category to organize products</p>
							<button
								onClick={() => {
									resetForm()
									setShowModal(true)
								}}
								className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
							>
								<Plus className="w-5 h-5" />
								Create First Category
							</button>
						</div>
					) : (
						<>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
								{categories.map((category: Category) => (
									<div
										key={category._id}
										className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
									>
										<div className="p-6">
											<div className="flex items-center justify-between mb-4">
												<div
													className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
													style={{ backgroundColor: `${category.color}15` }}
												>
													{category.icon}
												</div>
												<div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
													<button
														onClick={() => handleEdit(category)}
														disabled={isLoading}
														className="p-2 text-gray-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed"
														title="Edit category"
													>
														<Edit2 className="w-4 h-4" />
													</button>
													<button
														onClick={() => handleDeleteCategory(category._id, category.productCount)}
														disabled={isLoading}
														className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
														title="Delete category"
													>
														<Trash2 className="w-4 h-4" />
													</button>
												</div>
											</div>
											<div>
												<h3
													className="font-semibold text-gray-900 text-lg line-clamp-2 mb-1 hover:text-clip transition-colors"
													title={category.categoryName}
												>
													{category.categoryName}
												</h3>
												{category.productCount !== undefined && (
													<p className="text-sm text-gray-500">{category.productCount} products</p>
												)}
											</div>
											{category.productCount !== undefined && category.productCount > 0 && (
												<div className="mt-4">
													<div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
														<div
															className="h-1.5 rounded-full transition-all duration-500"
															style={{
																width: `${Math.min((category.productCount / 20) * 100, 100)}%`,
																backgroundColor: category.color
															}}
														/>
													</div>
												</div>
											)}
										</div>
										<div
											className="h-1 transition-all duration-300 group-hover:h-1.5"
											style={{ backgroundColor: category.color }}
										/>
									</div>
								))}
							</div>

							{/* Smart Pagination */}
							<Pagination
								currentPage={pagination.page}
								totalPages={pagination.totalPages}
								onPageChange={handlePageChange}
								totalItems={pagination.total}
								itemsPerPage={pagination.limit}
							/>

						</>
					)}

					{/* Modal */}
					{showModal && (
						<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in ">
							<div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl transform transition-all h-[95vh] overflow-y-auto thin-scrollbar">
								<div className="relative">
									<div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
										<h2 className="text-2xl font-bold">
											{editingCategory ? 'Edit Category' : 'Create Category'}
										</h2>
										<p className="text-indigo-100 mt-1">
											{editingCategory ? 'Update category details' : 'Add a new category to organize products'}
										</p>
									</div>

									{isSingleCategoryLoading && editingCategory ? (
										<div className="p-6 flex justify-center">
											<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
										</div>
									) : (
										<div className="p-6 space-y-5">
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													Category Name <span className="text-red-500">*</span>
												</label>
												<input
													type="text"
													value={formData.categoryName}
													onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
													className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
													placeholder="e.g., Electronics"
													autoFocus
													disabled={isLoading}
													maxLength={50}
												/>
												<p className="text-xs text-gray-500 mt-1">
													{formData.categoryName.length}/50 characters
												</p>
											</div>

											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													<Palette className="inline-block w-4 h-4 mr-1" />
													Icon
												</label>
												<div className="grid grid-cols-5 gap-2 max-h-34 overflow-y-auto p-1 thin-scrollbar">
													{icons.map(icon => (
														<button
															key={icon}
															type="button"
															onClick={() => setFormData({ ...formData, icon })}
															disabled={isLoading}
															className={`cursor-pointer text-2xl p-2 rounded-xl transition-all ${formData.icon === icon
																? 'bg-indigo-100 ring-2 ring-indigo-500 scale-105 shadow-md'
																: 'bg-gray-50 hover:bg-gray-100 hover:scale-105'
																} disabled:opacity-50 disabled:cursor-not-allowed`}
														>
															{icon}
														</button>
													))}
												</div>
											</div>

											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													Color
												</label>
												<div className="flex gap-3 flex-wrap">
													{[ '#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316' ].map(color => (
														<button
															key={color}
															type="button"
															onClick={() => setFormData({ ...formData, color })}
															disabled={isLoading}
															className={`w-10 h-10 rounded-xl transition-all transform ${formData.color === color
																? 'ring-2 ring-offset-2 ring-gray-400 scale-110 shadow-lg'
																: 'hover:scale-105'
																} disabled:opacity-50 disabled:cursor-not-allowed`}
															style={{ backgroundColor: color }}
														/>
													))}
												</div>
											</div>

											<div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
												<p className="text-sm text-gray-600 mb-2">Preview:</p>
												<div className="flex items-center gap-3">
													<div
														className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all"
														style={{ backgroundColor: `${formData.color}15` }}
													>
														{formData.icon}
													</div>
													<div className="flex-1">
														<p
															className="font-medium text-gray-900 line-clamp-1"
															title={formData.categoryName || 'Category Name'}
														>
															{formData.categoryName || 'Category Name'}
														</p>
														<p className="text-xs text-gray-500">0 products</p>
													</div>
												</div>
											</div>

											<div className="flex gap-3 pt-4">
												<button
													onClick={resetForm}
													disabled={isLoading}
													className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
												>
													Cancel
												</button>
												<button
													onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}
													disabled={isLoading || !formData.categoryName.trim()}
													className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
												>
													{isLoading ? (
														<div className="flex items-center justify-center gap-2">
															<div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
															<span>{editingCategory ? 'Updating...' : 'Creating...'}</span>
														</div>
													) : (
														editingCategory ? 'Update Category' : 'Create Category'
													)}
												</button>
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					)}
				</main>
			</div>
		</div>
	)
}

export default CategoriesPage
