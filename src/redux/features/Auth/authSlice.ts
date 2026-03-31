import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TUser = {
	userId: string;
	email: string;
	role: string;
	iat: number;
	exp: number;
};

type TAuthState = {
	token: string | null;
};

const initialState: TAuthState = {
	token: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<TAuthState>) => {
			// state.user = action.payload.user;
			state.token = action.payload.token;
		},
		logout: (state) => {
			// state.user = null;
			state.token = null;
		},
	},
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
