// Registration.jsx
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
  ListItemIcon,
  ListItemText,
  Divider,
  Snackbar,
  DialogContentText,
  Alert,
  CircularProgress,
  Autocomplete
} from '@mui/material';
import {
  Search,
  MoreVert,
  Edit,
  Delete,
  Add,
  Download,
  PersonAdd,
  CalendarToday,
  Person,
  Event as EventIcon,
  Groups,
  CheckCircle,
  Cancel,
  HowToReg,
  EventAvailable,
  Schedule
} from '@mui/icons-material';
import Footer from '../../components/footer/Footer';
import StatCard from '../../components/card/StatCard';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../../app/userReducer';
import { getAllEvents } from '../../app/eventReducer';
import { deleteRegistration, getAllRegistrations } from '../../app/registrationReducer';

const Registrations = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [registrationMenuAnchorEl, setRegistrationMenuAnchorEl] = useState(null);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [registrations, setRegistrations] = useState([]);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    user_id: '',
    event_id: ''
  });
  const [editFormData, setEditFormData] = useState({
    user_id: '',
    event_id: ''
  });
  const dispatch = useDispatch();

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const { loading, error } = useSelector(state => state.registration);

  // Icônes pour les registrations
  const registrationIcons = [
    <PersonAdd />,
    <HowToReg />,
    <EventAvailable />,
    <Groups />,
    <CheckCircle />,
    <Schedule />
  ];

  const getRandomIcon = (index) => {
    return registrationIcons[index % registrationIcons.length];
  };

  const getRandomColor = (index) => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.info.main,
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.error.main
    ];
    return colors[index % colors.length];
  };

  // Stats calculées
  const stats = [
    {
      title: 'Total Inscriptions',
      value: registrations.length,
      change: '...%',
      icon: <HowToReg />,
      color: theme.palette.primary.main,
    },
    {
      title: 'Utilisateurs Inscrits',
      value: new Set(registrations.map(r => r.user_id)).size,
      change: '...%',
      icon: <Groups />,
      color: theme.palette.success.main,
    },
    {
      title: 'Événements Concernés',
      value: new Set(registrations.map(r => r.event_id)).size,
      change: '...%',
      icon: <EventIcon />,
      color: theme.palette.warning.main,
    },
    {
      title: 'Inscriptions Aujourd\'hui',
      value: registrations.filter(r => {
        const today = new Date().toDateString();
        return new Date(r.created_at).toDateString() === today;
      }).length,
      change: '...%',
      icon: <CalendarToday />,
      color: theme.palette.info.main,
    },
  ];

  const handleRegistrationMenuOpen = (event, registration) => {
    setRegistrationMenuAnchorEl(event.currentTarget);
    setSelectedRegistration(registration);
  };

  const handleRegistrationMenuClose = () => {
    setRegistrationMenuAnchorEl(null);
  };

  const handleEditRegistration = () => {
    setEditFormData({
      user_id: selectedRegistration.user_id,
      event_id: selectedRegistration.event_id
    });
    setOpenEditDialog(true);
    handleRegistrationMenuClose();
  };

  const filteredRegistrations = registrations.filter(registration => {
    const userName = registration.user_name || '';
    const eventName = registration.event_name || '';
    const matchesSearch = userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         eventName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchRegistrations = async () => {
    try {
      const result = await dispatch(getAllRegistrations());
      console.log("RESULT", result);
      if (result) {
        setRegistrations(result.map(item => ({
          id: item.id,
          user_id: item.user_id,
          event_id: item.event_id,
          user_name: item.user?.nom || 'Utilisateur inconnu',
          user_email: item.user?.email || '',
          event_name: item.event?.nom || 'Événement inconnu',
          event_date: item.event?.date || '',
          created_at: new Date(item.created_at).toLocaleDateString('fr-FR'),
          created_at_time: new Date(item.created_at).toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        })));
      }
    } catch (err) {
      showSnackbar('Erreur lors du chargement des inscriptions', 'error');
    }
  };

  const fetchUsers = async () => {
    try {
      const result = await dispatch(getAllUsers());
      if (result) {
        setUsers(result.map(user => ({
          id: user.id,
          nom: user.nom,
          email: user.email
        })));
      }
    } catch (err) {
      showSnackbar('Erreur lors du chargement des utilisateurs', 'error');
    }
  };

  const fetchEvents = async () => {
    try {
      const result = await dispatch(getAllEvents());
      if (result) {
        setEvents(result.map(event => ({
          id: event.id,
          nom: event.nom,
          date: event.date
        })));
      }
    } catch (err) {
      showSnackbar('Erreur lors du chargement des événements', 'error');
    }
  };

  useEffect(() => {
    fetchRegistrations();
    fetchUsers();
    fetchEvents();
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleRegistrationDelete = async () => {
    if (!selectedRegistration) return;

    setIsSubmitting(true);
    try {
      await dispatch(deleteRegistration(selectedRegistration.id));
      await fetchRegistrations();
      showSnackbar('Inscription supprimée avec succès', 'success');
    } catch (error) {
      showSnackbar(error.message || 'Erreur lors de la suppression', 'error');
    } finally {
      setIsSubmitting(false);
      setDeleteConfirmOpen(false);
      handleRegistrationMenuClose();
    }
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

  useEffect(() => {
    if(openEditDialog == false) setSelectedRegistration(null);
  }, [openEditDialog]);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: theme.palette.primary.main }}>
          Gestion des Inscriptions
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Gérez toutes les inscriptions aux événements de votre plateforme
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
            placeholder="Rechercher par utilisateur ou événement..."
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
        </Box>
      </Paper>

      {/* Registrations Table */}
      <Paper sx={{ borderRadius: '16px', overflow: 'hidden', mb: 4 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                <TableCell sx={{ fontWeight: 600 }}>Utilisateur</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Événement</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date événement</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date inscription</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRegistrations
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((registration, index) => (
                <TableRow key={registration.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar 
                        sx={{ 
                          backgroundColor: alpha(getRandomColor(index), 0.1),
                          color: getRandomColor(index),
                          width: 50,
                          height: 50
                        }}
                      >
                        {getRandomIcon(index)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {registration.user_name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {registration.user_email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {registration.event_name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        ID: {registration.event_id}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EventIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {registration.event_date 
                          ? new Date(registration.event_date).toLocaleDateString('fr-FR')
                          : 'Date non définie'
                        }
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarToday sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="body2">{registration.created_at}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {registration.created_at_time}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Actions">
                      <IconButton
                        onClick={(e) => handleRegistrationMenuOpen(e, registration)}
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
          count={filteredRegistrations.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Registration Actions Menu */}
      <Menu
        anchorEl={registrationMenuAnchorEl}
        open={Boolean(registrationMenuAnchorEl)}
        onClose={handleRegistrationMenuClose}
        PaperProps={{
          sx: { borderRadius: '12px', minWidth: 200 }
        }}
      >
        <MenuItem 
          onClick={() => { setDeleteConfirmOpen(true); handleRegistrationMenuClose();}} 
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <Delete fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText>Supprimer</ListItemText>
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
            Êtes-vous sûr de vouloir supprimer cette inscription ?
            Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Annuler</Button>
          <Button 
            onClick={handleRegistrationDelete} 
            color="error"
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? 'Suppression...' : 'Confirmer'}
          </Button>
        </DialogActions>
      </Dialog>


      <Footer />
    </Box>
  );
};

export default Registrations;