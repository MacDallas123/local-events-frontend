import { createSlice } from "@reduxjs/toolkit";
import axios from '../api/axios';
import { checkAndRefreshTokenIfNeeded } from './authReducer';

const initialState = {
    loading: false,
    error: null,
    token: null
};

export const eventSlice = createSlice({
    name: "event",
    initialState,
    reducers: {
        // Get any Event
        getEventRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        getEventSuccess: (state) => {
            state.loading = false;
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
        getUserEventsSuccess: (state) => {
            state.loading = false;
            state.error = null;
        },
        getUserEventsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Get All events
        getAllEventsRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        getAllEventsSuccess: (state) => {
            state.loading = false;
            state.error = null;
        },
        getAllEventsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Update event
        updateEventRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        updateEventSuccess: (state) => {
            state.loading = false;
            state.error = null;
        },
        updateEventFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

         // Delete event
        deleteEventRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteEventSuccess: (state) => {
            state.loading = false;
            state.error = null;
        },
        deleteEventFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Validate Event user
        validateEventRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        validateEventSuccess: (state) => {
            state.loading = false;
            state.error = null;
        },
        validateEventFailure: (state, action) => {
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
    validateEventRequest,
    validateEventSuccess,
    validateEventFailure
} = eventSlice.actions;


// Get any event by id
export const getEvent = (id) => async (dispatch) => {
    dispatch(getEventRequest());
    try {
        await dispatch(checkAndRefreshTokenIfNeeded());
        const token = localStorage.getItem("token");
        const response = await axios.get(`/events/${id}`, {
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
        const response = await axios.get('/events', {
            headers: { Authorization: `Bearer ${token}` }
        });
        dispatch(getUserEventsSuccess());
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
        const response = await axios.get('/events', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const respDatas = response?.data;
        
        // Utilisation de Promise.all pour attendre toutes les Promises
        /*const eventsWithDetails = await Promise.all(
            respDatas.events.map(async (event) => {
                try {
                    const userResponse = await dispatch(getUser(event.organisateur_id));
                    const categoryResponse = await dispatch(getCategory(event.categorie_id));

                    return {
                        ...event,
                        organisateur__: {
                            nom: userResponse?.nom || 'N/A',
                            email: userResponse?.email || 'N/A'
                        },
                        categorie__: {
                            nom: categoryResponse?.nom || 'N/A'
                        }
                    };
                } catch (error) {
                    console.error("Error fetching details for event:", event.id, error);
                    return {
                        ...event,
                        organisateur__: {
                            nom: 'N/A',
                            email: 'N/A'
                        },
                        categorie__: {
                            nom: 'N/A'
                        }
                    };
                }
            })
        );*/

        console.log("EVENTS WITH DETAILS", respDatas);
        dispatch(getAllEventsSuccess());
        return { 
            ...respDatas
        };
    } catch (error) {
        dispatch(getAllEventsFailure(error.response?.data?.message || error.message));
        return null;
    }
};

// Get puplic events
export const getPublicEvents = () => async (dispatch) => {
    dispatch(getAllEventsRequest());
    try {
        await dispatch(checkAndRefreshTokenIfNeeded());
        const token = localStorage.getItem("token");
        const response = await axios.get('/events/public', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const respDatas = response?.data;
        
        // Utilisation de Promise.all pour attendre toutes les Promises
        /*const eventsWithDetails = await Promise.all(
            respDatas.events.map(async (event) => {
                try {
                    //const userResponse = await dispatch(getUser(event.organisateur?.id));
                    const categoryResponse = await dispatch(getCategory(event.categorie_id));

                    return {
                        ...event,
                        organisateur__: {
                            nom: event.organisateur?.nom || 'N/A',
                            email: event.organisateur?.email || 'N/A'
                        },
                        categorie__: {
                            nom: categoryResponse?.nom || 'N/A'
                        }
                    };
                } catch (error) {
                    console.error("Error fetching details for event:", event.id, error);
                    return {
                        ...event,
                        organisateur__: {
                            nom: 'N/A',
                            email: 'N/A'
                        },
                        categorie__: {
                            nom: 'N/A'
                        }
                    };
                }
            })
        );*/

        console.log("EVENTS WITH DETAILS", respDatas);
        dispatch(getAllEventsSuccess());
        return { 
            ...respDatas
        };
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
        dispatch(updateEventSuccess());
        return response?.data;
    } catch (error) {
        console.log("RESPONSE ERROR", error);
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
        dispatch(deleteEventSuccess());
        return response?.data;
    } catch (error) {
        dispatch(deleteEventFailure(error.response?.data?.message || error.message));
        return null;
    }
};

// Validate event by id
export const validateEvent = (id) => async (dispatch) => {
    dispatch(validateEventRequest());
    try {
        await dispatch(checkAndRefreshTokenIfNeeded());
        const token = localStorage.getItem("token");
        const response = await axios.patch(`/events/${id}/valider`, {est_valide: 1}, {
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        dispatch(validateEventSuccess());
        return response?.data;
    } catch (error) {
        console.log("RESPONSE ERROR", error);
        dispatch(validateEventFailure(error.response?.data?.message || error.message));
        return null;
    }
};

export const createEvent = (eventData) => async (dispatch) => {
    dispatch(updateEventRequest());
    try {
        await dispatch(checkAndRefreshTokenIfNeeded());
        const token = localStorage.getItem("token");
        console.log("FORM DATA", eventData);
        const response = await axios.post('/events', eventData, {
            headers: { 
                "Content-Type" : "multipart/form-data",
                Authorization: `Bearer ${token}` }
        });
        dispatch(updateEventSuccess());
        console.log("RESPONSE", response);
        return response?.data;
    } catch (error) {
        console.error("RESPONSE ERROR", error);
        dispatch(updateEventFailure(error.response?.data?.message || error.message));
        return null;
    }
};

export const eventReducer = eventSlice.reducer;

