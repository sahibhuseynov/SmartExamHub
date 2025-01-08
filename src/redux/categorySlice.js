import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    categories: []
};

const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        setCategories: (state, action) => {
            state.categories = action.payload;
        },
        updateCategoryDescription: (state, action) => {
            const { categoryId, description } = action.payload;
            const categoryIndex = state.categories.findIndex(cat => cat.id === categoryId);
            if (categoryIndex !== -1) {
                state.categories[categoryIndex].description = description;
            }
        }
    }
});

export const { setCategories, updateCategoryDescription } = categorySlice.actions;
export default categorySlice.reducer;
