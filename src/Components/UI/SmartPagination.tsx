// src/Components/Pagination/Pagination.tsx
import React, { useMemo } from 'react';
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from 'lucide-react';

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	totalItems?: number;
	itemsPerPage?: number;
	className?: string;
	showFirstLast?: boolean; // show first/last buttons (default true on desktop)
}

const Pagination: React.FC<PaginationProps> = ({
	currentPage,
	totalPages,
	onPageChange,
	totalItems,
	itemsPerPage,
	className = '',
	showFirstLast = true,
}) => {
	// Build the list of page numbers and ellipsis (same smart logic)
	const paginationItems = useMemo(() => {
		if (totalPages <= 1) return [];

		const items: (number | string)[] = [];

		// Determine middle block (size ≤ 3, centered on current page)
		let middleStart = Math.max(2, currentPage - 1);
		let middleEnd = Math.min(totalPages - 1, currentPage + 1);

		// Ensure the block size is exactly 3 when possible
		let blockSize = middleEnd - middleStart + 1;
		if (blockSize < 3) {
			if (middleStart > 2) {
				middleStart = Math.max(2, middleStart - (3 - blockSize));
			} else if (middleEnd < totalPages - 1) {
				middleEnd = Math.min(totalPages - 1, middleEnd + (3 - blockSize));
			}
			blockSize = middleEnd - middleStart + 1;
		}
		if (blockSize > 3) {
			if (currentPage - 1 < 2) {
				middleEnd = middleStart + 2;
			} else if (currentPage + 1 > totalPages - 1) {
				middleStart = middleEnd - 2;
			} else {
				middleStart = currentPage - 1;
				middleEnd = currentPage + 1;
			}
		}

		const middlePages: number[] = [];
		for (let i = middleStart; i <= middleEnd; i++) {
			if (i !== 1 && i !== totalPages) middlePages.push(i);
		}

		// First page
		const firstPage = 1;
		const firstInMiddle = middlePages[ 0 ];
		if (firstPage !== firstInMiddle) {
			items.push(firstPage);
			if (firstInMiddle && firstInMiddle > firstPage + 1) {
				items.push('...');
			}
		}

		// Middle pages
		items.push(...middlePages);

		// Last page
		const lastPage = totalPages;
		const lastInMiddle = middlePages[ middlePages.length - 1 ];
		if (lastPage !== lastInMiddle) {
			if (lastInMiddle && lastInMiddle < lastPage - 1) {
				items.push('...');
			}
			items.push(lastPage);
		}

		// Remove duplicates
		return items.filter((item, index, arr) => arr.indexOf(item) === index);
	}, [ currentPage, totalPages ]);

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages && page !== currentPage) {
			onPageChange(page);
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	};

	if (totalPages <= 1) return null;

	// Optional range info
	const startItem = totalItems ? (currentPage - 1) * (itemsPerPage || 0) + 1 : null;
	const endItem = totalItems
		? Math.min(currentPage * (itemsPerPage || 0), totalItems)
		: null;

	return (
		<div className={`flex flex-col items-center mt-8 ${className}`}>
			<div className="flex items-center gap-2 bg-white shadow-sm rounded-lg border border-gray-200 p-1">
				{/* First page button */}
				{showFirstLast && (
					<button
						onClick={() => handlePageChange(1)}
						disabled={currentPage === 1}
						className="hidden sm:flex p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
						title="First page"
					>
						<ChevronsLeft className="w-5 h-5" />
					</button>
				)}

				{/* Previous page button */}
				<button
					onClick={() => handlePageChange(currentPage - 1)}
					disabled={currentPage === 1}
					className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
					title="Previous page"
				>
					<ChevronLeft className="w-5 h-5" />
				</button>

				{/* Page numbers and ellipsis */}
				<div className="flex items-center gap-1">
					{paginationItems.map((item, idx) =>
						item === '...' ? (
							<span
								key={`dots-${idx}`}
								className="px-3 py-2 text-gray-500"
							>
								...
							</span>
						) : (
							<button
								key={item}
								onClick={() => handlePageChange(item as number)}
								className={`
                  min-w-[40px] px-3 py-2 rounded-md font-medium transition-all duration-200 cursor-pointer
                  ${currentPage === item
										? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:shadow-lg transform hover:scale-105'
										: 'text-gray-700 hover:bg-gray-100 hover:scale-105'
									}
                `}
							>
								{item}
							</button>
						)
					)}
				</div>

				{/* Next page button */}
				<button
					onClick={() => handlePageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
					className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
					title="Next page"
				>
					<ChevronRight className="w-5 h-5" />
				</button>

				{/* Last page button */}
				{showFirstLast && (
					<button
						onClick={() => handlePageChange(totalPages)}
						disabled={currentPage === totalPages}
						className="hidden sm:flex p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
						title="Last page"
					>
						<ChevronsRight className="w-5 h-5" />
					</button>
				)}
			</div>

			{/* Optional info text */}
			{totalItems !== undefined && itemsPerPage !== undefined && (
				<div className="mt-4 text-center text-sm text-gray-500">
					Page {currentPage} of {totalPages} •
					Showing {startItem} to {endItem} of {totalItems} items
				</div>
			)}
		</div>
	);
};

export default Pagination;
