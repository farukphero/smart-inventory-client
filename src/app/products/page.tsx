// app/products/page.tsx
'use client'

import { useState } from 'react'
import { Plus, Package, Filter, ChevronLeft, ChevronRight, Grid3x3, List, ShoppingCart } from 'lucide-react'
import { Header } from "@/src/Components/Header"
import { ProductCard } from "@/src/Components/products/ProductCard"
import { ProductFilters } from "@/src/Components/products/ProductFilters"
import { useAuth } from "@/src/contexts/AuthContext"
import { mockProducts, mockCategories } from "@/src/libs/mockData"
import { DashboardSidebar } from "@/src/Components/Sidebar"
import { ProductModal } from "@/src/Components/products/ProductModal"

export default function ProductsPage() {
	const { isAdmin } = useAuth()
	const [ products, setProducts ] = useState(mockProducts)
	const [ searchTerm, setSearchTerm ] = useState('')
	const [ selectedCategory, setSelectedCategory ] = useState('')
	const [ showProductModal, setShowProductModal ] = useState(false)
	const [ showOrderModal, setShowOrderModal ] = useState(false)
	const [ editingProduct, setEditingProduct ] = useState<any>(null)
	const [ showFilters, setShowFilters ] = useState(false)
	const [ viewMode, setViewMode ] = useState<'grid' | 'list'>('grid')

	// Pagination states
	const [ currentPage, setCurrentPage ] = useState(1)
	const [ itemsPerPage, setItemsPerPage ] = useState(8)

	const filteredProducts = products.filter(product => {
		const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
		const matchesCategory = !selectedCategory || product.categoryId === selectedCategory
		return matchesSearch && matchesCategory
	})

	// Pagination logic
	const totalProducts = filteredProducts.length
	const totalPages = Math.ceil(totalProducts / itemsPerPage)
	const startIndex = (currentPage - 1) * itemsPerPage
	const endIndex = startIndex + itemsPerPage
	const currentProducts = filteredProducts.slice(startIndex, endIndex)

	const handlePageChange = (page: number) => {
		setCurrentPage(page)
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	const handleSaveProduct = (productData: any) => {
		if (editingProduct) {
			setProducts(products.map(p =>
				p.id === editingProduct.id
					? {
						...productData,
						id: p.id,
						createdAt: p.createdAt,
						updatedAt: new Date(),
						image: productData.image || p.image
					}
					: p
			))
		} else {
			const newProduct = {
				...productData,
				id: Date.now().toString(),
				createdAt: new Date(),
				updatedAt: new Date(),
				rating: productData.rating || 0,
				reviews: productData.reviews || 0,
				inStock: productData.inStock !== undefined ? productData.inStock : true
			}
			setProducts([ newProduct, ...products ])
			if (currentPage !== 1) {
				setCurrentPage(1)
			}
		}
		setShowProductModal(false)
		setEditingProduct(null)
	}

	const handleDeleteProduct = (id: string) => {
		if (confirm('Are you sure you want to delete this product?')) {
			setProducts(products.filter(p => p.id !== id))
			const newTotalPages = Math.ceil((totalProducts - 1) / itemsPerPage)
			if (currentPage > newTotalPages && newTotalPages > 0) {
				setCurrentPage(newTotalPages)
			}
		}
	}

	const handleOrderCreated = (newOrder: any) => {
		console.log('Order created:', newOrder)
		// You can add toast notification here
		alert(`Order ${newOrder.orderNumber} created successfully!`)
	}

	// Reset to first page when filters change
	const handleSearchChange = (value: string) => {
		setSearchTerm(value)
		setCurrentPage(1)
	}

	const handleCategoryChange = (value: string) => {
		setSelectedCategory(value)
		setCurrentPage(1)
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<DashboardSidebar />
			<div className="lg:ml-72">
				<Header />
				<main className="p-6 lg:p-8">
					{/* Header with Actions */}
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
						<div>
							<h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Products</h1>
							<p className="text-gray-500 mt-1">Manage your product inventory</p>
						</div>

						<div className="flex gap-3">
							{/* View Toggle */}
							<div className="flex bg-gray-100 rounded-lg p-1">
								<button
									onClick={() => setViewMode('grid')}
									className={`p-2 rounded-md transition ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600'
										}`}
								>
									<Grid3x3 className="w-4 h-4" />
								</button>
								<button
									onClick={() => setViewMode('list')}
									className={`p-2 rounded-md transition ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600'
										}`}
								>
									<List className="w-4 h-4" />
								</button>
							</div>

							{/* Create Order Button */}
							<button
								onClick={() => setShowOrderModal(true)}
								className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
							>
								<ShoppingCart className="w-5 h-5" />
								<span>Create Order</span>
							</button>

							{/* Add Products Button */}
							{isAdmin && (
								<button
									onClick={() => {
										setEditingProduct(null)
										setShowProductModal(true)
									}}
									className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 group"
								>
									<Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
									<span>Add Products</span>
								</button>
							)}
						</div>
					</div>

					{/* Quick Stats Banner */}
					{isAdmin && (
						<div className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-100">
							<div className="flex items-center justify-between flex-wrap gap-4">
								<div className="flex items-center gap-4">
									<div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-xl">
										<Package className="w-6 h-6 text-white" />
									</div>
									<div>
										<h3 className="font-semibold text-gray-900">Product Management</h3>
										<p className="text-sm text-gray-600">
											Total Products: <span className="font-bold text-indigo-600">{totalProducts}</span>
										</p>
									</div>
								</div>
								<button
									onClick={() => setShowOrderModal(true)}
									className="flex items-center gap-2 px-4 py-2 bg-white text-green-600 rounded-lg font-medium hover:shadow-md transition border border-green-200"
								>
									<ShoppingCart className="w-4 h-4" />
									Quick Order
								</button>
							</div>
						</div>
					)}

					{/* Filters */}
					<ProductFilters
						searchTerm={searchTerm}
						onSearchChange={handleSearchChange}
						selectedCategory={selectedCategory}
						onCategoryChange={handleCategoryChange}
						categories={mockCategories}
						showFilters={showFilters}
						onToggleFilters={() => setShowFilters(!showFilters)} />


					{/* Results Info */}
					<div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
						<div className="text-sm text-gray-500">
							Showing {startIndex + 1}-{Math.min(endIndex, totalProducts)} of {totalProducts} products
						</div>

						<div className="flex items-center gap-3">
							<select
								value={itemsPerPage}
								onChange={(e) => {
									setItemsPerPage(Number(e.target.value))
									setCurrentPage(1)
								}}
								className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
							>
								<option value={4}>4 per page</option>
								<option value={8}>8 per page</option>
								<option value={12}>12 per page</option>
								<option value={16}>16 per page</option>
								<option value={24}>24 per page</option>
							</select>
						</div>
					</div>

					{/* Products Grid/List View */}
					{currentProducts.length === 0 ? (
						<div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
							<Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
							<p className="text-gray-500">No products found</p>
							<p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
							{isAdmin && (
								<button
									onClick={() => {
										setEditingProduct(null)
										setShowProductModal(true)
									}}
									className="mt-6 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all inline-flex items-center gap-2"
								>
									<Plus className="w-4 h-4" />
									Add Your First Product
								</button>
							)}
						</div>
					) : (
						<>
							<div className={viewMode === 'grid'
								? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
								: "space-y-3"
							}>
								{currentProducts.map((product) => (
									<ProductCard
										key={product.id}
										product={product}
										onEdit={isAdmin ? () => {
											setEditingProduct(product)
											setShowProductModal(true)
										} : undefined}
										onDelete={isAdmin ? () => handleDeleteProduct(product.id) : undefined}
									/>
								))}
							</div>

							{/* Pagination */}
							{totalPages > 1 && (
								<div className="mt-8 flex justify-center">
									<div className="flex items-center gap-2">
										<button
											onClick={() => handlePageChange(currentPage - 1)}
											disabled={currentPage === 1}
											className={`p-2 rounded-lg border transition ${currentPage === 1
												? 'border-gray-200 text-gray-400 cursor-not-allowed'
												: 'border-gray-300 text-gray-700 hover:bg-indigo-50 hover:border-indigo-300'
												}`}
										>
											<ChevronLeft className="w-5 h-5" />
										</button>

										<div className="flex gap-1">
											{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
												if (
													page === 1 ||
													page === totalPages ||
													(page >= currentPage - 1 && page <= currentPage + 1)
												) {
													return (
														<button
															key={page}
															onClick={() => handlePageChange(page)}
															className={`w-10 h-10 rounded-lg font-medium transition ${currentPage === page
																? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
																: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
																}`}
														>
															{page}
														</button>
													)
												}

												if (page === currentPage - 2 || page === currentPage + 2) {
													return (
														<span key={page} className="w-10 h-10 flex items-center justify-center text-gray-400">
															...
														</span>
													)
												}

												return null
											})}
										</div>

										<button
											onClick={() => handlePageChange(currentPage + 1)}
											disabled={currentPage === totalPages}
											className={`p-2 rounded-lg border transition ${currentPage === totalPages
												? 'border-gray-200 text-gray-400 cursor-not-allowed'
												: 'border-gray-300 text-gray-700 hover:bg-indigo-50 hover:border-indigo-300'
												}`}
										>
											<ChevronRight className="w-5 h-5" />
										</button>
									</div>
								</div>
							)}

							<div className="mt-4 text-center text-sm text-gray-500">
								Page {currentPage} of {totalPages}
							</div>
						</>
					)}

					{/* Floating Action Button for Mobile */}
					{isAdmin && (
						<div className="fixed bottom-6 right-6 lg:hidden flex flex-col gap-3">
							<button
								onClick={() => setShowOrderModal(true)}
								className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-110"
							>
								<ShoppingCart className="w-6 h-6" />
							</button>
							<button
								onClick={() => {
									setEditingProduct(null)
									setShowProductModal(true)
								}}
								className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-110"
							>
								<Plus className="w-6 h-6" />
							</button>
						</div>
					)}

					{/* Product Modal */}
					<ProductModal
						isOpen={showOrderModal}
						onClose={() => setShowOrderModal(false)}
						onOrderCreated={handleOrderCreated}
						products={products}
						setProducts={setProducts}
					/>
				</main>
			</div>
		</div>
	)
}
