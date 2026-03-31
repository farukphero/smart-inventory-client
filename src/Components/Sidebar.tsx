// components/layout/Sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
	LayoutDashboard,
	Package,
	ShoppingCart,
	Tags,
	LogOut,
	TrendingUp,
	Activity,
	Settings
} from 'lucide-react'
import { useAuth } from "@/src/contexts/AuthContext"

const navItems = [
	{ path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
	{ path: '/products', label: 'Products', icon: Package },
	{ path: '/orders', label: 'Orders', icon: ShoppingCart },
	{ path: '/categories', label: 'Categories', icon: Tags },
	{ path: '/activity', label: 'Activity', icon: Activity },
]

export function DashboardSidebar() {
	const pathname = usePathname()
	const { user, logout, isAdmin } = useAuth()

	return (
		<>
			{/* Desktop Sidebar */}
			<aside className="hidden lg:flex fixed left-0 top-0 h-full w-72 bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-2xl z-20 flex-col">
				{/* Logo */}
				<div className="p-6 border-b border-gray-700">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
							<TrendingUp className="w-5 h-5" />
						</div>
						<div>
							<h1 className="text-xl font-bold tracking-tight">InventoryHub</h1>
							<p className="text-xs text-gray-400">Smart Management</p>
						</div>
					</div>
				</div>

				{/* Navigation */}
				<nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
					{navItems.map((item) => {
						const isActive = pathname === item.path || pathname?.startsWith(item.path + '/')
						return (
							<Link
								key={item.path}
								href={item.path}
								className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
									? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
									: 'text-gray-300 hover:bg-gray-800 hover:text-white'
									}`}
							>
								<item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : ''}`} />
								<span className="font-medium">{item.label}</span>
								{isActive && (
									<div className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
								)}
							</Link>
						)
					})}
				</nav>

				{/* User Section */}
				<div className="p-4 border-t border-gray-700 space-y-3">
					<div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-800/50">
						<div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold shadow-lg">
							{user?.name.charAt(0)}
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-sm font-medium truncate">{user?.name}</p>
							<p className="text-xs text-gray-400 capitalize">{user?.role}</p>
						</div>
					</div>
					<button
						onClick={logout}
						className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-300 hover:bg-red-600/20 hover:text-red-400 transition-all duration-200 group"
					>
						<LogOut className="w-5 h-5 transition-transform group-hover:scale-110" />
						<span className="font-medium">Logout</span>
					</button>
				</div>
			</aside>
		</>
	)
}
