import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
    id: string;
    username: string;
    email: string;
    roles: string[];
}

interface AuthState {
    user: User | null;
    token: string | null;
}

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem("token"),
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthState: (state, action: PayloadAction<AuthState>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;

            if (action.payload.token) {
                localStorage.setItem("token", action.payload.token);
            }
        },

        logout: (state) => {
            state.user = null;
            state.token = null;

            localStorage.removeItem("token");
        }, 
    },
});

export const { setAuthState, logout } = authSlice.actions;
export default authSlice.reducer;
