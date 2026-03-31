// components/layout/Header.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { Activity, Bell, Search, Menu, X, LogOut, LayoutDashboard, Package, ShoppingCart, Tags, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from "@/src/contexts/AuthContext"
import { motion, AnimatePresence } from 'framer-motion'
import { handleLogout } from "@/src/utils"
import { useAppDispatch } from "@/src/redux/hooks"


export function Header() {
	const { user } = useAuth()
	const pathname = usePathname()
	const router = useRouter();
	const dispatch = useAppDispatch();
	const isSessionExpired = false
	const [ showMobileMenu, setShowMobileMenu ] = useState(false)
	const [ showUserMenu, setShowUserMenu ] = useState(false)
	const [ scrolled, setScrolled ] = useState(false)
	const [ isLoggingOut, setIsLoggingOut ] = useState(false);

	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 10)
		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	// Close user menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (showUserMenu && !(e.target as Element).closest('.user-menu-container')) {
				setShowUserMenu(false)
			}
		}
		document.addEventListener('click', handleClickOutside)
		return () => document.removeEventListener('click', handleClickOutside)
	}, [ showUserMenu ])

	// Prevent body scroll when mobile menu is open
	useEffect(() => {
		if (showMobileMenu) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = ''
		}
		return () => {
			document.body.style.overflow = ''
		}
	}, [ showMobileMenu ])



	const handleLogoutInMobile = useCallback(async () => {
		setIsLoggingOut(true);
		try {
			await handleLogout(
				dispatch,
				isSessionExpired,
				router,
			);
		} catch (error) {
			setIsLoggingOut(false);
		} finally {
			setIsLoggingOut(false);
		}
	}, [
		dispatch,
		router,
		isSessionExpired,
	]);

	return (
		<>
			<header className={`sticky top-0 z-30 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white shadow-sm'}`}>
				<div className="px-4 lg:px-8 py-4 flex items-center justify-between">
					{/* Mobile Menu Button */}
					<button
						onClick={() => setShowMobileMenu(true)}
						className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
					>
						<Menu className="w-6 h-6" />
					</button>

					{/* Logo for Mobile */}
					<div className="lg:hidden flex items-center gap-2">
						<div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
							<TrendingUp className="w-4 h-4 text-white" />
						</div>
						<span className="font-bold text-gray-800">InventoryHub</span>
					</div>

					{/* Search Bar */}
					<div className="flex-1 max-w-md hidden lg:block">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
							<input
								type="text"
								placeholder="Search products, orders, customers..."
								className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
							/>
						</div>
					</div>

					{/* Right Section */}
					<div className="flex items-center gap-3">
						<button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
							<Bell className="w-5 h-5" />
							<span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
						</button>

						{/* User Menu */}
						<div className="relative user-menu-container">
							<button
								onClick={() => setShowUserMenu(!showUserMenu)}
								className="flex items-center gap-3 pl-3 pr-2 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
							>
								<div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
									{user?.name?.charAt(0) || 'U'}
								</div>
								<span className="hidden lg:inline text-sm font-medium text-gray-700">{user?.name}</span>
							</button>

							{showUserMenu && (
								<div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-fade-in">
									<div className="px-4 py-3 border-b border-gray-100">
										<p className="text-sm font-medium text-gray-900">{user?.name}</p>
										<p className="text-xs text-gray-500">{user?.email}</p>
										<p className="text-xs text-indigo-600 capitalize mt-1">{user?.role}</p>
									</div>
									<button
										onClick={handleLogoutInMobile}
										disabled={isLoggingOut}
										className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
									>
										<LogOut className="w-4 h-4" />
										Logout
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</header>

			{/* Mobile Sidebar with Framer Motion - Only animation here */}
			<AnimatePresence mode="wait">
				{showMobileMenu && (
					<div className="fixed inset-0 z-50 lg:hidden">
						{/* Backdrop with fade animation */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
							className="absolute inset-0 bg-black/50 backdrop-blur-sm"
							onClick={() => setShowMobileMenu(false)}
						/>

						{/* Sidebar with slide animation */}
						<motion.div
							initial={{ x: '-100%' }}
							animate={{ x: 0 }}
							exit={{ x: '-100%' }}
							transition={{
								type: "tween",
								duration: 0.3,
								ease: [ 0.23, 1, 0.32, 1 ] // Cubic bezier for smooth easing
							}}
							className="absolute left-0 top-0 bottom-0 w-72 bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-2xl"
						>
							<div className="p-6 border-b border-gray-700 flex justify-between items-center">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
										<TrendingUp className="w-5 h-5" />
									</div>
									<div>
										<h1 className="text-xl font-bold">InventoryHub</h1>
										<p className="text-xs text-gray-400">Smart Management</p>
									</div>
								</div>
								<button
									onClick={() => setShowMobileMenu(false)}
									className="p-2 hover:bg-gray-800 rounded-xl transition-colors"
								>
									<X className="w-5 h-5" />
								</button>
							</div>

							<nav className="p-4 space-y-1.5">
								{navItems.map((item) => (
									<Link
										key={item.path}
										href={item.path}
										onClick={() => setShowMobileMenu(false)}
										className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname === item.path
											? 'bg-indigo-600 text-white'
											: 'text-gray-300 hover:bg-gray-800 hover:text-white'
											}`}
									>
										<item.icon className="w-5 h-5" />
										<span>{item.label}</span>
									</Link>
								))}
							</nav>

							<div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
								<div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-800/50">
									<div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
										{user?.name?.charAt(0) || 'U'}
									</div>
									<div>
										<p className="text-sm font-medium">{user?.name}</p>
										<p className="text-xs text-gray-400 capitalize">{user?.role}</p>
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		</>
	)
}

const navItems = [
	{ path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
	{ path: '/products', label: 'Products', icon: Package },
	{ path: '/orders', label: 'Orders', icon: ShoppingCart },
	{ path: '/categories', label: 'Categories', icon: Tags },
	{ path: '/activity', label: 'Activity', icon: Activity },
]
