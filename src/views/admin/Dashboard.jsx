// Dashboard.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  LinearProgress,
  Chip,
  useTheme,
  alpha,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Button,
  colors
} from '@mui/material';
import {
  TrendingUp,
  People,
  Event,
  Category,
  MoreVert,
  Visibility,
  CalendarToday,
  PersonAdd,
  EventAvailable,
  Analytics,
  NotificationsActive,
  Schedule,
  LockClock,
  PrivateConnectivity,
  Public,
  CheckCircle,
  AppRegistration
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import Footer from '../../components/footer/Footer';
import StatCard from '../../components/card/StatCard';
import { getDashboard } from '../../app/dashboardReducer';
import { useDispatch } from 'react-redux';
import AdminDashboard from '../../components/dashboard/AdminDashboard';
import OrganizerDashboard from '../../components/dashboard/OrganizerDashboard';
import UserDashboard from '../../components/dashboard/UserDashboard';
import { unregisterFromEvent } from '../../app/registrationReducer';

const Dashboard = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [dashboardDatas, setDasboardDatas] = useState([]);
    const [currentUserRole, setCurrentUserRole] = useState("user");

    const fetchAdminDashboard = async () => {
        const authUser = JSON.parse(localStorage.getItem("user"));
        const response = await dispatch(getDashboard(authUser?.role || "user"));
        console.log("ADMIN DASHBOARD DATAS", response);
        setDasboardDatas(response);
        // const response2 = await dispatch(getDashboard("organizer"));
        // console.log("Organizer DASHBOARD DATAS", response2);

        setCurrentUserRole(authUser?.role);
    }
    useEffect(() => {
        fetchAdminDashboard();
    }, []);

    const handleUnsubscribeToEvent = async (eventId) => {
        const response = await dispatch(unregisterFromEvent(eventId));
        console.log("UREGISTER REPONSE", response);
        fetchAdminDashboard();
    }
  return (
    <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: theme.palette.primary.main }}>
            Tableau de bord
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Vue d'ensemble de votre plateforme LocalEvents
        </Typography>
        </Box>
    
        
        {(currentUserRole == "super_admin" || currentUserRole == "admin") ? <AdminDashboard dashboardDatas={dashboardDatas[0]} /> : null }
        
        {(currentUserRole == "organizer") ? <OrganizerDashboard dashboardDatas={dashboardDatas[0]} /> : null }
        
        {dashboardDatas?.length > 0 ? 
            <UserDashboard 
                dashboardDatas={dashboardDatas[dashboardDatas?.length - 1]} 
                handleUnsubscribeToEvent={handleUnsubscribeToEvent} /> : null}
        {/* {(currentUserRole == "super_admin" || currentUserRole == "admin" || currentUserRole == "organizer" || currentUserRole == "user") ? <UserDashboard dashboardDatas={dashboardDatas[1]} /> : null } */}
        
        
        {/* Charts Row */}
        {/* <Grid container spacing={3} sx={{ mb: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: '16px', height: '400px', minWidth: { md: "300px" } }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Évolution mensuelle
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
                <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="events" stroke={theme.palette.primary.main} strokeWidth={3} />
                <Line type="monotone" dataKey="users" stroke={theme.palette.secondary.main} strokeWidth={3} />
                </LineChart>
            </ResponsiveContainer>
            </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: '16px', minWidth: { md: "300px" } }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Répartition par catégorie
            </Typography>
            <ResponsiveContainer width="100%" height="70%">
                <PieChart>
                <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                >
                    {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip />
                </PieChart>
            </ResponsiveContainer>
            <Box sx={{ mt: 2 }}>
                {categoryData.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ width: 12, height: 12, backgroundColor: item.color, borderRadius: 1, mr: 1 }} />
                    <Typography variant="caption" sx={{ flex: 1 }}>
                    {item.name}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {item.value}%
                    </Typography>
                </Box>
                ))}
            </Box>
            </Paper>
        </Grid>
        </Grid> */}

      <Footer />
    </Box>
  );
};

export default Dashboard;
