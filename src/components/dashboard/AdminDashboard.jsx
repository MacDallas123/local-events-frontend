import { useTheme } from "@emotion/react"
import { Box, Grid, Typography } from "@mui/material";
import StatCard from "../card/StatCard";
import { AppRegistration, Category, CheckCircle, Event, LockClock, People, PrivateConnectivity, Public } from "@mui/icons-material";

const AdminDashboard = ({ dashboardDatas }) => {
    const theme = useTheme();

    return (
        <>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 300, mb: 1, color: theme.palette.secondary.main }}>
                    Section administration
                </Typography>
            </Box>
            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4, display: "flex", alignItems: "start", justifyContent: "start" }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                    title="Utilisateurs"
                    value={dashboardDatas?.total_users}
                    change={12}
                    icon={<People />}
                    color={theme.palette.primary.main}
                    subtitle="Utilisateurs actifs"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                    title="Organisateurs"
                    value={dashboardDatas?.total_organizers}
                    change={5}
                    icon={<Category />}
                    color={theme.palette.success.main}
                    subtitle="Catégories actives"
                    />
                </Grid>
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
                    color="#296036FF"
                    subtitle="Ce mois-ci"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                    title="Événements privés"
                    value={dashboardDatas?.total_private_events}
                    change={8}
                    icon={<PrivateConnectivity />}
                    color="#B72242FF"
                    subtitle="Ce mois-ci"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                    title="Événements publiques"
                    value={dashboardDatas?.total_public_events}
                    change={8}
                    icon={<Public />}
                    color="#3225EBFF"
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
                    color="#850000FF"
                    subtitle="Ce mois-ci"
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default AdminDashboard;