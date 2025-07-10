import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  TextField,
  InputAdornment,
  Chip,
  Button,
  IconButton,
  useTheme,
  alpha,
  Paper,
  CircularProgress,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Rating,
  Divider
} from '@mui/material';
import {
  Search,
  FilterList,
  LocationOn,
  CalendarToday,
  Person,
  TrendingUp,
  ExpandMore,
  Favorite,
  FavoriteBorder,
  Share,
  Visibility,
  MusicNote,
  ArtTrack,
  RunCircle,
  BusinessCenter,
  Clear,
  Sort
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getAllEvents, getPublicEvents } from '../app/eventReducer';
import { getAllCategories } from '../app/categoryReducer';
import { registerToEvent, unregisterFromEvent } from '../app/registrationReducer';
import { getDashboard } from '../app/dashboardReducer';

const eventTypes = [
  { 
    label: 'Musique', 
    icon: <MusicNote />, 
    color: '#FF6B6B',
    refName: 'music'
  },
  { 
    label: 'Arts', 
    icon: <ArtTrack />, 
    color: '#4ECDC4',
    refName: 'art'
  },
  { 
    label: 'Sport', 
    icon: <RunCircle />, 
    color: '#45B7D1',
    refName: 'sport'
  },
  { 
    label: 'Conférences', 
    icon: <BusinessCenter />, 
    color: '#96CEB4',
    refName: 'conference'
  },
];

const sortOptions = [
  { value: 'date', label: 'Date' },
  { value: 'popularity', label: 'Popularité' },
  { value: 'name', label: 'Nom' },
  { value: 'location', label: 'Lieu' }
];

