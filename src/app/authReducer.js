import { createSlice } from '@reduxjs/toolkit';
import axios from '../api/axios';

// Initial State
const initialState = {
    loading: false,
    user: null,
    error: null,
    token: null,
    target: null
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            //state.user = action.payload.user;
            //state.token = action.payload.access_token;
            state.error = null;
            state.target = "/";
            console.log("ACTION", action);
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        registerRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        registerSuccess: (state) => {
            state.loading = false;
            state.error = null;
            state.target = "/auth/login";
        },
        registerFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        refreshAccessToken: (state, action) => {
            state.token = action.payload;
        },
        logoutRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        logoutSuccess: (state) => {
            state.loading = false;
            state.error = null;
            state.target = "/auth/login";
        },
        logoutFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export const {
    loginRequest,
    loginSuccess,
    loginFailure,
    registerRequest,
    registerSuccess,
    registerFailure,
    clearError,
    refreshAccessToken,
    logoutRequest,
    logoutSuccess,
    logoutFailure
} = authSlice.actions;

// Ajoute la date d'expiration du token (1h)
function setTokenWithExpiry(token) {
    localStorage.setItem("token", token);
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // +1h
    localStorage.setItem("token_expiry", expiry.toISOString());
}

// Vérifie si le token est expiré et le rafraîchit si besoin
export const checkAndRefreshTokenIfNeeded = () => async (dispatch) => {
    const expiry = localStorage.getItem("token_expiry");
    if(!expiry) await dispatch(refresh());
    if (expiry && new Date() > new Date(expiry)) {
        await dispatch(refresh());
    }
};

export const login = (credentials) => async (dispatch) => {
    dispatch(loginRequest());
    try {
        const response = await axios.post('/auth/login', credentials);
        dispatch(loginSuccess(response.data));
        setTokenWithExpiry(response.data.access_token);
        localStorage.setItem("refresh", response.data.refresh_token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        //location.href= "/"
        return { status: response?.status, datas: response?.data };
    } catch (error) {
        dispatch(loginFailure(error.response?.data?.message || error.message));
        return { status: 500 }
    }
};

export const register = (userData) => async (dispatch) => {
    dispatch(registerRequest());
    try {
        await dispatch(checkAndRefreshTokenIfNeeded());
        if(userData.password == userData.confirmPassword) {
            const response = await axios.post('/auth/register', { ...userData, "nom": userData.name }, { headers: { 
                "Content-Type": "application/json"
            }});
            dispatch(registerSuccess());
            location.href = "/auth/login";
        } else {
            dispatch(registerFailure("Les mots de passe ne correspondent pas"));
        }
    } catch (error) {
        console.log("ERROR", error);
        dispatch(registerFailure(error.response?.data?.message || error.message));
    }
};

export const refresh = () => async (dispatch) => {
    try {
        const refreshToken = localStorage.getItem("refresh");
        const response = await axios.post('/auth/refresh', {}, { headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${refreshToken}`
        }});
        dispatch(refreshAccessToken(response.data.access_token));
        setTokenWithExpiry(response.data.access_token);
        return response.data.access_token;
    } catch (error) {
        console.log("ERROR", error);
        // Si le refresh échoue, on force la déconnexion
        dispatch(logoutSuccess());
        localStorage.clear();
        location.href = "/auth/login";
        throw error;
    }
}

export const logout = () => async (dispatch) => {
    dispatch(logoutRequest());
    try {
        await dispatch(checkAndRefreshTokenIfNeeded());
        const token = localStorage.getItem("token");
        const response = await axios.post('/auth/logout', {}, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        dispatch(logoutSuccess());
        localStorage.clear();
        console.log("RESPONSE", response);
        return { status: response?.status, datas: response?.data };
    } catch (error) {
        dispatch(logoutFailure(error.response?.data?.message || error.message));
    }
}

export const authReducer = authSlice.reducer;
