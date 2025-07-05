
// Users.jsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Card,
  CardContent,
  useTheme,
  alpha,
  TablePagination,
  Tooltip
} from '@mui/material';
import {
  Search,
  FilterList,
  MoreVert,
  Edit,
  Delete,
  Block,
  CheckCircle,
  PersonAdd,
  Download,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  Verified,
  Warning,
  People
} from '@mui/icons-material';

const Users = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Sample users data
  const users = [
    {
      id: 1,
      name: 'Marie Dubois',
      email: 'marie.dubois@email.com',
      phone: '+33 1 23 45 67 89',
      location: 'Paris, France',
      status: 'active',
      role: 'user',
      joinDate: '2024-01-15',
      eventsCreated: 12,
      eventsAttended: 45,
      avatar: 'MD',
      verified: true,
    },
    {
      id: 2,
      name: 'Jean Martin',
      email: 'jean.martin@email.com',
      phone: '+33 1 98 76 54 32',
      location: 'Lyon, France',
      status: 'active',
      role: 'organizer',
      joinDate: '2024-02-10',
      eventsCreated: 8,
      eventsAttended: 23,
      avatar: 'JM',
      verified: true,
    },
    {
      id: 3,
      name: 'Sophie Bernard',
      email: 'sophie.bernard@email.com',
      phone: '+33 1 11 22 33 44',
      location: 'Marseille, France',
      status: 'suspended',
      role: 'user',
      joinDate: '2024-03-05',
      eventsCreated: 0,
      eventsAttended: 5,
      avatar: 'SB',
      verified: false,
    },
    {
      id: 4,
      name: 'Pierre Durand',
      email: 'pierre.durand@email.com',
      phone: '+33 1 55 66 77 88',
      location: 'Toulouse, France',
      status: 'active',
      role: 'admin',
      joinDate: '2023-12-20',
      eventsCreated: 25,
      eventsAttended: 67,
      avatar: 'PD',
      verified: true,
    },
    {
      id: 5,
      name: 'Emma Rousseau',
      email: 'emma.rousseau@email.com',
      phone: '+33 1 99 88 77 66',
      location: 'Nice, France',
      status: 'inactive',
      role: 'user',
      joinDate: '2024-04-12',
      eventsCreated: 3,
      eventsAttended: 8,
      avatar: 'ER',
      verified: false,
    },
  ];

  const stats = [
    {
      title: 'Total Utilisateurs',
      value: users.length,
      change: '+12%',
      icon: <People />,
      color: theme.palette.primary.main,
    },
    {
      title: 'Utilisateurs Actifs',
      value: users.filter(u => u.status === 'active').length,
      change: '+8%',
      icon: <CheckCircle />,
      color: theme.palette.success.main,
    },
    {
      title: 'Organisateurs',
      value: users.filter(u => u.role === 'organizer').length,
      change: '+15%',
      icon: <Verified />,
      color: theme.palette.secondary.main,
    },
    {
      title: 'Suspendus',
      value: users.filter(u => u.status === 'suspended').length,
      change: '-5%',
      icon: <Warning />,
      color: theme.palette.error.main,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return theme.palette.success.main;
      case 'inactive': return theme.palette.warning.main;
      case 'suspended': return theme.palette.error.main;
      default: return theme.palette.grey[500];
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return theme.palette.error.main;
      case 'organizer': return theme.palette.secondary.main;
      case 'user': return theme.palette.primary.main;
      default: return theme.palette.grey[500];
    }
  };

  const handleUserMenuOpen = (event, user) => {
    setUserMenuAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
    setSelectedUser(null);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const StatCard = ({ title, value, change, icon, color }) => (
    <Card sx={{ borderRadius: '16px', border: `1px solid ${alpha(color, 0.1)}` }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: color }}>
              {value}
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 0.5 }}>
              {title}
            </Typography>
            <Chip
              label={change}
              size="small"
              sx={{
                mt: 1,
                backgroundColor: alpha(color, 0.1),
                color: color,
                fontWeight: 600,
              }}
            />
          </Box>
          <Avatar sx={{ backgroundColor: alpha(color, 0.1), color: color, width: 48, height: 48 }}>
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
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Gestion des Utilisateurs
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Gérez tous les utilisateurs de votre plateforme
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Actions Bar */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: '16px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <TextField
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300 }}
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Statut</InputLabel>
              <Select
                value={statusFilter}
                label="Statut"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">Tous</MenuItem>
                <MenuItem value="active">Actifs</MenuItem>
                <MenuItem value="inactive">Inactifs</MenuItem>
                <MenuItem value="suspended">Suspendus</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              startIcon={<Download />}
              sx={{ textTransform: 'none' }}
            >
              Exporter
            </Button>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              sx={{ textTransform: 'none' }}
              onClick={() => setOpenDialog(true)}
            >
              Ajouter utilisateur
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Users Table */}
      <Paper sx={{ borderRadius: '16px', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                <TableCell sx={{ fontWeight: 600 }}>Utilisateur</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Statut</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Rôle</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Événements</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Inscription</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ backgroundColor: theme.palette.primary.main }}>
                        {user.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {user.name}
                          {user.verified && (
                            <Verified sx={{ ml: 1, fontSize: 16, color: theme.palette.success.main }} />
                          )}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          ID: {user.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Email sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="body2">{user.email}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Phone sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="body2">{user.phone}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOn sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="body2">{user.location}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.status}
                      size="small"
                      sx={{
                        backgroundColor: alpha(getStatusColor(user.status), 0.1),
                        color: getStatusColor(user.status),
                        fontWeight: 600,
                        textTransform: 'capitalize',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      size="small"
                      sx={{
                        backgroundColor: alpha(getRoleColor(user.role), 0.1),
                        color: getRoleColor(user.role),
                        fontWeight: 600,
                        textTransform: 'capitalize',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {user.eventsCreated} créés
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {user.eventsAttended} participés
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarToday sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <Typography variant="body2">{user.joinDate}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Actions">
                      <IconButton
                        onClick={(e) => handleUserMenuOpen(e, user)}
                        size="small"
                      >
                        <MoreVert />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* User Actions Menu */}
      <Menu
        anchorEl={userMenuAnchorEl}
        open={Boolean(userMenuAnchorEl)}
        onClose={handleUserMenuClose}
        PaperProps={{
          sx: { borderRadius: '12px', minWidth: 200 }
        }}
      >
        <MenuItem onClick={handleUserMenuClose}>
          <Edit sx={{ mr: 2 }} />
          Modifier
        </MenuItem>
        <MenuItem onClick={handleUserMenuClose}>
          <Email sx={{ mr: 2 }} />
          Envoyer un message
        </MenuItem>
        <MenuItem onClick={handleUserMenuClose}>
          <Block sx={{ mr: 2 }} />
          Suspendre
        </MenuItem>
        <MenuItem onClick={handleUserMenuClose} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 2 }} />
          Supprimer
        </MenuItem>
      </Menu>

    {/* Add User Dialog */}
    <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
            sx: { borderRadius: '16px' }
        }}
        >
        <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
        <DialogContent>
            <Box sx={{ pt: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                    <TextField
                        label="Nom complet"
                        fullWidth
                        variant="outlined"
                    />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <TextField
                        label="Email"
                        fullWidth
                        variant="outlined"
                        type="email"
                    />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <TextField
                        label="Téléphone"
                        fullWidth
                        variant="outlined"
                    />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Rôle</InputLabel>
                            <Select label="Rôle">
                            <MenuItem value="user">Utilisateur</MenuItem>
                            <MenuItem value="organizer">Organisateur</MenuItem>
                            <MenuItem value="admin">Administrateur</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>
        </DialogContent>
    </Dialog>
    </Box>
  );
}

export default Users;