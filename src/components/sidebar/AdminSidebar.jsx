import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  useTheme,
  alpha,
  Avatar,
  Chip,
  IconButton,
  useMediaQuery,
  Collapse
} from "@mui/material";
import {
  Dashboard,
  Category,
  People,
  Event,
  Settings,
  AdminPanelSettings,
  ExpandLess,
  ExpandMore,
  Analytics,
  Notifications,
  Menu as MenuIcon,
  Close,
  AppRegistrationRounded
} from "@mui/icons-material";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleExpandClick = (item) => {
    setExpandedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const menuItems = [
    {
      id: 'dashboard',
      title: 'Tableau de bord',
      icon: <Dashboard />,
      path: '/admin/dashboard',
      color: theme.palette.primary.main,
    },
    {
      id: 'categories',
      title: 'Gestion des Catégories',
      icon: <Category />,
      path: '/admin/categories',
      color: theme.palette.secondary.main,
      /* subItems: [
        { title: 'Toutes les catégories', path: '/admin/categories' },
        { title: 'Ajouter une catégorie', path: '/admin/categories/create' },
      ] */
    },
    {
      id: 'users',
      title: 'Gestion des Utilisateurs',
      icon: <People />,
      path: '/admin/users',
      color: theme.palette.info.main,
    },
    {
      id: 'events',
      title: 'Gestion des Événements',
      icon: <Event />,
      path: '/admin/events',
      color: theme.palette.success.main,
      /* subItems: [
        { title: 'Tous les événements', path: '/admin/events' },
        { title: 'Événements en attente', path: '/admin/events/pending' },
        { title: 'Événements approuvés', path: '/admin/events/approved' },
        { title: 'Événements terminés', path: '/admin/events/completed' },
      ] */
    },
    {
      id: 'events',
      title: 'Gestion des Inscriptions',
      icon: <AppRegistrationRounded />,
      path: '/admin/registrations',
      color: theme.palette.error.main,
      /* subItems: [
        { title: 'Tous les événements', path: '/admin/events' },
        { title: 'Événements en attente', path: '/admin/events/pending' },
        { title: 'Événements approuvés', path: '/admin/events/approved' },
        { title: 'Événements terminés', path: '/admin/events/completed' },
      ] */
    },
    /*{
      id: 'analytics',
      title: 'Analyses',
      icon: <Analytics />,
      path: '/admin/analytics',
      color: theme.palette.warning.main,
    },
    {
      id: 'settings',
      title: 'Paramètres',
      icon: <Settings />,
      path: '/admin/settings',
      color: theme.palette.grey[600],
    },*/
  ];

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const drawerWidth = 280;

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          p: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 70% 30%, ${alpha(theme.palette.common.white, 0.1)} 0%, transparent 50%)`,
            pointerEvents: 'none',
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                backgroundColor: alpha(theme.palette.common.white, 0.2),
                mr: 2,
              }}
            >
              <AdminPanelSettings />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Administration
            </Typography>
          </Box>
          {isMobile && (
            <IconButton
              color="inherit"
              onClick={handleDrawerToggle}
              sx={{ p: 0 }}
            >
              <Close />
            </IconButton>
          )}
        </Box>
        
        <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.75rem' }}>
          Panneau de contrôle LocalEvents
        </Typography>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ px: 2, py: 1 }}>
          {menuItems.map((item) => (
            <Box key={item.id} sx={{ mb: 0.5 }}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    if (item.subItems) {
                      handleExpandClick(item.id);
                    } else {
                      handleNavigate(item.path);
                    }
                  }}
                  sx={{
                    borderRadius: '12px',
                    mb: 0.5,
                    backgroundColor: isActive(item.path) 
                      ? alpha(item.color, 0.1)
                      : 'transparent',
                    border: isActive(item.path) 
                      ? `1px solid ${alpha(item.color, 0.2)}`
                      : '1px solid transparent',
                    '&:hover': {
                      backgroundColor: alpha(item.color, 0.08),
                      transform: 'translateX(4px)',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive(item.path) ? item.color : theme.palette.text.secondary,
                      minWidth: 40,
                      transition: 'color 0.2s ease-in-out',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontSize: '0.875rem',
                        fontWeight: isActive(item.path) ? 600 : 500,
                        color: isActive(item.path) ? item.color : theme.palette.text.primary,
                        transition: 'all 0.2s ease-in-out',
                      },
                    }}
                  />
                  {item.badge && (
                    <Chip
                      label={item.badge}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.6rem',
                        backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                        color: theme.palette.secondary.main,
                        mr: 1,
                      }}
                    />
                  )}
                  {item.subItems && (
                    expandedItems[item.id] ? <ExpandLess /> : <ExpandMore />
                  )}
                </ListItemButton>
              </ListItem>
              
              {/* Sub-items */}
              {item.subItems && (
                <Collapse in={expandedItems[item.id]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem) => (
                      <ListItem key={subItem.path} disablePadding>
                        <ListItemButton
                          onClick={() => handleNavigate(subItem.path)}
                          sx={{
                            pl: 4,
                            borderRadius: '8px',
                            ml: 2,
                            mr: 1,
                            mb: 0.5,
                            backgroundColor: isActive(subItem.path) 
                              ? alpha(item.color, 0.08)
                              : 'transparent',
                            '&:hover': {
                              backgroundColor: alpha(item.color, 0.05),
                            },
                            transition: 'all 0.2s ease-in-out',
                          }}
                        >
                          <ListItemText
                            primary={subItem.title}
                            sx={{
                              '& .MuiListItemText-primary': {
                                fontSize: '0.8rem',
                                fontWeight: isActive(subItem.path) ? 600 : 400,
                                color: isActive(subItem.path) 
                                  ? item.color 
                                  : theme.palette.text.secondary,
                              },
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </Box>
          ))}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 2,
            borderRadius: '12px',
            backgroundColor: alpha(theme.palette.info.main, 0.05),
            border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
          }}
        >
          <Notifications 
            sx={{ 
              color: theme.palette.info.main, 
              mr: 1.5,
              fontSize: '1.2rem' 
            }} 
          />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
              Notifications
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              3 nouvelles notifications
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Mobile Menu Button */}
      {(isMobile && !mobileOpen) && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            position: 'fixed',
            bottom: 20,
            left: 20,
            zIndex: 1300,
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Desktop Drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            boxShadow: isMobile ? 'none' : `4px 0 20px ${alpha(theme.palette.common.black, 0.05)}`,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default AdminSidebar;