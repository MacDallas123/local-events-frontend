import { createSlice } from "@reduxjs/toolkit";
import axios from '../api/axios';
import { checkAndRefreshTokenIfNeeded } from './authReducer';

const initialState = {
    loading: false,
    error: null
};

/* export const getAdminDashboard = createAsyncThunk('/dashboard/global', async ({ dispatch }) => {

    await dispatch(checkAndRefreshTokenIfNeeded());
    const response = await axios.get(`/dashboard/global`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response?.data;
}); */

export const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        getDashboardRequest: (state) => {
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
        }
    },
    /*extraReducers: (builder) => {
        builder
            .addCase(getAdminDashboard.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAdminDashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                localStorage.setItem('user', JSON.stringify(action.payload)); // Sauvegarde dans localStorage
            })
            .addCase(getAdminDashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }*/
});

export const {
    getDashboardRequest,
    getEventSuccess,
    getEventFailure
} = dashboardSlice.actions;

export const getDashboard = (userType) => async (dispatch) =>{
    
    let finalRoutes = [];
    switch(userType){
        case "super_admin":
        case "admin":
            finalRoutes = ["/dashboard/global", "/dashboard/user"];
        break;
        case "organizer":
            finalRoutes = ["/dashboard/organizer", "/dashboard/user"];
        break;
        default:
            finalRoutes = ["/dashboard/user"];
            break;
    }

    await dispatch(getDashboardRequest());

    let datas = [];
    try {
        await dispatch(checkAndRefreshTokenIfNeeded());

        console.log("ROUTES", finalRoutes);
        const token = localStorage.getItem("token");
        for(let i = 0; i < finalRoutes.length; i++)
        {
            let route = finalRoutes[i];
            let response = await axios.get(route, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if(response?.data != null && response?.data != undefined) datas.push(response?.data);
        }
        dispatch(getEventSuccess());
        return datas;
    } catch (error) {
        dispatch(getEventFailure(error.response?.data?.message || error.message));
        console.log("RESPONSE ERROR", error);
        return [];
    }
}

export const dashboardReducer = dashboardSlice.reducer;

