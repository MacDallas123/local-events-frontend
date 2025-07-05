// Dashboard.jsx
import React from 'react';
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
  Button
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
  Schedule
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import Footer from '../../components/footer/Footer';

const Dashboard = () => {
  const theme = useTheme();

  // Sample data for charts
  const monthlyData = [
    { name: 'Jan', events: 45, users: 120 },
    { name: 'Fév', events: 52, users: 150 },
    { name: 'Mar', events: 48, users: 180 },
    { name: 'Avr', events: 61, users: 200 },
    { name: 'Mai', events: 55, users: 240 },
    { name: 'Jun', events: 67, users: 280 },
  ];

  const categoryData = [
    { name: 'Musique', value: 35, color: theme.palette.primary.main },
    { name: 'Sport', value: 25, color: theme.palette.secondary.main },
    { name: 'Culture', value: 20, color: theme.palette.success.main },
    { name: 'Business', value: 15, color: theme.palette.warning.main },
    { name: 'Autres', value: 5, color: theme.palette.info.main },
  ];

  const recentActivities = [
    { id: 1, type: 'event', title: 'Nouveau événement créé', subtitle: 'Concert Jazz - Place Centrale', time: '2h', icon: <Event /> },
    { id: 2, type: 'user', title: 'Nouvel utilisateur inscrit', subtitle: 'Marie Dubois', time: '3h', icon: <PersonAdd /> },
    { id: 3, type: 'event', title: 'Événement approuvé', subtitle: 'Marché de Noël 2024', time: '5h', icon: <EventAvailable /> },
    { id: 4, type: 'category', title: 'Nouvelle catégorie ajoutée', subtitle: 'Gastronomie', time: '1j', icon: <Category /> },
  ];

  const StatCard = ({ title, value, change, icon, color, subtitle }) => (
    <Card
      sx={{
        p: 0,
        borderRadius: '16px',
        border: `1px solid ${alpha(color, 0.1)}`,
        boxShadow: `0 4px 20px ${alpha(color, 0.1)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 30px ${alpha(color, 0.2)}`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, color: color, mb: 0.5 }}>
              {value}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              {subtitle}
            </Typography>
            <Chip
              label={`${change > 0 ? '+' : ''}${change}% ce mois`}
              size="small"
              sx={{
                backgroundColor: change > 0 ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1),
                color: change > 0 ? theme.palette.success.main : theme.palette.error.main,
                fontWeight: 600,
              }}
            />
          </Box>
          <Avatar
            sx={{
              backgroundColor: alpha(color, 0.1),
              color: color,
              width: 56,
              height: 56,
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

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

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Utilisateurs"
            value="1,284"
            change={12}
            icon={<People />}
            color={theme.palette.primary.main}
            subtitle="Utilisateurs actifs"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Événements"
            value="342"
            change={8}
            icon={<Event />}
            color={theme.palette.secondary.main}
            subtitle="Ce mois-ci"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Catégories"
            value="24"
            change={5}
            icon={<Category />}
            color={theme.palette.success.main}
            subtitle="Catégories actives"
          />
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
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
      </Grid>

      {/* Recent Activities */}
      {/* <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: '16px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Activités récentes
              </Typography>
              <IconButton size="small">
                <MoreVert />
              </IconButton>
            </Box>
            <List>
              {recentActivities.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.1) }}>
                        {activity.icon}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.title}
                      secondary={
                        <React.Fragment>
                          <Typography variant="body2" color="text.secondary">
                            {activity.subtitle}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Il y a {activity.time}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  {index < recentActivities.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: '16px' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Actions rapides
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Event />}
                  sx={{
                    py: 2,
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Nouvel événement
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<PersonAdd />}
                  sx={{
                    py: 2,
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Ajouter utilisateur
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Category />}
                  sx={{
                    py: 2,
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Nouvelle catégorie
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Analytics />}
                  sx={{
                    py: 2,
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Voir analytics
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid> */}

      <Footer />
    </Box>
  );
};

export default Dashboard;
