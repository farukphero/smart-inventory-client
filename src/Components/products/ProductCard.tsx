import { ConfirmModal } from "@/src/Components/UI/DeleteConfirmModal";
import { ShoppingCart, Edit, Trash2, Package, Hash } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
	product: any;
	onEdit?: () => void;
	onDelete?: () => void;        // this will be called only after confirmation
	onOrder?: () => void;
}

export function ProductCard({ product, onEdit, onDelete, onOrder }: ProductCardProps) {
	const [ showDeleteModal, setShowDeleteModal ] = useState(false);

	const handleDeleteClick = () => {
		setShowDeleteModal(true);
	};

	const handleConfirmDelete = () => {
		if (onDelete) onDelete();
	};

	return (
		<>
			<div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
				{/* Top bar: subtle icon + status */}
				<div className="px-4 pt-4 pb-2 flex items-start justify-between">
					<div className="flex items-center gap-2 text-gray-500">
						<Package className="w-5 h-5" />
						{product.sku && (
							<div className="flex items-center gap-1 text-xs text-gray-400">
								<Hash className="w-3 h-3" />
								<span>{product.sku}</span>
							</div>
						)}
					</div>
					<span
						className={`px-2 py-1 text-xs rounded-full font-medium ${product.status === 'ACTIVE'
							? 'bg-green-100 text-green-700'
							: 'bg-red-100 text-red-700'
							}`}
					>
						{product.status === 'ACTIVE' ? 'In Stock' : 'Out of Stock'}
					</span>
				</div>

				{/* Product Info */}
				<div className="p-4 pt-0 space-y-2">
					<div>
						<h3 className="font-semibold text-gray-900 line-clamp-1">
							{product.productName}
						</h3>
						<p className="text-sm text-gray-500 mt-0.5 line-clamp-1 truncate">
							{product.categoryId?.categoryName || 'Uncategorized'}
						</p>
						{product.description && (
							<p className="text-sm text-gray-500 mt-2 line-clamp-2">
								{product.description}
							</p>
						)}
					</div>

					<div className="flex items-baseline gap-1 pt-1">
						<span className="text-2xl font-bold text-gray-900">
							${product.price.toFixed(2)}
						</span>
						{product.stockQuantity > 0 && (
							<span className="text-sm text-gray-500">/ unit</span>
						)}
					</div>

					{product.stockQuantity !== undefined && (
						<div className="text-xs text-gray-500">
							{product.stockQuantity > 0
								? `${product.stockQuantity} units available`
								: 'Out of stock'}
						</div>
					)}

					{/* Action buttons */}
					<div className="flex justify-between items-center pt-2">
						<div className="flex gap-2">
							{onEdit && (
								<button
									onClick={onEdit}
									className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
									aria-label="Edit product"
								>
									<Edit className="w-4 h-4" />
								</button>
							)}
							{onDelete && (
								<button
									onClick={handleDeleteClick}
									className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
									aria-label="Delete product"
								>
									<Trash2 className="w-4 h-4" />
								</button>
							)}
						</div>

						{onOrder && (
							<button
								onClick={onOrder}
								className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm rounded-lg hover:shadow-md transition-all transform hover:scale-105"
							>
								<ShoppingCart className="w-4 h-4" />
								<span>Order Now</span>
							</button>
						)}
					</div>
				</div>
			</div>

			{/* Delete Confirmation Modal */}
			<ConfirmModal
				isOpen={showDeleteModal}
				onClose={() => setShowDeleteModal(false)}
				onConfirm={handleConfirmDelete}
				title="Delete Product"
				message={`Are you sure you want to delete "${product.productName}"? This action cannot be undone.`}
				confirmText="Delete"
				cancelText="Cancel"
				variant="danger"
			/>
		</>
	);
}
