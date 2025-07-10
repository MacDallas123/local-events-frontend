import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Avatar,
  Chip,
  IconButton,
  useTheme,
  alpha,
  Card,
  CardContent,
  Divider,
  Alert,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Person,
  Edit,
  Save,
  Cancel,
  Email,
  Phone,
  AdminPanelSettings,
  Visibility,
  VisibilityOff,
  Lock,
  CheckCircle,
  ErrorOutline,
  PhotoCamera,
  AccountCircle,
  Badge,
  CalendarToday,
  Security,
  Notifications,
  Language,
  Delete,
  Warning,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { changePassword, deleteUser, updateUser } from '../../app/userReducer';
import { useDispatch } from 'react-redux';
import { logout } from '../../app/authReducer';

const Profil = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // États pour les données utilisateur
  const [userData, setUserData] = useState({
    id: 1,
    nom: 'John Doe',
    email: 'john.doe@example.com',
    telephone: '+237 123 456 789',
    role: 'user',
    is_active: true,
    created_at: '2024-01-15T10:30:00Z'
  });
  
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({ ...userData });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const dispatch = useDispatch();

  // Mappage des rôles
  const roleMapping = {
    visitor: { label: 'Visiteur', color: '#95A5A6', icon: <Person /> },
    user: { label: 'Utilisateur', color: '#3498DB', icon: <AccountCircle /> },
    organizer: { label: 'Organisateur', color: '#E74C3C', icon: <Badge /> },
    admin: { label: 'Administrateur', color: '#F39C12', icon: <AdminPanelSettings /> },
    super_admin: { label: 'Super Admin', color: '#9B59B6', icon: <Security /> }
  };

  const handleEdit = () => {
    setEditMode(true);
    setEditedData({ ...userData });
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditedData({ ...userData });
    setMessage({ type: '', text: '' });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await dispatch(updateUser(userData.id, editedData));
      if(response == null)
      {
        setMessage({ type: 'error', text: response?.data?.message || 'Erreur lors de la mise à jour' });
        return;
      }

      // Validation basique
      if (!editedData.nom || !editedData.email) {
        setMessage({ type: 'error', text: 'Le nom et l\'email sont obligatoires' });
        setLoading(false);
        return;
      }
      
      setUserData({ ...editedData });
      localStorage.setItem("user", JSON.stringify({ ...editedData }));
      setEditMode(false);
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Erreur lors de la mise à jour' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 8 caractères' });
      return;
    }

    setLoading(true);
    try {
        const response = await dispatch(changePassword(passwordData));
        if(response == null)
        {
            setMessage({ type: 'error', text: response?.data?.message || 'Erreur lors de la mise à jour' });
            return;
        }

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordDialog(false);
      setMessage({ type: 'success', text: 'Mot de passe modifié avec succès' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors du changement de mot de passe' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
        const response = await dispatch(deleteUser(userData.id));
        if(response == null)
        {
            setMessage({ type: 'error', text: response?.data?.message || 'Erreur lors de la mise suppression de votre compte' });
            return;
        }
        
        // Redirection vers la page d'accueil après suppression
        await dispatch(logout());
        //navigate('/');
        setMessage({ type: 'success', text: 'Compte supprimé avec succès' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la suppression du compte' });
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    const authUser = JSON.parse(localStorage.getItem("user"));
    console.log("AUTH USER", authUser);
    setUserData(authUser);
  }, []);

  return (
    <Box sx={{ flex: 1, position: 'relative' }}>
      {/* Header Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          pt: { xs: 4, md: 6 },
          pb: { xs: 6, md: 8 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(circle at 30% 20%, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 50%),
                              radial-gradient(circle at 70% 80%, ${alpha(theme.palette.secondary.main, 0.15)} 0%, transparent 50%)`,
            pointerEvents: 'none',
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Profile Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  fontSize: '3rem',
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  mx: 'auto',
                }}
              >
                {userData.nom.charAt(0).toUpperCase()}
              </Avatar>
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
                size="small"
              >
                <PhotoCamera />
              </IconButton>
            </Box>
            
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 1,
                fontSize: { xs: '2rem', md: '2.5rem' },
              }}
            >
              {userData.nom}
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
              <Chip
                icon={roleMapping[userData.role].icon}
                label={roleMapping[userData.role].label}
                sx={{
                  backgroundColor: alpha(roleMapping[userData.role].color, 0.1),
                  color: roleMapping[userData.role].color,
                  fontWeight: 600,
                  border: `1px solid ${alpha(roleMapping[userData.role].color, 0.3)}`,
                }}
              />
              <Chip
                icon={<CalendarToday />}
                label={`Membre depuis ${formatDate(userData.created_at)}`}
                variant="outlined"
                sx={{
                  borderColor: alpha(theme.palette.text.secondary, 0.3),
                  color: 'text.secondary',
                }}
              />
            </Box>
          </Box>

          {/* Message Alert */}
          {message.text && (
            <Alert
              severity={message.type}
              sx={{ mb: 4, borderRadius: '12px' }}
              onClose={() => setMessage({ type: '', text: '' })}
            >
              {message.text}
            </Alert>
          )}

          {/* Profile Content */}
          <Grid container spacing={4}>
            {/* Personal Information */}
            <Grid item xs={12} md={8}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: '20px',
                  backgroundColor: alpha(theme.palette.common.white, 0.8),
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: {xs: 'center', md: 'space-between'}, alignItems: 'center', mb: 3, flexWrap: "wrap" }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, textAlign: "center" }}>
                    Informations personnelles
                  </Typography>
                  {!editMode ? (
                    <Button
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={handleEdit}
                      sx={{
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                    >
                      Modifier
                    </Button>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        startIcon={<Cancel />}
                        onClick={handleCancel}
                        sx={{
                          borderRadius: '12px',
                          textTransform: 'none',
                        }}
                      >
                        Annuler
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<Save />}
                        onClick={handleSave}
                        disabled={loading}
                        sx={{
                          borderRadius: '12px',
                          textTransform: 'none',
                          fontWeight: 600,
                        }}
                      >
                        Sauvegarder
                      </Button>
                    </Box>
                  )}
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nom complet"
                      value={editMode ? editedData.nom : userData.nom}
                      onChange={(e) => setEditedData({ ...editedData, nom: e.target.value })}
                      disabled={!editMode}
                      InputProps={{
                        startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                        },
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={editMode ? editedData.email : userData.email}
                      onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                      disabled={!editMode}
                      InputProps={{
                        startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                        },
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Téléphone"
                      value={editMode ? editedData.telephone : userData.telephone}
                      onChange={(e) => setEditedData({ ...editedData, telephone: e.target.value })}
                      disabled={!editMode}
                      InputProps={{
                        startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                        },
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth disabled>
                      <InputLabel>Rôle</InputLabel>
                      <Select
                        value={userData.role}
                        label="Rôle"
                        sx={{
                          borderRadius: '12px',
                        }}
                      >
                        {Object.entries(roleMapping).map(([key, value]) => (
                          <MenuItem key={key} value={key}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {value.icon}
                              {value.label}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Security & Settings */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Security Card */}
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: '20px',
                    backgroundColor: alpha(theme.palette.common.white, 0.8),
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography sx={{ fontWeight: 700, mb: 2 }}>
                      Sécurité
                    </Typography>
                    
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Lock />}
                      onClick={() => setShowPasswordDialog(true)}
                      sx={{
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 600,
                        mb: 2,
                        justifyContent: 'flex-start',
                      }}
                    >
                      Changer le mot de passe
                    </Button>
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={userData.is_active}
                          onChange={(e) => setUserData({ ...userData, is_active: e.target.checked })}
                          color="primary"
                        />
                      }
                      label="Compte actif"
                    />
                  </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: '20px',
                    backgroundColor: alpha(theme.palette.error.main, 0.05),
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography sx={{ fontWeight: 700, mb: 2, color: 'error.main' }}>
                      Zone de danger
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      La suppression de votre compte est irréversible. Toutes vos données seront perdues.
                    </Typography>
                    
                    <Button
                      fullWidth
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => setShowDeleteDialog(true)}
                      sx={{
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                    >
                      Supprimer le compte
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onClose={() => setShowPasswordDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography sx={{ fontWeight: 700 }}>
            Changer le mot de passe
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              fullWidth
              label="Mot de passe actuel"
              type={showPassword ? 'text' : 'password'}
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Nouveau mot de passe"
              type={showPassword ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            />
            <TextField
              fullWidth
              label="Confirmer le nouveau mot de passe"
              type={showPassword ? 'text' : 'password'}
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPasswordDialog(false)}>Annuler</Button>
          <Button onClick={handlePasswordChange} variant="contained" disabled={loading}>
            Changer le mot de passe
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Warning color="error" />
            <Typography sx={{ fontWeight: 700, color: 'error.main' }}>
              Supprimer le compte
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et toutes vos données seront perdues.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Annuler</Button>
          <Button onClick={handleDeleteAccount} color="error" variant="contained" disabled={loading}>
            Supprimer définitivement
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profil;