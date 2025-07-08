import { 
  AppBar, 
  Box, 
  Button, 
  Toolbar, 
  Typography, 
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  useTheme,
  alpha
} from "@mui/material";
import { 
  CalendarMonth, 
  Add, 
  Person, 
  KeyboardArrowDown,
  Notifications,
  Search,
  Home,
  Public
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../app/authReducer";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    const response = await dispatch(logout());
    if(response.status == 200) {
      localStorage.clear();
      location.href= "/";
      handleMenuClose();
    }
  }

  const handleGoToAdmin = () => {
    navigate("/admin");

    handleMenuClose();
  }

  const handleGoToProfile = () => {
    navigate("/profile");

    handleMenuClose();
  }

  useEffect(() => {
    const authUser = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(authUser);
  }, []);

  return (
    <AppBar 
      position="relative" 
      elevation={0}
      sx={{ 
        // background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
        boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
        overflow: "auto"
      }}
    >
      <Toolbar sx={{ minHeight: '70px !important', px: { xs: 2, md: 4, display: "flex" } }}>
        {/* Logo and Brand */}
        <Box display="flex" alignItems="center" sx={{ mr: 4, flex: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: {xs: 36, md: 48},
              height: {xs: 36, md: 48},
              borderRadius: '12px',
              background: alpha(theme.palette.common.white, 0.15),
              backdropFilter: 'blur(10px)',
              mr: 2,
              border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
            }}
          >
            <CalendarMonth sx={{ color: 'white', fontSize: { xs: 18, md: 24} }} />
          </Box>
          <Box>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 800,
                color: 'white',
                letterSpacing: '-0.5px',
                lineHeight: 1.2,
                fontSize: { xs: '1.2rem', md: '1.7rem'},
                flex: 1
              }}
              
            >
                LocalEvents
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: alpha(theme.palette.common.white, 0.8),
                fontSize: { xs: '0.5rem', md: '0.7rem'},
                fontWeight: 500,
                letterSpacing: {xs: '0.4px', md: '0.5px'},
              }}
            >
              GESTION D'ÉVÉNEMENTS
            </Typography>
          </Box>
        </Box>

        {/* Navigation Items - Desktop */}
        <Box 
          sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            alignItems: 'center',
            gap: 1,
            flexGrow: 1,
            ml: 4,
          }}
        >
          {/* <Button
            color="inherit"
            startIcon={<Search />}
            sx={{
              color: alpha(theme.palette.common.white, 0.9),
              textTransform: 'none',
              fontWeight: 500,
              px: 2,
              py: 1,
              borderRadius: '10px',
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.1),
              },
            }}
          >
            Découvrir
          </Button> 
          <Button
            color="inherit"
            sx={{
              color: alpha(theme.palette.common.white, 0.9),
              textTransform: 'none',
              fontWeight: 500,
              px: 2,
              py: 1,
              borderRadius: '10px',
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.1),
              },
            }}
          >
            Mes événements
          </Button>*/}
        </Box>

        {/* Action Buttons */}
        <Box display="flex" alignItems="center" gap={1.5}>
          {/* Home */}
          <IconButton
            sx={{
              color: 'white',
              backgroundColor: alpha(theme.palette.common.white, 0.1),
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.2),
              },
            }}

            onClick={() => { navigate('/'); }}
          >
            <Home />
          </IconButton>

          {currentUser != null ? (
            <IconButton
              sx={{
                color: 'white',
                backgroundColor: alpha(theme.palette.common.white, 0.1),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.common.white, 0.2),
                },
              }}

              onClick={() => { navigate('/explore'); }}
            >
              <Public />
            </IconButton>
          ) : null }

          {/* Notifications */}
          {/* <IconButton
            sx={{
              color: 'white',
              backgroundColor: alpha(theme.palette.common.white, 0.1),
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.2),
              },
            }}
          >
            <Notifications />
          </IconButton> */}

          {/* Create Event Button */}
          {/* <Button
            variant="contained"
            // startIcon={<Add />}
            sx={{
              backgroundColor: alpha(theme.palette.common.white, 0.2),
              color: 'white',
              textTransform: 'none',
              fontWeight: 600,
              px: { xs: 1, md:3 },
              py: 1.2,
              borderRadius: '12px',
              border: `1px solid ${alpha(theme.palette.common.white, 0.3)}`,
              backdropFilter: 'blur(10px)',
              boxShadow: {
                md: `0 4px 12px ${alpha(theme.palette.common.black, 0.2)}`
              },
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.3),
                transform: 'translateY(-1px)',
                boxShadow: {
                  md: `0 6px 20px ${alpha(theme.palette.common.black, 0.3)}`
                },
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <Add />
            <Typography sx={{ display: { xs: 'none', md: 'flex' }, ml: 1 }}>
              Créer un événement
            </Typography>
          </Button> */}

          {/* User Menu */}
          {currentUser != null ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                color="inherit"
                onClick={handleMenuOpen}
                endIcon={<KeyboardArrowDown />}
                sx={{
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 500,
                  px: 2,
                  py: 1,
                  borderRadius: '10px',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                  },
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 28, 
                    height: 28, 
                    mr: 1,
                    backgroundColor: alpha(theme.palette.secondary.main, 0.3),
                    fontSize: '0.8rem',
                  }}
                >
                  <Person fontSize="small" />
                </Avatar>
                <Typography sx={{ display: { xs: 'none', md: 'flex' } }}>
                  Mon compte
                </Typography>
              </Button>
              
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1,
                    borderRadius: '12px',
                    minWidth: 200,
                    boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.2)}`,
                  },
                }}
              >
                <MenuItem onClick={handleGoToAdmin} sx={{ color: 'blue'}}>
                  Tableau de bord
                </MenuItem>
                <MenuItem onClick={handleGoToProfile}>Mon profil</MenuItem>
                {/* <MenuItem onClick={handleMenuClose}>Mes événements</MenuItem> */}
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                  Déconnexion
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                color="inherit"
                onClick={() => navigate('/auth/login')}
                sx={{
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 500,
                  px: 2,
                  py: 1,
                  borderRadius: '10px',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                  },
                }}
              >
                Connexion
              </Button>
              <Button 
                variant="contained"
                onClick={() => navigate('/auth/register')}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  px: 2,
                  py: 1,
                  borderRadius: '10px',
                  backgroundColor: theme.palette.secondary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.secondary.dark,
                  },
                }}
              >
                Inscription
              </Button>
            </Box>
          )}
        </Box>


      </Toolbar>

      {/* Status Bar */}
      <Box
        sx={{
          backgroundColor: alpha(theme.palette.common.white, 0.05),
          px: { xs: 2, md: 4 },
          py: 0.5,
          borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexWrap: "wrap",
          justifyItems: "center"
        }}
      >
        <Chip
          label="🎉 Nouveau: Creer des evenements par categorie"
          size="small"
          sx={{
            backgroundColor: alpha(theme.palette.secondary.main, 0.2),
            color: 'white',
            fontSize: '0.75rem',
            fontWeight: 500,
            border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
          }}
        />
        <Typography
          variant="caption"
          sx={{
            color: alpha(theme.palette.common.white, 0.7),
            fontSize: '0.7rem',
          }}
        >
          Organisez vos événements en toute simplicité
        </Typography>
      </Box>
    </AppBar>
  );
};

export default Header;