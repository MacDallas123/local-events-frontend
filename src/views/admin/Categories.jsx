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
  Divider
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
    setSelectedCategory(null);
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
    // const datas = await dispatch(getAllCategories());
    /*setCategories(datas.map((item) => {
      return {
        id: item.id,
        nom: item.nom,
        description: item.description,
        created_at: new Date(item.created_at).toLocaleDateString('fr-FR'),
        events_count: item.events?.length || 0 // Supposant que les événements sont inclus dans la réponse
      };
    }));*/
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryDelete = async () => {
    if (selectedCategory.events_count > 0) {
      alert('Impossible de supprimer une catégorie qui contient des événements');
      return;
    }
    // await dispatch(deleteCategory(selectedCategory.id));
    await fetchCategories();
    handleCategoryMenuClose();
  };

  const handleCreateCategory = async () => {
    if (!formData.nom.trim()) {
      alert('Le nom de la catégorie est requis');
      return;
    }
    // await dispatch(createCategory(formData));
    await fetchCategories();
    setFormData({ nom: '', description: '' });
    setOpenDialog(false);
  };

  const handleUpdateCategory = async () => {
    if (!editFormData.nom.trim()) {
      alert('Le nom de la catégorie est requis');
      return;
    }
    // await dispatch(updateCategory(selectedCategory.id, editFormData));
    await fetchCategories();
    setEditFormData({ nom: '', description: '' });
    setOpenEditDialog(false);
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
          onClick={handleCategoryDelete} 
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

      {/* Add Category Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '16px' }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Créer une nouvelle catégorie
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
                  value={formData.nom}
                  onChange={(e) => handleFormChange('nom', e.target.value)}
                  required
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
                  placeholder="Description optionnelle de la catégorie..."
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleCreateCategory}>
            Créer la catégorie
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
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
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