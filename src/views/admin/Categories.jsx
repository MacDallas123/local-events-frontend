// Categories.jsx
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
  CircularProgress
} from '@mui/material';
import {
  Search,
  MoreVert,
  Edit,
  Delete,
  Add,
  Download,
  Category as CategoryIcon,
  CalendarToday,
  Description,
  Event as EventIcon,
  Folder,
  FolderOpen,
  Label,
  BookmarkBorder,
  LocalOffer
} from '@mui/icons-material';
import Footer from '../../components/footer/Footer';
import StatCard from '../../components/card/StatCard';
import { useDispatch, useSelector } from 'react-redux';
import { createCategory, deleteCategory, getAllCategories, updateCategory } from '../../app/categoryReducer';
// import { deleteCategory, getAllCategories, createCategory, updateCategory } from '../../app/categoryReducer';

const Categories = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryMenuAnchorEl, setCategoryMenuAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    nom: '',
    description: ''
  });
  const [editFormData, setEditFormData] = useState({
    nom: '',
    description: ''
  });
  const dispatch = useDispatch();

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const { loading, error } = useSelector(state => state.category);

  // Icônes pour les catégories (vous pouvez personnaliser selon vos besoins)
  const categoryIcons = [
    <CategoryIcon />,
    <EventIcon />,
    <LocalOffer />,
    <Label />,
    <BookmarkBorder />,
    <Folder />
  ];

  const getRandomIcon = (index) => {
    return categoryIcons[index % categoryIcons.length];
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
      title: 'Total Catégories',
      value: categories.length,
      change: '...%',
      icon: <CategoryIcon />,
      color: theme.palette.primary.main,
    },
    {
      title: 'Catégories Actives',
      value: categories.filter(c => c.events_count > 0).length,
      change: '...%',
      icon: <FolderOpen />,
      color: theme.palette.success.main,
    },
    {
      title: 'Catégories Vides',
      value: categories.filter(c => c.events_count === 0).length,
      change: '...%',
      icon: <Folder />,
      color: theme.palette.warning.main,
    },
    {
      title: 'Événements Total',
      value: categories.reduce((sum, c) => sum + (c.events_count || 0), 0),
      change: '...%',
      icon: <EventIcon />,
      color: theme.palette.info.main,
    },
  ];

  const handleCategoryMenuOpen = (event, category) => {
    setCategoryMenuAnchorEl(event.currentTarget);
    setSelectedCategory(category);
  };

  const handleCategoryMenuClose = () => {
    setCategoryMenuAnchorEl(null);
    //setSelectedCategory(null);
  };

  const handleEditCategory = () => {
    setEditFormData({
      nom: selectedCategory.nom,
      description: selectedCategory.description || ''
    });
    setOpenEditDialog(true);
    handleCategoryMenuClose();
  };

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchCategories = async () => {
    try {
      const result = await dispatch(getAllCategories());
      if (result) {
        setCategories(result.map(item => ({
          id: item.id,
          nom: item.nom,
          description: item.description,
          created_at: new Date(item.created_at).toLocaleDateString('fr-FR'),
          events_count: item.events?.length || 0
        })));
      }
    } catch (err) {
      showSnackbar('Erreur lors du chargement des catégories', 'error');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleCategoryDelete = async () => {
    if (!selectedCategory) return;
    
    if (selectedCategory.events_count > 0) {
      showSnackbar('Impossible de supprimer une catégorie avec des événements', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(deleteCategory(selectedCategory.id));
      await fetchCategories();
      showSnackbar('Catégorie supprimée avec succès', 'success');
    } catch (error) {
      showSnackbar(error.message || 'Erreur lors de la suppression', 'error');
    } finally {
      setIsSubmitting(false);
      setDeleteConfirmOpen(false);
      handleCategoryMenuClose();
    }
  };

    const handleCreateCategory = async () => {
    if (!formData.nom.trim()) {
      showSnackbar('Le nom de la catégorie est requis', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(createCategory(formData));
      setFormData({ nom: '', description: '' });
      setOpenDialog(false);
      await fetchCategories();
      showSnackbar('Catégorie créée avec succès', 'success');
    } catch (error) {
      showSnackbar(error.message || 'Erreur lors de la création', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editFormData.nom.trim()) {
      showSnackbar('Le nom de la catégorie est requis', 'warning');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await dispatch(updateCategory(selectedCategory.id, editFormData));
      setEditFormData({ nom: '', description: '' });
      setOpenEditDialog(false);
      await fetchCategories();
      showSnackbar('Catégorie mise à jour avec succès', 'success');
    } catch (error) {
      showSnackbar(error.message || 'Erreur lors de la mise à jour', 'error');
    } finally {
      setIsSubmitting(false);
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
    if(openEditDialog == false) setSelectedCategory(null);
  }, [openEditDialog]);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: theme.palette.primary.main }}>
          Gestion des Catégories
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Gérez toutes les catégories d'événements de votre plateforme
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
            placeholder="Rechercher une catégorie..."
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
              Nouvelle catégorie
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Categories Table */}
      <Paper sx={{ borderRadius: '16px', overflow: 'hidden', mb: 4 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                <TableCell sx={{ fontWeight: 600 }}>Catégorie</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Événements</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date de création</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCategories
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((category, index) => (
                <TableRow key={category.id} hover>
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
                          {category.nom}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          ID: {category.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: category.description ? 'text.primary' : 'text.secondary',
                        maxWidth: 300,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {category.description || 'Aucune description'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={`${category.events_count} événement${category.events_count > 1 ? 's' : ''}`}
                        size="small"
                        sx={{
                          backgroundColor: category.events_count > 0 
                            ? alpha(theme.palette.success.main, 0.1)
                            : alpha(theme.palette.warning.main, 0.1),
                          color: category.events_count > 0 
                            ? theme.palette.success.main
                            : theme.palette.warning.main,
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarToday sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <Typography variant="body2">{category.created_at}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Actions">
                      <IconButton
                        onClick={(e) => handleCategoryMenuOpen(e, category)}
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
          count={filteredCategories.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Category Actions Menu */}
      <Menu
        anchorEl={categoryMenuAnchorEl}
        open={Boolean(categoryMenuAnchorEl)}
        onClose={handleCategoryMenuClose}
        PaperProps={{
          sx: { borderRadius: '12px', minWidth: 200 }
        }}
      >
        <MenuItem onClick={handleEditCategory}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Modifier</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => { setDeleteConfirmOpen(true); handleCategoryMenuClose();}} 
          sx={{ color: 'error.main' }}
          disabled={selectedCategory?.events_count > 0}
        >
          <ListItemIcon>
            <Delete fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText>
            {selectedCategory?.events_count > 0 ? 'Supprimer (impossible - contient des événements)' : 'Supprimer'}
          </ListItemText>
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
            Êtes-vous sûr de vouloir supprimer la catégorie "{selectedCategory?.nom}" ?
            Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Annuler</Button>
          <Button 
            onClick={handleCategoryDelete} 
            color="error"
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? 'Suppression...' : 'Confirmer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogue de creation et de modifications */}
      <Dialog
        open={openDialog}
        onClose={() => !isSubmitting && setOpenDialog(false)}
        maxWidth="sm"
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
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ 
              bgcolor: alpha(theme.palette.primary.main, 0.2),
              color: theme.palette.primary.main
            }}>
              <Add />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: "15px", md: "20px"} }}>
              Nouvelle catégorie
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Nom de la catégorie"
                fullWidth
                variant="outlined"
                value={formData.nom}
                onChange={(e) => handleFormChange('nom', e.target.value)}
                required
                size='small'
                disabled={isSubmitting}
                sx={{ mb: 2, mt: 2 }}
              />
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                placeholder="Décrivez cette catégorie..."
                size='small'
                disabled={isSubmitting}
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
            onClick={handleCreateCategory}
            disabled={isSubmitting || !formData.nom.trim()}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            sx={{ ml: 1, fontSize: { xs: "11px", md: "14px"} }}
          >
            {isSubmitting ? 'Création...' : 'Créer la catégorie'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Category Dialog */}
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
            Modifier la catégorie
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Nom de la catégorie"
                  fullWidth
                  variant="outlined"
                  name='editName'
                  value={editFormData.nom}
                  onChange={(e) => handleEditFormChange('nom', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  name='editDescription'
                  variant="outlined"
                  value={editFormData.description}
                  onChange={(e) => handleEditFormChange('description', e.target.value)}
                  placeholder="Description optionnelle de la catégorie..."
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleUpdateCategory}>
            Mettre à jour
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  );
};

export default Categories;