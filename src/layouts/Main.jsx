import { Box, useTheme, alpha } from "@mui/material";
import { Outlet } from "react-router-dom";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";

const Main = () => {
  const theme = useTheme();
  
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
      }
    }}>
      <Box sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1200
      }}>
        <Header />
      </Box>
      
      {/* Main Content Area */}
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
      
      <Footer />
    </Box>
  );
};

export default Main;