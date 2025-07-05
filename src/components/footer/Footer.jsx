import { Box, Typography, Container, Grid, IconButton, Divider, useTheme, alpha } from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn, Email, Phone, LocationOn } from "@mui/icons-material";

const Footer = () => {
  const theme = useTheme();
  
  return (
    <Box 
      component="footer" 
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.grey[900]} 0%, ${theme.palette.grey[800]} 100%)`,
        color: 'white',
        mt: 'auto',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: `linear-gradient(90deg, transparent 0%, ${alpha(theme.palette.primary.main, 0.5)} 50%, transparent 100%)`,
        }
      }}
    >
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 800,
                  mb: 1,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                LocalEvents
              </Typography>
              <Typography variant="body2" sx={{ color: 'grey.400', mb: 2, lineHeight: 1.6 }}>
                Créez, gérez et partagez vos événements en toute simplicité. 
                La plateforme de référence pour tous vos besoins événementiels.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {[Facebook, Twitter, Instagram, LinkedIn].map((Icon, index) => (
                  <IconButton 
                    key={index}
                    size="small"
                    sx={{
                      color: 'grey.400',
                      backgroundColor: alpha(theme.palette.common.white, 0.05),
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.2),
                        color: theme.palette.primary.main,
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    <Icon fontSize="small" />
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'white' }}>
              Liens rapides
            </Typography>
            {['Accueil', 'Événements', 'Créer', 'À propos'].map((link) => (
              <Typography 
                key={link}
                variant="body2" 
                sx={{ 
                  color: 'grey.400',
                  mb: 1,
                  cursor: 'pointer',
                  '&:hover': {
                    color: theme.palette.primary.main,
                  },
                  transition: 'color 0.2s ease-in-out',
                }}
              >
                {link}
              </Typography>
            ))}
          </Grid>

          {/* Services */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'white' }}>
              Services
            </Typography>
            {['Gestion d\'événements', 'Billetterie', 'Analytics', 'Support'].map((service) => (
              <Typography 
                key={service}
                variant="body2" 
                sx={{ 
                  color: 'grey.400',
                  mb: 1,
                  cursor: 'pointer',
                  '&:hover': {
                    color: theme.palette.primary.main,
                  },
                  transition: 'color 0.2s ease-in-out',
                }}
              >
                {service}
              </Typography>
            ))}
          </Grid>

          {/* Contact */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'white' }}>
              Contact
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Email sx={{ fontSize: 16, color: 'grey.400', mr: 1 }} />
              <Typography variant="body2" sx={{ color: 'grey.400' }}>
                contact@localevents.com
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Phone sx={{ fontSize: 16, color: 'grey.400', mr: 1 }} />
              <Typography variant="body2" sx={{ color: 'grey.400' }}>
                +237 6 57 68 74 47
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOn sx={{ fontSize: 16, color: 'grey.400', mr: 1 }} />
              <Typography variant="body2" sx={{ color: 'grey.400' }}>
                Yaoundé, Cameroun
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: alpha(theme.palette.common.white, 0.1) }} />

        {/* Copyright */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'grey.500' }}>
            © {new Date().getFullYear()} LocalEvents — Créé avec{' '}
            <span style={{ color: theme.palette.primary.main, fontSize: '1.2em' }}>❤</span>{' '}
            par votre équipe
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;