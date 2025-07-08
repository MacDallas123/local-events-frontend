import { createSlice } from "@reduxjs/toolkit";
import axios from '../api/axios';
import { checkAndRefreshTokenIfNeeded } from './authReducer';

const initialState = {
    loading: false,
    error: null,
    token: null
};

const token = localStorage.getItem("token");

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        // create User
        createUserRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        createUserSuccess: (state) => {
            state.loading = false;
            state.error = null;
        },
        createUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Get any User
        getUserRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        getUserSuccess: (state) => {
            state.loading = false;
            state.error = null;
        },
        getUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Get Auth User
        meRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        meSuccess: (state) => {
            state.loading = false;
            state.error = null;
        },
        meFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Get All Users
        getAllUsersRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        getAllUsersSuccess: (state) => {
            state.loading = false;
            state.error = null;
        },
        getAllUsersFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Update user
        updateUserRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        updateUsersSuccess: (state) => {
            state.loading = false;
            state.error = null;
        },
        updateUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Delete user
        deleteUserRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteUserSuccess: (state) => {
            state.loading = false;
            state.error = null;
        },
        deleteUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // change user password
        changeUserPasswordRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        changeUserPasswordSuccess: (state) => {
            state.loading = false;
            state.error = null;
        },
        changeUserPasswordFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    }
});

export const {
    createUserRequest,
    createUserSuccess,
    createUserFailure,
    getUserRequest,
    getUserSuccess,
    getUserFailure,
    meRequest,
    meSuccess,
    meFailure,
    getAllUsersRequest,
    getAllUsersSuccess,
    getAllUsersFailure,
    updateUserRequest,
    updateUsersSuccess,
    updateUserFailure,
    deleteUserRequest,
    deleteUserSuccess,
    deleteUserFailure,
    changeUserPasswordRequest,
    changeUserPasswordSuccess,
    changeUserPasswordFailure
} = userSlice.actions;


// Get any user by id
export const getUser = (id) => async (dispatch) => {
    dispatch(getUserRequest());
    try {
        await dispatch(checkAndRefreshTokenIfNeeded());
        const token = localStorage.getItem("token");
        const response = await axios.get(`/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        dispatch(getUserSuccess(response.data));
        return response?.data;
    } catch (error) {
        dispatch(getUserFailure(error.response?.data?.message || error.message));
        return null;
    }
};

// Get authenticated user
export const getMe = () => async (dispatch) => {
    dispatch(meRequest());
    try {
        await dispatch(checkAndRefreshTokenIfNeeded());
        const token = localStorage.getItem("token");
        const response = await axios.get('/users/me', {
            headers: { Authorization: `Bearer ${token}` }
        });
        dispatch(meSuccess(response.data));
        return response?.data;
    } catch (error) {
        dispatch(meFailure(error.response?.data?.message || error.message));
        return null;
    }
};

// Get all users
export const getAllUsers = () => async (dispatch) => {
    dispatch(getAllUsersRequest());
    try {
        await dispatch(checkAndRefreshTokenIfNeeded());
        const token = localStorage.getItem("token");
        const response = await axios.get('/users/', {
            headers: { Authorization: `Bearer ${token}` }
        });
        dispatch(getAllUsersSuccess(response.data));
        return response?.data;
    } catch (error) {
        dispatch(getAllUsersFailure(error.response?.data?.message || error.message));
        return [];
    }
};

// Update user by id
export const updateUser = (id, userData) => async (dispatch) => {
    dispatch(updateUserRequest());
    try {
        await dispatch(checkAndRefreshTokenIfNeeded());
        const token = localStorage.getItem("token");
        const response = await axios.put(`/users/${id}`, userData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        dispatch(updateUsersSuccess(response.data));
        return response?.data;
    } catch (error) {
        dispatch(updateUserFailure(error.response?.data?.message || error.message));
        return null;
    }
};

// Change password
export const changePassword = (userData) => async (dispatch) => {
    dispatch(changeUserPasswordRequest());
    try {
        await dispatch(checkAndRefreshTokenIfNeeded());
        const token = localStorage.getItem("token");
        const response = await axios.post('/users/change-password', { 
            old_password: userData.currentPassword,
            new_password: userData.newPassword
        }, { headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }});
        dispatch(changeUserPasswordSuccess());
        return response?.data;
    } catch (error) {
        console.log("ERROR", error);
        dispatch(changeUserPasswordFailure(error.response?.data?.message || error.message));
        return null;
    }
};

// Delete user by id
export const deleteUser = (id) => async (dispatch) => {
    dispatch(deleteUserRequest());
    try {
        await dispatch(checkAndRefreshTokenIfNeeded());
        const token = localStorage.getItem("token");
        const response = await axios.delete(`/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        dispatch(deleteUserSuccess(response.data));
        return response?.data;
    } catch (error) {
        dispatch(deleteUserFailure(error.response?.data?.message || error.message));
        return null;
    }
};

export const createUser = (userData) => async (dispatch) => {
    dispatch(createUserRequest());
    try {
        await dispatch(checkAndRefreshTokenIfNeeded());
        const response = await axios.post('/users/', { ...userData, password: "12345678" }, { headers: { 
            "Content-Type": "application/json",
            "Authorization":  `Bearer ${token}`
        }});
        dispatch(createUserSuccess());
        
        return { status: response.status, datas: response?.data }
    } catch (error) {
        console.log("ERROR", error);
        dispatch(createUserFailure(error.response?.data?.message || error.message));
        return { status: 500 }
    }
};

export const userReducer = userSlice.reducer;

