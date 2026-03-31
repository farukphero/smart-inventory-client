'use client'
import { useState, useEffect, useRef } from 'react'
import { X, Plus, Package, DollarSign, Layers, AlignLeft, AlertTriangle, TrendingUp, Tag, Clock, CheckCircle } from 'lucide-react'
import { mockCategories } from "@/src/libs/mockData"

interface ProductModalProps {
	isOpen: boolean
	onClose: () => void
	onOrderCreated: (order: any) => void
	products: any[]
	setProducts: (products: any[]) => void
}

export function ProductModal({ isOpen, onClose, onOrderCreated, products, setProducts }: ProductModalProps) {
	const [ newProduct, setNewProduct ] = useState({
		name: '',
		price: '',
		stockQuantity: '',
		minStockThreshold: '5',
		categoryId: '',
		description: '',
		status: 'active'
	})
	const [ errors, setErrors ] = useState<Record<string, string>>({})
	const modalRef = useRef<HTMLDivElement>(null)
	const formRef = useRef<HTMLDivElement>(null)

	// Handle escape key press
	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen) {
				handleClose()
			}
		}
		window.addEventListener('keydown', handleEsc)
		return () => window.removeEventListener('keydown', handleEsc)
	}, [ isOpen ])

	// Prevent body scroll and handle focus trap
	useEffect(() => {
		if (isOpen) {
			const scrollY = window.scrollY
			document.body.style.position = 'fixed'
			document.body.style.top = `-${scrollY}px`
			document.body.style.width = '100%'
			document.body.style.overflow = 'hidden'

			if (modalRef.current) {
				modalRef.current.focus()
			}

			return () => {
				document.body.style.position = ''
				document.body.style.top = ''
				document.body.style.width = ''
				document.body.style.overflow = ''
				window.scrollTo(0, scrollY)
			}
		}
	}, [ isOpen ])

	const validateForm = () => {
		const newErrors: Record<string, string> = {}
		if (!newProduct.name.trim()) newErrors.name = 'Product name is required'
		if (!newProduct.price || parseFloat(newProduct.price) <= 0) newErrors.price = 'Valid price is required'
		if (!newProduct.stockQuantity || parseInt(newProduct.stockQuantity) < 0) newErrors.stock = 'Valid stock quantity is required'
		if (newProduct.minStockThreshold && parseInt(newProduct.minStockThreshold) < 0) newErrors.minStock = 'Minimum stock cannot be negative'
		if (newProduct.minStockThreshold && parseInt(newProduct.minStockThreshold) > parseInt(newProduct.stockQuantity)) {
			newErrors.minStock = 'Minimum stock cannot exceed current stock'
		}
		if (!newProduct.categoryId) newErrors.categoryId = 'Category is required'

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleAddNewProduct = () => {
		if (!validateForm()) return

		const currentStock = parseInt(newProduct.stockQuantity)
		const minStock = newProduct.minStockThreshold ? parseInt(newProduct.minStockThreshold) : 5

		const product = {
			id: Date.now().toString(),
			name: newProduct.name,
			price: parseFloat(newProduct.price),
			stockQuantity: currentStock,
			minStockThreshold: minStock,
			categoryId: newProduct.categoryId,
			description: newProduct.description,
			rating: 0,
			reviews: 0,
			inStock: currentStock > 0,
			status: newProduct.status,
			lowStock: currentStock <= minStock,
			createdAt: new Date(),
			updatedAt: new Date()
		}

		setProducts([ product, ...products ])
		handleClose()
	}

	const handleClose = () => {
		setNewProduct({
			name: '',
			price: '',
			stockQuantity: '',
			minStockThreshold: '5',
			categoryId: '',
			description: '',
			status: 'active'
		})
		setErrors({})
		onClose()
	}

	const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			handleClose()
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Tab') {
			const focusableElements = modalRef.current?.querySelectorAll(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			)

			if (focusableElements && focusableElements.length > 0) {
				const firstElement = focusableElements[ 0 ] as HTMLElement
				const lastElement = focusableElements[ focusableElements.length - 1 ] as HTMLElement

				if (e.shiftKey && document.activeElement === firstElement) {
					e.preventDefault()
					lastElement.focus()
				} else if (!e.shiftKey && document.activeElement === lastElement) {
					e.preventDefault()
					firstElement.focus()
				}
			}
		}
	}

	// Scroll to error field
	const scrollToError = () => {
		const firstErrorField = Object.keys(errors)[ 0 ]
		if (firstErrorField && formRef.current) {
			const errorElement = formRef.current.querySelector(`[data-field="${firstErrorField}"]`)
			if (errorElement) {
				errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
			}
		}
	}

	useEffect(() => {
		if (Object.keys(errors).length > 0) {
			scrollToError()
		}
	}, [ errors ])

	if (!isOpen) return null

	return (
		<div
			className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-in fade-in duration-200 overflow-x-hidden overflow-y-auto"
			onClick={handleBackdropClick}
		>
			<div
				ref={modalRef}
				tabIndex={-1}
				onKeyDown={handleKeyDown}
				className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl w-full max-w-2xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300 my-8 mx-auto overflow-hidden"
				style={{
					maxHeight: 'calc(100vh - 4rem)',
					display: 'flex',
					flexDirection: 'column'
				}}
			>
				{/* Header - Fixed with glass morphism */}
				<div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-6 py-5 flex-shrink-0">
					<div className="absolute inset-0 bg-black/10"></div>
					<div className="relative z-10">
						<h3 className="text-2xl font-bold text-white flex items-center gap-3">
							<div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
								<Package className="w-5 h-5" />
							</div>
							Create New Product
						</h3>
						<p className="text-white/80 text-sm mt-1">Fill in the details to add a new product to your inventory</p>
					</div>
					<button
						onClick={handleClose}
						className="absolute top-5 right-5 text-white/80 hover:text-white transition-all hover:scale-110 duration-200 bg-white/10 rounded-lg p-1.5 backdrop-blur-sm"
						aria-label="Close modal"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Form Body - Scrollable with custom scrollbar */}
				<div
					ref={formRef}
					className="flex-1 overflow-y-auto p-6 space-y-6"
					style={{
						scrollBehavior: 'smooth',
						scrollbarWidth: 'thin',
						scrollbarColor: '#cbd5e1 #f1f5f9'
					}}
				>
					<style jsx>{`
						div::-webkit-scrollbar {
							width: 6px;
						}
						div::-webkit-scrollbar-track {
							background: #f1f5f9;
							border-radius: 10px;
						}
						div::-webkit-scrollbar-thumb {
							background: #cbd5e1;
							border-radius: 10px;
						}
						div::-webkit-scrollbar-thumb:hover {
							background: #94a3b8;
						}
					`}</style>

					{/* Product Name */}
					<div data-field="name" className="group">
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Product Name <span className="text-red-500">*</span>
						</label>
						<div className="relative">
							<Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
							<input
								type="text"
								placeholder="e.g., Wireless Headphones"
								value={newProduct.name}
								onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
								className={`w-full pl-9 pr-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 ${errors.name ? 'border-red-500 focus:border-red-500 bg-red-50/50' : 'border-gray-200 focus:border-indigo-500 hover:border-gray-300'
									}`}
							/>
						</div>
						{errors.name && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>{errors.name}</p>}
					</div>

					{/* Price and Stock Row */}
					<div className="grid grid-cols-2 gap-4">
						<div data-field="price">
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Price <span className="text-red-500">*</span>
							</label>
							<div className="relative">
								<DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
								<input
									type="number"
									step="0.01"
									placeholder="0.00"
									value={newProduct.price}
									onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
									className={`w-full pl-9 pr-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 ${errors.price ? 'border-red-500 focus:border-red-500 bg-red-50/50' : 'border-gray-200 focus:border-indigo-500 hover:border-gray-300'
										}`}
								/>
							</div>
							{errors.price && <p className="text-xs text-red-500 mt-1.5">{errors.price}</p>}
						</div>

						<div data-field="stock">
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Stock Quantity <span className="text-red-500">*</span>
							</label>
							<div className="relative">
								<Layers className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
								<input
									type="number"
									placeholder="0"
									value={newProduct.stockQuantity}
									onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: e.target.value })}
									className={`w-full pl-9 pr-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 ${errors.stock ? 'border-red-500 focus:border-red-500 bg-red-50/50' : 'border-gray-200 focus:border-indigo-500 hover:border-gray-300'
										}`}
								/>
							</div>
							{errors.stock && <p className="text-xs text-red-500 mt-1.5">{errors.stock}</p>}
						</div>
					</div>

					{/* Minimum Stock and Status Row */}
					<div className="grid grid-cols-2 gap-4">
						<div data-field="minStock">
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								<div className="flex items-center gap-1.5">
									<AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />
									Minimum Stock Threshold
								</div>
							</label>
							<div className="relative">
								<AlertTriangle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
								<input
									type="number"
									placeholder="Default: 5"
									value={newProduct.minStockThreshold}
									onChange={(e) => setNewProduct({ ...newProduct, minStockThreshold: e.target.value })}
									className={`w-full pl-9 pr-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 ${errors.minStockThreshold ? 'border-red-500 focus:border-red-500 bg-red-50/50' : 'border-gray-200 focus:border-indigo-500 hover:border-gray-300'
										}`}
								/>
							</div>
							<p className="text-xs text-gray-500 mt-1.5">⚠️ Alert when stock falls below this value</p>
							{errors.minStockThreshold && <p className="text-xs text-red-500 mt-1.5">{errors.minStockThreshold}</p>}
						</div>

						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								<div className="flex items-center gap-1.5">
									<TrendingUp className="w-3.5 h-3.5 text-green-500" />
									Product Status
								</div>
							</label>
							<select
								value={newProduct.status}
								onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value })}
								className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 hover:border-gray-300"
							>
								<option value="active">🟢 Active - Available for sale</option>
								<option value="draft">📝 Draft - Not yet published</option>
								<option value="archived">📦 Archived - Hidden from store</option>
							</select>
						</div>
					</div>

					{/* Category */}
					<div data-field="categoryId">
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Category <span className="text-red-500">*</span>
						</label>
						<div className="relative">
							<Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
							<select
								value={newProduct.categoryId}
								onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
								className={`w-full pl-9 pr-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 ${errors.categoryId ? 'border-red-500 focus:border-red-500 bg-red-50/50' : 'border-gray-200 focus:border-indigo-500 hover:border-gray-300'
									}`}
							>
								<option value="">Select a category</option>
								{mockCategories.map(cat => (
									<option key={cat.id} value={cat.id}>{cat.name}</option>
								))}
							</select>
						</div>
						{errors.categoryId && <p className="text-xs text-red-500 mt-1.5">{errors.categoryId}</p>}
					</div>

					{/* Description */}
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Description
							<span className="text-xs text-gray-500 ml-2">(Optional)</span>
						</label>
						<div className="relative">
							<AlignLeft className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
							<textarea
								placeholder="Enter product description, features, specifications..."
								value={newProduct.description}
								onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
								rows={4}
								className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 hover:border-gray-300 resize-none"
							/>
						</div>
						<p className="text-xs text-gray-500 mt-1.5">📝 {newProduct.description.length}/500 characters</p>
					</div>

					{/* Stock Status Preview */}
					{newProduct.stockQuantity && newProduct.minStockThreshold && parseInt(newProduct.stockQuantity) <= parseInt(newProduct.minStockThreshold) && (
						<div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 rounded-xl p-4 flex items-start gap-3 shadow-sm">
							<div className="bg-yellow-100 p-2 rounded-lg">
								<AlertTriangle className="w-5 h-5 text-yellow-600" />
							</div>
							<div className="flex-1">
								<p className="font-semibold text-yellow-800">Low Stock Warning</p>
								<p className="text-yellow-700 text-sm mt-0.5">
									Current stock ({newProduct.stockQuantity} units) is at or below minimum stock level ({newProduct.minStockThreshold} units)
								</p>
								<p className="text-yellow-600 text-xs mt-1.5">⚠️ Consider restocking soon to avoid inventory shortage</p>
							</div>
						</div>
					)}

					{/* Success Preview for Active Products */}
					{newProduct.status === 'active' && newProduct.name && newProduct.price && newProduct.stockQuantity && (
						<div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-xl p-4 flex items-start gap-3 shadow-sm">
							<div className="bg-green-100 p-2 rounded-lg">
								<CheckCircle className="w-5 h-5 text-green-600" />
							</div>
							<div className="flex-1">
								<p className="font-semibold text-green-800">Ready to Publish</p>
								<p className="text-green-700 text-sm mt-0.5">
									Your product will be visible in the store immediately after creation
								</p>
							</div>
						</div>
					)}
				</div>

				{/* Footer - Fixed with glass morphism */}
				<div className="sticky bottom-0 bg-white/95 backdrop-blur-sm px-6 py-4 border-t border-gray-100 flex-shrink-0">
					<div className="flex gap-3">
						<button
							onClick={handleClose}
							className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
						>
							Cancel
						</button>
						<button
							onClick={handleAddNewProduct}
							className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 font-medium flex items-center justify-center gap-2 group"
						>
							<Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
							Create Product
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
