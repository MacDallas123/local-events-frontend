import { createSlice } from "@reduxjs/toolkit";
import axios from '../api/axios';
import { checkAndRefreshTokenIfNeeded } from './authReducer';

const initialState = {
    loading: false,
    error: null
};

export const registrationSlice = createSlice({
    name: "registration",
    initialState,
    reducers: {
        // Register to event
        registerToEventRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        registerToEventSuccess: (state) => {
            state.loading = false;
            state.error = null;
        },
        registerToEventFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Unregister from event
        unregisterFromEventRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        unregisterFromEventSuccess: (state) => {
            state.loading = false;
            state.error = null;
        },
        unregisterFromEventFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Delete registration (Admin)
        deleteRegistrationRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteRegistrationSuccess: (state) => {
            state.loading = false;
            state.error = null;
        },
        deleteRegistrationFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Get all registrations
        getAllRegistrationsRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        getAllRegistrationsSuccess: (state) => {
            state.loading = false;
            state.error = null;
        },
        getAllRegistrationsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Get registrations by event
        getRegistrationsByEventRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        getRegistrationsByEventSuccess: (state) => {
            state.loading = false;
            state.error = null;
        },
        getRegistrationsByEventFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    }
});

export const {
    registerToEventRequest,
    registerToEventSuccess,
    registerToEventFailure,
    unregisterFromEventRequest,
    unregisterFromEventSuccess,
    unregisterFromEventFailure,
    deleteRegistrationRequest,
    deleteRegistrationSuccess,
    deleteRegistrationFailure,
    getAllRegistrationsRequest,
    getAllRegistrationsSuccess,
    getAllRegistrationsFailure,
    getRegistrationsByEventRequest,
    getRegistrationsByEventSuccess,
    getRegistrationsByEventFailure
} = registrationSlice.actions;

// Thunk actions

// Register to event
export const registerToEvent = (eventId) => async (dispatch) => {
    dispatch(registerToEventRequest());
    try {
        await dispatch(checkAndRefreshTokenIfNeeded());
        const token = localStorage.getItem("token");
        const response = await axios.post('/registrations', 
            { event_id: eventId },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        dispatch(registerToEventSuccess(response.data));
        return response?.data;
    } catch (error) {
        console.log("RESPONSE ERROR", error);
        dispatch(registerToEventFailure(error.response?.data?.message || error.message));
        return null;
    }
};

// Unregister from event
export const unregisterFromEvent = (eventId) => async (dispatch) => {
    dispatch(unregisterFromEventRequest());
    try {
        await dispatch(checkAndRefreshTokenIfNeeded());
        const token = localStorage.getItem("token");
        const response = await axios.delete(`/registrations/event/${eventId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        dispatch(unregisterFromEventSuccess(response.data));
        return response?.data;
    } catch (error) {
        console.log("RESPONSE ERROR", error);
        dispatch(unregisterFromEventFailure(error.response?.data?.message || error.message));
        return null;
    }
};

// Delete registration (Admin)
export const deleteRegistration = (registrationId) => async (dispatch) => {
    dispatch(deleteRegistrationRequest());
    try {
        await dispatch(checkAndRefreshTokenIfNeeded());
        const token = localStorage.getItem("token");
        const response = await axios.delete(`/registrations/${registrationId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        dispatch(deleteRegistrationSuccess(response.data));
        return response?.data;
    } catch (error) {
        dispatch(deleteRegistrationFailure(error.response?.data?.message || error.message));
        return null;
    }
};

// Get all registrations
export const getAllRegistrations = (isAdmin = false) => async (dispatch) => {
    dispatch(getAllRegistrationsRequest());
    try {
        await dispatch(checkAndRefreshTokenIfNeeded());
        const token = localStorage.getItem("token");
        const queryParam = isAdmin ? '?all=1' : '';
        const response = await axios.get(`/registrations/${queryParam}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        dispatch(getAllRegistrationsSuccess(response.data));
        return response?.data;
    } catch (error) {
        dispatch(getAllRegistrationsFailure(error.response?.data?.message || error.message));
        return [];
    }
};

// Get registrations by event
export const getRegistrationsByEvent = (eventId) => async (dispatch) => {
    dispatch(getRegistrationsByEventRequest());
    try {
        await dispatch(checkAndRefreshTokenIfNeeded());
        const token = localStorage.getItem("token");
        const response = await axios.get(`/registrations/event/${eventId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        dispatch(getRegistrationsByEventSuccess(response.data));
        return response?.data;
    } catch (error) {
        dispatch(getRegistrationsByEventFailure(error.response?.data?.message || error.message));
        return null;
    }
};

export const registrationReducer = registrationSlice.reducer;