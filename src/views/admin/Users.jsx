
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
  Tooltip,
  DialogContentText,
  CircularProgress,
  Snackbar,
  Alert
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
import { createUser, deleteUser, getAllUsers, updateUser } from '../../app/userReducer';

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

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [validateConfirmOpen, setValidateConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: null,
    role: 'user',
  });
  const [editFormData, setEditFormData] = useState({
    nom: '',
    email: '',
    telephone: null,
    role: 'user',
  });

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

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleUserMenuOpen = (event, user) => {
    setUserMenuAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
    //setSelectedUser(null);
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

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditFormChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditUser = () => {
    console.log("SELECTED USER", selectedUser);
    setEditFormData({
      nom: selectedUser.name,
      email: selectedUser.email,
      telephone: selectedUser.phone || '',
      role: selectedUser.role
    });
    setOpenEditDialog(true);
    handleUserMenuClose();
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

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleUserDelete = async () => {
    await dispatch(deleteUser(selectedUser.id));
    await fetchUsers();
    handleUserMenuClose();

    if (!selectedUser) return;
    
    setIsSubmitting(true);
    try {
      await dispatch(deleteUser(selectedUser.id));
      await fetchUsers();
      showSnackbar('Événement supprimé avec succès', 'success');
    } catch (error) {
      showSnackbar(error.message || 'Erreur lors de la suppression', 'error');
    } finally {
      setIsSubmitting(false);
      setDeleteConfirmOpen(false);
      handleUserMenuClose();
    }
  }

    const handleCreateUser = async () => {
      if (!formData.nom.trim()) {
        showSnackbar('Le nom de la catégorie est requis', 'warning');
        return;
      }
  
      setIsSubmitting(true);
      try {
        await dispatch(createUser(formData));
        setFormData({ nom: '',
          email: '',
          telephone: null,
          role: 'user' });

        setOpenDialog(false);
        await fetchUsers();
        showSnackbar('Utilisateur créé avec succès', 'success');
      } catch (error) {
        showSnackbar(error.message || 'Erreur lors de la création', 'error');
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleUpdateUser = async () => {
        if (!editFormData.nom.trim()) {
          showSnackbar('Le nom de l\'utilisateur est requis', 'warning');
          return;
        }
        
        setIsSubmitting(true);
        try {
          await dispatch(updateUser(selectedUser.id, editFormData));
          setEditFormData({ nom: '',
            email: '',
            telephone: null,
            role: 'user' });
          setOpenEditDialog(false);
          await fetchUsers();
          showSnackbar('Utilisateur mis à jour avec succès', 'success');
        } catch (error) {
          showSnackbar(error.message || 'Erreur lors de la mise à jour', 'error');
        } finally {
          setIsSubmitting(false);
        }
      };
    
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
        <MenuItem onClick={handleEditUser} sx={{ color: 'primary.main' }}>
          <Edit sx={{ mr: 2 }} />
          Modifier
        </MenuItem>
        <MenuItem onClick={() => setDeleteConfirmOpen(true)} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 2 }} />
          Supprimer
        </MenuItem>
      </Menu>
    
    <Snackbar
      open={snackbar.open}
      autoHideDuration={6000}
      onClose={handleCloseSnackbar}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        onClose={handleCloseSnackbar} 
        severity={snackbar.severity}
        sx={{ width: '100%' }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
    {/* Dialogue de confirmation de suppression */}
    <Dialog
      open={deleteConfirmOpen}
      onClose={() => setDeleteConfirmOpen(false)}
      maxWidth="xs"
      PaperProps={{
        sx: { borderRadius: '16px' }
      }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>
        Confirmer la suppression
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Êtes-vous sûr de vouloir supprimer la catégorie "{selectedUser?.nom}" ?
          Cette action est irréversible.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDeleteConfirmOpen(false)}>Annuler</Button>
        <Button 
          onClick={handleUserDelete} 
          color="error"
          variant="contained"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting ? 'Suppression...' : 'Confirmer'}
        </Button>
      </DialogActions>
    </Dialog>

    {/* Add User Dialog */}
    <Dialog
        open={openDialog}
        onClose={() => !isSubmitting && setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
            sx: { borderRadius: '16px' }
        }}
        >
        <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
        <DialogContent>
            <Box sx={{ pt: 2 }}>
                <Grid container spacing={2} sx={{ display: "flex", flexDirection: "column" }}>
                    <Grid item xs={12} sm={6}>
                    <TextField
                        label="Nom complet"
                        fullWidth
                        variant="outlined"
                        value={formData.nom}
                        onChange={(e) => handleFormChange('nom', e.target.value)}
                        disabled={isSubmitting}
                        required
                    />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <TextField
                        label="Email"
                        fullWidth
                        variant="outlined"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleFormChange('email', e.target.value)}
                        disabled={isSubmitting}
                        required
                    />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <TextField
                        label="Téléphone"
                        fullWidth
                        variant="outlined"
                        value={formData.telephone}
                        onChange={(e) => handleFormChange('telephone', e.target.value)}
                        disabled={isSubmitting}
                        required
                    />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Rôle</InputLabel>
                            <Select label="Rôle"
                              value={formData.role}
                              onChange={(e) => handleFormChange('role', e.target.value)}
                              disabled={isSubmitting}
                              required
                            >
                            <MenuItem value="user">Utilisateur</MenuItem>
                            <MenuItem value="organizer">Organisateur</MenuItem>
                            <MenuItem value="admin">Administrateur</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>
        </DialogContent>
        <DialogActions sx={{ 
          px: 3, 
          py: 2,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}>
          <Button 
            onClick={() => setOpenDialog(false)} 
            disabled={isSubmitting}
            sx={{ fontSize: { xs: "11px", md: "14px"} }}
          >
            Annuler
          </Button>
          <Button 
            variant="contained" 
            onClick={handleCreateUser}
            disabled={isSubmitting || !formData.nom.trim()}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            sx={{ ml: 1, fontSize: { xs: "11px", md: "14px"} }}
          >
            {isSubmitting ? 'Création...' : 'Créer l\'utilisateur'}
          </Button>
        </DialogActions>
    </Dialog>

    {/* Edit User Dialog */}
    <Dialog
      open={openEditDialog}
      onClose={() => setOpenEditDialog(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: '16px' }
      }}
    >
      <DialogTitle>
        <Typography sx={{ fontWeight: 700 }}>
          Modifier l'utilisateur
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={2} sx={{ display: "flex", flexDirection: "column" }}>
            <Grid item xs={12} sm={6}>
              <TextField
                  label="Nom complet"
                  fullWidth
                  variant="outlined"
                  value={editFormData.nom}
                  onChange={(e) => handleEditFormChange('nom', e.target.value)}
                  required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                  label="Email"
                  fullWidth
                  variant="outlined"
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => handleEditFormChange('email', e.target.value)}
                  required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
            <TextField
                label="Téléphone"
                fullWidth
                variant="outlined"
                value={editFormData.telephone}
                onChange={(e) => handleEditFormChange('telephone', e.target.value)}
                required
            />
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <InputLabel>Rôle</InputLabel>
                    <Select label="Rôle"
                      value={editFormData.role}
                      onChange={(e) => handleEditFormChange('role', e.target.value)}
                      required
                    >
                    <MenuItem value="user">Utilisateur</MenuItem>
                    <MenuItem value="organizer">Organisateur</MenuItem>
                    <MenuItem value="admin">Administrateur</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => { setOpenEditDialog(false); setSelectedUser(null); }}>Annuler</Button>
        <Button variant="contained" onClick={handleUpdateUser}>
          Mettre à jour
        </Button>
      </DialogActions>
    </Dialog>
    <Footer />
    </Box>
  );
}

export default Users;