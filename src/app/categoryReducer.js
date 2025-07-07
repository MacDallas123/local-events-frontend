import { createSlice } from "@reduxjs/toolkit";
import axios from '../api/axios';
import { checkAndRefreshTokenIfNeeded } from './authReducer';

const initialState = {
    loading: false,
    error: null
};

export const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        // Get all categories
        getAllCategoriesRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        getAllCategoriesSuccess: (state) => {
            state.loading = false;
            state.error = null;
        },
        getAllCategoriesFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Get single category
        getCategoryRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        getCategorySuccess: (state) => {
            state.loading = false;
            state.error = null;
        },
        getCategoryFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Create category
        createCategoryRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        createCategorySuccess: (state) => {
            state.loading = false;
            state.error = null;
        },
        createCategoryFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Update category
        updateCategoryRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        updateCategorySuccess: (state) => {
            state.loading = false;
            state.error = null;
        },
        updateCategoryFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Delete category
        deleteCategoryRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteCategorySuccess: (state) => {
            state.loading = false;
            state.error = null;
        },
        deleteCategoryFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    }
});

export const {
    getAllCategoriesRequest,
    getAllCategoriesSuccess,
    getAllCategoriesFailure,
    getCategoryRequest,
    getCategorySuccess,
    getCategoryFailure,
    createCategoryRequest,
    createCategorySuccess,
    createCategoryFailure,
    updateCategoryRequest,
    updateCategorySuccess,
    updateCategoryFailure,
    deleteCategoryRequest,
    deleteCategorySuccess,
    deleteCategoryFailure
} = categorySlice.actions;

// Thunk actions

// Get all categories
export const getAllCategories = () => async (dispatch) => {
    dispatch(getAllCategoriesRequest());
    try {
        await dispatch(checkAndRefreshTokenIfNeeded());
        const token = localStorage.getItem("token");
        const response = await axios.get('/categories/', {
            headers: { Authorization: `Bearer ${token}` }
        });
        dispatch(getAllCategoriesSuccess(response.data));
        return response?.data;
    } catch (error) {
        dispatch(getAllCategoriesFailure(error.response?.data?.message || error.message));
        return [];
    }
};

// Get single category by id
export const getCategory = (id) => async (dispatch) => {
    dispatch(getCategoryRequest());
    try {
        await dispatch(checkAndRefreshTokenIfNeeded());
        const token = localStorage.getItem("token");
        const response = await axios.get(`/categories/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        dispatch(getCategorySuccess(response.data));
        return response?.data;
    } catch (error) {
        dispatch(getCategoryFailure(error.response?.data?.message || error.message));
        return null;
    }
};

// Create new category
export const createCategory = (categoryData) => async (dispatch) => {
    dispatch(createCategoryRequest());
    try {
        await dispatch(checkAndRefreshTokenIfNeeded());
        const token = localStorage.getItem("token");
        const response = await axios.post('/categories/', categoryData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        dispatch(createCategorySuccess(response.data));
        return response?.data;
    } catch (error) {
        dispatch(createCategoryFailure(error.response?.data?.message || error.message));
        return null;
    }
};

// Update category by id
export const updateCategory = (id, categoryData) => async (dispatch) => {
    dispatch(updateCategoryRequest());
    try {
        await dispatch(checkAndRefreshTokenIfNeeded());
        const token = localStorage.getItem("token");
        const response = await axios.patch(`/categories/${id}`, categoryData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        dispatch(updateCategorySuccess(response.data));
        return response?.data;
    } catch (error) {
        dispatch(updateCategoryFailure(error.response?.data?.message || error.message));
        return null;
    }
};

// Delete category by id
export const deleteCategory = (id) => async (dispatch) => {
    dispatch(deleteCategoryRequest());
    try {
        await dispatch(checkAndRefreshTokenIfNeeded());
        const token = localStorage.getItem("token");
        const response = await axios.delete(`/categories/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        dispatch(deleteCategorySuccess(id));
        return response?.data;
    } catch (error) {
        dispatch(deleteCategoryFailure(error.response?.data?.message || error.message));
        return null;
    }
};

export const categoryReducer = categorySlice.reducer;