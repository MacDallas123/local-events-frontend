import { useTheme } from "@emotion/react"
import { Box, Button, Grid, Typography } from "@mui/material";
import StatCard from "../card/StatCard";
import { AppRegistration, Category, CheckCircle, LockClock, People, PrivateConnectivity, Public } from "@mui/icons-material";

const UserDashboard = ({ dashboardDatas, handleUnsubscribeToEvent }) => {
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
            <Grid container spacing={3} sx={{ mb: 4, display: "flex", alignItems: "start", justifyContent: "space-between", flexWrap: "wrap" }}>
                {dashboardDatas?.events.map((event) => {
                    return (
                        <Grid item xs={12} sm={6} md={4} key={event.event_id}>
                            <Box
                                sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    boxShadow: 3,
                                    background: theme.palette.background.paper,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                    minHeight: 200,
                                    color: "black"
                                }}
                            >
                                <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                                    {event.is_public ? <Public fontSize="small" sx={{ mr: 0.5 }} /> : <PrivateConnectivity fontSize="small" sx={{ mr: 0.5 }} />}
                                    {event.is_public ? "Public" : "Privé"}
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                    {event.titre}
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                    <LockClock fontSize="small" sx={{ mr: 1, color: theme.palette.secondary.main }} />
                                    <Typography variant="body2">{event.date}</Typography>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                    <Category fontSize="small" sx={{ mr: 1, color: theme.palette.secondary.main }} />
                                    <Typography variant="body2">{event.lieu}</Typography>
                                </Box>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    size="small"
                                    sx={{ mt: "auto", alignSelf: "flex-end" }}
                                    onClick={() => handleUnsubscribeToEvent(event.event_id)}
                                    startIcon={<CheckCircle />}
                                >
                                    Se désinscrire
                                </Button>
                            </Box>
                        </Grid>
                    );
                })}
            </Grid>
        </>
    )
}

export default UserDashboard;