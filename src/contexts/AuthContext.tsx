// contexts/AuthContext.tsx
'use client'

import { mockUsers } from "@/src/libs/mockData"
import { User } from "@/src/types"
import React, { createContext, useContext, useState, useEffect } from 'react'


interface AuthContextType {
	user: User | null
	loading: boolean
	login: (email: string, password: string) => Promise<void>
	logout: () => void
	isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [ user, setUser ] = useState<User | null>(null)
	const [ loading, setLoading ] = useState(true)

	useEffect(() => {
		const storedUser = localStorage.getItem('inventory_user')
		if (storedUser) {
			setUser(JSON.parse(storedUser))
		}
		setLoading(false)
	}, [])

	const login = async (email: string, password: string) => {
		// Demo authentication - any password works with demo emails
		const foundUser = mockUsers.find(u => u.email === email)
		if (foundUser) {
			setUser(foundUser)
			localStorage.setItem('inventory_user', JSON.stringify(foundUser))
		} else {
			throw new Error('Invalid credentials')
		}
	}

	const logout = () => {
		setUser(null)
		localStorage.removeItem('inventory_user')
	}

	return (
		<AuthContext.Provider value={{ user, loading, login, logout, isAdmin: user?.role === 'admin' }}>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth() {
	const context = useContext(AuthContext)
	if (!context) throw new Error('useAuth must be used within AuthProvider')
	return context
}
