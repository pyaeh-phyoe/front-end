import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const createOrder = createAsyncThunk(
    "orders/createOrder",
    async (products) => {
        console.log(products)
            const response = await fetch("https://quaint-gold-goldfish.cyclic.app/orders", {

            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(products),
        });
        const data = await response.json();
        console.log("fetch")
        return data;
    }
);

export const fetchOrders = createAsyncThunk(
    "orders/fetchOrders",
    async () => {
        const response = await fetch("https://quaint-gold-goldfish.cyclic.app/orders");
        const data = await response.json();
        return data;
    }
);

const orderSlice = createSlice({
    name: "orders",
    initialState: {
        orders: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default orderSlice.reducer;
