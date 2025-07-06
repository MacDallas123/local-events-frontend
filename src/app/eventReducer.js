import { createSlice } from "@reduxjs/toolkit";
import axios from '../api/axios';
import { checkAndRefreshTokenIfNeeded } from './authReducer';

const initialState = {
    loading: false,
    datas: null,
    error: null,
    token: null
};

export const eventSlice = createSlice({
    name: "event",
    initialState,
    reducers: {
        // Get any User
        getEventRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        getEventSuccess: (state, action) => {
            state.loading = false;
            state.datas = action.payload;
            state.error = null;
        },
        getEventFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Get Auth User Events
        getUserEventsRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        getUserEventsSuccess: (state, action) => {
            state.loading = false;
            state.datas = action.payload;
            state.error = null;
        },
        getUserEventsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Get All Users
        getAllEventsRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        getAllEventsSuccess: (state, action) => {
            state.loading = false;
            state.datas = action.payload;
            state.error = null;
        },
        getAllEventsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Update user
        updateEventRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        updateEventSuccess: (state, action) => {
            state.loading = false;
            state.datas = action.payload;
            state.error = null;
        },
        updateEventFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

         // Delete user
        deleteEventRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteEventSuccess: (state, action) => {
            state.loading = false;
            state.datas = action.payload;
            state.error = null;
        },
        deleteEventFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    }
});

export const {
    getEventRequest,
    getEventSuccess,
    getEventFailure,
    getUserEventsRequest,
    getUserEventsSuccess,
    getUserEventsFailure,
    getAllEventsRequest,
    getAllEventsSuccess,
    getAllEventsFailure,
    updateEventRequest,
    updateEventSuccess,
    updateEventFailure,
    deleteEventRequest,
    deleteEventSuccess,
    deleteEventFailure,
} = eventSlice.actions;


// Get any event by id
export const getEvent = (id) => async (dispatch) => {
    dispatch(getEventRequest());
    try {
        await dispatch(checkAndRefreshTokenIfNeeded());
        const token = localStorage.getItem("token");
        const response = await axios.get(`/event/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        dispatch(getEventSuccess(response.data));
        return response?.data;
    } catch (error) {
        dispatch(getEventFailure(error.response?.data?.message || error.message));
        return null;
    }
};

// Get authenticated user events
export const getUserEvents = () => async (dispatch) => {
    dispatch(getUserEventsRequest());
    try {
        await dispatch(checkAndRefreshTokenIfNeeded());
        const token = localStorage.getItem("token");
        const response = await axios.get('/events/', {
            headers: { Authorization: `Bearer ${token}` }
        });
        dispatch(getUserEventsSuccess(response.data));
        return response?.data;
    } catch (error) {
        dispatch(getUserEventsFailure(error.response?.data?.message || error.message));
        return null;
    }
};

// Get all events
export const getAllEvents = () => async (dispatch) => {
    dispatch(getAllEventsRequest());
    try {
        await dispatch(checkAndRefreshTokenIfNeeded());
        const token = localStorage.getItem("token");
        const response = await axios.get('/events/', {
            headers: { Authorization: `Bearer ${token}` }
        });
        dispatch(getAllEventsSuccess(response.data));
        return response?.data;
    } catch (error) {
        dispatch(getAllEventsFailure(error.response?.data?.message || error.message));
        return null;
    }
};

// Update event by id
export const updateEvent = (id, userData) => async (dispatch) => {
    dispatch(updateEventRequest());
    try {
        await dispatch(checkAndRefreshTokenIfNeeded());
        const token = localStorage.getItem("token");
        const response = await axios.put(`/events/${id}`, userData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        dispatch(updateEventSuccess(response.data));
        return response?.data;
    } catch (error) {
        dispatch(updateEventFailure(error.response?.data?.message || error.message));
        return null;
    }
};

// Delete event by id
export const deleteEvent = (id) => async (dispatch) => {
    dispatch(deleteEventRequest());
    try {
        await dispatch(checkAndRefreshTokenIfNeeded());
        const token = localStorage.getItem("token");
        const response = await axios.delete(`/events/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        dispatch(deleteEventSuccess(response.data));
        return response?.data;
    } catch (error) {
        dispatch(deleteEventFailure(error.response?.data?.message || error.message));
        return null;
    }
};

export const eventReducer = eventSlice.reducer;

