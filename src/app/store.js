import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './authReducer';
import { userReducer } from './userReducer';
import { eventReducer } from './eventReducer';
import { dashboardReducer } from './dashboardReducer';
import { categoryReducer } from './categoryReducer';


export default configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        event: eventReducer,
        dashboard: dashboardReducer,
        category: categoryReducer
    }
});