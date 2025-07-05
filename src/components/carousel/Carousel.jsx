import { Box, Paper, Typography, Button, IconButton, useTheme, alpha, Card, CardContent, CardMedia, Chip } from "@mui/material";
import { PlayArrow, ArrowForward, LocationOn, CalendarToday, People } from "@mui/icons-material";
import { useState, useEffect } from "react";

const eventData = [
  {
    id: 1,
    title: "Festival de Musique Électronique",
    date: "15 Août 2024",
    location: "Paris, France",
    attendees: "2.5k",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
    category: "Musique",
    price: "À partir de 45€"
  },
  {
    id: 2,
    title: "Conférence Tech Innovation",
    date: "22 Septembre 2024",
    location: "Lyon, France",
    attendees: "800",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    category: "Conférences",
    price: "Gratuit"
  },
  {
    id: 3,
    title: "Soirée Gastronomique",
    date: "5 Octobre 2024",
    location: "Marseille, France",
    attendees: "150",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    category: "Fête",
    price: "85€"
  }
];

const Carousel = () => {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % eventData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentEvent = eventData[currentIndex];

  return (
    <Box sx={{ mb: 6, position: 'relative' }}>
      {/* Main Featured Event */}
      <Card
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '20px',
          height: { xs: 300, md: 400 },
          backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.8)} 0%, ${alpha(theme.palette.secondary.main, 0.6)} 100%), url(${currentEvent.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.3)}`,
          transition: 'all 0.5s ease-in-out',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.7)} 0%, ${alpha(theme.palette.secondary.main, 0.5)} 100%)`,
            zIndex: 1,
          }
        }}
      >
        <CardContent
          sx={{
            position: 'relative',
            zIndex: 2,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: { xs: 3, md: 5 }
          }}
        >
          {/* Top Section */}
          <Box>
            <Chip
              label={currentEvent.category}
              size="small"
              sx={{
                backgroundColor: alpha(theme.palette.common.white, 0.2),
                color: 'white',
                fontWeight: 600,
                mb: 2,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.common.white, 0.3)}`,
              }}
            />
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                fontWeight: 800,
                mb: 2,
                fontSize: { xs: '2rem', md: '3rem' },
                lineHeight: 1.2,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              {currentEvent.title}
            </Typography>
          </Box>

          {/* Middle Section */}
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarToday sx={{ fontSize: 20 }} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {currentEvent.date}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn sx={{ fontSize: 20 }} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {currentEvent.location}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <People sx={{ fontSize: 20 }} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {currentEvent.attendees} participants
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Bottom Section */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700,
                color: alpha(theme.palette.common.white, 0.9),
              }}
            >
              {currentEvent.price}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<PlayArrow />}
                sx={{
                  color: 'white',
                  borderColor: alpha(theme.palette.common.white, 0.5),
                  backgroundColor: alpha(theme.palette.common.white, 0.1),
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.common.white, 0.2),
                    borderColor: 'white',
                  },
                  borderRadius: '10px',
                  px: 3,
                }}
              >
                Voir détails
              </Button>
              <Button
                variant="contained"
                endIcon={<ArrowForward />}
                sx={{
                  backgroundColor: alpha(theme.palette.common.white, 0.2),
                  color: 'white',
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(theme.palette.common.white, 0.3)}`,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.common.white, 0.3),
                    transform: 'translateY(-2px)',
                  },
                  borderRadius: '10px',
                  px: 3,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                Réserver maintenant
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Carousel Indicators */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 1,
          mt: 3,
        }}
      >
        {eventData.map((_, index) => (
          <Box
            key={index}
            onClick={() => setCurrentIndex(index)}
            sx={{
              width: currentIndex === index ? 24 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: currentIndex === index ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.3),
              cursor: 'pointer',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                backgroundColor: theme.palette.primary.main,
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Carousel;