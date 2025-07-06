import { useTheme } from "@emotion/react"
import { Box, Grid, Typography } from "@mui/material";
import StatCard from "../card/StatCard";
import { AppRegistration, Category, CheckCircle, LockClock, People, PrivateConnectivity, Public } from "@mui/icons-material";

const UserDashboard = ({ dashboardDatas }) => {
    const theme = useTheme();

    return (
        <>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 300, mb: 1, color: theme.palette.secondary.main }}>
                    Evènements
                </Typography>
            </Box>
            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                    title="Total d'inscriptions"
                    value={dashboardDatas?.total_registrations}
                    change={8}
                    icon={<AppRegistration />}
                    color={theme.palette.secondary.main}
                    subtitle="Ce mois-ci"
                    />
                </Grid>
            </Grid>

            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 1, color: theme.palette.secondary.main }}>
                    Liste des évènements
                </Typography>
            </Box>
            <Grid container spacing={3} sx={{ mb: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {dashboardDatas?.events.map((event) => {
                    return (
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="h6">
                                Nom: { event.title }
                            </Typography>
                            <Typography variant="h6">
                                Date: { event.date }
                            </Typography>
                            <Typography variant="h6">
                                Lieux: { event.location }
                            </Typography>
                        </Grid>
                    );
                })}
            </Grid>
        </>
    )
}

export default UserDashboard;