
'use client'

import { Header } from "@/src/Components/Header"
import { OrderModal } from "@/src/Components/orders/CreateOrderModal"
import { ProductCard } from "@/src/Components/products/ProductCard"
import { ProductFilters } from "@/src/Components/products/ProductFilters"
import { ProductModal } from "@/src/Components/products/ProductModal"
import { DashboardSidebar } from "@/src/Components/Sidebar"
import Pagination from "@/src/Components/UI/SmartPagination"
import { useGetAllCategoriesQuery } from "@/src/redux/api/ProductCategory/productCategoryApi"
import { useDeleteProductMutation, useGetAllProductsQuery } from "@/src/redux/api/Products/productsApi"
import { Grid3x3, List, Package, Plus, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import toast from "react-hot-toast"


const ProductsPage = () => {
	const [ showProductModal, setShowProductModal ] = useState(false)
	const [ showOrderModal, setShowOrderModal ] = useState(false)
	const [ showFilters, setShowFilters ] = useState(false)
	const [ viewMode, setViewMode ] = useState<'grid' | 'list'>('grid')
	const [ currentPage, setCurrentPage ] = useState(1)
	const [ itemsPerPage, setItemsPerPage ] = useState(8)
	const [ searchTerm, setSearchTerm ] = useState('')
	const [ selectedCategory, setSelectedCategory ] = useState('')
	const [ selectedProductForOrder, setSelectedProductForOrder ] = useState<any>(null);
	const [ editingProductId, setEditingProductId ] = useState<string>(""); // store product to edit


	const [ deleteProduct ] = useDeleteProductMutation()

	// Fetch products
	const { data: productsData, isLoading: isProductsLoading, refetch: refetchProducts } = useGetAllProductsQuery({
		page: currentPage,
		limit: itemsPerPage,
		searchTerm,
	})

	// Fetch categories for filters
	const { data: categoriesData } = useGetAllCategoriesQuery({
		page: 1,
		limit: 1000000000,
		searchTerm: ''
	})
	const categories = categoriesData?.data?.data || categoriesData?.data || []

	const products = productsData?.data?.data || []
	const totalPages = productsData?.data?.meta?.totalPage || 1
	const totalItems = productsData?.data?.data?.length || 0

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage)
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	const handleSearchChange = (value: string) => {
		setSearchTerm(value)
		setCurrentPage(1)
	}

	const handleCategoryChange = (value: string) => {
		setSelectedCategory(value)
		setCurrentPage(1)
	}

	const handleProductCreated = () => {
		refetchProducts()
		setShowProductModal(false)

	}

	const handleQuickOrder = (product: any) => {
		setSelectedProductForOrder(product);
		setShowOrderModal(true);
	};

	const handleEdit = (productId: any) => {
		setEditingProductId(productId);
		setShowProductModal(true);
	};


	const handleDeleteProduct = async (productId: string) => {
		try {
			const response = await deleteProduct(productId).unwrap();
			if (response.success) {
				toast.success('Product deleted successfully');
			}
		} catch (error) {
			toast.error('Failed to delete product');
		}
	};
	if (isProductsLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<DashboardSidebar />
			<div className="lg:ml-72">
				<Header />
				<main className="p-6 lg:p-8">
					{/* Header */}
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
									className={`p-2 rounded-md transition ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600'}`}
								>
									<Grid3x3 className="w-4 h-4" />
								</button>
								<button
									onClick={() => setViewMode('list')}
									className={`p-2 rounded-md transition ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600'}`}
								>
									<List className="w-4 h-4" />
								</button>
							</div>



							{/* Add Products Button */}
							<button
								onClick={() => {
									setShowProductModal(true)
								}}
								className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-500 ease-in-out group cursor-pointer"
							>
								<Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
								<span>Add Product</span>
							</button>
						</div>
					</div>
					{/* Filters */}
					<ProductFilters
						searchTerm={searchTerm}
						onSearchChange={handleSearchChange}
						selectedCategory={selectedCategory}
						onCategoryChange={handleCategoryChange}
						categories={categories}
						showFilters={showFilters}
						onToggleFilters={() => setShowFilters(!showFilters)}
					/>

					{/* Results Info & Items per page */}
					<div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
						<p className="text-sm text-gray-500">
							Showing {products.length} of {totalItems} products
						</p>
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

					{/* Products Grid/List */}
					{products.length === 0 ? (
						<div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
							<Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
							<p className="text-gray-500">No products found</p>
							<p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
							<button
								onClick={() => {
									setShowProductModal(true)
								}}
								className="mt-6 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all inline-flex items-center gap-2"
							>
								<Plus className="w-4 h-4" />
								Add Your First Product
							</button>
						</div>
					) : (
						<>
							<div className={viewMode === 'grid'
								? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
								: "space-y-3"
							}>
								{products.map((product: any) => (
									<ProductCard
										key={product._id}
										product={product}
										onEdit={() => handleEdit(product?._id)} // Pass product to edit
										onDelete={() => {
											handleDeleteProduct(product._id)
										}}
										onOrder={() => handleQuickOrder(product)}  // <-- new prop
									/>
								))}
							</div>

							{/* Pagination */}
							{totalPages > 1 && (
								<Pagination
									currentPage={currentPage}
									totalPages={totalPages}
									onPageChange={handlePageChange}
									totalItems={totalItems}
									itemsPerPage={itemsPerPage}
								/>
							)}

							<div className="mt-4 text-center text-sm text-gray-500">
								Page {currentPage} of {totalPages}
							</div>
						</>
					)}

					{/* Floating Action Buttons for Mobile */}
					<div className="fixed bottom-6 right-6 lg:hidden flex flex-col gap-3">
						<button
							onClick={() => setShowOrderModal(true)}
							className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-110"
						>
							<ShoppingCart className="w-6 h-6" />
						</button>
						<button
							onClick={() => {

								setShowProductModal(true)
							}}
							className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-110"
						>
							<Plus className="w-6 h-6" />
						</button>
					</div>

					{/* Product Modal */}
					<ProductModal
						isOpen={showProductModal}
						onClose={() => {
							setShowProductModal(false)
							handleProductCreated()
							setEditingProductId("") // reset editing state when modal closes
						}}
						id={editingProductId}  // <-- pass the product ID to edit
					/>

					{/* Order Modal */}
					<OrderModal
						isOpen={showOrderModal}
						onClose={() => setShowOrderModal(false)}
						product={selectedProductForOrder}  // <-- pass the selected product
					/>
				</main>
			</div>
		</div>
	)
}

export default ProductsPage
