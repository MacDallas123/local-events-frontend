
import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Outlet } from "react-router-dom";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";


const backgroundImage =
  "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80')"; // Image d'événement

const Auth = () => {
  const theme = useTheme();

  return (
    <>
        <main>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    minHeight: "100vh",
                    "&:before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    background: "rgba(34, 34, 58, 0.7)",
                    zIndex: 1,
                    },
                }}
            >
                <Paper
                    elevation={6}
                    sx={{
                    position: "relative",
                    zIndex: 2,
                    p: 4,
                    minWidth: 350,
                    maxWidth: 400,
                    borderRadius: 3,
                    background: "rgba(255,255,255,0.95)",
                    boxShadow: `0 8px 32px 0 ${theme.palette.primary.main}33`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    }}
                >
                <CalendarMonthIcon
                    sx={{
                        fontSize: 56,
                        color: theme.palette.primary.main,
                        mb: 1,
                    }}
                />
                    <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        mb: 2,
                        fontWeight: 700,
                        color: theme.palette.primary.main,
                        letterSpacing: 1,
                    }}
                    >
                    LocalEvents
                    </Typography>
                    <Outlet />
                </Paper>
            </Box>
        </main>
    </>
  );
}

export default Auth;