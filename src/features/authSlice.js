import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userName: null,
    password: null,
    authorize: false,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            const { userName, password } = action.payload
            if (userName === "John Doe" && password === "1234") {
                state.authorize = true
            }
        },
        logout: (state) => {
            state.authorize = false
        }
    },
})

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;