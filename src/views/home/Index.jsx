import React, { useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  IconButton, 
  useTheme, 
  alpha,
  Paper,
  Button,
  Chip
} from '@mui/material';
import { 
  MusicNote, 
  Celebration, 
  SportsEsports, 
  BusinessCenter,
  TrendingUp,
  People,
  Star,
  ArrowForward,
  RunCircle,
  ArtTrack
} from '@mui/icons-material';
import Carousel from '../../components/carousel/Carousel';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const eventTypes = [
  { 
    label: 'Musique', 
    icon: <MusicNote fontSize="large" />, 
    color: '#FF6B6B',
    description: 'Concerts, festivals, soirées DJ',
    count: '2.5k+ événements',
    refName: 'music'
  },
  { 
    label: 'Arts', 
    icon: <ArtTrack fontSize="large" />, 
    color: '#4ECDC4',
    description: 'Anniversaires, mariages, célébrations',
    count: '1.8k+ événements',
    refName: 'art'
  },
  { 
    label: 'Sport', 
    icon: <RunCircle fontSize="large" />, 
    color: '#45B7D1',
    description: 'Gaming, sports, activités ludiques',
    count: '950+ événements',
    refName: 'sport'
  },
  { 
    label: 'Conférences', 
    icon: <BusinessCenter fontSize="large" />, 
    color: '#96CEB4',
    description: 'Conférences, séminaires, networking',
    count: '3.2k+ événements',
    refName: 'conference'
  },
];

const stats = [
  { label: 'Événements créés', value: '8.5k+', icon: <TrendingUp /> },
  { label: 'Utilisateurs actifs', value: '12k+', icon: <People /> },
  { label: 'Note moyenne', value: '4.9★', icon: <Star /> },
];

