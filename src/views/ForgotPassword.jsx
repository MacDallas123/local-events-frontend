import React, { useState } from "react";
import { TextField, Button, Box, InputAdornment, useTheme, Typography, CircularProgress, Alert } from "@mui/material";
import { Email, ErrorOutline, CheckCircle, ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post('/auth/forgot-password', { email }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response?.data;
      console.log("FORGOT DATA", data);
      if (data) {
        setSuccess(true);
      } else {
        setError(data.error || "Une erreur s'est produite");
      }
    } catch (err) {
        console.log("ERROR", err);
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/auth/login');
  };

  if (success) {
    return (
      <>
        <Typography variant="h6" sx={{ mb: 2, color: theme.palette.secondary.main }}>
          Réinitialisation du mot de passe
        </Typography>
        <Box
          sx={{
            mb: 2,
            display: "flex",
            alignItems: "center",
            background: "rgba(76, 175, 80, 0.12)", // green[500] with transparency
            borderRadius: 2,
            px: 2,
            py: 1,
          }}
        >
          <CheckCircle sx={{ color: "success.main", mr: 1 }} />
          <Typography variant="body2" color="success.main" sx={{ fontWeight: 500 }}>
            Un email de réinitialisation a été envoyé à votre adresse email (si elle existe dans notre système).
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Vérifiez votre boîte de réception et cliquez sur le lien pour réinitialiser votre mot de passe.
          </Typography>
          <Button
            variant="outlined"
            onClick={handleBackToLogin}
            startIcon={<ArrowBack />}
            sx={{ fontWeight: 500 }}
          >
            Retour à la connexion
          </Button>
        </Box>
      </>
    );
  }

  return (
    <>
      <Typography variant="h6" sx={{ mb: 2, color: theme.palette.secondary.main }}>
        Mot de passe oublié
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: theme.palette.text.secondary }}>
        Entrez votre adresse email pour recevoir un lien de réinitialisation de mot de passe.
      </Typography>
      
      {error && (
        <Box
          sx={{
            mb: 2,
            display: "flex",
            alignItems: "center",
            background: "rgba(244, 67, 54, 0.12)", // red[500] with transparency
            borderRadius: 2,
            px: 2,
            py: 1,
          }}
        >
          <ErrorOutline sx={{ color: "error.main", mr: 1 }} />
          <Typography variant="body2" color="error" sx={{ fontWeight: 500 }}>
            {error}
          </Typography>
        </Box>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
        <TextField
          label="Adresse email"
          name="email"
          type="email"
          value={email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2, fontWeight: 600 }}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Envoyer le lien de réinitialisation"
          )}
        </Button>
      </Box>
      
      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Typography variant="body2">
          Vous vous souvenez de votre mot de passe ?{" "}
          <a 
            onClick={(e) => { e.preventDefault(); navigate("/auth/login"); }} 
            style={{ 
              color: theme.palette.primary.main, 
              textDecoration: "none", 
              fontWeight: 500, 
              cursor: "pointer" 
            }}
          >
            Se connecter
          </a>
        </Typography>
      </Box>
    </>
  );
}