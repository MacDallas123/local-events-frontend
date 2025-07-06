import { useTheme } from "@emotion/react"
import { Box, Grid, Typography } from "@mui/material";
import StatCard from "../card/StatCard";
import { AppRegistration, Category, CheckCircle, LockClock, People, PrivateConnectivity, Public } from "@mui/icons-material";

const OrganizerDashboard = ({ dashboardDatas }) => {
    const theme = useTheme();

    return (
        <>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 300, mb: 1, color: theme.palette.secondary.main }}>
                    Section Organisateur
                </Typography>
            </Box>
            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                    title="Événements"
                    value={dashboardDatas?.total_events}
                    change={8}
                    icon={<Event />}
                    color={theme.palette.secondary.main}
                    subtitle="Ce mois-ci"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                    title="Événements en attente"
                    value={dashboardDatas?.total_pending_events}
                    change={8}
                    icon={<LockClock />}
                    color="#A33F26FF"
                    subtitle="Ce mois-ci"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                    title="Total d'enregistement"
                    value={dashboardDatas?.total_registrations}
                    change={8}
                    icon={<AppRegistration />}
                    color={theme.palette.secondary.main}
                    subtitle="Ce mois-ci"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                    title="Événements validés"
                    value={dashboardDatas?.total_validated_events}
                    change={8}
                    icon={<CheckCircle />}
                    color="#008504FF"
                    subtitle="Ce mois-ci"
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default OrganizerDashboard;