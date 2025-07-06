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
  Switch
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
  EventAvailable
} from '@mui/icons-material';
import Footer from '../../components/footer/Footer';
import StatCard from '../../components/card/StatCard';
import { useDispatch, useSelector } from 'react-redux';
import { getAllEvents } from '../../app/eventReducer';
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
  const dispatch = useDispatch();

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
    setSelectedEvent(null);
  };

  const handleViewEvent = () => {
    setOpenViewDialog(true);
    handleEventMenuClose();
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.lieu.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organisateur?.nom?.toLowerCase().includes(searchTerm.toLowerCase());
    
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
    const datas = await dispatch(getAllEvents());
    setEvents(datas.map((item) => {
      return {
        id: item.id,
        titre: item.titre,
        description: item.description,
        date: new Date(item.date).toLocaleDateString('fr-FR'),
        lieu: item.lieu,
        latitude: item.latitude,
        longitude: item.longitude,
        image_url: item.image_url,
        type: item.type,
        est_valide: item.est_valide,
        categorie: item.categorie,
        organisateur: item.organisateur,
        created_at: new Date(item.created_at).toLocaleDateString('fr-FR'),
        updated_at: new Date(item.updated_at).toLocaleDateString('fr-FR')
      };
    }));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEventDelete = async () => {
    //await dispatch(deleteEvent(selectedEvent.id));
    await fetchEvents();
    handleEventMenuClose();
  };

  const handleEventValidate = async () => {
    //await dispatch(validateEvent(selectedEvent.id));
    await fetchEvents();
    handleEventMenuClose();
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
                          {event.organisateur?.nom || 'N/A'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {event.organisateur?.email || ''}
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
                      label={event.categorie?.nom || 'N/A'}
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

      {/* Event Actions Menu */}
      <Menu
        anchorEl={eventMenuAnchorEl}
        open={Boolean(eventMenuAnchorEl)}
        onClose={handleEventMenuClose}
        PaperProps={{
          sx: { borderRadius: '12px', minWidth: 200 }
        }}
      >
        <MenuItem onClick={handleViewEvent}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          <ListItemText>Voir détails</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => console.log('Edit event')}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Modifier</ListItemText>
        </MenuItem>
        {selectedEvent && !selectedEvent.est_valide && (
          <MenuItem onClick={handleEventValidate} sx={{ color: 'success.main' }}>
            <ListItemIcon>
              <CheckCircle fontSize="small" sx={{ color: 'success.main' }} />
            </ListItemIcon>
            <ListItemText>Valider</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={handleEventDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Delete fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText>Supprimer</ListItemText>
        </MenuItem>
      </Menu>

      {/* View Event Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '16px' }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Détails de l'événement
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <Grid container spacing={3} sx={{ pt: 2 }}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, borderRadius: '12px' }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Informations générales
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography><strong>Titre:</strong> {selectedEvent.titre}</Typography>
                    <Typography><strong>Description:</strong> {selectedEvent.description || 'Aucune description'}</Typography>
                    <Typography><strong>Date:</strong> {selectedEvent.date}</Typography>
                    <Typography><strong>Lieu:</strong> {selectedEvent.lieu}</Typography>
                    <Typography><strong>Type:</strong> {selectedEvent.type}</Typography>
                    <Typography><strong>Statut:</strong> {selectedEvent.est_valide ? 'Validé' : 'En attente'}</Typography>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, borderRadius: '12px' }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Organisateur & Catégorie
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography><strong>Organisateur:</strong> {selectedEvent.organisateur?.nom || 'N/A'}</Typography>
                    <Typography><strong>Email:</strong> {selectedEvent.organisateur?.email || 'N/A'}</Typography>
                    <Typography><strong>Catégorie:</strong> {selectedEvent.categorie?.nom || 'N/A'}</Typography>
                    <Typography><strong>Créé le:</strong> {selectedEvent.created_at}</Typography>
                    <Typography><strong>Modifié le:</strong> {selectedEvent.updated_at}</Typography>
                  </Box>
                </Card>
              </Grid>
              {selectedEvent.image_url && (
                <Grid item xs={12}>
                  <Card sx={{ p: 2, borderRadius: '12px' }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Image de l'événement
                    </Typography>
                    <Box
                      component="img"
                      src={selectedEvent.image_url}
                      alt={selectedEvent.titre}
                      sx={{
                        width: '100%',
                        maxHeight: 300,
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                    />
                  </Card>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>

      {/* Add Event Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '16px' }
        }}
      >
        <DialogTitle>Créer un nouvel événement</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Titre de l'événement"
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date"
                  fullWidth
                  type="datetime-local"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Lieu"
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select label="Type">
                    <MenuItem value="public">Public</MenuItem>
                    <MenuItem value="privé">Privé</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Catégorie</InputLabel>
                  <Select label="Catégorie">
                    <MenuItem value="1">Conférence</MenuItem>
                    <MenuItem value="2">Formation</MenuItem>
                    <MenuItem value="3">Networking</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="URL de l'image"
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch />}
                  label="Valider automatiquement"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button variant="contained" onClick={() => setOpenDialog(false)}>
            Créer l'événement
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  );
};

export default EventsManagement;