const Index = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const authInfos = useSelector((state) => state.auth);

    useEffect(() => {
        console.log("AUTH INFOS", authInfos);
    }, [authInfos]);
    
    const handleSelectEvent = (e, type) => {
        e.preventDefault();

        navigate("/events", {
            state: {
                eventType: type,
            }
        });
    }

    return (
        <Box sx={{ flex: 1, position: 'relative' }}>
            {/* Hero Section */}
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
                    {/* Welcome Section */}
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography 
                        variant="h2" 
                        component="h1" 
                        sx={{ 
                        fontWeight: 800, 
                        mb: 2,
                        fontSize: { xs: '2.5rem', md: '3.5rem' },
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        }}
                    >
                        Créez des événements inoubliables
                    </Typography>
                    <Typography 
                        variant="h6" 
                        sx={{ 
                        color: 'text.secondary', 
                        mb: 4,
                        maxWidth: 600,
                        mx: 'auto',
                        lineHeight: 1.6,
                        }}
                    >
                        Découvrez, organisez et participez aux meilleurs événements près de chez vous. 
                        Rejoignez notre communauté de créateurs d'expériences uniques.
                    </Typography>
                    
                    {/* Stats Cards */}
                    <Grid container spacing={3} sx={{ 
                            mb: 6,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                        {stats.map((stat, index) => (
                        <Grid item xs={12} sm={4} key={index}>
                            <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                textAlign: 'center',
                                backgroundColor: alpha(theme.palette.common.white, 0.8),
                                backdropFilter: 'blur(10px)',
                                borderRadius: '16px',
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.15)}`,
                                },
                            }}
                            >
                            <Box sx={{ color: theme.palette.primary.main, mb: 1 }}>
                                {stat.icon}
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                {stat.value}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {stat.label}
                            </Typography>
                            </Paper>
                        </Grid>
                        ))}
                    </Grid>
                    </Box>

                    {/* Featured Events Carousel */}
                    <Carousel />

                    {/* Event Categories */}
                    <Box sx={{ mb: 6 }}>
                    <Typography 
                        variant="h3" 
                        component="h2" 
                        sx={{ 
                        fontWeight: 700, 
                        mb: 2,
                        textAlign: 'center',
                        fontSize: { xs: '2rem', md: '2.5rem' },
                        }}
                    >
                        Explorez par catégorie
                    </Typography>
                    <Typography 
                        variant="h6" 
                        sx={{ 
                        color: 'text.secondary', 
                        mb: 4,
                        textAlign: 'center',
                        maxWidth: 600,
                        mx: 'auto',
                        }}
                    >
                        Trouvez l'événement parfait selon vos passions et centres d'intérêt
                    </Typography>

                    <Grid container spacing={3} sx={{ 
                            mb: 6,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                        {eventTypes.map((type, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index} sx={{ cursor: "pointer" }}>
                            <Button
                            sx={{
                                height: '100%',
                                textTransform: "capitalize",
                                background: `linear-gradient(135deg, ${alpha(type.color, 0.1)} 0%, ${alpha(type.color, 0.05)} 100%)`,
                                borderRadius: '20px',
                                border: `2px solid ${alpha(type.color, 0.2)}`,
                                transition: 'all 0.3s ease-in-out',
                                cursor: 'pointer',
                                width: { xs: "90%" },
                                minWidth: "300px",
                                '&:hover': {
                                transform: 'translateY(-8px)',
                                boxShadow: `0 20px 40px ${alpha(type.color, 0.3)}`,
                                borderColor: type.color,
                                },
                            }}

                            onClick={(e) => handleSelectEvent(e, type.refName)}
                            >
                            <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                <Box
                                
                                sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: '20px',
                                    backgroundColor: alpha(type.color, 0.15),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mx: 'auto',
                                    mb: 3,
                                    color: type.color,
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                    backgroundColor: alpha(type.color, 0.2),
                                    transform: 'scale(1.1)',
                                    },
                                }}
                                >
                                {type.icon}
                                </Box>
                                <Typography 
                                variant="h5" 
                                sx={{ 
                                    fontWeight: 700, 
                                    mb: 1,
                                    color: type.color,
                                }}
                                >
                                {type.label}
                                </Typography>
                                <Typography 
                                variant="body2" 
                                sx={{ 
                                    color: 'text.secondary', 
                                    mb: 2,
                                    lineHeight: 1.6,
                                }}
                                >
                                {type.description}
                                </Typography>
                                <Chip
                                label={type.count}
                                size="small"
                                sx={{
                                    backgroundColor: alpha(type.color, 0.1),
                                    color: type.color,
                                    fontWeight: 600,
                                    border: `1px solid ${alpha(type.color, 0.3)}`,
                                }}
                                />
                            </CardContent>
                            </Button>
                        </Grid>
                        ))}
                    </Grid>
                    </Box>

                    {/* Call to Action */}
                    <Paper
                    elevation={0}
                    sx={{
                        p: 6,
                        textAlign: 'center',
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        color: 'white',
                        borderRadius: '24px',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                        opacity: 0.3,
                        },
                    }}
                    >
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                        Prêt à créer votre premier événement ?
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                        Rejoignez des milliers d'organisateurs qui font confiance à LocalEvents
                        </Typography>
                        <Button
                        variant="contained"
                        size="large"
                        endIcon={<ArrowForward />}
                        sx={{
                            backgroundColor: alpha(theme.palette.common.white, 0.2),
                            color: 'white',
                            fontWeight: 600,
                            px: 4,
                            py: 1.5,
                            borderRadius: '12px',
                            border: `1px solid ${alpha(theme.palette.common.white, 0.3)}`,
                            backdropFilter: 'blur(10px)',
                            '&:hover': {
                            backgroundColor: alpha(theme.palette.common.white, 0.3),
                            transform: 'translateY(-2px)',
                            },
                            transition: 'all 0.2s ease-in-out',
                        }}
                        >
                            Créer mon événement gratuitement 
                        </Button>
                    </Box>
                    </Paper>
                </Container>
            </Box>
        </Box> 
    );
}

export default Index;