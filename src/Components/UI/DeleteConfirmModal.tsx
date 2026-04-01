import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ConfirmModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title?: string;
	message?: string;
	confirmText?: string;
	cancelText?: string;
	variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmModal({
	isOpen,
	onClose,
	onConfirm,
	title = 'Confirm Action',
	message = 'Are you sure you want to proceed?',
	confirmText = 'Confirm',
	cancelText = 'Cancel',
	variant = 'danger',
}: ConfirmModalProps) {
	// Close modal on Escape key press
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen) onClose();
		};
		document.addEventListener('keydown', handleEscape);
		return () => document.removeEventListener('keydown', handleEscape);
	}, [ isOpen, onClose ]);

	// Prevent body scroll when modal is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [ isOpen ]);

	if (!isOpen) return null;

	const variantClasses = {
		danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
		warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
		info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
			<div
				className="bg-white rounded-2xl shadow-xl max-w-md w-full transform transition-all"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b border-gray-200">
					<h3 className="text-lg font-semibold text-gray-900">{title}</h3>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 transition"
						aria-label="Close"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Body */}
				<div className="p-4">
					<p className="text-gray-600">{message}</p>
				</div>

				{/* Footer */}
				<div className="flex justify-end gap-3 p-4 border-t border-gray-200">
					<button
						onClick={onClose}
						className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition cursor-pointer"
					>
						{cancelText}
					</button>
					<button
						onClick={() => {
							onConfirm();
							onClose();
						}}
						className={`cursor-pointer px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition ${variantClasses[ variant ]}`}
					>
						{confirmText}
					</button>
				</div>
			</div>
		</div>
	);
}
