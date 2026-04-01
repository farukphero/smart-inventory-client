
'use client'

import { useState } from 'react'
import { X, Plus, Trash2, Package, User, Mail, Phone } from 'lucide-react'
import { mockProducts } from "@/src/libs/mockData"


interface CreateOrderModalProps {
	isOpen: boolean
	onClose: () => void
	// onOrderCreated: (order: any) => void
	product?: any; // optional product to pre-fill
}

export function OrderModal({ isOpen, onClose, product }: CreateOrderModalProps) {
	const [ customerName, setCustomerName ] = useState('')
	const [ customerEmail, setCustomerEmail ] = useState('')
	const [ customerPhone, setCustomerPhone ] = useState('')
	const [ items, setItems ] = useState<{ productId: string; quantity: number }[]>([ { productId: '', quantity: 1 } ])

	const getProduct = (id: string) => mockProducts.find(p => p.id === id)

	const addItem = () => setItems([ ...items, { productId: '', quantity: 1 } ])
	const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index))
	const updateItem = (index: number, field: string, value: any) => {
		const newItems = [ ...items ]
		newItems[ index ] = { ...newItems[ index ], [ field ]: value }
		setItems(newItems)
	}

	const calculateTotal = () => {
		return items.reduce((sum, item) => {
			const product = getProduct(item.productId)
			return sum + (product ? product.price * item.quantity : 0)
		}, 0)
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (!customerName.trim() || items.some(i => !i.productId || i.quantity <= 0)) {
			alert('Please fill all required fields')
			return
		}

		const orderItems = items.map(item => {
			const product = getProduct(item.productId)!
			return {
				productId: product.id,
				productName: product.name,
				quantity: item.quantity,
				price: product.price,
				total: product.price * item.quantity,
			}
		})

		const newOrder = {
			id: Date.now().toString(),
			orderNumber: `ORD-${Date.now().toString().slice(-8)}`,
			customerName,
			customerEmail,
			customerPhone,
			items: orderItems,
			totalPrice: calculateTotal(),
			status: 'Pending',
			paymentStatus: 'Unpaid',
			createdAt: new Date(),
			updatedAt: new Date(),
		}

		// onOrderCreated(newOrder)
		onClose()
		// Reset form
		setCustomerName('')
		setCustomerEmail('')
		setCustomerPhone('')
		setItems([ { productId: '', quantity: 1 } ])
	}

	if (!isOpen) return null


	console.log('Selected product for order:', product) // Debug log to check the received product

	return (
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
			<div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
				<div className="sticky top-0 bg-white z-10 flex justify-between items-center p-6 border-b border-gray-100">
					<div>
						<h2 className="text-xl font-semibold text-gray-900">Create New Order</h2>
						<p className="text-sm text-gray-500 mt-1">Enter customer and order details</p>
					</div>
					<button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
						<X className="w-5 h-5" />
					</button>
				</div>
				<form onSubmit={handleSubmit} className="p-6 space-y-5">
					{/* Customer Info */}
					<div className="bg-gray-50 rounded-xl p-5 space-y-4">
						<h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
							<User className="w-4 h-4" />
							Customer Information
						</h3>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
								<input
									type="text"
									value={customerName}
									onChange={(e) => setCustomerName(e.target.value)}
									className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
									<Mail className="w-3 h-3" />
									Email
								</label>
								<input
									type="email"
									value={customerEmail}
									onChange={(e) => setCustomerEmail(e.target.value)}
									className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
								/>
							</div>
							<div className="sm:col-span-2">
								<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
									<Phone className="w-3 h-3" />
									Phone
								</label>
								<input
									type="tel"
									value={customerPhone}
									onChange={(e) => setCustomerPhone(e.target.value)}
									className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
								/>
							</div>
						</div>
					</div>

					{/* Order Items */}
					<div>
						<h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
							<Package className="w-4 h-4" />
							Order Items
						</h3>
						<div className="space-y-3">
							{items.map((item, index) => {
								const product = getProduct(item.productId)
								return (
									<div key={index} className="flex flex-wrap sm:flex-nowrap gap-3 items-end bg-gray-50 p-3 rounded-xl">
										<div className="flex-1">
											<select
												value={item.productId}
												onChange={(e) => updateItem(index, 'productId', e.target.value)}
												className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
												required
											>
												<option value="">Select Product</option>
												{mockProducts.map(p => (
													<option key={p.id} value={p.id}>
														{p.name} - ${p.price} (Stock: {p.stockQuantity})
													</option>
												))}
											</select>
										</div>
										<div className="w-28">
											<input
												type="number"
												min="1"
												value={item.quantity}
												onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
												className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
												required
											/>
										</div>
										<div className="w-24 text-right">
											{product && <span className="font-medium text-gray-900">${(product.price * item.quantity).toFixed(2)}</span>}
										</div>
										{items.length > 1 && (
											<button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 p-2">
												<Trash2 className="w-4 h-4" />
											</button>
										)}
									</div>
								)
							})}
							<button
								type="button"
								onClick={addItem}
								className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors"
							>
								<Plus className="w-4 h-4" /> Add Item
							</button>
						</div>
					</div>

					{/* Total */}
					<div className="border-t border-gray-100 pt-4">
						<div className="text-right">
							<p className="text-sm text-gray-500">Total Amount</p>
							<p className="text-3xl font-bold text-gray-900">${calculateTotal().toFixed(2)}</p>
						</div>
					</div>

					{/* Actions */}
					<div className="flex gap-3 pt-4">
						<button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors">
							Cancel
						</button>
						<button type="submit" className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">
							Create Order
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
