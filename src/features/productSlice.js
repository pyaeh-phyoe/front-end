import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk(
    "products/fetchProducts",
    async () => {
        const response = await fetch("https://quaint-gold-goldfish.cyclic.app/products");
        const data = await response.json();
        return data;
    }
);

const productSlice = createSlice({
    name: "products",
    initialState: {
        items: [],
        loading: false,
        error: null,
        selectedProducts: [],
    },
    reducers: {
        selectProduct: (state, action) => {
            state.selectedProducts = action.payload;
        },
        updateQuantity: (state, action) => {
            state.selectedProducts = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});
export const { selectProduct, updateQuantity } = productSlice.actions;

export default productSlice.reducer;
