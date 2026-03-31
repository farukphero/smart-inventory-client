// app/providers.tsx
'use client'

import { AuthProvider } from "@/src/contexts/AuthContext"
import { persistor, store } from "@/src/redux/store"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react";


export function Providers({ children }: { children: React.ReactNode }) {
	return <Provider store={store}>
		<PersistGate
			loading={null}
			persistor={persistor}
		>
			<AuthProvider>
				{children}
			</AuthProvider >
		</PersistGate>
	</Provider>
}
