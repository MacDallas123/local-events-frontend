
// Users.jsx
import React, { useEffect, useState } from 'react';
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
  People,
  AdminPanelSettings
} from '@mui/icons-material';
import Footer from '../../components/footer/Footer';
import StatCard from '../../components/card/StatCard';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, getAllUsers } from '../../app/userReducer';

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
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();

  const requestDatas = useSelector((state) => state.datas);

  // Sample users data
  const stats = [
    {
      title: 'Total Utilisateurs',
      value: users.length,
      change: '...%',
      icon: <People />,
      color: theme.palette.primary.main,
    },
    {
      title: 'Rôle Administrateur',
      value: users.filter(u => u.role === 'admin').length,
      change: '...%',
      icon: <CheckCircle />,
      color: theme.palette.success.main,
    },
    {
      title: 'Rôle Organisateur',
      value: users.filter(u => u.role === 'organizer').length,
      change: '...%',
      icon: <Verified />,
      color: theme.palette.secondary.main,
    },
    {
      title: 'Rôle Utilisateur',
      value: users.filter(u => u.role === 'user').length,
      change: '...%',
      icon: <AdminPanelSettings />,
      color: theme.palette.primary.light,
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
    const matchesStatus = statusFilter === 'all' || user.role === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  
  const fetchUsers = async () => {
    const datas = await dispatch(getAllUsers());
    setUsers(datas.map((item) => {
      return {
        id: item.id,
        name: item.nom,
        email: item.email,
        phone: item.telephone,
        role: item.role,
        joinDate: item.created_at
      };
    }));
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserDelete = async () => {
    await dispatch(deleteUser(selectedUser.id));
    await fetchUsers();
    handleUserMenuClose();
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: theme.palette.primary.main }}>
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
            sx={{ minWidth: { xs: "80%", md: 300 } }}
          />
          <Box sx={{ display: 'flex', gap: 1, flexWrap: "wrap" }}>
            <FormControl size="small" sx={{ minWidth: { xs: "80%", md: 120 } }}>
              <InputLabel>Rôle</InputLabel>
              <Select
                value={statusFilter}
                label="Statut"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">Tous</MenuItem>
                <MenuItem value="admin">Administrateur</MenuItem>
                <MenuItem value="organizer">Organisateur</MenuItem>
                <MenuItem value="user">Utilisateur</MenuItem>
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
      <Paper sx={{ borderRadius: '16px', overflow: 'hidden', mb: 4 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                <TableCell sx={{ fontWeight: 600 }}>Utilisateur</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
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
                    </Box>
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
        <MenuItem onClick={() => handleUserDelete()} sx={{ color: 'error.main' }}>
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

    <Footer />
    </Box>
  );
}

export default Users;