// EventsManagement.jsx
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
  Badge,
  ListItemIcon,
  ListItemText,
  FormControlLabel,
  Switch,
  DialogContentText,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Search,
  FilterList,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  CheckCircle,
  Cancel,
  Add,
  Download,
  Event as EventIcon,
  LocationOn,
  CalendarToday,
  Person,
  Public,
  Lock,
  Verified,
  Warning,
  Category,
  Schedule,
  PendingActions,
  EventAvailable,
  Upload
} from '@mui/icons-material';
import Footer from '../../components/footer/Footer';
import StatCard from '../../components/card/StatCard';
import { useDispatch, useSelector } from 'react-redux';
import { createEvent, deleteEvent, getAllEvents, updateEvent, validateEvent } from '../../app/eventReducer';
import { getAllCategories } from '../../app/categoryReducer';
// import { deleteEvent, getAllEvents, validateEvent } from '../../app/eventReducer';

const EventsManagement = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [eventMenuAnchorEl, setEventMenuAnchorEl] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [events, setEvents] = useState([]);
  const { loading, error } = useSelector(state => state.event);
  const dispatch = useDispatch();

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [validateConfirmOpen, setValidateConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    date: '',
    lieu: '',
    type: 'public',
    categorie: '',
    image: null,
    est_valide: false
  });

  const [editFormData, setEditFormData] = useState({
    titre: '',
    description: '',
    date: '',
    lieu: '',
    type: 'public',
    categorie: '',
    image: null,
    est_valide: false
  });

  // 3. Fonctions de gestion des formulaires
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFormData(prev => ({
      ...prev,
      image: file
    }));
  };

  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const result = await dispatch(getAllCategories());
      if (result) {
        setCategories(result.map(item => ({
          id: item.id,
          nom: item.nom,
        })));
      }
    } catch (err) {
      console.log("ERR", err);
      showSnackbar('Erreur lors du chargement des catégories', 'error');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEditFileChange = (event) => {
    const file = event.target.files[0];
    setEditFormData(prev => ({
      ...prev,
      image: file
    }));
  };

  // Stats calculées
  const stats = [
    {
      title: 'Total Événements',
      value: events.length,
      change: '...%',
      icon: <EventIcon />,
      color: theme.palette.primary.main,
    },
    {
      title: 'Événements Validés',
      value: events.filter(e => e.est_valide).length,
      change: '...%',
      icon: <CheckCircle />,
      color: theme.palette.success.main,
    },
    {
      title: 'En Attente',
      value: events.filter(e => !e.est_valide).length,
      change: '...%',
      icon: <PendingActions />,
      color: theme.palette.warning.main,
    },
    {
      title: 'Événements Publics',
      value: events.filter(e => e.type === 'public').length,
      change: '...%',
      icon: <Public />,
      color: theme.palette.info.main,
    },
  ];

  const getStatusColor = (est_valide) => {
    return est_valide ? theme.palette.success.main : theme.palette.warning.main;
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'public': return theme.palette.info.main;
      case 'privé': return theme.palette.secondary.main;
      default: return theme.palette.grey[500];
    }
  };

  const handleEventMenuOpen = (event, eventData) => {
    setEventMenuAnchorEl(event.currentTarget);
    setSelectedEvent(eventData);
  };

  const handleEventMenuClose = () => {
    setEventMenuAnchorEl(null);
    //setSelectedEvent(null);
  };

  const handleViewEvent = () => {
    setOpenViewDialog(true);
    handleEventMenuClose();
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.lieu.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organisateur.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.category.nom?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'validated' && event.est_valide) ||
                         (statusFilter === 'pending' && !event.est_valide);
    
    const matchesType = typeFilter === 'all' || event.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchEvents = async () => {
    try {
      const result = await dispatch(getAllEvents());
      console.log("RESEULTS", result);
      if (result) {
        setEvents(result.events.map(item => ({
          id: item.id,
          titre: item.titre,
          description: item.description,
          date: new Date(item.date).toLocaleDateString('fr-FR'),
          lieu: item.lieu,
          type: item.type,
          est_valide: item.est_valide,
          categorie: item.categorie,
          organisateur: item.organisateur,
          created_at: new Date(item.created_at).toLocaleDateString('fr-FR'),
          updated_at: new Date(item.updated_at).toLocaleDateString('fr-FR')
        })));
      }
    } catch (err) {
      showSnackbar('Erreur lors du chargement des événements', 'error');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = async () => {
    if (!formData.titre.trim()) {
      showSnackbar('Le titre de l\'événement est requis', 'warning');
      return;
    }
    if (!formData.date) {
      showSnackbar('La date de l\'événement est requise', 'warning');
      return;
    }
    if (!formData.lieu.trim()) {
      showSnackbar('Le lieu de l\'événement est requis', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      // Préparer les données pour FormData si un fichier est présent
      const eventData = new FormData();
      eventData.append('titre', formData.titre);
      eventData.append('description', formData.description);
      eventData.append('date', formData.date);
      eventData.append('lieu', formData.lieu);
      eventData.append('type', formData.type);
      eventData.append('categorie_id', formData.categorie);
      eventData.append('est_valide', formData.est_valide);
      
      if (formData.image) {
        eventData.append('image', formData.image);
      }

      // console.log("FORM DATA", formData, "EVENT DATA", eventData);
      await dispatch(createEvent(eventData));
      
      // Réinitialiser le formulaire
      setFormData({
        titre: '',
        description: '',
        date: '',
        lieu: '',
        type: 'public',
        categorie: '',
        image: null,
        est_valide: false
      });
      
      setOpenDialog(false);
      await fetchEvents();
      showSnackbar('Événement créé avec succès', 'success');
    } catch (error) {
      showSnackbar(error.message || 'Erreur lors de la création', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Fonction de modification d'événement
  const handleEditEvent = () => {
    if (!selectedEvent) return;
    
    let date = new Date(selectedEvent.date);
    let formattedDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}T00:00`;
    console.log("SELECT EVENT", selectedEvent, "DATE", formattedDate);
    setEditFormData({
      titre: selectedEvent.titre,
      description: selectedEvent.description || '',
      date: `${formattedDate}`,
      lieu: selectedEvent.lieu,
      type: selectedEvent.type,
      categorie: selectedEvent.categorie?.id || '',
      image: null,
      est_valide: selectedEvent.est_valide
    });
    setOpenEditDialog(true);
    handleEventMenuClose();
  };

  const handleUpdateEvent = async () => {
    if (!editFormData.titre.trim()) {
      showSnackbar('Le titre de l\'événement est requis', 'warning');
      return;
    }
    if (!editFormData.date) {
      showSnackbar('La date de l\'événement est requise', 'warning');
      return;
    }
    if (!editFormData.lieu.trim()) {
      showSnackbar('Le lieu de l\'événement est requis', 'warning');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const eventData = new FormData();
      eventData.append('titre', editFormData.titre);
      eventData.append('description', editFormData.description);
      eventData.append('date', editFormData.date);
      eventData.append('lieu', editFormData.lieu);
      eventData.append('type', editFormData.type);
      eventData.append('categorie', editFormData.categorie);
      eventData.append('est_valide', editFormData.est_valide);
      
      if (editFormData.image) {
        eventData.append('image', editFormData.image);
      }

      await dispatch(updateEvent(selectedEvent.id, eventData));
      
      setEditFormData({
        titre: '',
        description: '',
        date: '',
        lieu: '',
        type: 'public',
        categorie: '',
        image: null,
        est_valide: false
      });
      
      setOpenEditDialog(false);
      await fetchEvents();
      showSnackbar('Événement mis à jour avec succès', 'success');
    } catch (error) {
      showSnackbar(error.message || 'Erreur lors de la mise à jour', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

    // 6. Modification du menu d'actions pour inclure l'édition
  const menuActions = (
    <Menu
      anchorEl={eventMenuAnchorEl}
      open={Boolean(eventMenuAnchorEl)}
      onClose={handleEventMenuClose}
      PaperProps={{
        sx: { borderRadius: '12px', minWidth: 200 }
      }}
    >
      {/* <MenuItem onClick={handleViewEvent}>
        <ListItemIcon>
          <Visibility fontSize="small" />
        </ListItemIcon>
        <ListItemText>Voir détails</ListItemText>
      </MenuItem> */}
      <MenuItem onClick={handleEditEvent}>
        <ListItemIcon>
          <Edit fontSize="small" />
        </ListItemIcon>
        <ListItemText>Modifier</ListItemText>
      </MenuItem>
      {selectedEvent && !selectedEvent.est_valide && (
        <MenuItem 
          onClick={() => setValidateConfirmOpen(true)} 
          sx={{ color: 'success.main' }}
        >
          <ListItemIcon>
            <CheckCircle fontSize="small" sx={{ color: 'success.main' }} />
          </ListItemIcon>
          <ListItemText>Valider</ListItemText>
        </MenuItem>
      )}
      <MenuItem 
        onClick={() => setDeleteConfirmOpen(true)} 
        sx={{ color: 'error.main' }}
      >
        <ListItemIcon>
          <Delete fontSize="small" sx={{ color: 'error.main' }} />
        </ListItemIcon>
        <ListItemText>Supprimer</ListItemText>
      </MenuItem>
    </Menu>
  );

  // 7. Formulaire de création d'événement amélioré
  const createEventDialog = (
    <Dialog
      open={openDialog}
      onClose={() => !isSubmitting && setOpenDialog(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: '16px',
          background: theme.palette.background.paper
        }
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        py: 2,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ 
            bgcolor: alpha(theme.palette.primary.main, 0.2),
            color: theme.palette.primary.main,
            width: 40,
            height: 40
          }}>
            <Add fontSize="small" />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: "15px", md: "20px"} }}>
            Créer un nouvel événement
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <Grid container spacing={3} sx={{ mt: 1, display: "flex", flexDirection: "column" }}>
          <Grid item xs={12}>
            <TextField
              label="Titre de l'événement"
              fullWidth
              variant="outlined"
              value={formData.titre}
              onChange={(e) => handleFormChange('titre', e.target.value)}
              required
              disabled={isSubmitting}
              size='small'
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={formData.description}
              onChange={(e) => handleFormChange('description', e.target.value)}
              disabled={isSubmitting}
              size='small'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date"
              fullWidth
              type="datetime-local"
              variant="outlined"
              value={formData.date}
              onChange={(e) => handleFormChange('date', e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              disabled={isSubmitting}
              required
              size='small'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Lieu"
              fullWidth
              variant="outlined"
              value={formData.lieu}
              onChange={(e) => handleFormChange('lieu', e.target.value)}
              disabled={isSubmitting}
              required
              size='small'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select 
                label="Type"
                value={formData.type}
                onChange={(e) => handleFormChange('type', e.target.value)}
                disabled={isSubmitting}
                size='small'
              >
                <MenuItem value="public">Public</MenuItem>
                <MenuItem value="privé">Privé</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Catégorie</InputLabel>
              <Select 
                label="Catégorie"
                value={formData.categorie}
                onChange={(e) => handleFormChange('categorie', e.target.value)}
                disabled={isSubmitting}
                size='small'
              >
                {categories?.map((category) => {
                  return (
                    <MenuItem value={`${category.id}`}>{category.nom}</MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Image de l'événement
              </Typography>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="image-upload"
                type="file"
                onChange={handleFileChange}
                disabled={isSubmitting}
              />
              <label htmlFor="image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<Upload />}
                  disabled={isSubmitting}
                  sx={{ textTransform: 'none' }}
                >
                  Choisir une image
                </Button>
              </label>
              {formData.image && (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Fichier sélectionné: {formData.image.name}
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch 
                  checked={formData.est_valide}
                  onChange={(e) => handleFormChange('est_valide', e.target.checked)}
                  disabled={isSubmitting} 
                />
              }
              label="Valider automatiquement"
              sx={{ mt: 1 }}
            />
          </Grid>
        </Grid>
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
          onClick={handleCreateEvent}
          disabled={isSubmitting || !formData.titre.trim() || !formData.date || !formData.lieu.trim()}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          sx={{ ml: 1, fontSize: { xs: "11px", md: "14px"} }}
        >
          {isSubmitting ? 'Création en cours...' : 'Créer l\'événement'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  // 8. Dialogue de modification d'événement
  const editEventDialog = (
    <Dialog
      open={openEditDialog}
      onClose={() => !isSubmitting && setOpenEditDialog(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: '16px' }
      }}
    >
      <DialogTitle>
        <Typography sx={{ fontWeight: 700 }}>
          Modifier l'événement
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <Grid container spacing={3} sx={{ mt: 1, display: "flex", flexDirection: "column" }}>
          <Grid item xs={12}>
            <TextField
              label="Titre de l'événement"
              fullWidth
              variant="outlined"
              value={editFormData.titre}
              onChange={(e) => handleEditFormChange('titre', e.target.value)}
              required
              disabled={isSubmitting}
              size='small'
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={editFormData.description}
              onChange={(e) => handleEditFormChange('description', e.target.value)}
              disabled={isSubmitting}
              size='small'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date"
              fullWidth
              type="datetime-local"
              variant="outlined"
              value={editFormData.date}
              onChange={(e) => handleEditFormChange('date', e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              disabled={isSubmitting}
              required
              size='small'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Lieu"
              fullWidth
              variant="outlined"
              value={editFormData.lieu}
              onChange={(e) => handleEditFormChange('lieu', e.target.value)}
              disabled={isSubmitting}
              required
              size='small'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select 
                label="Type"
                value={editFormData.type}
                onChange={(e) => handleEditFormChange('type', e.target.value)}
                disabled={isSubmitting}
                size='small'
              >
                <MenuItem value="public">Public</MenuItem>
                <MenuItem value="privé">Privé</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Catégorie</InputLabel>
              <Select 
                label="Catégorie"
                value={editFormData.categorie}
                onChange={(e) => handleEditFormChange('categorie', e.target.value)}
                disabled={isSubmitting}
                size='small'
              >
                {categories?.map((category) => {
                  return (
                    <MenuItem value={`${category.id}`}>{category.nom}</MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Changer l'image de l'événement
              </Typography>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="edit-image-upload"
                type="file"
                onChange={handleEditFileChange}
                disabled={isSubmitting}
              />
              <label htmlFor="edit-image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<Upload />}
                  disabled={isSubmitting}
                  sx={{ textTransform: 'none' }}
                >
                  Choisir une nouvelle image
                </Button>
              </label>
              {editFormData.image && (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Nouveau fichier sélectionné: {editFormData.image.name}
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch 
                  checked={editFormData.est_valide}
                  onChange={(e) => handleEditFormChange('est_valide', e.target.checked)}
                  disabled={isSubmitting} 
                />
              }
              label="Événement validé"
              sx={{ mt: 1 }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ 
        px: 3, 
        py: 2,
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`
      }}>
        <Button 
          onClick={() => { 
            setOpenEditDialog(false); 
            setSelectedEvent(null); 
          }}
          disabled={isSubmitting}
          sx={{ fontSize: { xs: "11px", md: "14px"} }}
        >
          Annuler
        </Button>
        <Button 
          variant="contained" 
          onClick={handleUpdateEvent}
          disabled={isSubmitting || !editFormData.titre.trim() || !editFormData.date || !editFormData.lieu.trim()}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          sx={{ ml: 1, fontSize: { xs: "11px", md: "14px"} }}
        >
          {isSubmitting ? 'Mise à jour...' : 'Mettre à jour'}
        </Button>
      </DialogActions>
    </Dialog>
  );
  
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleEventDelete = async () => {
    if (!selectedEvent) return;
    
    setIsSubmitting(true);
    try {
      await dispatch(deleteEvent(selectedEvent.id));
      await fetchEvents();
      showSnackbar('Événement supprimé avec succès', 'success');
    } catch (error) {
      showSnackbar(error.message || 'Erreur lors de la suppression', 'error');
    } finally {
      setIsSubmitting(false);
      setDeleteConfirmOpen(false);
      handleEventMenuClose();
    }
  };

  const handleEventValidate = async () => {
    if (!selectedEvent) return;
    
    setIsSubmitting(true);
    try {
      await dispatch(validateEvent(selectedEvent.id));
      await fetchEvents();
      showSnackbar('Événement validé avec succès', 'success');
    } catch (error) {
      showSnackbar(error.message || 'Erreur lors de la validation', 'error');
    } finally {
      setIsSubmitting(false);
      setValidateConfirmOpen(false);
      handleEventMenuClose();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: theme.palette.primary.main }}>
          Gestion des Événements
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Gérez tous les événements de votre plateforme
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
            placeholder="Rechercher un événement..."
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
              <InputLabel>Statut</InputLabel>
              <Select
                value={statusFilter}
                label="Statut"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">Tous</MenuItem>
                <MenuItem value="validated">Validés</MenuItem>
                <MenuItem value="pending">En attente</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: { xs: "80%", md: 100 } }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={typeFilter}
                label="Type"
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <MenuItem value="all">Tous</MenuItem>
                <MenuItem value="public">Public</MenuItem>
                <MenuItem value="privé">Privé</MenuItem>
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
              startIcon={<Add />}
              sx={{ textTransform: 'none' }}
              onClick={() => setOpenDialog(true)}
            >
              Nouvel événement
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* EventsManagement Table */}
      <Paper sx={{ borderRadius: '16px', overflow: 'hidden', mb: 4 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                <TableCell sx={{ fontWeight: 600 }}>Événement</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date & Lieu</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Organisateur</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Statut</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Catégorie</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEvents
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((event) => (
                <TableRow key={event.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar 
                        src={event.image_url}
                        sx={{ 
                          backgroundColor: theme.palette.primary.main,
                          width: 50,
                          height: 50
                        }}
                      >
                        <EventIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {event.titre}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          ID: {event.id}
                        </Typography>
                        {event.description && (
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: 'text.secondary',
                              maxWidth: 200,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {event.description}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <CalendarToday sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {event.date}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOn sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {event.lieu}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, backgroundColor: theme.palette.secondary.main }}>
                        <Person sx={{ fontSize: 16 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {event.organisateur.nom || 'N/A'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {event.organisateur.email || ''}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={event.type === 'public' ? <Public /> : <Lock />}
                      label={event.type}
                      size="small"
                      sx={{
                        backgroundColor: alpha(getTypeColor(event.type), 0.1),
                        color: getTypeColor(event.type),
                        fontWeight: 600,
                        textTransform: 'capitalize',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={event.est_valide ? <CheckCircle /> : <PendingActions />}
                      label={event.est_valide ? 'Validé' : 'En attente'}
                      size="small"
                      sx={{
                        backgroundColor: alpha(getStatusColor(event.est_valide), 0.1),
                        color: getStatusColor(event.est_valide),
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={event.categorie.nom || 'N/A'}
                      size="small"
                      sx={{
                        backgroundColor: alpha(theme.palette.info.main, 0.1),
                        color: theme.palette.info.main,
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Actions">
                      <IconButton
                        onClick={(e) => handleEventMenuOpen(e, event)}
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
          count={filteredEvents.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      
      {/* Ajout du Snackbar pour les notifications */}
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
            Êtes-vous sûr de vouloir supprimer l'événement "{selectedEvent?.titre}" ?
            Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Annuler</Button>
          <Button 
            onClick={handleEventDelete} 
            color="error"
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? 'Suppression...' : 'Confirmer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogue de confirmation de validation */}
      <Dialog
        open={validateConfirmOpen}
        onClose={() => setValidateConfirmOpen(false)}
        maxWidth="xs"
        PaperProps={{
          sx: { borderRadius: '16px' }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Valider l'événement
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir valider l'événement "{selectedEvent?.titre}" ?
            Il sera alors visible par tous les utilisateurs.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setValidateConfirmOpen(false)}>Annuler</Button>
          <Button 
            onClick={handleEventValidate} 
            color="success"
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? 'Validation...' : 'Confirmer'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {createEventDialog}
      {editEventDialog}
      {menuActions}

      <Footer />
    </Box>
  );
};

export default EventsManagement;