import { alpha, Box, useTheme, useMediaQuery } from "@mui/material";
import AdminSidebar from "../components/sidebar/AdminSidebar";
import { Outlet } from "react-router-dom";
import Header from "../components/header/Header";

const drawerWidth = 280;

const Admin = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
    <Box sx={{
      width: '100%',
      maxWidth: 'none',
      margin: 0,
      padding: 0,
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
      position: 'relative',
      // Adding subtle pattern overlay
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `radial-gradient(circle at 20% 80%, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 50%),
                          radial-gradient(circle at 80% 20%, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 50%)`,
        pointerEvents: 'none',
        zIndex: -1,
        display: "flex",
        flexDirection: "row"
      }
    }}>
      <AdminSidebar />
      
      {/* Container pour le Header avec décalage */}
      <Box 
        sx={{ 
          position: "fixed",
          top: 0,
          left: { xs: 0, md: `${drawerWidth}px` }, // Décale le header en desktop
          right: 0,
          zIndex: 1200, // S'assure que le header reste au-dessus
          transition: 'left 0.2s',
        }}
      >
        <Header />
      </Box>

      {/* Main Content Area */}
      <Box 
        sx={{ 
          ml: { md: `${drawerWidth}px` }, // Décale le contenu en desktop
          transition: 'margin-left 0.2s',
        }}
      >
        <Box 
            sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            pt: { xs: '140px', md: '120px' }, // Account for header height
            position: 'relative',
            zIndex: 1,
            }}
        >
                <Outlet />
        </Box>
      </Box>
    </Box>
    );
}

export default Admin;