const Explore = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //const { eventType } = location.state || "Music";

  // États
  const [events, setEvents] = useState([]);
  const [subscribedEvents, setSubscribedEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);

  // Récupération du type d'événement depuis la navigation
  const eventTypeFromState = location.state?.eventType;

  // Chargement des données
  const loadData = async () => {
    setLoading(true);
    try {
      const [eventsData, categoriesData, dashboardDatas] = await Promise.all([
        dispatch(getPublicEvents()),
        dispatch(getAllCategories()),
        dispatch(getDashboard("user"))
      ]);

      if (eventsData?.events) {
        setEvents(eventsData.events);
        setFilteredEvents(eventsData.events);
      }
      if (categoriesData?.categories) {
        setCategories(categoriesData.categories);
      }

      //console.log("DASHBOARD DATAS", dashboardDatas);
      if(dashboardDatas.length > 0) setSubscribedEvents(dashboardDatas[0].events);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [dispatch]);

  /*useEffect(() => {
    console.log("SUBS EVENTS", subscribedEvents);
  }, [subscribedEvents]);*/

  // Filtrage et tri des événements
  useEffect(() => {
    let filtered = [...events];

    // Filtrage par recherche
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event?.lieu?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrage par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.categorie_id === selectedCategory);
    }

    // Filtrage par type d'événement (depuis la navigation)
    if (eventTypeFromState) {
      const typeMapping = {
        'music': 'Musique',
        'art': 'Arts',
        'sport': 'Sport',
        'conference': 'Conférences'
      };
      const typeName = typeMapping[eventTypeFromState];
      if (typeName) {
        filtered = filtered.filter(event => event.categorie?.nom === typeName);
      }
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date_debut) - new Date(b.date_debut);
        case 'name':
          return a.nom.localeCompare(b.nom);
        case 'location':
          return a.lieu.localeCompare(b.lieu);
        default:
          return 0;
      }
    });

    setFilteredEvents(filtered);
  }, [events, searchTerm, selectedCategory, sortBy, eventTypeFromState]);

  // Gestion des favoris
  const toggleFavorite = (eventId) => {
    setFavorites(prev => 
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  // Formatage de la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Formatage de l'heure
  const formatTime = (timeString) => {
    return timeString?.substring(11, 16);
  };

  const handleRegistrationToEvent = async (eventId) => {
    const registerResponse = await dispatch(registerToEvent(eventId));
    
    //console.log("REGISTRATION", registerResponse);
    /*if(registerResponse != null)
      alert("INSCRIPTION REUSSIE");*/
    await loadData();
    
  }

  const handleUnsubscribeToEvent = async (eventId) => {
    const registerResponse = await dispatch(unregisterFromEvent(eventId));
    
    /*if(registerResponse != null)
      alert("DESINSCRIPTION REUSSIE");*/
    await loadData();
    
  }

  // Composant EventCard
  const EventCard = ({ event }) => (
    <Card
      sx={{
        height: '100%',
        borderRadius: '20px',
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        cursor: 'pointer',
        minWidth: "300px",
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
        },
      }}
      //onClick={() => navigate(`/event/${event.id}`)}
    >
      <CardMedia
        component="img"
        height="200"
        image={event.image_url || '/api/placeholder/400/200'}
        alt={event.titre}
        sx={{
          objectFit: 'cover',
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        }}
      />
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, flex: 1 }}>
            {event.titre}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(event.id);
              }}
              sx={{ color: favorites.includes(event.id) ? 'red' : 'grey.400' }}
            >
              {favorites.includes(event.id) ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                // Logic pour partager
              }}
            >
              <Share />
            </IconButton>
          </Box>
        </Box>
        
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          {event.description}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {formatDate(event.date)} à {formatTime(event.date)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {event.lieu}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {event.organisateur?.nom || 'Organisateur'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip
            label={event.categorie?.nom || 'Catégorie'}
            size="small"
            sx={{
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              fontWeight: 600,
            }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
              {event.prix ? `${event.prix} FCFA` : 'Gratuit'}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          {subscribedEvents.filter((item) => item.event_id === event.id).length > 0 ? (
            <Button 
              variant='outlined'
              color='primary'
              fullWidth
              sx={{ 
                borderRadius: "12px",
                px: 3}}
                onClick={() => handleUnsubscribeToEvent(event.id)}
              >
              Se désinscrire
            </Button>
          ) : (
            <Button 
              variant='contained'
              fullWidth
              sx={{ 
                borderRadius: "12px",
                px: 3}}
                onClick={() => handleRegistrationToEvent(event.id)}
              >
              S'inscrire
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 800,
              mb: 2,
              textAlign: 'center',
              fontSize: { xs: '2rem', md: '2.5rem' },
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Explorer les événements
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              textAlign: 'center',
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Découvrez les événements qui vous passionnent
          </Typography>
        </Box>

        {/* Barre de recherche et filtres */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: '20px',
            backgroundColor: alpha(theme.palette.common.white, 0.8),
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}
        >
          <Grid container spacing={3} alignItems="center">
            {/* Recherche */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Rechercher des événements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setSearchTerm('')}>
                        <Clear />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  },
                }}
              />
            </Grid>

            {/* Catégorie */}
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Catégorie</InputLabel>
                <Select
                  label="Catégorie"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  sx={{ borderRadius: '12px', px: 2 }}
                >
                  <MenuItem value="all">Toutes les catégories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.nom}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Tri */}
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Trier par</InputLabel>
                <Select
                  label="Trier par"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  sx={{ borderRadius: '12px', minWidth: "100px" }}
                >
                  {sortOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Filtres par type d'événement */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            {eventTypes.map((type) => (
              <Button
                key={type.refName}
                variant={eventTypeFromState === type.refName ? 'contained' : 'outlined'}
                startIcon={type.icon}
                onClick={() => {
                  navigate('/explore', { state: { eventType: type.refName } });
                }}
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  backgroundColor: eventTypeFromState === type.refName 
                    ? type.color 
                    : 'transparent',
                  borderColor: type.color,
                  color: eventTypeFromState === type.refName 
                    ? 'white' 
                    : type.color,
                  '&:hover': {
                    backgroundColor: alpha(type.color, 0.1),
                    borderColor: type.color,
                  },
                }}
              >
                {type.label}
              </Button>
            ))}
          </Box>
        </Box>

        {/* Résultats */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "primary.main" }}>
            {filteredEvents.length} événement{filteredEvents.length !== 1 ? 's' : ''} trouvé{filteredEvents.length !== 1 ? 's' : ''}
          </Typography>
        </Box>

        {/* Grille des événements */}
        <Grid container spacing={3} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          {filteredEvents.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <EventCard event={event} />
            </Grid>
          ))}
        </Grid>

        {/* Message si aucun événement */}
        {filteredEvents.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              Aucun événement trouvé
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Essayez de modifier vos critères de recherche
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Explore;

